from django.http import JsonResponse
from django.template.loader import render_to_string
from django.shortcuts import render
from authentification.authentification import Authentification
from django.views.decorators.csrf import csrf_exempt
import json
from accounts.models import Usermine

# Create your views here.
def get_friends_page(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    context = {
        'friends': user.friends.all(),
        'variable2': 'template variable 2',
    }
    content_html = render_to_string('friends/friends.html', context)
    data = {
        'title': 'Friends Page',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

@csrf_exempt 
def addFriend(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    json_data = json.loads(request.body.decode('utf-8'))
    print('holaaaaaaaa')
    print(json_data)
    searchValue = json_data.lower()
    print(searchValue)
    try:
        user.friends.add(Usermine.objects.get(name=searchValue))
        print('anadioooooo')
    except Usermine.DoesNotExist:
        print('eresboboboooooo')    

    return (JsonResponse({'hola': 'meow'}))