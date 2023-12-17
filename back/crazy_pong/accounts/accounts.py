from django.http import JsonResponse
from django.template.loader import render_to_string
from django.views.decorators.csrf import csrf_exempt
import json
from django.shortcuts import render
from .models import Usermine
import base64
from django.db import IntegrityError
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
import bcrypt
from security.security import Security
from authentification.authentification import Authentification

class Accounts:
    @staticmethod
    def username_or_email_is_in_use(username, email):
        # Check if the username is already in use
        if Usermine.objects.filter(name=username).exists():
            return True, 'Username is already in use'
        # Check if the email is already in use
        if Usermine.objects.filter(email=email).exists():
            return True, 'Email is already in use'
        # Both are allowed to be used
        return False, None


    @staticmethod
    def validate_inputdata_for_new_account_request(request):
        data = json.loads(request.body.decode('utf-8'))
        if not data:
            return False, 'invalid data send'
        username = data.get('signupUsername')
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirm_password')
        if not username or not email or not password or not confirm_password:
            return False, 'fill all the form inputs'
        print('username: ', username)
        print('email: ', email)
        print('password: ', password)
        print('confirm_password: ', confirm_password)
        is_secure, error_messages = Security.check_pwd_security(password)
        if is_secure == False:
            print(error_messages)
            return False, error_messages
        valid_username = Security.is_valid_username(username)
        if valid_username == False:
            return False, 'Invalid characters in username'
        return True, None

    @staticmethod
    def validate_inputdata_for_login_request(request):
        data = json.loads(request.body.decode('utf-8'))
        if not data:
            return False, 'invalid data send'
        username = data.get('Username or email')
        password = data.get('password')
        if not username  or not password:
            return False, 'fill all the form inputs'
        print('username: ', username)
        print('password: ', password)
        is_secure, error_messages = Security.check_pwd_security(password)
        print('holaaaaaaaaa')
        if is_secure == False:
            return False, error_messages
        return True, None

    @staticmethod 
    @csrf_exempt 
    def process_new_account_request(request):
        if request.method != 'POST':
            return False, 'Invalid request method'
        try:
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
            res, errMsg = Accounts.username_or_email_is_in_use(username, email)
            if errMsg:
                return False, errMsg
            # Encrypt and prepare the password
            encrypted_pwd = Security.hash_password(password)
            pwd_str = encrypted_pwd.decode('utf-8')
            # Store the data
            user = Usermine(name=username, password=pwd_str, email=email)
            user.save()
            return True, 'User saved successfully'
        except IntegrityError as e:
            # Username or email in use execption
            return False, 'Invalid data'


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
            username = data.get('Username or email')
            password = data.get('password')
            user = Usermine.objects.get(name=username)
            if Security.verify_password(password, user.password):
                user.online = True
                user.save()
                jwtToken = Authentification.generate_jwt_token(user.id)
                response_data = {'message': 'logued', 'google2FA': user.google2FA, 'mail2FA': user.mail2FA, 'jwtToken': jwtToken}
                return response_data, None
            else:
                response_data = {'error': 'Invalid password'}
                return response_data, None
        except Usermine.DoesNotExist:
            response_data = {'error': 'User with username does not exist'}
            return response_data, None
