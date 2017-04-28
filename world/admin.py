from django.contrib.gis import admin
from .models import WorldBorder, UserMap, CountryList

admin.site.register(WorldBorder, admin.OSMGeoAdmin)

admin.site.register(UserMap, admin.OSMGeoAdmin)
admin.site.register(CountryList, admin.OSMGeoAdmin)
