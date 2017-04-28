from django import forms
from django.forms import ModelForm
from django.forms.models import inlineformset_factory
from .models import CountryList, UserMap

class CountryForm(forms.Form):
    name = forms.CharField(label='Add Layer Name Here', max_length = 100)
    listofcountries = forms.CharField(label='Add list of countries', max_length= 200)
    year = forms.IntegerField(label='Add year here')
    layercolour = forms.CharField(label='Add layer colour here')

class CountryEditForm(forms.ModelForm):
    class Meta:
        model = CountryList
        fields = ('layername', 'countrylist', 'year', 'info', 'layercolour')

class UserMapForm(ModelForm):
    class Meta:
        model = UserMap
        fields = ('mapname', )

MapFormSet = inlineformset_factory(UserMap, CountryList, extra = 0 ,fields=('layername','countrylist', 'year', 'info', 'layercolour' ))
