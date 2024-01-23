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

# Install psycopg2 (PostgreSQL adapter for Python)
RUN pip install psycopg2-binary

# Copy SSL/TLS certificate and key
COPY ./crazy-pong.com_ssl_certificate.cer /etc/ssl/certs/cert.crt
COPY ./crazy-pong.com_private_key.key /etc/ssl/private/cert.key

# Install django-cors-headers
RUN pip install django-cors-headers

# Download and copy the wait-for-it.sh script into the image
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh

# Set up Django and PostgreSQL environment variables
ENV DJANGO_SETTINGS_MODULE=crazy_pong.settings
ENV DATABASE_URL=postgres://username:password@db_host:5432/db_name

# Make port 8000 available to the world outside this container
EXPOSE 8000

CMD ["python", "/app/crazy_pong/manage.py", "runsslserver", "--certificate", "/etc/ssl/certs/cert.crt", "--key", "/etc/ssl/private/cert.key", "0.0.0.0:8000"]

CMD ["daphne", "-e", "ssl:443:privateKey=crazy-pong.com_private_key.key:certKey=crazy-pong.com_ssl_certificate.cer", "crazy_pong.crazy_pong.asgi:application"]
