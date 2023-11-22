from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.shortcuts import render
from .models import User

@csrf_exempt  # Use this decorator for simplicity in this example. 
#In production, handle CSRF properly.
def request_login(request):
    if request.method == 'POST':
        try:
            # Check if the request body is empty
            if not request.body:
                raise json.JSONDecodeError("Empty request body", request.body, 0)

            data = json.loads(request.body)
            
            # Access the value of 'dataInput' from the JSON data
            data_input_value = data.get('dataInput')

            # Do something with the data_input_value
            # For example, print it to the console
            print('dataInput value:', data_input_value)
            if (data_input_value == "hola"):
                user = User(password="holA1298@klsO", email="example@example.com", active=True)
                user.save()
                print('hola')
                response_data = {'message': 'Data received successfully'}
            else:
                view_to_check_data(request)
                all_users = User.objects.all()


                users_data = list(all_users.values())


                response_data = {'message': 'wrong data stupid'}

                return JsonResponse({'users': users_data})

            # Do something with the data

            # response_data = {'message': 'Data received successfully'}

            # Assuming you want to send a JSON response back to the frontend
            return JsonResponse(response_data)
        except json.JSONDecodeError as e:
            return JsonResponse({'error': str(e) + 'gracias si muy bueno'}, status=400)
    elif request.method == 'GET':
        try:
        # Check if the request body is empty
            print("method GET")
            all_users = User.objects.all()


            users_data = list(all_users.values())


            response_data = {'message': 'wrong data stupid'}

            return JsonResponse({'users': users_data})

        except json.JSONDecodeError as e:
            return JsonResponse({'error': str(e) + 'gracias si muy bueno'}, status=400)
    return JsonResponse({'message': 'Invalid method'})


def view_to_check_data(request):
    # Retrieve all User objects from the database
    all_users = User.objects.all()

    # Do something with the retrieved data, e.g., print it
    for user in all_users:
        print(f"User ID: {user.id}, Email: {user.email}, Active: {user.active}")

    # You can also filter data based on certain conditions
    # For example, retrieve active users
    active_users = User.objects.filter(active=True)
    for active_user in active_users:
        print(f"Active User ID: {active_user.id}, Email: {active_user.email}")

    # Return a response, render a template, or do other things with the data
    return JsonResponse({'message': 'Data checked successfully'})




def get_login_form_page(request):
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
    }
    content_html = render_to_string('login/normal_login.html', context)
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)


def get_home_page(request):
    data = {
        'title': 'Login Page',
        'content': '<strong>Hello,holadsfa World!</strong>',
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)



