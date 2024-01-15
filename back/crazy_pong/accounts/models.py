from django.db import models
import random
from django.utils import timezone
from game.models import Match

class Usermine(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=128, unique=True, default='username')
    password = models.CharField(max_length=128, verbose_name='password', blank=True, null=True)
    email = models.EmailField(max_length=255)
    playing = models.BooleanField(default=False)
    inTournament = models.IntegerField(default=0)
    tournament_id = models.CharField(max_length=128, default='')
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
    friends = models.ManyToManyField('self', blank=True, symmetrical=False)
    avatar = models.CharField(max_length=128, default='media/avatars/Pingu_default.png')


    def get_last_5_matches(self):
        # Get the last 5 matches sorted by timestamp in descending order
        last_5_matches = self.matches_played.order_by('-timestamp')[:5]
        matches_with_names = []
        for match in last_5_matches:
            if match.player1 > 0:
                player1_name = Usermine.objects.get(id=match.player1).name
            else:
                player1_name = 'IA'
            if match.player2 > 0:
                player2_name = Usermine.objects.get(id=match.player2).name
            else:
                player2_name = 'IA'
            if match.match_winner == match.player1:
                match_winner = player1_name
            else:
                match_winner = player2_name
            print(match_winner)
            matches_with_names.append({
                'match_id': match.match_id,
                'player1': player1_name,
                'player2': player2_name,
                'player1_score': match.player1_score,
                'player2_score': match.player2_score,
                'match_winner': match_winner,
                'timestamp': match.timestamp,
            })

        return matches_with_names
        
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






