from django.http import JsonResponse
from django.template.loader import render_to_string
##Jareste limpiar
from django.views.decorators.csrf import csrf_exempt
from .models import Usermine
from security.security import Security


class Profile:

