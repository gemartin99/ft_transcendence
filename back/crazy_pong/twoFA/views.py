from django.http import JsonResponse
from django.template.loader import render_to_string
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def get_edit_twofactor_page(request):
    context = {
        'variable1': 'template variable 1',
        'variable2': 'template variable 2',
    }
    content_html = render_to_string('twofactor/twofactor.html', context)
    data = {
        'title': 'Select Logging Mode',
        'content': content_html,
        'additionalInfo': 'Some additional information here',
    }
    return JsonResponse(data)
