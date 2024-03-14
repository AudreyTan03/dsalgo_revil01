from django.conf import settings
import pyotp
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
# from backend.user.models import User
from user.serializers import SendPasswordResetEmailSerializer, UserChangePasswordSerializer, UserPasswordResetSerializer, UserRegistrationSerializers, UserLoginSerializer, UserProfileSerializer
from django.contrib.auth import authenticate
from rest_framework.exceptions import ValidationError
from user.serializers import *
from user.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import permissions, status
import pyotp
from user.models import OTP
from django.core.mail import send_mail
# from .serializers import  UserSerializerWithToken

#Generate token Manually
def get_tokens_for_user(user): # Token generator ->Auds (gumagana sa regis)
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        serializer = UserRegistrationSerializers(data=data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            user_type = serializer.validated_data.get('user_type', 'student')
            is_instructor = user_type == 'instructor'

            # Generate OTP
            otp_key = pyotp.random_base32()
            otp_instance = pyotp.TOTP(otp_key, digits=6)
            otp_code = otp_instance.now()

            # Create user and save OTP secret key
            user = serializer.save(user_type=user_type, is_instructor=is_instructor)
            otp = OTP.objects.create(
                user=user,
                otp_secret=otp_key,
            )

            # Send OTP via email
            send_otp_email(data["email"], otp_code)
            # serializer = UserSerializerWithToken(user, many=False)

            token = get_tokens_for_user(user)
            response_data = {
                "user_id": user.id,
                "otp_id": otp.id,
                "token": token,
                "detail": "User successfully registered. Please check your email for the OTP code.",
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
    except Exception as e:
        message = {'detail': str(e)}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def verify_otp(request):
    data = request.data
    try:
        user_id = data["user_id"]
        otp_id = data["otp_id"]
        otp_code = data["otp_code"]

        user = User.objects.get(id=user_id)
        otp = OTP.objects.get(id=otp_id, user=user)

        print(otp_code)
        print(otp.otp_secret)
        totp = pyotp.TOTP(otp.otp_secret)
        if totp.verify(otp_code, valid_window=7):
            user.is_active = True
            user.save()

            otp.is_verified = True
            otp.save()
            
            return Response({"detail": "OTP verified successfully"}, status=status.HTTP_200_OK)
        
        else:
            raise Exception("Invalid OTP code")
    except Exception as e:
        message = {"detail": str(e)}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

def send_otp_email(email, otp_code):
    subject = "OTP Verification"
    message = f"Your OTP code is: {otp_code}"
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [email]
    send_mail(subject, message, email_from, recipient_list)

# @api_view(['POST'])
# def resend_otp(request):
#     try:
#         data = request.data
#         user_id = data['user_id']
#         user = User.objects.get(id=user_id)
        
#         if user.is_active:
#             return Response({'message': 'Account is already active. Cannot resend OTP.'}, status=status.HTTP_400_BAD_REQUEST)
        
#         otp = OTP.objects.get(user=user)
#         otp_key = otp.otp_secret
#         otp_instance = pyotp.TOTP(otp_key, digits=6)
#         otp_code = otp_instance.now()
#         send_otp_email(user.email, otp_code)
#         return Response({'message': 'OTP has been sent to your email'}, status=status.HTTP_200_OK)
    
#     except User.DoesNotExist:
#         return Response({'message': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def loginUser(request, format=None):
    if request.method == 'POST':
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(email=email, password=password)
            
            if user is not None:
                token = get_tokens_for_user(user)
                user_type = 'instructor' if user.is_instructor else 'student'
                response_data = {'token': token, 'msg': 'Login Success', 'user_type': user_type}
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                return Response({'errors': {'non_field_errors': ['Email or Password is not valid']}}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Handle serializer validation errors
            raise ValidationError(serializer.errors)



class UserProfileView(APIView):
    renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        serializer= UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class UserProfileView(APIView):
    permission_classes = (IsAuthenticated,)
    
    def get(self, request, format=None):
        try:
            user = request.user
            profile = user.profile  
            profile_serializer = ProfileSerializer(profile)
            user_serializer = UserProfileSerializer(user)
            return Response({'user_data': user_serializer.data, 'userprofile_data': profile_serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    try:
        user = request.user
        profile = user.profile
        data = request.data

        if 'userprofile_picture' in request.FILES:
            profile.image = request.FILES['userprofile_picture']

        profile.name = data.get('name', profile.name)
        user.email = data.get('email', user.email)
        profile.save()    
        user.save()
        
        profile_serializer = ProfileSerializer(profile)
        user_serializer = UserProfileSerializer(user)
        return Response({'message': 'Profile updated successfully', 'user_data': user_serializer.data, 'userprofile_data': profile_serializer.data}, status=status.HTTP_200_OK)

    except Exception as e:
        print("Internal Server Error:", e)
        return Response({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserChangePasswordView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (JWTAuthentication,)
    def post(self, request, format=None):
        serializer = UserChangePasswordSerializer(data=request.data, context={'user': request.user})
        context = {'user': request.user}
        if serializer.is_valid(raise_exception=True):
            return Response({'msg':'Change Password Succcessfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class SendPasswordResetEmailView(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, format=None):
        serializer = SendPasswordResetEmailSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            return Response({'msg': 'Password Reset link send. Please check your Email'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserPasswordResetView(APIView):
    renderer_classes = [UserRenderer]
    def post(self,request, uid, token , format=None):
        serializer = UserPasswordResetSerializer(data=request.data, context = {'uid':uid, 'token': token})
        if serializer.is_valid(raise_exception=True):
            return Response({'msg':"Password Reset Succesfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


