# Generated by Django 5.0.1 on 2024-01-03 19:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='photo',
            name='image',
            field=models.ImageField(upload_to='tasks/static/tasks/task_photos/'),
        ),
    ]