from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.shortcuts import render

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


            # Do something with the data

            response_data = {'message': 'Data received successfully'}

            # Assuming you want to send a JSON response back to the frontend
            return JsonResponse(response_data)
        except json.JSONDecodeError as e:
            return JsonResponse({'error': str(e) + 'gracias si muy bueno'}, status=400)

    return JsonResponse({'message': 'Invalid method'})


