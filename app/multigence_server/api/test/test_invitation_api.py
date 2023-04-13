from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase

from multigence_server.api.test import utils
from multigence_server.core import services
from multigence_server.core.models import Position, Company, User, QuestionOption, \
    Questionary, Question
from multigence_server.core.services import get_default_department
from multigence_server.registration.models import Invitation
from multigence_server.report.services import get_corridor_source_data


@override_settings(MAIL_API_KEY=None)
class InvitationApiTestCase(APITestCase):
    fixtures = ['fixtures/test-data.json',]

    url_root = '/api/'

    def test_trial_invites(self):
        utils.login(self.client, 'manager@multigence.com', 'managerpassword')

        company = Company.objects.get(name="multigence")
        company.trial = True
        company.invitations = 2
        company.save()

        department = get_default_department(company)

        # invite #1
        payload = {
            "email": "test@multigence.com",
            "role": User.EMPLOYEE,
            "first_name": "Hans",
            "last_name": "Meier",
            "department": str(department.uuid),
            "uri": "http://newuri.com"
        }

        response = self.client.post(self.url_root + "invite/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # invite #2
        payload = {
            "email": "test2@multigence.com",
            "role": User.EMPLOYEE,
            "first_name": "Hans",
            "last_name": "Meier",
            "department": str(department.uuid),
            "uri": "http://newuri.com"
        }

        response = self.client.post(self.url_root + "invite/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


        # invite #3
        payload = {
            "email": "test3@multigence.com",
            "role": User.EMPLOYEE,
            "first_name": "Hans",
            "last_name": "Meier",
            "department": str(department.uuid),
            "uri": "http://newuri.com"
        }

        response = self.client.post(self.url_root + "invite/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)


    def test_invite_twice(self):
        utils.login(self.client, 'manager@multigence.com', 'managerpassword')

        company = Company.objects.get(name="multigence")
        department = get_default_department(company)

        # invite
        payload = {
            "email": "test@multigence.com",
            "role": User.EMPLOYEE,
            "first_name": "Hans",
            "last_name": "Meier",
            "department": str(department.uuid),
            "uri": "http://newuri.com"
        }

        response = self.client.post(self.url_root + "invite/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


        # invite again, change company
        company = Company.objects.get(name="google")
        department = get_default_department(company)

        # invite
        payload = {
            "email": "test@multigence.com",
            "role": User.EMPLOYEE,
            "first_name": "Hans",
            "last_name": "Meier",
            "department": str(department.uuid),
            "uri": "http://newuri.com"
        }

        response = self.client.post(self.url_root + "invite/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # accept invitation, start test
        invitations = Invitation.objects.all()
        self.assertEqual(len(invitations), 1)
        invitation = invitations[0]

        # get invitation
        response = self.client.get(self.url_root + "invite/" + str(invitation.uuid) + "/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        invitation_json = response.data
        self.assertEquals(invitation_json['email'], "test@multigence.com")
        self.assertEquals(invitation_json['role'], User.EMPLOYEE)
        self.assertEquals(invitation_json['first_name'], "Hans")
        self.assertEquals(invitation_json['last_name'], "Meier")

        # accept invitation
        response = self.client.patch(self.url_root + "invite/" + str(invitation.uuid) + "/", {"password": "pass"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # accept again
        response = self.client.patch(self.url_root + "invite/" + str(invitation.uuid) + "/", {"password": "pass"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # answer
        self.answer_questionary("test@multigence.com")

        user = User.objects.get(email="manager@multigence.com")
        self.client.force_authenticate(user=user)

        # invite again => reject
        payload = {
            "email": "test@multigence.com",
            "role": User.EMPLOYEE,
            "first_name": "Hans",
            "last_name": "Meier",
            "department": str(department.uuid),
            "uri": "http://newuri.com"
        }

        response = self.client.post(self.url_root + "invite/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)


    def test_applicant_invitation(self):
        utils.login(self.client, 'manager@multigence.com', 'managerpassword')

        company = Company.objects.get(name="multigence")
        department = get_default_department(company)
        position = Position.objects.create(name="DEV 101", company=company)

        # invite candidate but forget position
        payload = {
            "email": "test@multigence.com",
            "role": "APPLICANT",
            "first_name": "Hans",
            "last_name": "Meier",
            "department": str(department.uuid),
            "uri": "http://newuri.com"
        }
        response = self.client.post(self.url_root + "invite/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # invite candidate with position
        payload = {
            "email": "test@multigence.com",
            "role": "APPLICANT",
            "first_name": "Hans",
            "last_name": "Meier",
            "position": str(position.uuid),
            "department": str(department.uuid),
            "uri": "http://newuri.com"
        }
        response = self.client.post(self.url_root + "invite/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        invitations = Invitation.objects.all()
        self.assertEqual(len(invitations), 1)
        invitation = invitations[0]

        # get invitation
        response = self.client.get(self.url_root + "invite/" + str(invitation.uuid) + "/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        invitation_json = response.data
        self.assertEquals(invitation_json['email'], "test@multigence.com")
        self.assertEquals(invitation_json['role'], "APPLICANT")
        self.assertEquals(invitation_json['first_name'], "Hans")
        self.assertEquals(invitation_json['last_name'], "Meier")
        self.assertEquals(invitation_json['position'], str(position.uuid))

        # accept invitation
        response = self.client.patch(self.url_root + "invite/" + str(invitation.uuid) + "/", {"password": "pass"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # accept again
        response = self.client.patch(self.url_root + "invite/" + str(invitation.uuid) + "/", {"password": "pass"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)



    def test_manager_invitation(self):
        utils.login(self.client, 'admin@multigence.com', 'adminpassword')

        company=Company.objects.get(name="multigence")
        department = get_default_department(company)

        # invite user
        payload = {
            "email": "manager2@multigence.com",
            "role": "MANAGER",
            "first_name": "Hans",
            "last_name": "Meier",
            "department": str(department.uuid),
            "uri": "http://newuri.com"
        }
        response = self.client.post(self.url_root + "invite/", data=payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        invitations = Invitation.objects.all()
        self.assertEqual(len(invitations), 1)
        invitation = invitations[0]

        # get invitation
        response = self.client.get(self.url_root + "invite/" + str(invitation.uuid) + "/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        invitation_json = response.data
        self.assertEquals(invitation_json['email'], "manager2@multigence.com")
        self.assertEquals(invitation_json['role'], "MANAGER")
        self.assertEquals(invitation_json['first_name'], "Hans")
        self.assertEquals(invitation_json['last_name'], "Meier")
        self.assertEquals(invitation_json['department'], department.uuid)

        # accept invitation
        response = self.client.patch(self.url_root + "invite/" + str(invitation.uuid) + "/", {"password": "pass"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # accept again
        response = self.client.patch(self.url_root + "invite/" + str(invitation.uuid) + "/", {"password": "pass"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        manager2 = User.objects.get(email="manager2@multigence.com")

        self.assertEqual(User.MANAGER, manager2.role)
        self.assertEqual("multigence", manager2.department.company.name)

        # test get_user
        users = list(services.get_user(company))
        self.assertEqual(len(users), 0)

        # finish the test
        self.answer_questionary("manager2@multigence.com")

        users = list(services.get_user(company, role=User.EMPLOYEE))

        self.assertEqual(len(users), 1)
        self.assertEqual(users[0].uuid, manager2.uuid)

        data = get_corridor_source_data(company)
        self.assertEqual(data[0]['totalPoints'], 15)


    def test_permission_denied(self):
        # login as not a manager or admin
        utils.login(self.client, 'dummy@multigence.com', 'dummyuserpassword')

        # invite user
        payload = {
            "email": "test@multigence.com",
            "role": "APPLICANT",
            "first_name": "Hans",
            "last_name": "Meier",
            "position": "DEV 1101"
        }
        response = self.client.post(self.url_root + "invite/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def answer_questionary(self, email):
        user = User.objects.get(email=email)
        self.client.force_authenticate(user=user)

        # get questionaries
        url = self.url_root + 'user/' + str(user.uuid) + '/questionary/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        questionary_response = response.data[0]
        questionary_uuid = str(questionary_response['uuid'])
        q = Questionary.objects.get(uuid=questionary_uuid)
        self.assertEqual(questionary_response['status'], "CREATED")

        # qet questions
        response = self.client.get(url + questionary_uuid + "/")
        questions = response.data['questions']

        self.assertEqual(2, len(questions))

        # answer questions
        question_1 = questions[0]
        options_1 = question_1['options']
        self.assertEqual(len(options_1), 7)

        question_1_uuid = str(question_1['uuid'])

        q1 = Question.objects.get(uuid=question_1_uuid)
        qo1 = QuestionOption.objects.get(question_id=question_1_uuid, text__en='option1')

        payload = {'questionId': question_1_uuid, 'options': [
            {'uuid': str(QuestionOption.objects.get(question_id=question_1_uuid, text__en='option1').uuid), 'points': 1},
            {'uuid': str(QuestionOption.objects.get(question_id=question_1_uuid, text__en='option2').uuid), 'points': 2},
            {'uuid': str(QuestionOption.objects.get(question_id=question_1_uuid, text__en='option3').uuid), 'points': 4},
            {'uuid': str(QuestionOption.objects.get(question_id=question_1_uuid, text__en='option4').uuid), 'points': 15},
        ]}

        response = self.client.post(url + questionary_uuid + "/answer/", payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Status should be changed to IN_PROGRESS
        response = self.client.get(url + questionary_uuid + "/")
        self.assertEqual(response.data['status'], "IN_PROGRESS")

        # next question
        question_2 = questions[1]

        options_2 = question_2['options']
        self.assertEqual(len(options_2), 7)

        question_2_uuid = str(question_2['uuid'])
        payload = {'questionId': str(question_2_uuid), 'options': [
            {'uuid': str(QuestionOption.objects.get(question_id=question_2_uuid, text__en='option1').uuid), 'points': 10},
            {'uuid': str(QuestionOption.objects.get(question_id=question_2_uuid, text__en='option2').uuid), 'points': 1},
            {'uuid': str(QuestionOption.objects.get(question_id=question_2_uuid, text__en='option3').uuid), 'points': 11},
        ]}

        response = self.client.post(url + questionary_uuid + "/answer/", payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Questionary should be DONE
        response = self.client.get(url + questionary_uuid + "/")
        self.assertEqual(response.data['status'], "DONE")
