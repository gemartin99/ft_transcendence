# Generated by Django 3.2.10 on 2023-12-17 15:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0010_remove_usermine_validated2fa'),
    ]

    operations = [
        migrations.AddField(
            model_name='usermine',
            name='validated2FA',
            field=models.BooleanField(default=False),
        ),
    ]
