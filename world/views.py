from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.shortcuts import render
from django.contrib.gis.shortcuts import render_to_kml
from django.core.serializers import serialize
from .models import WorldBorder

def index(request):
    return render(request, 'world/index.html', {
    'borders' : WorldBorder.objects.all()
    })

def shpPoly(request):
  polygons = WorldBorder.objects.kml().filter(name='France')

  #selected = polygons.objects.get(name="France")
  return render_to_kml("world/placemarks.kml", {'places': polygons})
