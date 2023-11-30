from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.
from django.core.mail import send_mail




def mail(request):
    try:
        send_mail(
            "Jaime a ver si curras un rato",
            "Biel tontu",
            "crazypongreal@hotmail.com",
            ["jareste2000@gmail.com"],
            fail_silently=False,
        )
        return JsonResponse({'message': 'messageSent'})
    except Exception as e:
        return JsonResponse({'message': f'Error: {str(e)}'})