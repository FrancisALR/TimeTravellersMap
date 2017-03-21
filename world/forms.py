from django import forms


class CountryForm(forms.Form):
    name = forms.CharField(label='Add Layer Name Here', max_length = 100)
    listofcountries = forms.CharField(label='Add list of countries', max_length= 200)
