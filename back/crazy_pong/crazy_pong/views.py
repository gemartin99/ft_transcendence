import crazy_pong.langs
from django.http import JsonResponse
from django.template.loader import render_to_string
from authentification.authentification import Authentification

from accounts.models import Usermine

# Front pages that are not from a specific app 
def get_aboutus_page(request):
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
    }
    content_html = render_to_string('aboutus/aboutus.html', context)
    data = {
        'title': 'About us',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

def get_information_page(request):

    loggued, redirect = Authentification.user_loggued_ok(request)
    if (loggued == True):
        jwt_token = request.COOKIES.get('jwttoken', None)
        user_id = Authentification.decode_jwt_token(jwt_token)
        user = Usermine.objects.get(id=user_id)
        languaje = user.language
    else:
        language = request.META.get('HTTP_LANGUAGE', 'default_language')

    context = crazy_pong.langs.get_langs(language)
    content_html = render_to_string('information/information.html', context)
    data = {
        'title': 'Information',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)


def get_home_page(request):
    loggued, redirect = Authentification.user_loggued_ok(request)
    if (loggued == True):
        jwt_token = request.COOKIES.get('jwttoken', None)
        user_id = Authentification.decode_jwt_token(jwt_token)
        user = Usermine.objects.get(id=user_id)
        languaje = user.language
    else:
        language = request.META.get('HTTP_LANGUAGE', 'default_language')



    context = crazy_pong.langs.get_langs(language)
    jwtToken = request.COOKIES.get('jwttoken', None)
    if jwtToken:
        context.update({'loggued': True})
    # else:
    #     context.update({'loggued': False})
    print(jwtToken)
    content_html = render_to_string('home/index.html', context)
    data = {
        'title': 'Home2',
        'content': content_html,
        'additionalInfo': language,
    }
    return JsonResponse(data)


