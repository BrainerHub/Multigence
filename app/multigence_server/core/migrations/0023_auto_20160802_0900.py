# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-08-02 09:00
from __future__ import unicode_literals

from django.db import migrations

from multigence_server.core.models import User

def change_admin_role(apps, schema_editor):
    User = apps.get_model("core", "User")
    if User.objects.filter(email="admin@multigence.com").exists():
        admin = User.objects.get(email="admin@multigence.com")
        admin.role = 'ADMIN'
        admin.save()

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0022_auto_20160801_1600'),
    ]

    operations = [
        migrations.RunPython(change_admin_role),
    ]
