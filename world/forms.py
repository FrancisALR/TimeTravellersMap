from django import forms
from django.forms import ModelForm
from django.forms.models import inlineformset_factory
from .models import CountryLists, UserMaps

class CountryForm(forms.Form):
    name = forms.CharField(label='Add Layer Name Here', max_length = 100)
    listofcountries = forms.CharField(label='Add list of countries', max_length= 200)
    year = forms.IntegerField(label='Add year here')

class UserMapForm(ModelForm):
    class Meta:
        model = UserMaps
        fields = ('mapname', )

MapFormSet = inlineformset_factory(UserMaps, CountryLists, extra = 1 ,fields=('layername','countrylist', 'year' ))
