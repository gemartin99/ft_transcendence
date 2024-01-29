from django.http import JsonResponse
from django.template.loader import render_to_string

import crazy_pong.langs
import random
import crazy_pong.users
# Front pages that are not from a specific app 
def get_aboutus_page(request):
    numbers = list(range(5))
    random.shuffle(numbers)
    context = crazy_pong.users.get_context_aboutus(numbers)
    content_html = render_to_string('aboutus/aboutus.html', context)
    data = {
        'title': 'About us',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)

def get_information_page(request):
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


