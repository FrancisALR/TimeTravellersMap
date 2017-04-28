from django.contrib.gis.db import models
from django.core.serializers import serialize
from django.contrib.postgres.fields import ArrayField

class WorldBorder(models.Model):
    # Regular Django fields corresponding to the attributes in the
    # world borders shapefile.
    name = models.CharField(max_length=50)
    area = models.IntegerField()
    pop2005 = models.IntegerField('Population 2005')
    fips = models.CharField('FIPS Code', max_length=2)
    iso2 = models.CharField('2 Digit ISO', max_length=2)
    iso3 = models.CharField('3 Digit ISO', max_length=3)
    un = models.IntegerField('United Nations Code')
    region = models.IntegerField('Region Code')
    subregion = models.IntegerField('Sub-Region Code')
    lon = models.FloatField()
    lat = models.FloatField()
    objects = models.GeoManager()
    # GeoDjango-specific: a geometry field (MultiPolygonField)
    mpoly = models.MultiPolygonField(blank=True, null=True)

    # Returns the string representation of the model.
    def __str__(self):              # __unicode__ on Python 2
        return self.name

class UserMap(models.Model):
    mapname = models.CharField(max_length=50)

    def __str__(self):              # __unicode__ on Python 2
        return self.mapname

class CountryList(models.Model):
    layername = models.CharField(max_length=50)
    countrylist = ArrayField(models.CharField(max_length=50),null=True, blank=True)
    year = models.IntegerField()
    info = models.TextField(default=None, blank=True, null=True)
    layercolour = models.CharField(max_length=50)
    relatedmap = models.ForeignKey(UserMap, null=True, blank=True, related_name="layers")

    def __str__(self):              # __unicode__ on Python 2
        return self.layername
