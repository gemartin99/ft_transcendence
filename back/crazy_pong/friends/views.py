from django.http import JsonResponse
from django.template.loader import render_to_string
from django.shortcuts import render

# Create your views here.
def get_friends_page(request):
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
    }
    content_html = render_to_string('friends/friends.html', context)
    data = {
        'title': 'Friends Page',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)