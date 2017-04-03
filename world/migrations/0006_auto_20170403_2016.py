# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-04-03 20:16
from __future__ import unicode_literals

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('world', '0005_auto_20170403_1709'),
    ]

    operations = [
        migrations.AlterField(
            model_name='countrylists',
            name='countrylist',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=50), blank=True, null=True, size=None),
        ),
        migrations.AlterField(
            model_name='countrylists',
            name='layername',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='countrylists',
            name='year',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
