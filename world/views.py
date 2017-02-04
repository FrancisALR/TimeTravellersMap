from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.shortcuts import render

def index(request):
    'Display map'
    return render(request, 'world/index.html')