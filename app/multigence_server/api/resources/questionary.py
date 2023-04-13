from django.shortcuts import get_object_or_404
from rest_framework import serializers
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from multigence_server.api.resources.question import QuestionSerializer
from multigence_server.core.models import QuestionaryResult
from multigence_server.core.services import get_language_code_from_request


class QuestionarySerializer(serializers.BaseSerializer):
    """
    We use a BaseSerializer because we want to serialize a QuestionaryResult into a resource that looks like a Questionary (the API hides the fact that we operate on QuestionaryResults)
    """

    def to_representation(self, questionary_result):
        questionary = questionary_result.questionary
        questions = questionary.get_questions()

        # fields
        uuid = questionary.uuid
        name = questionary.name

        return {
            'uuid': uuid,
            'name': name,
            'status': questionary_result.status,
            'max_points': questionary.max_points,
            'questions': QuestionSerializer(questions, many=True, context=self.context).data
        }


class QuestionaryResultStatusSerializer(serializers.BaseSerializer):
    def to_representation(self, questionary_result):
        user = questionary_result.user
        department_uuid = user.department.uuid if user.department else None
        department_name = user.department.name if user.department else None
        position_uuid = user.position.uuid if user.position else None
        position_name = user.position.name if user.position else None
        return {
            'uuid': user.uuid,
            'department_uuid': department_uuid,
            'department_name': department_name,
            'questionary_uuid': questionary_result.questionary.uuid,
            'status': questionary_result.status,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role,
            'position_name': position_name,
            'position_uuid': position_uuid,
            'title': user.title,
        }


class QuestionaryStatusSerializer(serializers.BaseSerializer):
    def to_representation(self, questionary_results):
        return {
            'users': QuestionaryResultStatusSerializer(questionary_results, many=True).data
        }


class QuestionaryViewSet(viewsets.ViewSet):

    def list(self, request, user_pk=None):
        queryset = QuestionaryResult.objects.filter(user_id=user_pk)
        language = get_language_code_from_request(request)
        serializer = QuestionarySerializer(queryset, many=True, context={'language': language})
        return Response(serializer.data)

    def retrieve(self, request, pk=None, user_pk=None):
        questionary_result = get_object_or_404(QuestionaryResult, questionary_id=pk, user_id=user_pk)
        language = get_language_code_from_request(request)
        serializer = QuestionarySerializer(questionary_result, context={'language': language})
        return Response(serializer.data)

class QuestionaryStatusViewSet(viewsets.ViewSet):

    def list(self, request, organization_pk=None):
        queryset = QuestionaryResult.objects.filter(questionary__company__uuid=organization_pk)
        serializer = QuestionaryStatusSerializer(queryset)
        return Response(serializer.data)

