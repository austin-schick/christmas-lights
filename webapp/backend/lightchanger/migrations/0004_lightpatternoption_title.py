# Generated by Django 3.2.13 on 2022-12-24 03:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lightchanger', '0003_rename_image_lightpatternoption_image_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='lightpatternoption',
            name='title',
            field=models.TextField(default='', max_length=100),
        ),
    ]
