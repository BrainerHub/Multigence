# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-08-01 16:00
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0021_auto_20160715_1527'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='gender',
            field=models.CharField(blank=True, choices=[('MALE', 'Male'), ('FEMALE', 'Female'), ('UNSPECIFIED', 'Unspecified')], max_length=32, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.CharField(choices=[('EMPLOYEE', 'Employee'), ('APPLICANT', 'Applicant'), ('MANAGER', 'Company manager'), ('ADMIN', 'Admin')], default='EMPLOYEE', max_length=20),
        ),
    ]
