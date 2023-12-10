from django.db import models

class Usermine(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(default='username', max_length=128, unique=True)
    password = models.CharField(max_length=128, verbose_name='password')
    email = models.EmailField(max_length=255, unique=True)
    reg_completed = models.BooleanField(default=False)
    playing = models.BooleanField(default=False)
    online = models.BooleanField(default=False)
    id42 = models.IntegerField(default=42)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    played = models.IntegerField(default=0)
    score = models.IntegerField(default=0)
    twofactor = models.IntegerField(default=0)
    twofactor_valid = models.IntegerField(default=0)
    twofactor_verifycode = models.CharField(default='', max_length=128)

    class Meta:
        abstract = False  # This corresponds to the 'abstract' option in the migration






