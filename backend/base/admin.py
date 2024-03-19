from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
# Register your models here.

admin.site.register(Product)
admin.site.register(Review)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)  # Display the 'name' field in the admin list view

# Register the models with the admin site
admin.site.register(Category, CategoryAdmin)



