from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

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
    # tasks list
    path('tasks-list/', views.TasksListView.as_view(), name='tasks-list'),
    # delete-task
    path('delete-task/<int:pk>/', views.DeleteTaskView.as_view(), name='delete-task'),
    # view-task
    path('view-task/<int:pk>/', views.ViewTaskView.as_view(), name='view-task'),
    # delete-task-photo
    path('delete-task-photo/<int:pk>/', views.DeleteTaskPhotoView.as_view(), name='delete-task-photo'),
    # update-task
    path('update-task/<int:pk>/', views.UpdateTaskView.as_view(), name='update-task'),

    # change-password
    path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    # get logged in user details
    path('get-user-details/', views.GetUserDetailsView.as_view(), name='get-user-details'),
    # user-list
    path('user-list/', views.UserListView.as_view(), name='user-list'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)