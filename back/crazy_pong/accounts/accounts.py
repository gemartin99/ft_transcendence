from django.http import JsonResponse
from django.template.loader import render_to_string
##Jareste limpiar
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
        print('try 0!!!!')
        data = json.loads(request.body.decode('utf-8'))
        if not data:
            return False, 'invalid data send'
        username = data.get('signupUsername')
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirm_password')

        if not username or not email or not password or not confirm_password:
            return False, 'fill all the form inputs'

        print('try 1!!!!')
        print(data)
        print('username: ', username)
        print('email: ', email)
        print('password: ', password)
        print('confirm_password: ', confirm_password)

        print('try 2!!!!')
        is_secure, error_messages = Security.check_pwd_security(password)
        print('try 3!!!!')
        if is_secure == False:
            print(error_messages)
            return False, error_messages
        print('try 4!!!!')
        return True, None

    @staticmethod
    def validate_inputdata_for_login_request(request):
        print('try 0!!!!')
        data = json.loads(request.body.decode('utf-8'))
        if not data:
            return False, 'invalid data send'
        username = data.get('Username or email')
        password = data.get('password')

        if not username  or not password:
            return False, 'fill all the form inputs'

        print('try 1!!!!')
        print(data)
        print('username: ', username)
        print('password: ', password)

        print('try 2!!!!')
        is_secure, error_messages = Security.check_pwd_security(password)
        print('try 3!!!!')
        if is_secure == False:
            print(error_messages)
            return False, error_messages
        print('try 4!!!!')
        return True, None


    @staticmethod 
    @csrf_exempt 
    def process_new_account_request(request):
        print('in Accounts process_new_account_request!!!!')

        #Check request method
        if request.method != 'POST':
            return False, 'Invalid request method'

        print('request method is POST!!!!')
        try:
            # Check input data is valid one
            res, errMsg = Accounts.validate_inputdata_for_new_account_request(request)
            if errMsg:
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
        print('in Accounts process_new_login_request!!!!')

        #Check request method
        if request.method != 'POST':
            return False, 'Invalid request method'

        try:
            res, errMsg = Accounts.validate_inputdata_for_login_request(request)
            if errMsg:
                return False, errMsg
            print('try 0!!!!')
            data = json.loads(request.body.decode('utf-8'))
            username = data.get('Username or email')
            password = data.get('password')
            all_users = Usermine.objects.all()
            print('try 1!!!!')
            
            user = Usermine.objects.get(name=username)
            print('try 1.2!!!!')
            print(user)
            user.online = True
            user.save()

            user_info = {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'active': user.playing,
                'online': user.online,
                'id42': user.id42,
                'wins': user.wins,
                'losses': user.losses,
            }
            print('try 2!!!!')

            if Security.verify_password(password, user.password):
                # Generate the jwt token
                jwtToken = Authentification.generate_jwt_token(user.id)
                print("Token is:")
                print(jwtToken)
                response_data = {'message': 'logueao pum', 'user_info': user_info, 'jwtToken': jwtToken}
                return response_data, None
            else:
                return False, 'eres tontito'

        except Usermine.DoesNotExist:
            print('try 4!!!!')
            return JsonResponse({'error': 'User with username does not exist'}, status=200)
