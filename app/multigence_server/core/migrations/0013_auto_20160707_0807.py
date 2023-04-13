# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-07-07 08:07
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import uuid


def create_positions(apps, schema_editor):
    User = apps.get_model("core", "User")
    Position = apps.get_model("core", "Position")
    for user in User.objects.all():
        name = user.position
        if name:
            if not Position.objects.filter(name=name, company=user.department.company).exists():
                p = Position.objects.create(name=name, company=user.department.company, user_uuid=user.uuid)


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0012_auto_20160704_1324'),
    ]

    operations = [
        migrations.CreateModel(
            name='Position',
            fields=[
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('user_uuid', models.UUIDField(serialize=False)),
                ('name', models.CharField(max_length=128)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Company')),
            ],
        ),
        migrations.RunPython(create_positions),
    ]
