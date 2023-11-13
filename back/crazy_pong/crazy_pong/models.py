from django.db import models

class Usuario(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    contraseña = models.CharField(max_length=255)

    def __str__(self):
        return self.name
