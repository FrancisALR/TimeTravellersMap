from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.shortcuts import render, redirect
import json
from django.contrib.gis.shortcuts import render_to_kml
from django.core.serializers import serialize
from .models import WorldBorder
from .models import CountryLists
from .models import UserMaps
from world.forms import CountryForm, UserMapForm

def index(request):
    query = WorldBorder.objects.values_list('name', flat=True)
    querylist = list(query)
    json_data = json.dumps(querylist)

    allayers = CountryLists.objects.all()
    return render(request, 'world/index.html', {"names": json_data, "userLayers": allayers, "borders" : WorldBorder.objects.all()})

def showdata(request):

    allayers = CountryLists.objects.all()
    return render(request, 'world/showdata.html', {'allayers': allayers, })

def addlayer(request):
    print(request.method)
    if request.method == 'POST':  # if the form has been filled

        form = CountryForm(request.POST)

        if form.is_valid():
            name = request.POST.get('name', '')
            countriesstring = request.POST.get('listofcountries', '')
            countrylist = countriesstring.split(", ")
            year = request.POST.get('year', '')
            new_countrylist = CountryLists(layername=name, countrylist=countrylist, year=year)
            new_countrylist.save()

            return redirect('world/')
    else:
        form=CountryForm()
        return render(request, 'world/addlayer.html', {'form' :form})

def originaleu(request):
  polygons = WorldBorder.objects.kml().filter(name__in=['France','Belgium','Germany', 'Luxembourg', 'Italy', 'Netherlands'])
  return render_to_kml("world/placemarks.kml", {'places': polygons})


def additionaleu(request):
    polygons2 = WorldBorder.objects.kml().filter(name__in=['United Kingdom','Denmark','Ireland','Gibraltar'])
    return render_to_kml("world/placemarks.kml", {'places': polygons2})

def greeceeu(request):
    greecepolygon = WorldBorder.objects.kml().filter(name__in=['Greece'])
    return render_to_kml("world/placemarks.kml", {'places' : greecepolygon})

def eu1986(request):
    eightysixpolygon = WorldBorder.objects.kml().filter(name__in=['Spain', 'Portugal'])
    return render_to_kml("world/placemarks.kml", {'places' : eightysixpolygon})

def eu1995(request):
    ninetyfivepolygon = WorldBorder.objects.kml().filter(name__in=['Finland', 'Austria', 'Sweden'])
    return render_to_kml("world/placemarks.kml", {'places' : ninetyfivepolygon})

def eu2004(request):
    zerofourpolygon = WorldBorder.objects.kml().filter(name__in=['Estonia', 'Latvia', 'Lithuania', 'Poland', 'Czech Republic', 'Slovakia', 'Hungary', 'Cyprus'])
    return render_to_kml("world/placemarks.kml", {'places' : zerofourpolygon})

def eu2007(request):
    zerosevenpolygon = WorldBorder.objects.kml().filter(name__in=['Romania', 'Bulgaria'])
    return render_to_kml("world/placemarks.kml", {'places' : zerosevenpolygon})

def eu2013(request):
    thirteenpolygon = WorldBorder.objects.kml().filter(name__in=['Croatia'])
    return render_to_kml("world/placemarks.kml", {'places' : thirteenpolygon})

def allcountries(request):
    allcountries = WorldBorder.objects.kml()
    return render_to_kml("world/placemarks.kml", {'places' : allcountries})
