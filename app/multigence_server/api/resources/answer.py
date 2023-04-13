from rest_framework import status, serializers, viewsets
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from multigence_server.api.resources.answer_question_option_points import AnswerQuestionOptionPointsSerializer
from multigence_server.core.models import QuestionaryResult, Question, QuestionOption, Answer, \
    AnswerQuestionOptionPoints
from multigence_server.core.services import set_to_done_if_all_answered, create_answer


class AnswerSerializer(serializers.BaseSerializer):
    def to_representation(self, questionary_result):
        questionary = questionary_result.questionary
        questions = []
        if Answer.objects.filter(questionary_result=questionary_result).exists():
            answer = Answer.objects.get(questionary_result=questionary_result)
            for question in Question.objects.filter(questionary=questionary):
                question_options = []
                for question_option in QuestionOption.objects.filter(question=question):
                        if AnswerQuestionOptionPoints.objects.filter(answer=answer, question_option=question_option).exists():
                            answer_question_option_points = AnswerQuestionOptionPoints.objects.get(answer=answer, question_option=question_option)
                            question_options.append(AnswerQuestionOptionPointsSerializer(answer_question_option_points).data)
                questions.append({
                    'questionId': question.uuid,
                    'options': question_options
                })

        return questions

    def to_internal_value(self, data):
        question_id = data.get('questionId')
        options = data.get('options')

        # validation
        if not question_id:
            raise serializers.ValidationError({
                'questionId missing'
            })

        if not options:
            raise serializers.ValidationError({
                'options missing'
            })

        # validate options
        if not isinstance(options, list):
            raise serializers.ValidationError({
                'options not an array'
            })

        # question = get_object_or_404(Question, uuid=question_id)
        questionary_result = self.context.get('questionary_result')
        questionary = questionary_result.questionary

        # validate total points
        total_points = 0
        for option in options:
            option_id = option.get("uuid")
            points = option.get("points")
            if not option_id:
                raise serializers.ValidationError({
                    'uuid expected in options array'
                })
            if points is None:
                raise serializers.ValidationError({
                    'points expected in options array'
                })
            total_points += int(points)

        if total_points > questionary.max_points:
            raise serializers.ValidationError({
                'Sum of points > max_points'
            })

        return {
            'questionId': question_id,
            'options': options
        }


class AnswerViewSet(viewsets.ViewSet):

    def list(self, request, user_pk=None, questionary_pk=None):
        questionary_result = get_object_or_404(QuestionaryResult, user_id=user_pk, questionary_id=questionary_pk)
        serializer = AnswerSerializer(questionary_result)
        return Response(serializer.data)

    def create(self, request, user_pk=None, questionary_pk=None):
        questionary_result = get_object_or_404(QuestionaryResult, user_id=user_pk, questionary_id=questionary_pk)
        serializer = AnswerSerializer(data=request.data, context={'questionary_result': questionary_result})
        if serializer.is_valid(raise_exception=True):
            for option in serializer.validated_data.get('options'):
                question_option = get_object_or_404(QuestionOption, uuid=option.get("uuid"))
                points = option.get("points")
                create_answer(questionary_result, question_option, points)
            # set result status to DONE if all questions have been answered
            set_to_done_if_all_answered(questionary_result)
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.error_messages)
