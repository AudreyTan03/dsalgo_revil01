# Generated by Django 4.0.3 on 2024-03-20 11:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0004_product_editedat'),
    ]

    operations = [
        migrations.RenameField(
            model_name='product',
            old_name='video',
            new_name='preview_video',
        ),
        migrations.RemoveField(
            model_name='product',
            name='brand',
        ),
        migrations.RemoveField(
            model_name='product',
            name='countInStock',
        ),
    ]
