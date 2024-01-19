from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('email', models.EmailField(max_length=255, unique=True)),
                ('active', models.BooleanField(default=False)),
                ('online', models.BooleanField()),
                ('id42', models.IntegerField()),
                ('wins', models.IntegerField()),
                ('losses', models.IntegerField()),
            ],
            options={
                'abstract': False,
            },
        ),
    ]