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
    # jwt_token = request.COOKIES.get('jwttoken', None)
    # user_id = Authentification.decode_jwt_token(jwt_token)
    # user = Usermine.objects.get(id=user_id)    
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
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

@csrf_exempt
def activateMail2FA(request):
    # print("random_numbers:", generate_random_numbers())
    # jwt_token = request.COOKIES.get('jwttoken', None)
    # user_id = Authentification.decode_jwt_token(jwt_token)
    # user = Usermine.objects.get(id=user_id)
    # user.mail2FA = True
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    user.generate_mail2fa_code()
    TwoFA.send_mailUser(user.email, user.mail2FACode)
    print("numbers:", user.mail2FACode)
    user.save()
    return get_verification_page(None) 

@csrf_exempt
def verifyMailCode(request):
    # jwt_token = request.COOKIES.get('jwttoken', None)
    # user_id = Authentification.decode_jwt_token(jwt_token)
    # user = Usermine.objects.get(id=user_id)
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    print("holaaaa")
    if user.is_mail2fa_code_valid():
        totp_code = request.POST.get('totp_code')
        print(user.mail2FACode)
        print(totp_code)
        if totp_code == user.mail2FACode:
            user.mail2FA = True
            user.validated2FA = True
            user.save()
            return JsonResponse({'message': '2fa activated ok'})
    return JsonResponse({'message': 'notok'})

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
