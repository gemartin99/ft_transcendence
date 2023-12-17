#from .models import Usermine
from datetime import datetime, timedelta
from django.conf import settings
from accounts.models import Usermine
import jwt

class Authentification:
    @staticmethod
    def generate_jwt_token(user_id):
        # Set the expiration time for the token
        expiration_time = datetime.utcnow() + timedelta(days=1)

        print('generate_jwt_token userid:', user_id)
        # Create the payload with user information
        payload = {
            'user_id': user_id,
            'exp': expiration_time,
        }

        # Generate the JWT token
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        return token

    # @login_required
    def generate_jwt_view(request):
        user_id = request.user.id
        jwt_token = generate_jwt_token(user_id)
        return jwt_token

    @staticmethod
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

    @staticmethod
    def get_auth_user(request):
        jwt_token = request.COOKIES.get('jwttoken', None)
        user_id = Authentification.decode_jwt_token(jwt_token)
        try:
            user = Usermine.objects.get(id=user_id)
            print(f"User: {user.name}, Online: {user.online}")
            if ((user.mail2FA or user.google2FA) and user.validated2FA == False):
                print("soy false")
                return False, '/users/login' #aqui hay que redirigir al verificar 2fa
            return user, None
        except Usermine.DoesNotExist:
            return False, '/users/login/'
