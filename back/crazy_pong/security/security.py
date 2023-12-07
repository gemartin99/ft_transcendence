import bcrypt
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

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