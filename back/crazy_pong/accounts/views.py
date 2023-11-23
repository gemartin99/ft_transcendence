from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.shortcuts import render
from .models import User


#TEST ENCRIPTACION PASSWORD

import base64
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.fernet import Fernet
from django.db import IntegrityError

def encrypt_data(data, key):
    cipher_suite = Fernet(key)
    cipher_text = cipher_suite.encrypt(data.encode())
    return cipher_text

def compare_encrypted_data(encrypted_data, user_input, key):
    cipher_suite = Fernet(key)
    decrypted_data = cipher_suite.decrypt(encrypted_data).decode()
    decrypted_user = cipher_suite.decrypt(encrypted_data).decode()
    print('decrypted_data::::::::::::', decrypted_data)
    return decrypted_data == decrypted_user


# Generate a key using PBKDF2HMAC for added security
salt = salt_123  # You should use a unique salt for each user
kdf = PBKDF2HMAC(
    algorithm=hashes.SHA256(),
    iterations=100000,  # Adjust this according to your security requirements
    salt=salt,
    length=32
)

key = base64.urlsafe_b64encode(kdf.derive("Crazy_pong".encode())).decode()

# # Encrypt the password before saving it to the database
# encrypted_password = encrypt_data(user_input_password, key)

# # Later, when comparing user input with the stored encrypted password
# if compare_encrypted_data(encrypted_password, user_input_password, key):
#     print("Passwords match!")
# else:
#     print("Passwords do not match.")

# #TEST ENCRIPTACION PASSWORD


















#GUARDAR USERS EN DB


@csrf_exempt  # Use this decorator for simplicity in this example. 
#In production, handle CSRF properly.
def request_login(request):
    if request.method == 'POST':
        try:
            if not request.body:
                raise json.JSONDecodeError("Empty request body", request.body, 0)
            data = json.loads(request.body)
            data_input_value = data.get('dataInput')
            print('dataInput value:', data_input_value)
            if (data_input_value):
                encrypted_pwd = encrypt_data(data_input_value, key)
                user = User(password=encrypted_pwd, email=data_input_value+"@"+data_input_value+".com", active=True)
                user.save()
                print('hola')
                response_data = {'message': 'Data received successfully'}
            else:
                view_to_check_data(request)
                all_users = User.objects.all()
                users_data = list(all_users.values())
                response_data = {'message': 'wrong data stupid'}
                return JsonResponse({'users': users_data})
            return JsonResponse(response_data)
        except IntegrityError as e:
            all_users = User.objects.all()
            encrypted_pwd = encrypt_data(data_input_value, key)
            print('dataInput:::::::::', data_input_value)
            for user in all_users:
                if compare_encrypted_data(user.password, encrypted_pwd, key):
                    print('FOUND A COINCIDENCE!!!!!')
                else:
                    print('NO COINCIDENCE YET....', user.password, data_input_value)
            print(f"Email {data_input_value} already exists. Error: {e}")
            response_data = {'error': 'Email already exists'}
            return JsonResponse(response_data)
        except json.JSONDecodeError as e:
            return JsonResponse({'error': str(e) + 'gracias si muy bueno'}, status=400)
    elif request.method == 'GET':
        try:
            print("method GET")
            all_users = User.objects.all()
            users_data = list(all_users.values())
            response_data = {'message': 'wrong data stupid'}
            return JsonResponse({'users': users_data})

        except json.JSONDecodeError as e:
            return JsonResponse({'error': str(e) + 'gracias si muy bueno'}, status=400)
    return JsonResponse({'message': 'Invalid method'})

#GUARDAR USERS EN DB


#CONSULTAR USERS EN DB

def view_to_check_data(request):
    # Retrieve all User objects from the database
    all_users = User.objects.all()

    # Do something with the retrieved data, e.g., print it
    for user in all_users:
        print(f"User ID: {user.id}, Email: {user.email}, Active: {user.active}")

    # You can also filter data based on certain conditions
    # For example, retrieve active users
    active_users = User.objects.filter(active=True)
    for active_user in active_users:
        print(f"Active User ID: {active_user.id}, Email: {active_user.email}")

    # Return a response, render a template, or do other things with the data
    return JsonResponse({'message': 'Data checked successfully'})

#CONSULTAR USERS EN DB



def get_login_form_page(request):
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
    }
    content_html = render_to_string('login/normal_login.html', context)
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)


def get_home_page(request):
    data = {
        'title': 'Login Page',
        'content': '<strong>Hello,holadsfa World!</strong>',
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)



