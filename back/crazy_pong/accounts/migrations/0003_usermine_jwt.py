# Generated by Django 3.2.10 on 2023-11-30 11:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_auto_20231129_2134'),
    ]

    operations = [
        migrations.AddField(
            model_name='usermine',
            name='jwt',
            field=models.CharField(default='', max_length=255),
        ),
    ]
