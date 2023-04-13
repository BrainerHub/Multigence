from rest_framework import serializers
from rest_framework import viewsets

from multigence_server.core.models import Sphere


class SphereSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sphere
        fields = '__all__'
        read_only_fields = ('uuid',)


class SphereViewSet(viewsets.ModelViewSet):
    queryset = Sphere.objects.all().order_by('index')
    serializer_class = SphereSerializer