# from django.http import JsonResponse
# from django.template.loader import render_to_string
import json

# import base64
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt

from authentification.authentification import Authentification
# from django.contrib.auth.password_validation import validate_password
# from django.core.exceptions import ValidationError
# import bcrypt
from security.security import Security

# from django.shortcuts import render
from .models import Usermine

# import re

class Accounts:
    @staticmethod
    def username_is_in_use(username):
        # Check if the username is already in use
        if Usermine.objects.filter(name=username).exists():
            return True, 'Username is already in use'
        return False, None

    @staticmethod
    def validate_inputdata_for_new_account_request(request):
        # check for data
        language = request.META.get('HTTP_LANGUAGE', 'default_language')
        data = json.loads(request.body.decode('utf-8'))
        if not data:
            return False, 'Invalid data send.'
        # getters for data
        username = data.get('signupUsername')
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirm_password')
        # check everything filled
        if not username or not email or not password or not confirm_password:
            return False, 'Fill all the form inputs.'
        # parse username
        valid_username = Security.is_valid_username(username)
        if valid_username == False:
            if language == 'en':
                return False, 'Invalid characters in username'
            elif language == 'es': 
                return False, 'Caracteres inválidos en el nombre de usuario'
            else:
                return False, 'Caracteres inválidos no nome de usuário'
        #parse mail
        check_mail = Security.is_valid_email(email)
        if not check_mail:
            if language == 'en':
                return False, 'Invalid email.'
            elif language == 'es': 
                return False, 'Correo electrónico no válido.'
            else:
                return False, 'Email inválido.'
        #check pwd match
        if password != confirm_password:
            if language == 'en':
                return False, 'Password missmatch.'
            elif language == 'es':
                return False, 'Las contraseñas no coinciden.'
            else:
                return False, 'As palavras-passe não coincidem.'
        #parse pwd
        is_secure, error_messages = Security.check_pwd_security(password)
        if is_secure == False:
            print(language)
            if language == 'en':
                return False, 'Password not secure enough.'
            elif language == 'es':
                return False, 'La contraseña no es lo suficientemente segura.'
            else:
                return False, 'A senha não é segura o suficiente.'
        return True, None



    @staticmethod
    def validate_inputdata_for_login_request(request):
        data = json.loads(request.body.decode('utf-8'))
        if not data:
            return False, 'invalid data send'
        username = data.get('Username')
        password = data.get('password')
        if not username  or not password:
            return False, 'fill all the form inputs'
        return True, None

    @staticmethod 
    @csrf_exempt 
    def process_new_account_request(request):
        if request.method != 'POST':
            return False, 'Invalid request method'
        try:
            language = request.META.get('HTTP_LANGUAGE', 'default_language')
            res, errMsg = Accounts.validate_inputdata_for_new_account_request(request)
            print('res:',res,'errMsg:', errMsg)
            if errMsg or res == False:
                return False, errMsg
            # Get the vars
            data = json.loads(request.body.decode('utf-8'))
            username = data.get('signupUsername')
            email = data.get('email')
            password = data.get('password')
            confirm_password = data.get('confirm_password')
            # Check username and email are not in use
            res, errMsg = Accounts.username_is_in_use(username)
            if errMsg:
                if language == 'en':
                    return False, 'Username already in use'
                elif language == 'es':
                    return False, 'Nombre de usuario ya en uso'
                else:
                    return False, 'Nome de usuário já em uso'
            if password != confirm_password:
                if language == 'en':
                    return False, 'Password missmatch.'
                elif language == 'es':
                    return False, 'Las contraseñas no coinciden.'
                else:
                    return False, 'As palavras-passe não coincidem.'
            encrypted_pwd = Security.hash_password(password)
            pwd_str = encrypted_pwd.decode('utf-8')
            user = Usermine(name=username.lower(), password=pwd_str, email=email.lower())
            user.save()
            if language == 'en':
                return True, 'User saved successfully'
            elif language == 'es':
                return True, 'Usuario guardado correctamente'
            else: 
                return True, 'Utilizador guardado com sucesso'
        except IntegrityError as e:
            print(e)
            # Username or email in use execption
            if language == 'en':
                return False, 'Username or email already in use'
            elif language == 'es':
                return False, 'Nombre de usuario o correo electrónico ya en uso'
            else:
                return False, 'Nome de usuário ou email já em uso'


    @staticmethod 
    @csrf_exempt
    def process_new_login_request(request):
        if request.method != 'POST':
            response_data = {'error': 'Invalid request method'}
            return response_data
        try:
            res, errMsg = Accounts.validate_inputdata_for_login_request(request)
            if errMsg:
                return False, errMsg
            data = json.loads(request.body.decode('utf-8'))
            username = data.get('Username')
            print('userlogin:', username.lower())
            password = data.get('password')
            user = Usermine.objects.get(name=username.lower()) 
            if Security.verify_password(password, user.password):
                user.online = True
                user.save()
                jwtToken = Authentification.generate_jwt_token(user.id)
                response_data = {'message': 'logued', 'google2FA': user.google2FA, 'mail2FA': user.mail2FA, 'jwtToken': jwtToken, "user": user.id}
                return response_data, None
            else:
                user.save()
                response_data = {'error': 'Invalid password'}
                return response_data, None
        except Usermine.DoesNotExist:
            response_data = {'error': 'User with username does not exist'}
            return response_data, None
