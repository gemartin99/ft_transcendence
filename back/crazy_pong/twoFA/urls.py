from django.urls import path
from django.contrib.auth import views as auth_views

from .views import get_edit_twofactor_page

urlpatterns = [
     path('edit/', get_edit_twofactor_page, name='get_edit_twofactor_page'),
]


# To update password reset functionality