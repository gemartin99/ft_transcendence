import bcrypt
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
import re

class Security:
    @staticmethod
    def hash_password(password):
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed_password

    @staticmethod
    def verify_password(input_password, hashed_password):
        return bcrypt.checkpw(input_password.encode('utf-8'), hashed_password.encode('utf-8'))

    @staticmethod
    def check_pwd_security(password):
        try:
            validate_password(password)
            return True, None
        except ValidationError as e:
            return False, e.messages

    @staticmethod
    def is_valid_username(username):
        # Define a regular expression for allowed characters in the username
        allowed_characters = re.compile(r'^[a-zA-Z0-9_\-]+$')
        print('here:', allowed_characters)
        # Check if the username matches the pattern
        return bool(allowed_characters.match(username))