from django import forms
from django.forms import ModelForm
from django.forms.models import inlineformset_factory
from .models import CountryList, UserMap

# Form for modifying and creation of layers
class CountryListForm(forms.ModelForm):
    class Meta:
        model = CountryList
        fields = ('layername', 'countrylist', 'year', 'info', 'layercolour')

# Form for creation and editing of full maps
class UserMapForm(ModelForm):
    class Meta:
        model = UserMap
        fields = ('mapname', )

# Formset to combine both maps and layers via one-to-many relationship
MapFormSet = inlineformset_factory(UserMap, CountryList, extra = 0 ,fields=('layername','countrylist', 'year', 'info', 'layercolour' ))
