# views.py
from django.http import JsonResponse

def hello_view(request):
    data = {'message': 'Hello, World!'}
    return JsonResponse(data)

def get_hello_message(request):
    data = {'message': 'Hello, World!'}
    return JsonResponse(data)

def lista_usuarios(request):
    usuarios = Usuario.objects.all()
    return render(request, 'entity/lista_usuarios.html', {'usuarios': usuarios})

def detalle_usuario(request, usuario_id):
    usuario = Usuario.objects.get(pk=usuario_id)
    return render(request, 'entity/detalle_usuario.html', {'usuario': usuario})
