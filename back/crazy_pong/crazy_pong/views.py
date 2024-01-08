from django.http import JsonResponse
from django.template.loader import render_to_string
from django.shortcuts import render
import crazy_pong.langs

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
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
    }
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
    content_html = render_to_string('home/index.html', context)
    data = {
        'title': 'Home',
        'content': content_html,
        'additionalInfo': language,
    }
    return JsonResponse(data)


