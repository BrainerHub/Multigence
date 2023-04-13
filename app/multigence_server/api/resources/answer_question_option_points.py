from rest_framework import serializers

from multigence_server.core.models import AnswerQuestionOptionPoints


class AnswerQuestionOptionPointsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerQuestionOptionPoints
        fields = ('uuid', 'points')
