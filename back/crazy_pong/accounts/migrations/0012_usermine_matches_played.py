# Generated by Django 3.2.10 on 2023-12-20 16:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0001_initial'),
        ('accounts', '0011_usermine_validated2fa'),
    ]

    operations = [
        migrations.AddField(
            model_name='usermine',
            name='matches_played',
            field=models.ManyToManyField(blank=True, to='game.Match'),
        ),
    ]
