from rest_framework import viewsets, serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from multigence_server.emailing.services import send_registration_email


class RegistrationRequestSerializer(serializers.Serializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    email = serializers.CharField(required=True)
    company = serializers.CharField(required=True)
    additional_info = serializers.CharField(required=False)


class RegistrationViewSet(viewsets.ViewSet):
    permission_classes = (AllowAny,)

    def create(self, request):
        serializer = RegistrationRequestSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.data
            send_registration_email(email=data.get("email").lower(), first_name=data.get('first_name'), last_name=data.get('last_name'), company=data.get('company'), additional_info=data.get('additional_info'))
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.data)
