import json
import traceback
from datetime import datetime
import base64

from django.utils import timezone
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, HttpResponse
from django.views import View
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.urls import reverse
from django.core.files.base import ContentFile

from . serializers import TaskSerializer, PhotoSerializer, UserSerializer
from . models import Task, Photo

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import serializers, status


# Create your views here.
class IndexView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'tasks/index.html', {})

# create-task
class CreateTaskView(View):
    
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            print(data)
            
            # Convert due_date string to datetime
            due_date_str = data['due_date']
            due_date = datetime.strptime(due_date_str, "%Y-%m-%d").replace(tzinfo=timezone.utc)
            
            serializers = TaskSerializer(data={
                'title': data['title'],
                'description': data['description'],
                'due_date': due_date,
                'priority': data['priority'],
                'is_complete': data['is_complete'],
                'user': request.user.id,
            })
            
            if not serializers.is_valid():
                return JsonResponse({'status': 'error', 'message': serializers.errors}, status=status.HTTP_400_BAD_REQUEST)
            
            # create task
            task = Task.objects.create(
                title=data['title'],
                description=data['description'],
                due_date=due_date,
                priority=data['priority'],
                is_complete=data['is_complete'],
                user=request.user
            )
            
            # check if photos
            if 'photos' in data:
                for photo_data in data['photos']:
                    # Assuming photo_data['image'] contains a base64-encoded image
                    image_data = base64.b64decode(photo_data['image'])
                    
                    # Save the image to the Photo model
                    photo = Photo.objects.create(
                        task=task
                    )
                    photo.image.save(photo_data['filename'], ContentFile(image_data), save=True)
                
            return JsonResponse({'status': 'success', 'message': 'Task created successfully'})
        except Exception as e:
            print(e)
            traceback.print_exc()
            return JsonResponse({'status': 'error', 'message': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
# Login
class LoginView(View):
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return render(request, 'tasks/index.html', {})
        return render(request, 'tasks/login.html', {})
        
    def post(self, request, *args, **kwargs):

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        print(user) # Log the user

        # Check if authentication successful
        if user is not None:
            if user.is_active:
                # User is authenticated and active
                login(request, user)
                return HttpResponseRedirect(reverse("index"))
            else:
                # User is authenticated but not active
                return render(request, "tasks/login.html", {
                    "message": "Your account is not activated. Please contact admin."
                })
        else:
            # Authentication failed (invalid credentials)
            return render(request, "tasks/login.html", {
                "message": "Invalid username and/or password."
            })
            


# Logout
class LogoutView(View):
    def get(self, request, *args, **kwargs):
        logout(request)
        return HttpResponseRedirect(reverse("login"))

# Register
class RegisterView(View):
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return render(request, 'tasks/index.html', {})
        return render(request, 'tasks/register.html', {})

    def post(self, request, *args, **kwargs):
        # create user
        username = request.POST["username"]
        email = request.POST["email"]
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        
        # check if username already exists
        if User.objects.filter(username=username).exists():
            return render(request, "tasks/register.html", {
                "message": "Username already exists."
            })
        # check if email already exists
        if User.objects.filter(email=email).exists():
            return render(request, "tasks/register.html", {
                "message": "Email already exists."
            })
        # check if password and confirmation match
        if password != confirmation:
            return render(request, "tasks/register.html", {
                "message": "Passwords do not match."
            })
        # create user
        user = User.objects.create_user(username, email, password)
        user.save()
        # return to login page with message
        return render(request, "tasks/login.html", {
            "message": "Registration Success. Please login."
        })
    
# Change Password
class ChangePasswordView(View):
    def put(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            # check if current password is correct
            user = authenticate(username=request.user.username, password=data['current_password'])
            if user is None:
                return JsonResponse({'status': 'error', 'message': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
            # check if new password and confirm password is same
            if data['new_password'] != data['confirm_password']:
                return JsonResponse({'status': 'error', 'message': 'New password and confirm password is not same'}, status=status.HTTP_400_BAD_REQUEST)
            # change password
            user.set_password(data['new_password'])
            user.save()
            return JsonResponse({'status': 'success', 'message': 'Password changed successfully'})
        except Exception as e:
            print(e)
            traceback.print_exc()
            return JsonResponse({'status': 'error', 'message': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# get-user-details
class GetUserDetailsView(View):
    def get(self, request, *args, **kwargs):
        try:
            user = User.objects.get(id=request.user.id)
            print(user) # Log the user
            serializer = UserSerializer(user)
            return JsonResponse({'status': 'success', 'data': serializer.data})
        except Exception as e:
            print(e)
            traceback.print_exc()
            return JsonResponse({'status': 'error', 'message': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

