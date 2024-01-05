# Task Manager with REST API

## Project Overview
This project involves creating a task management web application with a REST API using Django. The application allows multiple users to perform CRUD operations on tasks. It utilizes Django templates for rendering views, PostgreSQL for the database, and Django ORM for managing database relations. Development best practices, including virtual environments, environment variables, and Git, are followed.

# Getting Started
### Prerequisites
- Python 3.x
- Django
- djangorestframework
- psycopg2
- python-dotenv
- Pillow
- PostgreSQL

# Installation
### Clone the repository:
`git clone https://github.com/shamimhcp1/Task-Manager-with-REST-API`

### Set up a virtual environment:
- `cd task-manager`
- `python -m venv venv`
- `venv/bin/activate`

### Install dependencies:
`pip install -r requirements.txt`

### Set up PostgreSQL database:
- Create a new database named **"task_manager_db"** (or any preferred name).
- Create a `.env` file in project root direcroty, Update the database configuration with your database credentials. (see the `.env_example` file.)

### Apply migrations:
- `python manage.py makemigrations`
- `python manage.py migrate`

### Create a superuser:
- `python manage.py createsuperuser`

### Run the development server:
- `python manage.py runserver`
- Access the application at `http://127.0.0.1:8000/`.

## Project Structure
- task_manager/: Django project directory.
- tasks/: Django app directory.

1. **Registration**
2. **Login**
3. **Task Management:** Create, view, update, delete tasks
4. **Task properties:**
- Title, description, due date
- Multiple photos add/delete options
- Priority (Low, medium, high)
- Mark as complete
- Date time of creation
- Date time of last update

5. **Search and Filter:** Search tasks by title

6. **Filter tasks by:** Creation date, Due date, Priority, Completion status

# Admin Interface:
- CRUD functionalities for all models in Admin
- Sort tasks by priority by default
- Database Relations
- Define appropriate relations between models, e.g., ForeignKey, ManyToManyField.
- Templates with React.js
- View for task list, task creation, task details, task update, and task deletion
- Utilize Django template tags and filters
- Responsive and visually appealing design using Bootstrap
- Django Views and URL Patterns
- Class Based Views for task-related operations
- Retrieve tasks from the database and display on the task list view
- Task creation and update forms with validation
- Logic for creating, updating, and deleting tasks in the database using Django ORM
- REST API
- API views to list all tasks, retrieve a single task, create a new task, update an existing task, and delete a task
- Serializers for data conversion to/from JSON format
- Handling appropriate HTTP methods (GET, POST, PUT/PATCH, DELETE)
- Validate input data and handle errors appropriately

# Contributing
Contributions are welcome! Please reach out to the project owner at `shamimhcp@gmail.com`. 