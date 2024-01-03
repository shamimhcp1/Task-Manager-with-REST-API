from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    due_date = models.DateTimeField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES)
    is_complete = models.BooleanField(default=False)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_update_date = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.title} ({self.user.username}) - {self.priority} - {self.is_complete}"

class Photo(models.Model):
    task = models.ForeignKey(Task, related_name='photos', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='tasks/static/tasks/task_photos/')

    def __str__(self):
        return f"Photo for Task: {self.task.title} ({self.task.user.username}) - {self.task.priority} - {self.task.is_complete}"
