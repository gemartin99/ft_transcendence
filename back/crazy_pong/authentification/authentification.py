#from .models import Usermine
from datetime import datetime, timedelta

import jwt
from django.conf import settings

from accounts.models import Usermine


class Authentification:
    @staticmethod
    def generate_jwt_token(user_id):
        expiration_time = datetime.utcnow() + timedelta(days=1)
        payload = {
            'user_id': user_id,
            'exp': expiration_time,
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        return token

    def generate_jwt_view(request):
        user_id = request.user.id
        jwt_token = Authentification.generate_jwt_token(user_id)
        return jwt_token

    @staticmethod
    def decode_jwt_token(token):
        try:
            decoded_payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_payload['user_id']
            return user_id
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None

    @staticmethod
    def get_auth_user(request):
        jwt_token = request.COOKIES.get('jwttoken', None)
        user_id = Authentification.decode_jwt_token(jwt_token)
        try:
            user = Usermine.objects.get(id=user_id)
            if (user.mail2FA and user.validated2FA == False):
                return False, '/twoFA/MailVerification/'
            if (user.google2FA and user.validated2FA == False):
                return False, '/twoFA/GoogleVerification/'
            return user, None
        except Usermine.DoesNotExist:
            return False, '/users/login/'

    @staticmethod
    def user_loggued_ok(request):
        jwt_token = request.COOKIES.get('jwttoken', None)
        if not jwt_token:
            return False, '/users/login/'
        user_id = Authentification.decode_jwt_token(jwt_token)
        try:
            user = Usermine.objects.get(id=user_id)
            if (user.mail2FA and user.validated2FA == False):
                return False, '/twoFA/MailVerification/'
            if (user.google2FA and user.validated2FA == False):
                return False, '/twoFA/GoogleVerification/'
            return True, '/'
        except Usermine.DoesNotExist:
            return False, '/users/login/'




