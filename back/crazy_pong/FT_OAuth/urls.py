from django.urls import path
# from django.contrib.auth import views as auth_views
from .views import check_42
# from .views import 

app_name = 'FT_OAuth'
urlpatterns = [
    path('42/', check_42, name='check_42'),


]