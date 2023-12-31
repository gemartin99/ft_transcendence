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
import re

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
    def is_valid_email(email):
        # Regular expression for a basic email validation
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'

        # Use re.match() to check if the email matches the pattern
        match = re.match(email_regex, email)

        return bool(match)

    @staticmethod
    def validate_inputdata_for_new_account_request(request):
        # check for data
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
            return False, 'Invalid characters in username'
        #parse mail
        check_mail = Accounts.is_valid_email(email)
        if not check_mail:
            return False, 'Introduce a valid email.'
        #parse pwd
        is_secure, error_messages = Security.check_pwd_security(password)
        if is_secure == False:
            print(error_messages)
            return False, error_messages
        #check pwd match
        if password != confirm_password:
            return False, 'Password missmatch.'
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
        print('username: ', username)
        print('password: ', password)
        # is_secure, error_messages = Security.check_pwd_security(password)
        print('holaaaaaaaaa')
        # if is_secure == False:
        #     return False, error_messages
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
            user = Usermine(name=username.lower(), password=pwd_str, email=email.lower())
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
            username = data.get('Username')
            print('userlogin:', username.lower())
            password = data.get('password')
            user = Usermine.objects.get(name=username.lower()) 
            if Security.verify_password(password, user.password):
                user.online = True
                user.save()
                jwtToken = Authentification.generate_jwt_token(user.id)
                response_data = {'message': 'logued', 'google2FA': user.google2FA, 'mail2FA': user.mail2FA, 'jwtToken': jwtToken}
                return response_data, None
            else:
                user.save()
                response_data = {'error': 'Invalid password'}
                return response_data, None
        except Usermine.DoesNotExist:
            response_data = {'error': 'User with username does not exist'}
            return response_data, None
