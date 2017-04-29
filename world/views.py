from django.http import HttpResponse
from django.shortcuts import render_to_response, get_object_or_404, render, redirect
from django.contrib.gis.shortcuts import render_to_kml
from django.core.serializers import serialize
from world.forms import CountryForm, UserMapForm, MapFormSet, CountryEditForm
from .models import WorldBorder, CountryList, UserMap
import json

# home page of site, main functionality and map on this page
def index(request):
    query = WorldBorder.objects.values_list('name', flat=True) # creates queryset of all world border objects
    query_list = list(query)
    json_data = json.dumps(query_list) # casts to json data for use in javascript
    all_layers = CountryList.objects.all() # creates queryset of all user defined layers
    all_maps = UserMap.objects.all() # creates queryset of all user defined maps
    return render(request, 'world/index.html', {"names": json_data, "user_layers": all_layers, "borders" : WorldBorder.objects.all(), "user_maps" : all_maps})

# casts map to json for populating a select with that map's layers
def all_json_models (request, map):
    current_map = UserMap.objects.get(mapname=map) # gets map from url input
    models = CountryList.objects.all().filter(relatedmap=current_map)
    ordered = models.order_by('year')
    json_models = serialize("json",ordered) # serializes to json
    return HttpResponse (json_models, content_type="application/javascript") #returns and is picked up by JS funcion

# form to create user defined maps with layers
def add_map(request):
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
        map_formset = MapFormSet(instance=UserMap(), prefix="nested")
    return render(request, 'world/add_map.html', {'form' : form, "map_formset": map_formset})

# adds a single layer
def add_layer(request):
    print(request.method)
    if request.method == 'POST':  # if the form has been filled

        form = CountryForm(request.POST)

        if form.is_valid():
            name = request.POST.get('name', '')
            countriesstring = request.POST.get('listofcountries', '')
            countrylist = countriesstring.split(", ")
            year = request.POST.get('year', '')
            layercolour = request.POST.get('layercolour', '')
            new_countrylist = CountryList(layername=name, countrylist=countrylist, year=year, layercolour=layercolour)
            new_countrylist.save()

            return redirect('/world')
    else:
        form=CountryForm()
        return render(request, 'world/add_layer.html', {'form' :form})


def show_maps(request):
    all_layers = CountryList.objects.all()
    all_maps = UserMap.objects.all()
    ordered_maps = all_maps.order_by('mapname')
    return render(request, 'world/show_maps.html', { "user_layers": all_layers, "user_maps" : ordered_maps})

def edit_map(request, map_name):

    user_map = get_object_or_404(UserMap, mapname=map_name)
    form = UserMapForm(instance=user_map)
    formset = MapFormSet(instance=user_map,  prefix="nested")

    if request.method == "POST":
        form = UserMapForm(request.POST, instance=user_map)
        if form.is_valid():
            updated_user_map = form.save()
            formset = MapFormSet(request.POST, instance=updated_user_map,  prefix="nested")
            if formset.is_valid():
                updated_user_map.save()
                formset.save()
                return redirect('/world/show_maps')
    else:
        form = UserMapForm(instance=user_map)
        formset = MapFormSet(instance=user_map,  prefix="nested")
    return render(request, 'world/edit_map.html', {'form' : form, "map_formset": formset})

def edit_layer(request,layer_name):
    user_layer = get_object_or_404(CountryList, layername=layer_name)
    form = CountryEditForm(instance=user_layer)
    if request.method == "POST":
        form = CountryEditForm(request.POST, instance=user_layer)
        if form.is_valid():
            form.save()
            return redirect('world/show_layers')
    else:
        form = CountryEditForm(instance=user_layer)
    return render(request, 'world/edit_layer.html', {'form' : form})

def show_layers(request):
    all_layers = CountryList.objects.all()
    return render(request, 'world/show_layers.html', { "user_layers": all_layers})

def delete_map(request, map_name):
    to_delete = get_object_or_404(UserMap, mapname=map_name)
    to_delete.delete()
    return redirect('/world')

def delete_layer(request, layer_name):
    to_delete = get_object_or_404(CountryList, layername=layer_name)
    to_delete.delete()
    return redirect('/world')


# Solution to add WorldBorder entries to map with kml taken from following source
# Title: How to display my PostGis geometry on the GeoDjango map widget
# Author: User dmh126 at gis.stackexchange
# Available at: https://gis.stackexchange.com/questions/138278/how-to-dispay-my-postggis-geometry-on-the-geodjango-map-widget
def all_countries(request):
    all_countries = WorldBorder.objects.kml()
    return render_to_kml("world/placemarks.kml", {'places' : all_countries})
