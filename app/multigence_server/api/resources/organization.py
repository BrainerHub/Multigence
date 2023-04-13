from django.shortcuts import get_object_or_404
from django.conf import settings
from rest_framework import serializers
from rest_framework import viewsets, status
from rest_framework.response import Response

from multigence_server.api.resources.department import DepartmentSerializer
from multigence_server.api.resources.invitation import InvitationSerializer
from multigence_server.api.resources.position import PositionSerializer
from multigence_server.core import services
from multigence_server.core.models import Company, User, Department, QuestionaryResult, Position, Questionary, Question, \
    QuestionaryQuestion
from multigence_server.core.services import create_questionary
from multigence_server.registration.models import Invitation


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'


class ApplicantEmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('uuid', 'email', 'department', 'title', 'position', 'first_name', 'last_name', 'role')
        read_only_fields = ('uuid',)


class OrganizationUserSerializer(serializers.BaseSerializer):
    def to_representation(self, organization):
        department = self.context.get('department')
        status = self.context.get('status')

        applicants_data = services.get_user(organization, role=User.APPLICANT, status=status, department=department)
        employees_data = services.get_user(organization, role=User.EMPLOYEE, status=status, department=department)

        applicants = ApplicantEmployeeSerializer(applicants_data, many=True).data
        employees = ApplicantEmployeeSerializer(employees_data, many=True).data

        return {
            'employees': employees,
            'applicants': applicants
        }

class OrganizationDepartmentSerializer(serializers.BaseSerializer):
    def to_representation(self, organization):

        departments_data = Department.objects.filter(company=organization)
        departments = DepartmentSerializer(departments_data, many=True).data

        return {
            'departments': departments
        }


class OrganizationPositionSerializer(serializers.BaseSerializer):
    def to_representation(self, organization):

        positions_data = Position.objects.filter(company=organization)
        positions = PositionSerializer(positions_data, many=True).data

        return {
            'positions': positions
        }


class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = OrganizationSerializer

    def create(self, request, *args, **kwargs):
        serializer = OrganizationSerializer(data=request.data)

        if serializer.is_valid():
            name = serializer.data['name']
            trial = serializer.data['trial'] if 'trial' in serializer.data else False
            invitations = serializer.data['invitations'] if 'invitations' in serializer.data else 0

            company = Company.objects.create(name=name, invitations=invitations, trial=trial)

            # create default departments
            for department in settings.DEFAULT_DEPARTMENTS:
                Department.objects.create(name=department, company=company)

            # create questionary
            create_questionary(company, "Default Questionary")

            return Response(status=status.HTTP_201_CREATED, data={"uuid": str(company.uuid)})
        else:
            errors = serializer.errors
            error_list = []
            for field_name, field_errors in errors.items():
                error_list.append({field_name: field_errors[0]})

            return Response(data=error_list)


class OrganizationUserViewSet(viewsets.ViewSet):

    def list(self, request, organization_pk=None):
        company = get_object_or_404(Company, uuid=organization_pk)
        department_uuid = request.GET.get('department')
        if department_uuid:
            department = get_object_or_404(Department, uuid=department_uuid)
        else:
            department = None

        status = request.GET.get('status', default=QuestionaryResult.DONE)

        serializer = OrganizationUserSerializer(company, context={'department': department, 'status': status})
        return Response(serializer.data)


class OrganizationInvitationsViewSet(viewsets.ViewSet):

    def list(self, request, organization_pk=None):
        company = get_object_or_404(Company, uuid=organization_pk)
        questionary = company.questionary
        invitations = Invitation.objects.filter(questionary=questionary)
        serializer = InvitationSerializer(invitations, many=True)
        return Response(serializer.data)


class OrganizationDepartmentViewSet(viewsets.ViewSet):

    def list(self, request, organization_pk=None):
        company = get_object_or_404(Company, uuid=organization_pk)
        serializer = OrganizationDepartmentSerializer(company)
        return Response(serializer.data)

    def create(self, request, organization_pk=None):
        company = get_object_or_404(Company, uuid=organization_pk)
        serializer = DepartmentSerializer(data=request.data)
        if serializer.is_valid():
            name = serializer.validated_data.get('name')
            if not Department.objects.filter(name=name, company=company).exists():
                Department.objects.create(name=name, company=company)
                return Response(status=status.HTTP_201_CREATED)
            else:
                return Response(status=status.HTTP_409_CONFLICT, data={"Department exists already"})

class OrganizationPositionViewSet(viewsets.ViewSet):

    def list(self, request, organization_pk=None):
        company = get_object_or_404(Company, uuid=organization_pk)
        serializer = OrganizationPositionSerializer(company)
        return Response(serializer.data)

    def create(self, request, organization_pk=None):
        company = get_object_or_404(Company, uuid=organization_pk)
        serializer = PositionSerializer(data=request.data)
        if serializer.is_valid():
            name = serializer.validated_data.get('name')
            if not Position.objects.filter(name=name, company=company).exists():
                Position.objects.create(name=name, company=company)
                return Response(status=status.HTTP_201_CREATED)
            else:
                return Response(status=status.HTTP_409_CONFLICT, data={"Position exists already"})
