# views.py
from django.http import JsonResponse
from django.shortcuts import render

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

def change_view(request):
    # Your view logic here
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
        # Add other variables as needed
    }
    return render(request, 'crazy_pong/template_1.html', context)
