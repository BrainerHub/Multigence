# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-07-07 08:29
from __future__ import unicode_literals

import django
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0013_auto_20160707_0807'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='position',
        ),
        migrations.AddField(
            model_name='user',
            name='position',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='core.Position'),
        ),
        migrations.AlterUniqueTogether(
            name='position',
            unique_together=set([('name', 'company')]),
        ),

    ]
