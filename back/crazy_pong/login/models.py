from django.db import models

# Create your models here.
from django.db import models
class User(models.Model):
    name = models.CharField(max_length=80)
    email = models.EmailField()
    online = models.BooleanField()
    id42 = models.IntegerField()
    wins = models.IntegerField()
    losses = models.IntegerField()
    