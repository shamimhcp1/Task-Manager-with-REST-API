from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.views import View
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse

from django.contrib.auth.models import User

# Create your views here.
class IndexView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'tasks/index.html', {})

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
        return render(request, 'tasks/login.html', {})

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
    