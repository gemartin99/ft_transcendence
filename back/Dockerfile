# Use an official Python runtime as a parent image
FROM python:3.8

# Set environment variables for Python
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Install gunicorn
RUN pip install gunicorn

# Install PostgreSQL client and update package index
RUN apt-get update && \
    apt-get install -y postgresql-client

# Set up Django and PostgreSQL environment variables
# ENV DJANGO_SETTINGS_MODULE=myproject.settings
# ENV DATABASE_URL=postgres://username:password@db_host:5432/db_name

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Define command to run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "crazy_pong.crazy_pong.wsgi:application", "--env", "DJANGO_SETTINGS_MODULE=crazy_pong.crazy_pong.settings"]

