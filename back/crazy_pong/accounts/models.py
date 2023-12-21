from django.db import models
import random
from django.utils import timezone
from game.models import Match

class Usermine(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=128, unique=True, default='username')
    password = models.CharField(max_length=128, verbose_name='password', blank=True, null=True)
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
    mail2FACode_timestamp = models.DateTimeField(null=True, blank=True)
    validated2FA = models.BooleanField(default=False)
    matches_played = models.ManyToManyField(Match, blank=True)

    def generate_mail2fa_code(self):
        self.mail2FACode = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        self.mail2FACode_timestamp = timezone.now()
        self.save()

    def is_mail2fa_code_valid(self):
        if self.mail2FACode and self.mail2FACode_timestamp:
            valid_duration = timezone.now() - self.mail2FACode_timestamp
            return valid_duration.total_seconds() <= 300  # 5 minutes in seconds
        self.mail2FACode = -1
        return False

    class Meta:
        abstract = False






