from django.db import migrations, models

class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Usermine',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(default='username', max_length=128, unique=True)),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('email', models.EmailField(max_length=255, unique=True)),
                ('reg_completed', models.BooleanField(default=False)),
                ('playing', models.BooleanField(default=False)),
                ('online', models.BooleanField(default=False)),
                ('id42', models.IntegerField(default=42)),
                ('wins', models.IntegerField(default=0)),
                ('losses', models.IntegerField(default=0)),
                ('played', models.IntegerField(default=0)),
                ('score', models.IntegerField(default=0)),
                ('twofactor', models.IntegerField(default=0)),
                ('twofactor_valid', models.IntegerField(default=0)),
                ('twofactor_verifycode', models.CharField(default='', max_length=128)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
