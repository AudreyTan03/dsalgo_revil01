import json
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import *
from .serializers import *
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework import permissions, status




from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Product, ShippingAddress
from .serializers import ProductSerializer

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import BasePermission

from .models import Product
from .serializers import ProductSerializer

class ProductDeleteView(generics.DestroyAPIView):
    queryset = Product.objects.all()
    lookup_field = 'pk'

    def delete(self, request, *args, **kwargs):
        try:
            product = self.get_object()
            product.delete()
            return Response({"message": "Product deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            return Response({"message": "Product does not exist"}, status=status.HTTP_404_NOT_FOUND)



class ProductView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class PostProduct(APIView):
    def post(self, request, *args, **kwargs):
        product_serializer = ProductSerializer(data=request.data)
        if product_serializer.is_valid():
            product_serializer.save()
            return Response(product_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', product_serializer.errors)
            return Response(product_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/products/',
        '/api/products/create/',
        '/api/products/upload/',
        '/api/products/<id>/reviews/',
        '/api/products/top/',
        '/api/products/<id>/',
        '/api/products/delete/<id>/',
        '/api/products/<update>/<id>/',
    ]
    return Response(routes)


@api_view(['GET'])
def getProducts(request):
    product = Product.objects.all()
    serializers = ProductSerializer(product, many=True)
    return Response(serializers.data)


@api_view(['GET'])
def getProduct(request, pk):
    try:
        product = Product.objects.get(pk=pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except ValueError:
        return Response({'detail': 'Invalid product ID'}, status=status.HTTP_400_BAD_REQUEST)


def saveShippingAddress(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_id = data['user']
        address = data['address']
        city = data['city']
        postalCode = data['postalCode']
        country = data['country']

        user = User.objects.get(id=user_id)

        shipping_address, created = ShippingAddress.objects.update_or_create(
            user=user,
            defaults={
                'address': address,
                'city': city,
                'postalCode': postalCode,
                'country': country,
            },
        )

        return JsonResponse({'status': 'Address saved successfully'})
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)



