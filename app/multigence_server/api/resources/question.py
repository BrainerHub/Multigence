from rest_framework import serializers

from multigence_server.api.resources.question_option import QuestionOptionSerializer
from multigence_server.core.models import QuestionOption


class QuestionSerializer(serializers.BaseSerializer):
    def to_representation(self, question):
        language = self.context.get('language')
        return {
            'uuid': question.uuid,
            'text': question.text.get(language),
            'options': QuestionOptionSerializer(QuestionOption.objects.filter(question=question), many=True, read_only=True, context=self.context).data
        }
