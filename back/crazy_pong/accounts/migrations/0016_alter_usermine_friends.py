# Generated by Django 3.2.10 on 2024-01-08 17:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0015_usermine_friends'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usermine',
            name='friends',
            field=models.ManyToManyField(blank=True, to='accounts.Usermine'),
        ),
    ]
