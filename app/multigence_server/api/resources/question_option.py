from rest_framework import serializers


class QuestionOptionSerializer(serializers.BaseSerializer):
    def to_representation(self, question_option):
        language = self.context.get('language')
        return {
            'uuid': question_option.uuid,
            'text': question_option.text.get(language)
        }
