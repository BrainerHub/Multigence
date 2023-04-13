# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-07-15 15:27
from __future__ import unicode_literals

from django.db import migrations
import multigence_server.core.models


class Migration(migrations.Migration):

    dependencies = [
        ('registration', '0004_auto_20160715_0757'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invitation',
            name='email',
            field=multigence_server.core.models.LowerCaseEmailField(max_length=255, unique=True),
        ),
        migrations.AlterUniqueTogether(
            name='invitation',
            unique_together=set([]),
        ),
    ]
