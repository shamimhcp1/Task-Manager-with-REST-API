from django.urls import path
from . import views

urlpatterns = [
    # index
    path('', views.IndexView.as_view(), name='index'),
    
    # login
    path('login/', views.LoginView.as_view(), name='login'),
    # logout
    path('logout/', views.LogoutView.as_view(), name='logout'),
    # register
    path('register/', views.RegisterView.as_view(), name='register'),
    
    # tasks
]
