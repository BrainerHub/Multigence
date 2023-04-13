from rest_framework import serializers

from multigence_server.core.models import Position


class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ('uuid', 'name')
        read_only_fields = ('uuid',)

