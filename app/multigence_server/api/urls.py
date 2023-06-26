# from django.conf.urls import url, include
from django.urls import include, path
from rest_framework_nested import routers

from multigence_server.api.resources import ping
from multigence_server.api.resources import user, question_upload, sphere, invitation, password_reset, registration, report
from multigence_server.api.resources.answer import AnswerViewSet
from multigence_server.api.resources.corridor import CorridorViewSet, CorridorViewSetV2
from multigence_server.api.resources.organization import OrganizationUserViewSet, OrganizationDepartmentViewSet,OrganizationViewSet, \
    OrganizationPositionViewSet, OrganizationInvitationsViewSet
from multigence_server.api.resources.questionary import QuestionaryViewSet, QuestionaryStatusViewSet
from multigence_server.api.resources.result import ResultViewSet
from multigence_server.api.resources.user import Login

base_router = routers.DefaultRouter()
base_router.register('ping', ping.PingViewSet, basename='ping')
base_router.register('user', user.UserViewSet, basename='user')
base_router.register('organization', OrganizationViewSet)
base_router.register('sphere', sphere.SphereViewSet)
base_router.register('invite', invitation.InvitationViewSet, basename='invitation')
base_router.register('questionUpload', question_upload.QuestionUploadViewSet, basename='question_upload')
base_router.register('resetPassword', password_reset.PasswordResetViewSet, basename='reset_password')
base_router.register('changePassword', password_reset.ChangePasswordViewSet, basename='change_password')
base_router.register('register', registration.RegistrationViewSet, basename='register')
base_router.register('report_sphere', report.ReportSphere, basename='report_sphere')

questionary_router = routers.NestedSimpleRouter(base_router, 'user', lookup='user')
questionary_router.register('questionary', QuestionaryViewSet, basename='questionary')

answer_router = routers.NestedSimpleRouter(questionary_router, 'questionary', lookup='questionary')
answer_router.register('answer', AnswerViewSet, basename='answer')

result_router = routers.NestedSimpleRouter(questionary_router, 'questionary', lookup='questionary')
result_router.register('result', ResultViewSet, basename='result')

organization_user_router = routers.NestedSimpleRouter(base_router, 'organization', lookup='organization')
organization_user_router.register('user', OrganizationUserViewSet, basename='organization_user')

organization_invitation_router = routers.NestedSimpleRouter(base_router, 'organization', lookup='organization')
organization_invitation_router.register('invitation', OrganizationInvitationsViewSet, basename='organization_invitation')

organization_department_router = routers.NestedSimpleRouter(base_router, 'organization', lookup='organization')
organization_department_router.register('department', OrganizationDepartmentViewSet, basename='organization_department')


organization_position_router = routers.NestedSimpleRouter(base_router, 'organization', lookup='organization')
organization_department_router.register('position', OrganizationPositionViewSet, basename='organization_position')

organization_report_corridor_router = routers.NestedSimpleRouter(base_router, 'organization', lookup='organization')
organization_report_corridor_router.register('report/corridor', CorridorViewSet, basename='corridor')

organization_report_corridor_router = routers.NestedSimpleRouter(base_router, 'organization', lookup='organization')
organization_report_corridor_router.register('report/corridor_v2', CorridorViewSetV2, basename='report_corridor')

organization_questionary_status_router = routers.NestedSimpleRouter(base_router, 'organization', lookup='organization')
organization_questionary_status_router.register('questionary/status', QuestionaryStatusViewSet, basename='questionary_status')



urlpatterns = [
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('', include(questionary_router.urls)),
    path('', include(answer_router.urls)),
    path('', include(result_router.urls)),
    path('', include(organization_user_router.urls)),
    path('', include(organization_invitation_router.urls)),
    path('', include(organization_department_router.urls)),
    path('', include(organization_position_router.urls)),
    path('', include(organization_report_corridor_router.urls)),
    path('', include(organization_questionary_status_router.urls)),
    path('', include(base_router.urls)),
    path('login/', Login.as_view())
]