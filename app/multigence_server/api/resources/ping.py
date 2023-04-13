from django.db import connection
from rest_framework import status
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


class PingViewSet(viewsets.ViewSet):
    permission_classes = (AllowAny,)

    def list(self, request):
        cursor = connection.cursor()

        cursor.execute("SELECT 1")

        row = cursor.fetchone()

        return Response(status=status.HTTP_200_OK)