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
    
    # tasks create
    path('create-task/', views.CreateTaskView.as_view(), name='create-task'),


    # change-password
    path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    # get-user-details
    path('get-user-details/', views.GetUserDetailsView.as_view(), name='get-user-details'),
]
