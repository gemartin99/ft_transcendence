# Generated by Django 3.2.10 on 2023-12-17 15:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0009_usermine_validated2fa'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='usermine',
            name='validated2FA',
        ),
    ]