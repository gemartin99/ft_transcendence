from django.http import JsonResponse
from django.template.loader import render_to_string
##Jareste limpiar
from django.views.decorators.csrf import csrf_exempt
import json
from django.shortcuts import render
from .models import Usermine
from django.shortcuts import get_object_or_404

import base64
from django.db import IntegrityError
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
import bcrypt

def get_home_page(request):
    data = {
        'title': 'Login Page',
        'content': '<strong>Hello,holadsfa World!</strong>',
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)


def get_login_page(request):
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
    }
    content_html = render_to_string('login/select_login.html', context)
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

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

def get_login42_form_page(request):
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
    }
    content_html = render_to_string('login/42_login.html', context)
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

def get_register_new_account_page(request):
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
    }
    content_html = render_to_string('login/register_account.html', context)
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

def change_view(request):
    # Your view logic here
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
        # Add other variables as needed
    }
    return render(request, 'home/index.html', context)

# Function to hash a password
def hash_password(password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password

def verify_password(input_password, hashed_password):
    return bcrypt.checkpw(input_password.encode('utf-8'), hashed_password.encode('utf-8'))

#END FUNCIONES PARA ENCRIPTAR STRINGS

def check_pwd_security(password):
    try:
        validate_password(password)
        return True, None
    except ValidationError as e:
        return False, e.messages





import jwt
from datetime import datetime, timedelta
from django.conf import settings

def generate_jwt_token(user_id):
    # Set the expiration time for the token
    expiration_time = datetime.utcnow() + timedelta(days=1)

    # Create the payload with user information
    payload = {
        'user_id': user_id,
        'exp': expiration_time,
    }

    # Generate the JWT token
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

    return token


from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
# from .utils import generate_jwt_token

@login_required
def generate_jwt_view(request):
    user_id = request.user.id
    jwt_token = generate_jwt_token(user_id)

    return JsonResponse({'token': jwt_token})




import jwt
from django.conf import settings

def decode_jwt_token(token):
    try:
        # Decode the JWT token
        decoded_payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        
        # Retrieve the user_id from the payload
        user_id = decoded_payload['user_id']
        
        return user_id
    except jwt.ExpiredSignatureError:
        # Handle token expiration
        print("Token has expired.")
        return None
    except jwt.InvalidTokenError:
        # Handle invalid token
        print("Invalid token.")
        return None










@csrf_exempt 
def create_account(request):
    print('in create account!!!!')
    if request.method == 'POST':
        print('request methos is POST!!!!')
        try:
            print('try 0!!!!')
            data = json.loads(request.body.decode('utf-8'))
            username = data.get('signupUsername')
            email = data.get('email')
            password = data.get('password')
            confirm_password = data.get('confirm_password')

            # prints to check
            print('try 1!!!!')
            print(data)
            print('username: ', username)
            print('email: ', email)
            print('password: ', password)
            print('confirm_password: ', confirm_password)
            # prints to check

            print('try 2!!!!')
            is_secure, error_messages = check_pwd_security(password)
            print('try 3!!!!')
            if is_secure == False:
                print(error_messages)
                return JsonResponse({'errors': error_messages})
            print('try 4!!!!')
            encrypted_pwd = hash_password(password)
            pwd_str = encrypted_pwd.decode('utf-8')
            user = Usermine(name=username.lower(), password=pwd_str, email=email.lower())
            user.save()
            return JsonResponse({'message': 'User saved successfully'})

        except IntegrityError as e:
            print('try 5!!!!')
            response_data = {'message': 'Email already exists'}
            print(f"Email already exists. Error: {e}")
            return JsonResponse(response_data, status=200)

        except json.JSONDecodeError as e:
            print('try 6!!!!')
            response_data = {'error': str(e) + 'gracias si muy bueno'}
            return JsonResponse(response_data, status=200)

    # Return a default response if the request method is not POST
    return JsonResponse({'error': 'Invalid request method'}, status=200)

@csrf_exempt
def do_login(request):
    print('in do_login!!!!')
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            print('request methos is POST!!!!')
            try:
                print('try 0!!!!')
                data = json.loads(request.body.decode('utf-8'))
                username = data.get('Username or email')
                password = data.get('password')
                all_users = Usermine.objects.all()
                print('try 1!!!!')
                
                user = Usermine.objects.get(name=username.lower())
                print('try 1.2!!!!')
                print(user)
                jwttoken = generate_jwt_token(username.lower())
                print('try 2!!!!')
                print('jwttoken:', jwttoken)
                if verify_password(password, user.password):
                    response_data = {'message': 'loguin ok', 'user': username,
                                    'jwttoken': jwttoken}
                    user.online = True
                    user.save()
                    return JsonResponse(response_data)
                else:
                    response_data = {'message': 'eres tontito'}
                    return JsonResponse(response_data)
                print('try 3!!!!')
            except Usermine.DoesNotExist:
                print('try 4!!!!')
                return JsonResponse({'error': 'User with username does not exist'}, status=200)
        else:
            return JsonResponse({'error': 'Invalid form data'}, status=400)

    # Return a JsonResponse indicating that the request method is not allowed
    print('try 5!!!!')
    return JsonResponse({'error': 'Method not allowed'}, status=200)

def logout(request):
    print('logout')
    jwt_token = request.COOKIES.get('jwttoken', None)
    user_id = decode_jwt_token(jwt_token)
    print(user_id)
    user = Usermine.objects.get(name=user_id)
    user.online = False
    user.save()
    response = JsonResponse({'message': 'Hello, world!'})
    response.delete_cookie('jwttoken')
    return response
    # return JsonResponse({'message': 'User passed to offline'})


from django.http import HttpResponse

def my_view(request):
    response = HttpResponse("Hello, world!")
    response.set_cookie('cookiename', 'cookievalue')
    return response

##debug functions
@csrf_exempt
def show_online(request):
    jwt_token = request.COOKIES.get('jwttoken', None)
    user_id = decode_jwt_token(jwt_token)
    print('onlinejwt:',jwt_token)
    print('uid:', user_id)
    all_users = Usermine.objects.all()
    for user in all_users:
        print(f"User: {user.name}, Online: {user.online}")
    return JsonResponse({'content': 'users printed'})


