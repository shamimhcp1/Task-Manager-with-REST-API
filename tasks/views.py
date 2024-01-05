import json
import traceback
from datetime import datetime, time
from django.utils import timezone

from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, HttpResponse, QueryDict
from django.views import View
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.urls import reverse
from django.core.files.base import ContentFile
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.utils.dateparse import parse_date

from . serializers import TaskSerializer, PhotoSerializer, UserSerializer
from . models import Task, Photo

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import serializers, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.views import APIView


# Create your views here.
class IndexView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'tasks/index.html', {})

# create-task
class CreateTaskView(View):
    def post(self, request, *args, **kwargs):
        try:
            # Use request.POST for form data
            data = request.POST.dict()
            print(data) # Log the data
            # Convert due_date string to datetime
            due_date_str = data['due_date']
            print('due_date_str: ', due_date_str)
            due_date = datetime.strptime(due_date_str, "%Y-%m-%d").date()

            # Convert date to datetime
            due_datetime = datetime.combine(due_date, time())

            # Create task serializer
            serializer = TaskSerializer(data={
                'title': data['title'],
                'description': data['description'],
                'due_date': due_datetime,
                'priority': data['priority'],
                'is_complete': data['is_complete'],
                'user': request.user.id,
            })

            if not serializer.is_valid():
                return JsonResponse({'status': 'error', 'message': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

            # Create task
            task = Task.objects.create(
                title=data['title'],
                description=data['description'],
                due_date=due_date,
                priority=data['priority'],
                is_complete=data['is_complete'],
                user=request.user
            )

            # Check if photos
            if 'photos' in request.FILES:
                for photo_data in request.FILES.getlist('photos'):
                    # Save the image to the Photo model
                    photo = Photo.objects.create(
                        task=task,
                        image=photo_data,
                    )

            return JsonResponse({'status': 'success', 'message': 'Task created successfully'})
        except Exception as e:
            print(e)
            traceback.print_exc()
            return JsonResponse({'status': 'error', 'message': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)        

# TasksListView with TaskSerializer
class TasksListView(View):
    def get(self, request, *args, **kwargs):
        try:
            # Get all tasks for the user and order by priority
            if request.user.is_superuser:
                tasks = Task.objects.all().order_by('priority')
            else:
                tasks = Task.objects.filter(user=request.user).order_by('priority')
            # Create task serializer
            serializer = TaskSerializer(tasks, many=True)
            return JsonResponse({'status': 'success', 'tasksList': serializer.data})
        except Exception as e:
            print(e)
            traceback.print_exc()
            return JsonResponse({'status': 'error', 'message': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            

# Delete Task and photos
class DeleteTaskView(View):
    def delete(self, request, *args, **kwargs):
        try:
            task = Task.objects.get(id=kwargs['pk'])
            # check if user is superuser
            if request.user.is_superuser:
                pass
            else:
                # check if user is authorized to delete the task
                if task.user != request.user:
                    return JsonResponse({'status': 'error', 'message': 'You are not authorized to delete this task'}, status=status.HTTP_401_UNAUTHORIZED)
                
            # Delete all photos related to this task and delete the files
            for photo in task.photos.all():
                photo.image.delete()
                photo.delete()
            # Delete the task
            task.delete()
            return JsonResponse({'status': 'success', 'message': 'Task deleted successfully'})
        except Task.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Task does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            traceback.print_exc()
            return JsonResponse({'status': 'error', 'message': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# view-task
class ViewTaskView(View):
    def get(self, request, *args, **kwargs):
        try:
            task = Task.objects.get(id=kwargs['pk'])
            # check if user is superuser
            if request.user.is_superuser:
                pass
            else:
                # check if user is authorized to view the task
                if task.user != request.user:
                    return JsonResponse({'status': 'error', 'message': 'You are not authorized to view this task'}, status=status.HTTP_401_UNAUTHORIZED)
            # Create task serializer
            serializer = TaskSerializer(task)
            # Create photo serializer
            photo_serializer = PhotoSerializer(task.photos.all(), many=True)
            return JsonResponse({'status': 'success', 'task': serializer.data, 'photos': photo_serializer.data})
        except Task.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Task does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            traceback.print_exc()
            return JsonResponse({'status': 'error', 'message': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# DeleteTaskPhotoView
class DeleteTaskPhotoView(View):
    def delete(self, request, *args, **kwargs):
        try:
            photo = Photo.objects.get(id=kwargs['pk'])
            # check if user is superuser
            if request.user.is_superuser:
                pass
            else:
                # check if user is authorized to delete the photo
                if photo.task.user != request.user:
                    return JsonResponse({'status': 'error', 'message': 'You are not authorized to delete this photo'}, status=status.HTTP_401_UNAUTHORIZED)
            # Delete the photo and delete the file
            photo.image.delete()
            photo.delete()
            return JsonResponse({'status': 'success', 'message': 'Photo deleted successfully'})
        except Photo.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Photo does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            traceback.print_exc()
            return JsonResponse({'status': 'error', 'message': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Update Task
@method_decorator(csrf_exempt, name='dispatch')
class UpdateTaskView(View):
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def patch(self, request, *args, **kwargs):
        body_unicode = request.body.decode('utf-8')
        body_data = json.loads(body_unicode)
        print('Request Data:', body_data)
        print('Request Files:', request.FILES)

        try:
            task = Task.objects.get(id=kwargs['pk'])
            # check if user is superuser
            if request.user.is_superuser:
                user = User.objects.get(id=body_data.get('user'))
            else:
                # check if user is authorized to update the task
                if task.user != request.user:
                    return JsonResponse({'status': 'error', 'message': 'You are not authorized to update this task'}, status=status.HTTP_401_UNAUTHORIZED)
                user = request.user

            # Use body_data.get for form data
            data = {
                'title': body_data.get('title'),
                'description': body_data.get('description'),
                'due_date': body_data.get('due_date'),
                'priority': body_data.get('priority'),
                'is_complete': body_data.get('is_complete'),
                'user': user,
            }
            print(data) # Log the data

            # Convert due_date string to datetime
            due_date_str = data['due_date']
            due_date = datetime.strptime(due_date_str, "%Y-%m-%d").date()

            # Convert date to datetime
            due_datetime = datetime.combine(due_date, time())

            # Create task serializer
            serializer = TaskSerializer(data={
                'title': data['title'],
                'description': data['description'],
                'due_date': due_datetime,
                'priority': data['priority'],
                'is_complete': data['is_complete'],
                'user': user.id,
            })

            if not serializer.is_valid():
                return JsonResponse({'status': 'error', 'message': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

            # Update task
            task.title = data['title']
            task.description = data['description']
            task.due_date = due_date
            task.priority = data['priority']
            task.is_complete = data['is_complete']
            task.user = user
            task.save()
            
            # Check if photos
            if 'photos' in request.FILES:
                for photo_data in request.FILES.getlist('photos'):
                    # Save the image to the Photo model
                    photo = Photo.objects.create(
                        task=task,
                        image=photo_data,
                    )

            return JsonResponse({'status': 'success', 'message': 'Task updated successfully'})
        except Task.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Task does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            traceback.print_exc()
            return JsonResponse({'status': 'error', 'message': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# filter-task with TaskSerializer by submitFilterTaskForm
class FilterTaskView(View):
    def post(self, request, *args, **kwargs):
        try:
            # Use request.POST for form data
            data = request.POST.dict()
            print(data)  # Log the data

            # Optional filter parameters
            due_date_str = data.get('due_date', None)
            creation_date_str = data.get('creation_date', None)
            priority = data.get('priority', None)
            is_complete = data.get('is_complete', None)

            # Convert date strings to datetime if provided
            due_datetime = datetime.combine(parse_date(due_date_str), time()) if due_date_str else None
            creation_datetime = timezone.make_aware(datetime.datetime.strptime(creation_date_str, "%Y-%m-%d")) if creation_date_str else None   

            # Build filter conditions based on provided data
            filter_conditions = {}
            if due_datetime:
                filter_conditions['due_date'] = due_datetime
            if creation_datetime:
                filter_conditions['creation_date'] = creation_datetime
            if priority is not None:
                filter_conditions['priority'] = priority
            if is_complete is not None:
                filter_conditions['is_complete'] = is_complete

            # Get all tasks for the user and order by priority filtered by due_date, creation_date, priority, is_complete
            if request.user.is_superuser:
                tasks = Task.objects.filter(**filter_conditions).order_by('priority')
            else:
                filter_conditions['user'] = request.user
                tasks = Task.objects.filter(**filter_conditions).order_by('priority')

            # Create task serializer
            serializer = TaskSerializer(tasks, many=True)
            return JsonResponse({'status': 'success', 'tasksList': serializer.data})
        except Exception as e:
            print(e)
            traceback.print_exc()
            return JsonResponse({'status': 'error', 'message': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# User List
class UserListView(View):
    def get(self, request, *args, **kwargs):
        try:
            # Get all users
            users = User.objects.all()
            # Create user serializer
            serializer = UserSerializer(users, many=True)
            return JsonResponse({'status': 'success', 'usersList': serializer.data})
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

# get logged in user details
class GetUserDetailsView(View):
    def get(self, request, *args, **kwargs):
        try:
            # check if user is authenticated
            if not request.user.is_authenticated:
                return JsonResponse({'status': 'error', 'message': 'User is not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
            # Create user serializer
            serializer = UserSerializer(request.user)
            return JsonResponse({'status': 'success', 'user': serializer.data})
        except Exception as e:
            print(e)
            traceback.print_exc()
            return JsonResponse({'status': 'error', 'message': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)