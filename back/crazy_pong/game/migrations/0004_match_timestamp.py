# Generated by Django 3.2.10 on 2023-12-28 13:45

import datetime

from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0003_merge_0002_auto_20231220_1702_0002_auto_20231220_1836'),
    ]

    operations = [
        migrations.AddField(
            model_name='match',
            name='timestamp',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2023, 12, 28, 13, 45, 23, 77630, tzinfo=utc)),
            preserve_default=False,
        ),
    ]
