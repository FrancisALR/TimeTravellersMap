from django.http import HttpResponse
from django.shortcuts import render_to_response, get_object_or_404, render, redirect
from django.contrib.gis.shortcuts import render_to_kml
from django.core.serializers import serialize
from world.forms import CountryForm, UserMapForm, MapFormSet
from .models import WorldBorder, CountryLists, UserMaps
import json

# home page of site, main functionality and map on this page
def index(request):
    query = WorldBorder.objects.values_list('name', flat=True) # creates queryset of all world border objects
    querylist = list(query)
    json_data = json.dumps(querylist) # casts to json data for use in javascript
    allayers = CountryLists.objects.all() # creates queryset of all user defined layers
    allmaps = UserMaps.objects.all() # creates queryset of all user defined maps
    return render(request, 'world/index.html', {"names": json_data, "userLayers": allayers, "borders" : WorldBorder.objects.all(), "usermaps" : allmaps})

# casts map to json for populating a select with that map's layers
def all_json_models (request, map):
    current_map = UserMaps.objects.get(mapname=map) # gets map from url input
    models = CountryLists.objects.all().filter(relatedmap=current_map)
    json_models = serialize("json",models) # serializes to json
    return HttpResponse (json_models, content_type="application/javascript") #returns and is picked up by JS funcion

# form to create user defined maps with layers
def addmap(request):
    if request.POST:
        form = UserMapForm(request.POST)
        if form.is_valid():
            usermap = form.save(commit=False)
            map_formset = MapFormSet(request.POST, instance=usermap, prefix="nested")
            if map_formset.is_valid():
                usermap.save()
                map_formset.save()
                return redirect('/world')
    else:
        form = UserMapForm()
        map_formset = MapFormSet(instance=UserMaps(), prefix="nested")
    return render(request, 'world/addmap.html', {'form' : form, "map_formset": map_formset})

# adds a single layer
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

            return redirect('/world')
    else:
        form=CountryForm()
        return render(request, 'world/addlayer.html', {'form' :form})


def showmaps(request):
    allayers = CountryLists.objects.all()
    allmaps = UserMaps.objects.all()
    return render(request, 'world/showmaps.html', { "userLayers": allayers, "usermaps" : allmaps})

def editmap(request, map_name):

    usermap = get_object_or_404(UserMaps, mapname=map_name)
    form = UserMapForm(instance=usermap)
    formset = MapFormSet(instance=usermap,  prefix="nested")

    if request.method == "POST":
        form = UserMapForm(request.POST, instance=usermap)
        if form.is_valid():
            updatedusermap = form.save()
            formset = MapFormSet(request.POST, instance=updatedusermap,  prefix="nested")
            if formset.is_valid():
                updatedusermap.save()
                formset.save()
                return redirect('/world/showmaps')
    else:
        form = UserMapForm(instance=usermap)
        formset = MapFormSet(instance=usermap,  prefix="nested")
    return render(request, 'world/editmap.html', {'form' : form, "map_formset": formset})


def deletemap(request, map_name):
    todelete = get_object_or_404(UserMaps, mapname=map_name)
    todelete.delete()
    return redirect('/world')

def allcountries(request):
    allcountries = WorldBorder.objects.kml()
    return render_to_kml("world/placemarks.kml", {'places' : allcountries})
