from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.shortcuts import render
from .models import User


#TEST ENCRIPTACION PASSWORD

import base64
# from cryptography.hazmat.backends import default_backend
# from cryptography.hazmat.primitives import hashes
# from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
# from cryptography.fernet import Fernet
from django.db import IntegrityError




#FUNCIONES PARA ENCRIPTAR STRINGS

import bcrypt

# Function to hash a password
def hash_password(password):
    # Generate a random salt
    salt = bcrypt.gensalt()
    # Hash the password with the salt
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password
# Function to verify a password
def verify_password(input_password, hashed_password):
    # Verify the input password against the hashed password
    return bcrypt.checkpw(input_password.encode('utf-8'), hashed_password.encode('utf-8'))
# Example usage:
# if __name__ == "__main__":
#     # User registration: Hash the user's password and store it in the database
#     user_password = "my_secure_password"
#     hashed_password = hash_password(user_password)
#     # Simulate a login attempt: Verify the provided password
#     login_attempt_password = "my_secure_password"
#     if verify_password(login_attempt_password, hashed_password):
#         print("Login successful!")
#     else:
#         print("Login failed. Invalid password.")

#END FUNCIONES PARA ENCRIPTAR STRINGS
















#GUARDAR USERS EN DB


@csrf_exempt  # Use this decorator for simplicity in this example. 
#In production, handle CSRF properly.
def request_login(request):
    #tengo gestionados dos metodos para esta request, POST y GET
    if request.method == 'POST':
        try:
            #esto no hace nada (creo)
            if not request.body:
                raise json.JSONDecodeError("Empty request body", request.body, 0)
            #Aqui recibo la data que me llega con el POST
            data = json.loads(request.body)
            data_input_value = data.get('dataInput')
            print('dataInput value:', data_input_value)

            #si me llega algo desde el cuadro de texto intento guardar el usuario
            if (data_input_value):
                encrypted_pwd = hash_password(data_input_value)
                print('encoded:', encrypted_pwd)
                decode_pwd = encrypted_pwd.decode('utf-8')
                print('decoded:', decode_pwd)
                #aqui instancio el user que viene del import de arriba
                user = User(password=decode_pwd, email=data_input_value+"@"+data_input_value+".com", active=True)
                #con esto guardo en la db
                user.save()
                print('hola')
                response_data = {'message': 'Data received successfully'}
            #si no me llega nada entonces no hago nada
            else:
                view_to_check_data(request)
                all_users = User.objects.all()
                users_data = list(all_users.values())
                response_data = {'message': 'wrong data stupid'}
                return JsonResponse({'users': users_data})
            return JsonResponse(response_data)
        #si al hacer user.save() da error, salta esta excepcion:
        #en esta excepcion lo que estoy hacciendo es enviar un 
        #objeto con todos los user
        except IntegrityError as e:
            all_users = User.objects.all()
            print('dataInput:::::::::', data_input_value)
            for user in all_users:
                print(data_input_value)
                print(user.password)
                #aqui verifico las passwords y envio mensaje segun si coincide o no
                if verify_password(data_input_value, user.password):
                    print('FOUND A COINCIDENCE!!!!!')
                    response_data = {'message': 'FOUND COINCIDENCE!!'}
                else:
                    print('NO COINCIDENCE YET....')
                    response_data = {'message': 'No coincidence stupid'}
            print(f"Email {data_input_value} already exists. Error: {e}")
            return JsonResponse(response_data)
        #este error ya ni me acuerdo cuando se da
        except json.JSONDecodeError as e:
            return JsonResponse({'error': str(e) + 'gracias si muy bueno'}, status=400)
    #aqui esta el request de GET
    elif request.method == 'GET':
        try:
            print("method GET")
            #aqui recibo todos los users de la base de datos
            all_users = User.objects.all()
            #los meto en una lista para enviarlos
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



#ESTO DE AQUI ABAJO NO HACE NADA (CREO)

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



