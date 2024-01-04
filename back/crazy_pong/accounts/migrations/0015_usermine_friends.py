# Generated by Django 3.2.10 on 2024-01-03 16:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0014_usermine_matches_played'),
    ]

    operations = [
        migrations.AddField(
            model_name='usermine',
            name='friends',
            field=models.ManyToManyField(blank=True, related_name='_accounts_usermine_friends_+', to='accounts.Usermine'),
        ),
    ]