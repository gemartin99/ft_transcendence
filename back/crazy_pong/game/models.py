from django.db import models
# Create your models here.

class Match(models.Model):
    match_id = models.CharField(primary_key = True, max_length=100)
    player1 = models.CharField(max_length=100, default='')
    player2 = models.CharField(max_length=100, default='')
    player1_score = models.IntegerField()
    player2_score = models.IntegerField()