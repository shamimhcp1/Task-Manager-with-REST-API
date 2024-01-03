from rest_framework import serializers
from .models import Task, Photo

class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ('id', 'image')

class TaskSerializer(serializers.ModelSerializer):
    photos = PhotoSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = ('id', 'title', 'description', 'due_date', 'priority', 'is_complete', 'creation_date', 'last_update_date', 'user', 'photos')
