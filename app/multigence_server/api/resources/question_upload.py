from rest_framework import serializers, viewsets, status
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework.response import Response

from multigence_server.core.models import Sphere, Question, QuestionOption
from multigence_server.core.services import validate_languages


class QuestionUploadOptionsSerializer(serializers.Serializer):
    option = serializers.JSONField()
    sphereName = serializers.CharField()

    def validate_sphere_id(self, value):
        if not Sphere.objects.filter(name=value).exists():
            raise serializers.ValidationError({
                'Sphere with name' + value + ' does not exist'
            })
        return value

    def validate_option(self, option):
        if not validate_languages(option):
            raise serializers.ValidationError({
                'Did not find required languages in option text:' + str(option)
            })
        return option


class QuestionUploadSerializer(serializers.Serializer):
    question = serializers.JSONField()
    options = QuestionUploadOptionsSerializer(many=True)

    def validate_question(self, question):
        if not validate_languages(question):
            raise serializers.ValidationError({
                'Did not find required languages in question text: ' + str(question)
            })
        return question


class QuestionUploadViewSet(viewsets.ViewSet):

    parser_classes = (MultiPartParser,JSONParser)

    def create(self, request):
        data = request.data
        if request.FILES['file']:
            jsonParser = JSONParser()
            data = jsonParser.parse(request.FILES['file'])
        serializer = QuestionUploadSerializer(data=data, many=True)
        if serializer.is_valid(raise_exception=True):
            questions = serializer.data
            for question in questions:
                text = question['question']
                q = Question.objects.create(text=text)
                options = question['options']
                for option in options:
                    QuestionOption.objects.create(question=q, text=option['option'], sphere=Sphere.objects.get(name=option['sphereName']))

            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.error_messages)
