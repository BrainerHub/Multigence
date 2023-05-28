from rest_framework import viewsets
from rest_framework.response import Response
from multigence_server.core.models import User, Answer, QuestionaryResult, AnswerQuestionOptionPoints

from itertools import groupby
class ReportSphere(viewsets.ModelViewSet):
    def list(self, request):
        user_obj = User.objects.filter(email="employee@multigence.com").first()
        result_obj = QuestionaryResult.objects.filter(user_id=user_obj.uuid).first()
        answer_obj = Answer.objects.filter(questionary_result=result_obj.uuid).first()
        answer_points = AnswerQuestionOptionPoints.objects.filter(answer=answer_obj.uuid).all()
        sphere_point_dict = []
        sphere_list = []
        for answer_point in answer_points:
            sphere_point_dict.append({
                'sphere': answer_point.question_option.sphere.uuid, 
                'point': answer_point.points, 
                'question': answer_point.question_option.question.uuid,
                'sphere_name': answer_point.question_option.sphere.name,
                'question_name': answer_point.question_option.question.text['en']
            })
            sphere_list.append(answer_point.question_option.sphere.name)

        sphere_list = list(set(sphere_list))
        groups = groupby(sphere_point_dict, lambda x: x['question'])
        point_list = []
        final_list = []
        sphere_point_list = []
        for group in groups:
            sphere_point_dict = {}
            for item in group:
                sphere_point_dict[item['sphere_name']] = item['point']
                question_name = item['question_name']
                sphere_point_list.append(sphere_point_dict)
            point_list = [sphere_point_dict.get(sphere, 0) for sphere in sphere_list]
            final_list.append({
                'question': question_name,
                'points': point_list
            })
        return Response(data={'sphere_list': sphere_list, 'point_list': point_list})
    
