from django.shortcuts import render, redirect
from django.http import JsonResponse

# Create your views here.
from django.core.mail import send_mail
from accounts.models import Usermine
from django.contrib import messages
import pyotp
from authentification.authentification import Authentification

class TwoFA:

    @staticmethod
    def disable_two_factor(user):
        print("hola")
        try:
            # user = Usermine.objects.userid
            print(user.name)
            user.mail2FA = False
            user.google2FA = False
            user.validated2FA = False
            user.save()
            return True, None
        except Exception as e:
            return False, "action can't be done, try again"

    @staticmethod
    def generate_totp_secret():
        return pyotp.random_base32()

    @staticmethod
    def enable_totp(request):
        if request.method == 'POST':
            totp_secret = generate_totp_secret()
            
            # aqui no deberia de revisar el user, deberia de tenerlo ya
            jwt_token = request.COOKIES.get('jwttoken', None)
            user_id = Authentification.decode_jwt_token(jwt_token)
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
            # aqui no deberia de revisar el user, deberia de tenerlo ya
            jwt_token = request.COOKIES.get('jwttoken', None)
            user_id = Authentification.decode_jwt_token(jwt_token)
            totp_code = str(request.POST.get('totp_code'))
            userid = user_id
            totp_secret = Usermine.objects.get(id=userid).totp
            totp = pyotp.TOTP(totp_secret)
            if totp.verify(totp_code):
                return True
            else:
                return False

    @staticmethod #este creo que no es valido
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

    @staticmethod #este creo que no es valido
    def verify_mail(userid, request):
        if (request == userid.mail2FACode):
            return True
        return False


    @staticmethod
    def send_mailUser(mail, code):
        try:
            subject = "Your Authentication Code"
            message = f"Your authentication code is: {code}. Use this code to verify your account."

            send_mail(
                subject,
                message,
                "crazypongreal@hotmail.com",
                [mail],
                fail_silently=False,
            )
            print('mail sent', code, mail)
            return JsonResponse({'message': 'messageSent'})
        except Exception as e:
            print('mail not sent', e)
            return JsonResponse({'message': f'Error: {str(e)}'})
