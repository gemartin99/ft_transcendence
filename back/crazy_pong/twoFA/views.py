from django.shortcuts import render, redirect
from django.http import JsonResponse

# Create your views here.
from django.core.mail import send_mail
from accounts.models import Usermine
from django.contrib import messages
import pyotp



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


##NO VA
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt

def send_sms_via_email(to, body):
    # Replace '@txt.att.net' with the actual gateway address for the recipient's carrier (e.g., '@vtext.com' for Verizon)
    email_address = f'{to}@messaging.sprintpcs.com'
    print(email_address)
    subject = ''  # The subject is often ignored in SMS messages

    send_mail(subject, body, 'crazypongreal@hotmail.com', [email_address], fail_silently=False)

def send_sms_view(request):
    to_phone_number = '+34654508192'  # Replace with the recipient's phone number, without the plus sign and with the country code
    message_body = 'gestioname el front'

    send_sms_via_email(to_phone_number, message_body)
    print('hola')
    return JsonResponse({'message': 'messageSent'})
##NO VA




#2FA con google funcional:::
def generate_totp_secret():
    return pyotp.random_base32()

@csrf_exempt 
def enable_totp(request):
    if request.method == 'POST':
        totp_secret = generate_totp_secret()
        
        # username = ''
        # tendremos que coger el username a traves del JWT
        userid = 'holasa'
        user = Usermine.objects.get(name=userid)
        user.totp = totp_secret;

        user.save()

        # Generate the provisioning URL to be used by the Google Authenticator app
        totp = pyotp.TOTP(totp_secret)
        provisioning_url = totp.provisioning_uri(name=user.name.encode('utf-8'), issuer_name='crazy-pong')

        print('hola')
        return JsonResponse({'provisioning_url': provisioning_url})

@csrf_exempt 
def verify_totp(request):
    if request.method == 'POST':
        print('Request Data:', request.POST)
        totp_code = str(request.POST.get('totp_code'))
        # username = ''
        # tendremos que coger el username a traves del JWT
        userid = 'holasa'
        totp_secret = Usermine.objects.get(name=userid).totp


        totp = pyotp.TOTP(totp_secret)
        if totp.verify(totp_code):
            return JsonResponse({'message': 'good job'})
        else:
            return JsonResponse({'message': 'Wrong one hehe'})
