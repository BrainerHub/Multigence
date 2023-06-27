from rest_framework import serializers, viewsets
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from multigence_server.core.models import Company, User, QuestionaryResult, Department
from multigence_server.report.services import get_corridor_source_data, get_corridor_destination_data, \
    extract_sphere_points, distance, extract_sphere_points_v2, get_corridor_destination_data_v2


class CorridorSourceDataSerializer(serializers.Serializer):
    sphereId = serializers.UUIDField()
    totalPoints = serializers.IntegerField()


class CorridorDestinationDataSerializer(serializers.BaseSerializer):

    def to_representation(self, user):
        if user.department.company.trial and user.role != User.ADMIN:
            return {
                'uuid': user.uuid,
                'data': CorridorSourceDataSerializer(user.sphere_data, many=True).data,
                'first_name': user.first_name_alias,
                'last_name': user.last_name_alias
            }
        else:
            return {
                'uuid': user.uuid,
                'data': CorridorSourceDataSerializer(user.sphere_data, many=True).data,
                'first_name': user.first_name,
                'last_name': user.last_name
            }
        

class CorridorDestinationDataSerializerV2(serializers.BaseSerializer):
    def to_representation(self, user):
        if user.department.company.trial and user.role != User.ADMIN:
            return {
                'uuid': user.uuid,
                'data': {
                    'spheres': user.sphere_data['spheres'],
                    'points': user.sphere_data['points'],
                    'total_points': user.sphere_data['total_points']
                },
                'first_name': user.first_name_alias,
                'last_name': user.last_name_alias
            }
        else:
            return {
                'uuid': user.uuid,
                'data': {
                    'spheres': user.sphere_data['spheres'],
                    'points': user.sphere_data['points'],
                    'total_points': user.sphere_data['total_points']
                },
                'first_name': user.first_name,
                'last_name': user.last_name
            }
        

class CorridorViewSet(viewsets.ViewSet):
    def list(self, request, organization_pk=None):
        company = get_object_or_404(Company, uuid=organization_pk)

        #
        # SOURCE (corridor data)
        #

        department = request.GET.get('department')
        source = request.GET.get('source')
        if not source:
            raise serializers.ValidationError("source required")

        if source == 'employees':
            corridor_data = get_corridor_source_data(company, role=User.EMPLOYEE, department_uuid=department)
        else:
            try:
                User.objects.get(uuid=source)
            except ValueError:
                raise serializers.ValidationError("User with uuid = " + source + " does not exist")
            corridor_data = get_corridor_source_data(company, user_id=source)

        #
        # DESTINATION (destination users)
        #

        destination = request.GET.get('destination')
        if not destination:
            raise serializers.ValidationError("destination required")

        # -- filter users
        
        if destination == 'employees':
            destination_users = User.objects.filter(department__company=company, role=User.EMPLOYEE, questionaryresult__status=QuestionaryResult.DONE)
        elif destination == 'candidates':
            destination_users = User.objects.filter(department__company=company, role=User.APPLICANT, questionaryresult__status=QuestionaryResult.DONE)
        elif destination.startswith('title'):
            if not destination.startswith("title:"):
                raise serializers.ValidationError("destination title malformed: expected 'title:STRING")
            title = destination.split(":")[1]
            destination_users = User.objects.filter(department__company=company, title=title, questionaryresult__status=QuestionaryResult.DONE)
        elif destination.startswith('position'):
            if not destination.startswith("position:"):
                raise serializers.ValidationError("destination position malformed: expected 'position:STRING")
            position = destination.split(":")[1]
            destination_users = User.objects.filter(department__company=company, position=position, questionaryresult__status=QuestionaryResult.DONE)
        else:
            destination_users = User.objects.filter(department__company=company, questionaryresult__status=QuestionaryResult.DONE)

        # -- rank users

        # add sphere_data & distance to each user
        avg_sphere_points = extract_sphere_points(corridor_data)
        for user in destination_users:
            user.sphere_data = get_corridor_destination_data(user.uuid)
            user_sphere_points = extract_sphere_points(user.sphere_data)
            user.distance = distance(user_sphere_points, avg_sphere_points)
        # sort
        destination_users = sorted(destination_users, key=lambda user: user.distance)

        # Create response
        source_data = CorridorSourceDataSerializer(corridor_data, many=True).data
        destination_data = CorridorDestinationDataSerializer(destination_users, many=True).data
        return Response({'data': source_data, 'users': destination_data})


class CorridorViewSetV2(viewsets.ViewSet):

    def list(self, request, organization_pk=None):
        company = get_object_or_404(Company, uuid=organization_pk)

        #
        # SOURCE (corridor data)
        #

        departments = []
        department = request.GET.get('department')
        if department == 'all':
            objs = Department.objects.all().values('uuid')
            departments = [str(obj['uuid']) for obj in objs]
        else:
            departments.append(department)
        department2 = request.GET.get('department2')
        if department2:
            departments.append(department2)
        department_list = []
        for department in departments:
            source = request.GET.get('source')
            if not source:
                raise serializers.ValidationError("source required")

            if source == 'employees':
                corridor_data = get_corridor_source_data(company, role=User.EMPLOYEE, department_uuid=department)
            else:
                try:
                    User.objects.get(uuid=source)
                except ValueError:
                    raise serializers.ValidationError("User with uuid = " + source + " does not exist")
                corridor_data = get_corridor_source_data(company, user_id=source)

            seprate_data = extract_sphere_points_v2(corridor_data)
            department_list.append({
                'data': seprate_data
            })

        #
        # DESTINATION (destination users)
        #

        destination = request.GET.get('destination')
        if not destination:
            raise serializers.ValidationError("destination required")

        # # -- filter users
        
        if destination == 'employees':
            destination_users = User.objects.filter(department__company=company, role=User.EMPLOYEE, questionaryresult__status=QuestionaryResult.DONE)
        elif destination == 'candidates':
            destination_users = User.objects.filter(department__company=company, role=User.APPLICANT, questionaryresult__status=QuestionaryResult.DONE)
        elif destination.startswith('title'):
            if not destination.startswith("title:"):
                raise serializers.ValidationError("destination title malformed: expected 'title:STRING")
            title = destination.split(":")[1]
            destination_users = User.objects.filter(department__company=company, title=title, questionaryresult__status=QuestionaryResult.DONE)
        elif destination.startswith('position'):
            if not destination.startswith("position:"):
                raise serializers.ValidationError("destination position malformed: expected 'position:STRING")
            position = destination.split(":")[1]
            destination_users = User.objects.filter(department__company=company, position=position, questionaryresult__status=QuestionaryResult.DONE)
        else:
            destination_users = User.objects.filter(department__company=company, questionaryresult__status=QuestionaryResult.DONE)

        # -- rank users

        # add sphere_data & distance to each user
        for user in destination_users:
            user.sphere_data = get_corridor_destination_data_v2(user.uuid)
        # sort
        # destination_users = sorted(destination_users, key=lambda user: user.distance)
        # Create response
        # source_data = CorridorSourceDataSerializer(corridor_data, many=True).data
        destination_data = CorridorDestinationDataSerializerV2(destination_users, many=True).data
        return Response({'data': department_list, 'users': destination_data})
