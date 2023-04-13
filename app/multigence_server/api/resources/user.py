from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from rest_framework import serializers, status, viewsets
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response

from multigence_server.api.permissions import IsAuthenticatedAndAdminIfList
from multigence_server.api.resources.department import DepartmentSerializer
from multigence_server.api.resources.organization import OrganizationSerializer
from multigence_server.api.resources.position import PositionSerializer
from multigence_server.core.models import User, Department, QuestionaryResult, Company


class UserSerializer(serializers.BaseSerializer):
    def to_representation(self, user):
        company = user.department.company
        questionary = company.questionary

        status = None
        if QuestionaryResult.objects.filter(user=user, questionary=questionary).exists():
            status = QuestionaryResult.objects.get(user=user, questionary=questionary).status

        position = None
        if user.position:
            position = PositionSerializer(user.position).data

        is_admin_user = self.context.get('is_admin_user')
        show_alias = company.trial and not is_admin_user

        first_name = user.first_name_alias if show_alias else user.first_name
        last_name = user.last_name_alias if show_alias else user.last_name

        return {
            'uuid': user.uuid,
            'questionary_uuid': questionary.uuid,
            'department': DepartmentSerializer(user.department).data,
            'company': OrganizationSerializer(company).data,
            'status': status,
            'first_name': first_name,
            'last_name': last_name,
            'role': user.role,
            'position': position,
            'title': user.title
        }


class ProfileSerializer(serializers.BaseSerializer):
    def to_representation(self, user):
        company = user.department.company if user.department else None
        position_uuid = user.position.uuid if user.position else None
        position_name = user.position.name if user.position else None

        first_name = user.first_name_alias if company.trial else user.first_name
        last_name = user.last_name_alias if company.trial else user.last_name

        return {
            'uuid': user.uuid,
            'email': user.email,
            'department': user.department.uuid,
            'department_name': user.department.name,
            'title': user.title,
            'position': position_uuid,
            'position_name': position_name,
            'first_name': first_name,
            'last_name': last_name,
            'role': user.role,
            'gender': user.gender,
            'address': user.address,
            'zipcode': user.zipcode,
            'state': user.state,
            'country': user.country,
            'telephone': user.telephone,
            'website': user.website,
            'profile_picture': user.profile_picture,
            'description': user.description,
            'company': company.uuid,
            'company_name': company.name
        }


class UserViewSet(viewsets.ViewSet):
    # todo: test permissions
    permission_classes = (IsAuthenticatedAndAdminIfList,)

    def list(self, request):
        organization_uuid = request.GET.get('organization')
        role = request.GET.get('role')
        roles = [User.APPLICANT, User.MANAGER, User.EMPLOYEE]
        if role:
            roles = [role]
        if organization_uuid:
            company = get_object_or_404(Company, uuid=organization_uuid)
            all_user = User.objects.filter(role__in=roles, department__company=company)
        else:
            all_user = User.objects.filter(role__in=roles)

        serializer = UserSerializer(all_user, many=True, context={'is_admin_user': request.user.role == User.ADMIN})
        return Response(serializer.data)

    def get(self, request, pk=None):
        if pk == "me":
            user = request.user
        else:
            user = get_object_or_404(User, uuid=pk)
        serializer = ProfileSerializer(user)
        return Response(serializer.data)

    def partial_update(self, request, pk=None):
        if pk == "me":
            user = request.user
        else:
            user = get_object_or_404(User, uuid=pk)

        data = request.data
        if 'password' in data: user.set_password(data['password'])
        if 'first_name' in data: user.first_name = data['first_name']
        if 'last_name' in data: user.last_name = data['last_name']
        if 'department' in data: user.department = get_object_or_404(Department, uuid=data['department'])
        if 'title' in data: user.title = data['title']
        if 'position' in data: user.position = data['position']
        if 'role' in data: user.role = data['role']
        if 'gender' in data: user.gender = data['gender']
        if 'address' in data: user.address = data['address']
        if 'zipcode' in data: user.zipcode = data['zipcode']
        if 'state' in data: user.state = data['state']
        if 'country' in data: user.country = data['country']
        if 'telephone' in data: user.telephone = data['telephone']
        if 'website' in data: user.website = data['website']
        if 'profile_picture' in data: user.profile_picture = data['profile_picture']
        if 'description' in data: user.description = data['description']

        user.save()
        return Response(status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        user = get_object_or_404(User, uuid=pk)
        user.delete()

        return Response(status=status.HTTP_200_OK)

class AuthTokenSerializer(serializers.Serializer):
    email = serializers.EmailField(label="Email")
    password = serializers.CharField(label="Password", style={'input_type': 'password'})

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(email=email.lower(), password=password)

            if user:
                if not user.is_active:
                    msg = 'User account is disabled.'
                    raise serializers.ValidationError(msg)
            else:
                msg = 'Unable to log in with provided credentials.'
                raise serializers.ValidationError(msg)
        else:
            msg = 'Must include "email" and "password".'
            raise serializers.ValidationError(msg)

        attrs['user'] = user
        return attrs


class Login(ObtainAuthToken):
    serializer_class = AuthTokenSerializer
