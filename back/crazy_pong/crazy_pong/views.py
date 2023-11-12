# views.py
from django.http import JsonResponse

def hello_view(request):
    data = {'message': 'Hello, World!'}
    return JsonResponse(data)

