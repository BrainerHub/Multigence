from django.shortcuts import get_object_or_404
from rest_framework import viewsets, serializers, status
from rest_framework.response import Response

from multigence_server import core
from multigence_server.api.permissions import IsAuthenticatedManagerOrAdminIfCreate
from multigence_server.api.utils import CustomValidationError
from multigence_server.core.models import User, Department, QuestionaryResult, Position, Questionary
from multigence_server.core.services import create_questionary_result
from multigence_server.emailing.services import send_invitation_email
from multigence_server.registration.models import Invitation
from multigence_server.registration.services import create_invitation
from multigence_server.core import services


class InvitationCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
    uri = serializers.URLField()

    def get_uri(self, obj):
        return self.uri

    def validate(self, data):
        department = data.get('department')
        company = department.company
        role = data.get('role')
        position = data.get('position')
        email = data.get('email').lower()

        # validate trial company has still invitations left
        if company.trial:
            if company.invitations_sent >= company.invitations:
                raise CustomValidationError("Maximum number of invitations reached", status.HTTP_409_CONFLICT)

        # validate applicant position
        if role == User.APPLICANT and not position:
            raise serializers.ValidationError("Position required for applicant invitation")

        # if user exists and has started questionary reject
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            if QuestionaryResult.objects.filter(user=user).exists():
                if not QuestionaryResult.objects.get(user=user).status == QuestionaryResult.CREATED:
                    raise CustomValidationError("User has started quiz already", status.HTTP_409_CONFLICT)

        return data

class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation


class InvitationAcceptanceSerializer(serializers.Serializer):
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    password = serializers.CharField(required=True)

    def validate_position(self, value):
        if value:
            if not Position.objects.filter(uuid=value).exists():
                return Response(status=status.HTTP_400_BAD_REQUEST, data="Position does not exist")


class InvitationViewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticatedManagerOrAdminIfCreate,)

    def get(self, request, pk=None):
        invitation = get_object_or_404(Invitation, uuid=pk)
        serializer = InvitationSerializer(invitation)
        return Response(serializer.data)

    def create(self, request):
        data = request.data

        serializer = InvitationCreationSerializer(data=data)
        email = data.get('email').lower()
        first_invitation = True

        # invitation for email and questionary already exists?
        valid = serializer.is_valid(raise_exception=False)
        if not valid:
            if Invitation.objects.filter(email=email).exists():
                first_invitation = False
                Invitation.objects.get(email=email).delete()

        serializer = InvitationCreationSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            first_name = data.get('first_name')
            last_name = data.get('last_name')
            role = data.get('role')
            position = data.get('position')
            department_uuid = data.get('department')
            department = Department.objects.get(uuid=department_uuid)
            company = department.company

             # store invitation
            invitation = create_invitation(email=email, role=role, first_name=first_name, last_name=last_name, department=department, position=position)

            # increase invitation count if not manager or admin
            if role == User.EMPLOYEE or role == User.APPLICANT:
                company.invitations_sent += 1
                company.save()

            # send email
            uri = "%s?uuid=%s" % (data.get('uri'), invitation.uuid)
            send_invitation_email(invitation, uri)

            return Response(status=status.HTTP_201_CREATED, data={"first_invitation" : first_invitation})


    def partial_update(self, request, pk=None):
        invitation = get_object_or_404(Invitation, uuid=pk)
        serializer = InvitationAcceptanceSerializer(data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            email = invitation.email
            first_name = serializer.data['first_name'] if 'first_name' in serializer.data else invitation.first_name
            last_name = serializer.data['last_name'] if 'last_name' in serializer.data else invitation.last_name
            role = invitation.role
            department = invitation.department
            position = invitation.position
            questionary = department.company.questionary

            # create position of not exists
            position_object = Position.objects.get(uuid=position) if position else None

            # create user if doesn't exist
            first_name_alias, last_name_alias = core.services.get_random_name()
            if not User.objects.filter(email=invitation.email).exists():
                user = User.objects.create_user(email=email, password=serializer.data['password'], first_name=first_name, last_name=last_name, first_name_alias=first_name_alias, last_name_alias=last_name_alias, department=department, role=role, position=position_object) #
            else:
                user = User.objects.get(email=email)
                user.first_name = first_name
                user.first_name_alias = first_name_alias
                user.last_name = last_name
                user.last_name_alias = last_name_alias
                user.position = position_object
                user.set_password(serializer.data['password'])
                user.save()

            # create questionary result if not exist
            if not QuestionaryResult.objects.filter(user=user, questionary=questionary).exists():
                create_questionary_result(questionary, user)

            # delete invitation
            invitation.delete()
            return Response(status=status.HTTP_200_OK)