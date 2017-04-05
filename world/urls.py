from django.conf.urls import url
from .models import WorldBorder
from django.contrib.gis import admin
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^admin/', admin.site.urls),
    url(r'^allcountries', views.allcountries),
    url(r'^addlayer$', views.addlayer),
    url(r'^addmap$', views.addmap),
    url(r'^map/(?P<map>[\w|\W]+)/all_json_models/$', views.all_json_models),
    url(r'^deletemap/(?P<map_name>.*)$', views.deletemap),
    url(r'^showmaps', views.showmaps),
    url(r'^editmap/(?P<map_name>.*)', views.editmap)
]
