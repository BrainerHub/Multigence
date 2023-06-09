# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-06-28 09:18
from __future__ import unicode_literals

from django.db import migrations



def set_default_department(apps, schema_editor):
    User = apps.get_model("core", "User")
    for user in User.objects.all():
        if not user.department:
            Department = apps.get_model("core", "Department")
            Company = apps.get_model("core", "Company")
            admin = User.objects.get(email="admin@multigence.com")
            company = Company.objects.get(uuid=admin.department.company.uuid)
            default_department = Department.objects.filter(company=company)[0]
            user.department = default_department
            user.save()


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_auto_20160627_1415'),
    ]

    operations = [
        migrations.RunPython(set_default_department),
    ]
