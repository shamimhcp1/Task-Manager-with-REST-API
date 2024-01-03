from django.contrib import admin
from .models import Task, Photo

class PhotoInline(admin.TabularInline):
    model = Photo
    extra = 1

class TaskAdmin(admin.ModelAdmin):
    inlines = [PhotoInline]
    list_display = ('title', 'due_date', 'priority', 'is_complete', 'creation_date', 'last_update_date', 'user')
    list_filter = ('creation_date', 'due_date', 'priority', 'is_complete')
    search_fields = ('title',)  # Enable search by title
    ordering = ('priority',)    # Sort tasks by Priority by default

admin.site.register(Task, TaskAdmin)
admin.site.register(Photo)
