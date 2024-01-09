from django.db import models
from django.utils import timezone
# Create your models here.

class Match(models.Model):
    match_id = models.CharField(primary_key = True, max_length=100)
    player1 = models.IntegerField()
    player2 = models.IntegerField()
    player1_score = models.IntegerField()
    player2_score = models.IntegerField()
    match_winner = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    