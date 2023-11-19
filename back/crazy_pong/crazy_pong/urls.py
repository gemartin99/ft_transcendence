"""
URL configuration for crazy_pong project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from .views import get_home_page, get_login_page, get_login_form_page, get_login42_form_page, change_view

urlpatterns = [
    #path('admin/', admin.site.urls),
    path('api/', get_home_page, name='get_home_page'),
    path('api/login/', get_login_page, name='get_login_page'),
    path('api/login/identify/', get_login_form_page, name='get_login_form_page'),
    path('api/login/42identify/', get_login42_form_page, name='get_login42_form_page'),
    path('api/users/', change_view, name='change_view'),
    # Add other URL patterns as needed
]
