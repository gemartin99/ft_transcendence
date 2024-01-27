import json

import friends.langs
from accounts.models import Usermine
from authentification.authentification import Authentification
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.views.decorators.csrf import csrf_exempt


# Create your views here.
def get_friends_page(request):
    user, redirect = Authentification.get_auth_user(request)
    if not user:
        return JsonResponse({'redirect': redirect})
    language = request.META.get('HTTP_LANGUAGE', 'default_language')
    context = {
        'friends': user.friends.all(),
    }
    context.update(friends.langs.get_langs(language))
    print(context)
    content_html = render_to_string('friends/friends.html', context)
    data = {
        'title': 'Friends Page',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

@csrf_exempt 
def addFriend(request):
    language = request.META.get('HTTP_LANGUAGE', 'default_language')
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
        if language == 'en':
            return JsonResponse({'message': 'Friend added succesfully.', 'redirect': '/friends/'})
        elif language == 'es':
            return JsonResponse({'message': 'Amigo agregado con éxito.', 'redirect': '/friends/'})
        else:
            return JsonResponse({'message': 'Amigo adicionado com sucesso.', 'redirect': '/friends/'})
    except Usermine.DoesNotExist:
        if language == 'en':
            return JsonResponse({'message': 'No user matches the username.'})
        elif language == 'es':
            return JsonResponse({'message': 'Ningún usuario coincide con el nombre de usuario.'})
        else:
            return JsonResponse({'message': 'Nenhum usuário corresponde ao nome de usuário.'})