from django.shortcuts import render
from django.http import HttpResponse
from django.views import View


# Create your views here.
class IndexView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'tasks/index.html', {})

class LoginView(View):
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return render(request, 'tasks/index.html', {})
        else:
            return render(request, 'tasks/login.html', {})

class LogoutView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'tasks/login.html', {})
    
class RegisterView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'tasks/register.html', {})
