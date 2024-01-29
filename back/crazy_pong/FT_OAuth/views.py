import json
import os

import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from accounts.models import Usermine
from authentification.authentification import Authentification


@csrf_exempt
def check_42(request):
	data = json.loads(request.body.decode('utf-8'))
	code = data.get('code')
	token_url = "https://api.intra.42.fr/oauth/token"
	token_params = {
		'grant_type': 'authorization_code',
		'code': code,
		'client_id': os.getenv('CLIENTID'),
		'client_secret': os.getenv('CLIENTSECRET'),
		'redirect_uri': os.getenv('REDIRECTURI'),
	}
	try:
		response = requests.post(token_url, data=token_params)
		response.raise_for_status()
		token_data = response.json()
		user_info_url = os.getenv('INFOURL')
		headers = {'Authorization': f'Bearer {token_data["access_token"]}'}
		user_info_response = requests.get(user_info_url, headers=headers)
		user_info = user_info_response.json()
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
			jwtToken = Authentification.generate_jwt_token(user.id)
			response_data = {'message': 'logued', 'google2FA': user.google2FA, 'mail2FA': user.mail2FA, 'jwtToken': jwtToken, 'user': user.id}
			return JsonResponse(response_data)
	except requests.exceptions.RequestException as e:
		return JsonResponse({'error': 'Token request error'})
