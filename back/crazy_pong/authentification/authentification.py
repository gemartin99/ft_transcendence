#from .models import Usermine
from datetime import datetime, timedelta
from django.conf import settings
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