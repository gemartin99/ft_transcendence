from django.shortcuts import render, redirect
from django.http import JsonResponse

# Create your views here.
from django.core.mail import send_mail
from accounts.models import Usermine
from django.contrib import messages
import pyotp

class TwoFA:
    @staticmethod
    def generate_totp_secret():
        return pyotp.random_base32()

    @staticmethod
    def enable_totp(request):
        if request.method == 'POST':
            totp_secret = generate_totp_secret()
            

            jwt_token = request.COOKIES.get('jwttoken', None)
            user_id = decode_jwt_token(jwt_token)
            totp_code = str(request.POST.get('totp_code'))
            userid = user_id
            
            # username = ''
            # tendremos que coger el username a traves del JWT
            user = Usermine.objects.get(id=userid)
            user.totp = totp_secret;
            user.save()

            # Generate the provisioning URL to be used by the Google Authenticator app
            totp = pyotp.TOTP(totp_secret)
            provisioning_url = totp.provisioning_uri(name=user.name.encode('utf-8'), issuer_name='crazy-pong')

            print('hola')
            return JsonResponse({'provisioning_url': provisioning_url})

    @staticmethod
    def verify_totp(request):
        if request.method == 'POST':
            jwt_token = request.COOKIES.get('jwttoken', None)
            user_id = decode_jwt_token(jwt_token)
            totp_code = str(request.POST.get('totp_code'))
            userid = user_id
            totp_secret = Usermine.objects.get(id=userid).totp
            totp = pyotp.TOTP(totp_secret)
            if totp.verify(totp_code):
                return True
            else:
                return False

    @staticmethod
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

    @staticmethod
    def verify_mail(userid, request):
        if (request == userid.mail2FACode):
            return True
        return False


    @staticmethod
    def send_mailUser(user):
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