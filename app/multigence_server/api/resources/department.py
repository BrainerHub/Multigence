from rest_framework import serializers

from multigence_server.core.models import Department


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ('uuid', 'name')
        read_only_fields = ('uuid',)
