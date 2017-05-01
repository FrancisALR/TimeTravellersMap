from django import forms
from django.forms import ModelForm
from django.forms.models import inlineformset_factory
from .models import CountryList, UserMap

class CountryListForm(forms.ModelForm):
    class Meta:
        model = CountryList
        fields = ('layername', 'countrylist', 'year', 'info', 'layercolour')

class UserMapForm(ModelForm):
    class Meta:
        model = UserMap
        fields = ('mapname', )

MapFormSet = inlineformset_factory(UserMap, CountryList, extra = 0 ,fields=('layername','countrylist', 'year', 'info', 'layercolour' ))
