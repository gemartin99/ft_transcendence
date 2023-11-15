from django.contrib import admin
from django.urls import path, include
from .views import get_hello_message

urlpatterns = [
    #path('admin/', admin.site.urls),
    #path('entity/', include('entity.urls')),
    path('api/hello/', get_hello_message, name='get_hello_message'),
    path('', get_hello_message, name='get_hello_message'),  # Coloca esta ruta al final
]
