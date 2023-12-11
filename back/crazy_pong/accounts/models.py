from django.db import models

class Usermine(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=128, unique=True, default='username')
    password = models.CharField(max_length=128, verbose_name='password')
    email = models.EmailField(max_length=255, unique=True)
    playing = models.BooleanField(default=False)
    online = models.BooleanField(default=False)
    id42 = models.IntegerField(default=42)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    jwt = models.CharField(max_length=255, default='')
    totp = models.CharField(max_length=255, default='')
    mail2FA = models.BooleanField(default=False)
    google2FA = models.BooleanField(default=False)
    mail2FACode = models.CharField(max_length=6, default=-1)

    class Meta:
        abstract = False






