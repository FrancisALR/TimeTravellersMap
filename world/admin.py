from django.contrib.gis import admin
from .models import WorldBorder, UserMap, CountryList

# Registers all models for modification/use in the Admin site
admin.site.register(WorldBorder, admin.OSMGeoAdmin)
admin.site.register(UserMap, admin.OSMGeoAdmin)
admin.site.register(CountryList, admin.OSMGeoAdmin)
