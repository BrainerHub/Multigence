import json

from django.shortcuts import get_object_or_404
from rest_framework import viewsets, serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from multigence_server.core.models import User
from multigence_server.emailing.services import send_password_reset_email
from multigence_server.registration.services import create_password_reset_token, get_email_from_password_reset_token, \
    delete_token


class PasswordResetRequest(object):
    def __init__(self, email, uri):
        self.email = email
        self.uri = uri


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
    uri = serializers.URLField()

    def validate_email(self, value):
        if not User.objects.filter(email=value.lower()).exists():
            raise serializers.ValidationError("Email not found")
        return value


class PasswordResetViewSet(viewsets.ViewSet):
    permission_classes = (AllowAny,)

    def create(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid(raise_exception=False):
            # create token
            email = serializer.validated_data['email'].lower()
            token = create_password_reset_token(email)

            # send email
            uri = "%s?token=%s" % (serializer.validated_data['uri'], token)
            send_password_reset_email(email=email, uri=uri)
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)


class ChangePasswordViewSet(viewsets.ViewSet):
    permission_classes = (AllowAny, )

    def create(self, request):
        json_body = json.loads(request.body.decode("utf-8"))
        print("---------json_body---------", json_body)
        if not "token" in json_body:
            return Response(status=status.HTTP_401_UNAUTHORIZED, data="no or invalid token sent")
        token = json_body['token']
        email = get_email_from_password_reset_token(token)
        print("---------email---------", email)
        user = get_object_or_404(User, email=email)

        if not "new_password" in json_body:
            return Response(status=status.HTTP_400_BAD_REQUEST, data="new_password required")
        new_password = json_body['new_password']
        if user.check_password(new_password):
            return Response(status=status.HTTP_409_CONFLICT, data="new_password is not new")

        user.set_password(new_password)
        user.save()
        delete_token(token)
        return Response(status=status.HTTP_204_NO_CONTENT)
