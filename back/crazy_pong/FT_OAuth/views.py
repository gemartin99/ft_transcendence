from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
import requests
from django.conf import settings
from django.http import HttpResponse

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
		'redirect_uri': 'http://localhost',
	}

	try:
		response = requests.post(token_url, data=token_params)
		response.raise_for_status()  # Check for HTTP errors

		token_data = response.json()

		# Use the access token to fetch user information
		user_info_url = 'https://api.intra.42.fr/v2/me'
		headers = {'Authorization': f'Bearer {token_data["access_token"]}'}

		user_info_response = requests.get(user_info_url, headers=headers)
		user_info = user_info_response.json()

		# print(user_info)
		print(user_info.get('id'))
		print(user_info.get('login'))
		return JsonResponse({'message': 'working'})

	except requests.exceptions.RequestException as e:
		print(f"Error making token request: {e}")
		return JsonResponse({'error': 'Token request error'})


	# response = requests.post(token_url, data=token_params)
	# print(response.text)
	# token_data = response.json()

	# # Use the access token to fetch user information
	# user_info_url = 'https://api.intra.42.fr/userinfo'
	# headers = {'Authorization': f'Bearer {token_data["access_token"]}'}

	# user_info_response = requests.get(user_info_url, headers=headers)
	# user_info = user_info_response.json()

	# return JsonResponse({'message': 'working'})



# import requests
# from django.conf import settings
# from django.http import HttpResponse

# def oauth2_callback(request):
#     code = request.GET.get('code')

#     # Exchange the authorization code for an access token
#     token_url = 'https://api.intra.42.fr/token'
#     token_params = {
#         'grant_type': 'authorization_code',
#         'code': code,
#         'client_id': settings.OAUTH2_CLIENT_ID,
#         'client_secret': settings.OAUTH2_CLIENT_SECRET,
#         'redirect_uri': settings.OAUTH2_REDIRECT_URI,
#     }

#     response = requests.post(token_url, data=token_params)
#     token_data = response.json()

#     # Use the access token to fetch user information
#     user_info_url = 'https://api.intra.42.fr/userinfo'
#     headers = {'Authorization': f'Bearer {token_data["access_token"]}'}

#     user_info_response = requests.get(user_info_url, headers=headers)
#     user_info = user_info_response.json()

#     # Process user_info as needed and store it in your backend

#     return HttpResponse("User information received and stored.")