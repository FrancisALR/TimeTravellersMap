from django.conf.urls import url
from .models import WorldBorder
from django.contrib.gis import admin
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^admin/', admin.site.urls),
    url(r'^originalEU', views.originaleu),
    url(r'^additionalEU', views.additionaleu),
    url(r'^greecetoEU', views.greeceeu),
    url(r'^1986eu', views.eu1986),
    url(r'^1995eu', views.eu1995),
    url(r'^2004eu', views.eu2004),
    url(r'^2007eu', views.eu2007),
    url(r'^2013eu', views.eu2013),
    url(r'^allcountries', views.allcountries),
    url(r'^addlayer$', views.addlayer),
    url(r'^addbothtest$', views.addbothtest),
    url(r'^map/(?P<map>[\w|\W]+)/all_json_models/$', views.all_json_models),
    url(r'^deletemap/(?P<map_name>.*)$', views.deletemap),
    url(r'^editmap', views.editmap),
    url(r'^editspecificmap/(?P<map_name>.*)', views.editspecificmap)
]
