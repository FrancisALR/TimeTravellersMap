# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-04-27 16:24
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('world', '0009_auto_20170424_0957'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='countryLists',
            new_name='CountryList',
        ),
        migrations.RenameModel(
            old_name='UserMaps',
            new_name='UserMap',
        ),
    ]
