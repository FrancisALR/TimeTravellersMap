from models import UserMaps

from django import template

register = template.Library()

@ register.inclusion_tag ( "layer_select.html" )
def brand_model_select():
    layer_list = UserMaps.objects.all()
    return {'layer_list':layer_list }
