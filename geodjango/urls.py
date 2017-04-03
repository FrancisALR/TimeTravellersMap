"""geodjango URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib.gis import admin
from world.views import *

admin.autodiscover()

urlpatterns = [
    url(r'^world/', include('world.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'^originalEU', originaleu),
    url(r'^additionalEU', additionaleu),
    url(r'^greecetoEU', greeceeu),
    url(r'^1986eu', eu1986),
    url(r'^1995eu', eu1995),
    url(r'^2004eu', eu2004),
    url(r'^2007eu', eu2007),
    url(r'^2013eu', eu2013),
    url(r'^allcountries', allcountries),
    url(r'^addlayer$', addlayer),
    url(r'^showdata$', showdata)
    ]
