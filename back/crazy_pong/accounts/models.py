from django.db import models

class User(models.Model):
    id = models.AutoField(primary_key=True)
    password = models.CharField(max_length=128, verbose_name='password')
    email = models.EmailField(max_length=255, unique=True)
    active = models.BooleanField(default=False)
    online = models.BooleanField(default=True)
    id42 = models.IntegerField(default=42)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)

    class Meta:
        abstract = False





