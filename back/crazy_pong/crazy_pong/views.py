# views.py
from django.http import JsonResponse

def hello_view(request):
    data = {'message': 'Hello,hhhhhhh World!'}
    return JsonResponse(data)

def get_home(request):
    data = {'message': '<strong>Hello,holadsfa World!</strong>'}
    return JsonResponse(data)

def get_login(request):
    data = {
        'title': 'Login Page',
        'content': '<strong>Hello, login</strong>',
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)