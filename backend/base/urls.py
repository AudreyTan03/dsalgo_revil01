from django.urls import path

# from backend.api.serializers import SendPasswordResetEmailSerializer

from . import views
from .views import *
from django.conf import settings
from django.conf.urls.static import static
from .views import ProductDeleteView


urlpatterns = [
    path('', views.getRoutes, name="routes"),
    # path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('users/profile/', views.getUserProfile, name='users-profile'),
    # path('users/', views.getUserProfile, name='users-profiles'),
    # path('users/register/', views.registerUser, name='register'),
    path('products/', views.getProducts, name="products"),
    path('products/<str:pk>', views.getProduct, name="products"),
    path('post-product/', views.PostProduct.as_view(), name="post_product"),
    path('products/<int:pk>/delete/', ProductDeleteView.as_view(), name='product-delete'),
    path('categories/', CategoryList.as_view(), name='category-list'),
    path('products/<int:pk>/edit/', ProductPatchView.as_view(), name='product_edit'),


]

