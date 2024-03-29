import pyotp
from django.core.mail import send_mail
from django.http import JsonResponse

from accounts.models import Usermine
from authentification.authentification import Authentification


class TwoFA:

    @staticmethod
    def disable_two_factor(user):
        try:
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
            totp_secret = TwoFA.generate_totp_secret()
            
            jwt_token = request.COOKIES.get('jwttoken', None)
            user_id = Authentification.decode_jwt_token(jwt_token)
            totp_code = str(request.POST.get('totp_code'))
            userid = user_id
            user = Usermine.objects.get(id=userid)
            user.totp = totp_secret;
            user.save()
            totp = pyotp.TOTP(totp_secret)
            provisioning_url = totp.provisioning_uri(name=user.name.encode('utf-8'), issuer_name='crazy-pong')
            return JsonResponse({'provisioning_url': provisioning_url})

    @staticmethod
    def verify_totp(request):
        jwt_token = request.COOKIES.get('jwttoken', None)
        language = request.META.get('HTTP_LANGUAGE', 'default_language')
        user_id = Authentification.decode_jwt_token(jwt_token)
        user = Usermine.objects.get(id=user_id)
        if not user:
            return JsonResponse({'redirect': '/users/login/'})
        if request.method != 'POST':
            return JsonResponse({'message': 'bad method!'})
        totp_code = str(request.POST.get('totp_code'))
        totp_secret = user.totp
        totp = pyotp.TOTP(totp_secret)
        if user.google2FA == True:
            if totp.verify(totp_code):
                user.validated2FA = True
                user.save()
                return JsonResponse({'message': '2fa activated ok'})
        if totp.verify(totp_code):
            user.mail2FA = False
            user.google2FA = True
            user.validated2FA = True
            user.save()
            return JsonResponse({'message': 'ok'})
        else:
            if language == 'es':
                return JsonResponse({'error': 'Código incorrecto o expirado.'})
            elif language == 'en':
                return JsonResponse({'error': 'Wrong or expired code'})
            elif language == 'pt':
                return JsonResponse({'error': 'Código errado ou expirado'})

    @staticmethod
    def send_mailUser(user, mail, code):
        try:
            subject = "Your Authentication Code"
            message = f"Dear {user}, \n\nyour authentication code is: {code}. Use this code to verify your account."

            send_mail(
                subject,
                message,
                "crazypongreal@hotmail.com",
                [mail],
                fail_silently=False,
            )
            return JsonResponse({'message': 'messageSent'})
        except Exception as e:
            return JsonResponse({'message': f'Error: {str(e)}'})
