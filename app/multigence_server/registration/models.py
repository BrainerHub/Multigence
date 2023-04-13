import uuid

from django.db import models

from multigence_server.core.models import Department, User, Questionary, LowerCaseEmailField


class Token(models.Model):
    key = models.CharField(max_length=256, primary_key=True)
    value = models.CharField(max_length=256)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.key)[:15] + "... " + self.value


class Invitation(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created = models.DateTimeField(auto_now_add=True)
    role = models.CharField(max_length=20, choices=User.ROLE_CHOICES, default=User.EMPLOYEE)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    department = models.ForeignKey(Department, null=False, blank=False, on_delete=models.CASCADE)
    position = models.CharField(max_length=512, blank=True, null=True)
    email = LowerCaseEmailField(max_length=255, unique=True)

    def __str__(self):
        return self.email + " " + self.department.company.name


