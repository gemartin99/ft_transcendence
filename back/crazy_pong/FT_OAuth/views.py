# from django.shortcuts import render
import json

import requests
# from django.conf import settings
# from django.http import HttpResponse
from accounts.models import Usermine
from authentification.authentification import Authentification
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

@csrf_exempt
def check_42(request):
	data = json.loads(request.body.decode('utf-8'))
	code = data.get('code')
	print(code)
	token_url = "https://api.intra.42.fr/oauth/token"
	token_params = {
		'grant_type': 'authorization_code',
		'code': code,
		'client_id': 'u-s4t2ud-2c2ec0c7f84e7050052f58ecb3b512a3e2182827b1fa480faece0ffed304acc0',
		'client_secret': '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',
		'redirect_uri': 'https://crazy-pong.com',
	}
	try:
		response = requests.post(token_url, data=token_params)
		response.raise_for_status()  # Check for HTTP errors
		token_data = response.json()
		user_info_url = 'https://api.intra.42.fr/v2/me'
		headers = {'Authorization': f'Bearer {token_data["access_token"]}'}
		user_info_response = requests.get(user_info_url, headers=headers)
		user_info = user_info_response.json()
		print(user_info)
		user_id = user_info.get('id')
		user_login = user_info.get('login')
		if user_id:
			existing_user = Usermine.objects.filter(id42=user_id).first()
			if existing_user:
				user = existing_user
			else:
				user = Usermine(
				name='42@' + user_login,
				email=user_info.get('email'),
				id42=user_id,
				wins=0,
				losses=0,
				)
			user.online = True
			user.validated2FA = False
			user.save()
			print(user.name)
			jwtToken = Authentification.generate_jwt_token(user.id)
			response_data = {'message': 'logued', 'google2FA': user.google2FA, 'mail2FA': user.mail2FA, 'jwtToken': jwtToken, 'user': user.id}
			return JsonResponse(response_data)
	except requests.exceptions.RequestException as e:
		print(f"Error making token request: {e}")
		return JsonResponse({'error': 'Token request error'})
