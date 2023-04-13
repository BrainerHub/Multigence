from rest_framework import viewsets
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework_csv.renderers import CSVRenderer

from multigence_server.api.authentication import ParamTokenAuthentication

import multigence_server.report.services
from multigence_server.core.models import QuestionaryResult, Sphere


class ResultViewSet(viewsets.ViewSet):
    renderer_classes = (CSVRenderer, )
    authentication_classes = (ParamTokenAuthentication, )

    def list(self, request, user_pk=None, questionary_pk=None):
        # set correct order header order
        # note: this can't be done before or would lead to migration errors
        self.renderer_classes[0].header = ['Question.de', 'Question.en']
        for s in Sphere.objects.all().order_by('index'):
            self.renderer_classes[0].header.append(s.name)

        questionary_result = get_object_or_404(QuestionaryResult, user_id=user_pk, questionary_id=questionary_pk)
        data = multigence_server.report.services.get_answer_report_as_csv(questionary_result)

        response = Response(data)
        file_name = "report-" + questionary_result.user.email + ".csv"
        response['Content-Disposition'] = 'attachment; filename="' + file_name +'"'
        return response
