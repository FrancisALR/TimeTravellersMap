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


def originaleu(request):
  polygons = WorldBorder.objects.kml().filter(name__in=['France','Belgium','Germany', 'Luxembourg', 'Italy', 'Netherlands'])
  return render_to_kml("world/placemarks.kml", {'places': polygons})


def additionaleu(request):
    polygons2 = WorldBorder.objects.kml().filter(name__in=['United Kingdom','Denmark','Ireland'])
    return render_to_kml("world/placemarks.kml", {'places': polygons2})
