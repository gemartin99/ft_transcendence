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


##NO VA
from django.core.mail import send_mail

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
