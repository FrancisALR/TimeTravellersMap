from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.shortcuts import render
from .models import WorldBorder

def index(request):
    return render(request, 'world/index.html', {
    'borders' : WorldBorder.objects.all()
    })
     
    