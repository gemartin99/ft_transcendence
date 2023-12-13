# Generated by Django 3.2.10 on 2023-12-10 13:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_usermine_totp'),
    ]

    operations = [
        migrations.AddField(
            model_name='usermine',
            name='google2FA',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='usermine',
            name='mail2FA',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='usermine',
            name='mail2FACode',
            field=models.IntegerField(default=-1, max_length=6),
        ),
    ]