from django.conf.urls import url
from .models import WorldBorder
from django.contrib.gis import admin
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^admin/', admin.site.urls),
    url(r'^all_countries', views.all_countries),
    url(r'^add_layer$', views.add_layer),
    url(r'^add_map$', views.add_map),
    url(r'^map/(?P<map>[\w|\W]+)/all_json_models/$', views.all_json_models),
    url(r'^delete_map/(?P<map_name>.*)$', views.delete_map),
    url(r'^show_maps', views.show_maps),
    url(r'^edit_map/(?P<map_name>.*)', views.edit_map)
]
