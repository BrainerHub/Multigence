# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-06-27 14:15
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0008_auto_20160614_1229'),
    ]

    operations = [
        migrations.AddField(
            model_name='sphere',
            name='index',
            field=models.IntegerField(default=0),
        ),
    ]
