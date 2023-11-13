# views.py
from django.http import JsonResponse

def hello_view(request):
    data = {'message': 'Hello,hhhhhhh World!'}
    return JsonResponse(data)

def get_hello_message(request):
    data = {'message': '<strong>Hello,holadsfa World!</strong>'}
    return JsonResponse(data)

