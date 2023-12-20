from django.db import models
from accounts.models import Usermine
# Create your models here.


class Match(models.Model):
    match_id = models.CharField(primary_key = True, max_length=100)
    player1 = models.ForeignKey(Usermine, on_delete=models.CASCADE, related_name='player1')
    player2 = models.ForeignKey(Usermine, on_delete=models.CASCADE, related_name='player2')
    player1_score = models.IntegerField()
    player2_score = models.IntegerField()
    