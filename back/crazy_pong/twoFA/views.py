from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.template.loader import render_to_string
# Create your views here.
from django.core.mail import send_mail
from accounts.models import Usermine
from django.contrib import messages
import pyotp
from authentification.authentification import Authentification
from django.views.decorators.csrf import csrf_exempt
from .twoFA import TwoFA

def activateGoogle2FA(request):
    jwt_token = request.COOKIES.get('jwttoken', None)
    user_id = Authentification.decode_jwt_token(jwt_token)
    user = Usermine.objects.get(id=user_id)
    user.google2FA = True
    user.save()
    return get_verification_page() 

def verifyGoogle2FA(request):
    if (TwoFA.verify_totp(request)):
        return JsonResponse({'message': 'ok'})
    else:
        return JsonResponse({'message': 'bad one'})

def get_verification_page(request):
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
    }
    content_html = render_to_string('login/2fa.html', context)
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)


def get_set_mail2FA_page(request):
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
    }
    content_html = render_to_string('twofactor/set-email2factor.html', context)
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

@csrf_exempt
def activateMail2FA(request):
    user = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': '/users/login/'})
    if request.method != 'POST':
        return JsonResponse({'message': 'bad method!'})
    user.generate_mail2fa_code()
    user.save()
    print("numbers:", user.mail2FACode)
    if (TwoFA.send_mailUser(user.email, user.mail2FACode)):
        return JsonResponse({'message': 'ok'})
    else:
        return JsonResponse({'message': 'bad one'})

<<<<<<< HEAD
@csrf_exempt
def verifyMail2FA(request):
    jwt_token = request.COOKIES.get('jwttoken', None)
    user_id = decode_jwt_token(jwt_token)
    user = Usermine.objects.get(id=user_id)
    if (user.mail2FACode == -1):
        TwoFA.send_mailUser(user.email, user.mail2FACode)
        return JsonResponse({'message': 'mail sent'})
    else:
        if (TwoFA.verify_mail(user)):
            return JsonResponse({'message': 'ok'})
        else:
            return JsonResponse({'message': 'bad one'})

@csrf_exempt
def verifyMailCode(request):
    return JsonResponse({'error': 'bad one'})
    return JsonResponse({'message': 'ok'})

def disableTwoFactor(request):
    user = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': '/users/login/'})
    if request.method != 'POST':
        return JsonResponse({'message': 'bad method!'})
    res, error = TwoFA.disable_two_factor(user)
    if error:
        return JsonResponse({'error': error})
    else:
        return JsonResponse({'message': 'ok'})
=======
# def verifyMail2FA(request):
#     jwt_token = request.COOKIES.get('jwttoken', None)
#     user_id = decode_jwt_token(jwt_token)
#     user = Usermine.objects.get(id=user_id)
#     if (user.mail2FACode == -1):
#         TwoFA.send_mailUser(user.email, user.mail2FACode)
#         return JsonResponse({'message': 'mail sent'})
#     else:
#         if (TwoFA.verify_mail(user)):
#             return JsonResponse({'message': 'ok'})
#         else:
#             return JsonResponse({'message': 'bad one'})

@csrf_exempt
def verifyMailCode(request):
    jwt_token = request.COOKIES.get('jwttoken', None)
    user_id = Authentification.decode_jwt_token(jwt_token)
    user = Usermine.objects.get(id=user_id)
    print("holaaaa")
    if user.is_mail2fa_code_valid():
        totp_code = request.POST.get('totp_code')
        print(user.mail2FACode)
        print(totp_code)
        if totp_code == user.mail2FACode:
            user.mail2FA = True
            user.save()
            return JsonResponse({'message': '2fa activated ok'})
    return JsonResponse({'message': 'notok'})
>>>>>>> 4e43c515b9bd6d408a04e1b18854c766074d0d02

# def mail(request):
#     try:
#         send_mail(
#             "Jaime a ver si curras un rato",
#             "Biel tontu",
#             "crazypongreal@hotmail.com",
#             ["jareste2000@gmail.com"],
#             fail_silently=False,
#         )
#         return JsonResponse({'message': 'messageSent'})
#     except Exception as e:
#         return JsonResponse({'message': f'Error: {str(e)}'})


# ##NO VA
# from django.core.mail import send_mail
# from django.views.decorators.csrf import csrf_exempt

# def send_sms_via_email(to, body):
#     # Replace '@txt.att.net' with the actual gateway address for the recipient's carrier (e.g., '@vtext.com' for Verizon)
#     email_address = f'{to}@messaging.sprintpcs.com'
#     print(email_address)
#     subject = ''  # The subject is often ignored in SMS messages

#     send_mail(subject, body, 'crazypongreal@hotmail.com', [email_address], fail_silently=False)

# def send_sms_view(request):
#     to_phone_number = '+34654508192'  # Replace with the recipient's phone number, without the plus sign and with the country code
#     message_body = 'gestioname el front'

#     send_sms_via_email(to_phone_number, message_body)
#     print('hola')
#     return JsonResponse({'message': 'messageSent'})
# ##NO VA

# #2FA con google funcional:::
# def generate_totp_secret():
#     return pyotp.random_base32()

# @csrf_exempt 
# def enable_totp(request):
#     if request.method == 'POST':
#         totp_secret = generate_totp_secret()
        

#         jwt_token = request.COOKIES.get('jwttoken', None)
#         user_id = Authentification.decode_jwt_token(jwt_token)
#         totp_code = str(request.POST.get('totp_code'))
#         userid = user_id
        
#         # username = ''
#         # tendremos que coger el username a traves del JWT
#         user = Usermine.objects.get(id=userid)
#         user.totp = totp_secret;
#         user.save()

#         # Generate the provisioning URL to be used by the Google Authenticator app
#         totp = pyotp.TOTP(totp_secret)
#         provisioning_url = totp.provisioning_uri(name=user.name.encode('utf-8'), issuer_name='crazy-pong')

#         print('hola')
#         return JsonResponse({'provisioning_url': provisioning_url})

# @csrf_exempt 
# def verify_totp(request):
#     if request.method == 'POST':
#         jwt_token = request.COOKIES.get('jwttoken', None)
#         user_id = Authentification.decode_jwt_token(jwt_token)
#         totp_code = str(request.POST.get('totp_code'))
#         userid = user_id
#         totp_secret = Usermine.objects.get(id=userid).totp


#         totp = pyotp.TOTP(totp_secret)
#         if totp.verify(totp_code):
#             return JsonResponse({'message': 'good job'})
#         else:
#             return JsonResponse({'message': 'Wrong one hehe'})
