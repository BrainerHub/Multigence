from rest_framework import status
from rest_framework.test import APITestCase

from multigence_server.core import services
from multigence_server.core.models import User, QuestionOption, Questionary


class TestTakingApiTestCase(APITestCase):
    fixtures = ['fixtures/test-data.json',]

    url_root = '/api/'

    def test_test_taking_reports(self):
        user = User.objects.get(email='employee@multigence.com')
        self.client.force_authenticate(user=user)

        # get questionaries
        url = self.url_root + 'user/' + str(user.uuid) + '/questionary/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        questionary_response = response.data[0]
        questionary_uuid = str(questionary_response['uuid'])
        self.assertEqual(questionary_response['status'], "CREATED")

        # qet questions
        response = self.client.get(url + questionary_uuid + "/")
        questions = response.data['questions']

        self.assertEqual(2, len(questions))

        # answer questions
        question_1 = questions[0]
        self.assertEqual(question_1['text'], "Question 2")
        options_1 = question_1['options']
        self.assertEqual(len(options_1), 7)

        question_1_uuid = str(question_1['uuid'])
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
        self.assertEqual(question_2['text'], "Question 1")

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

        #
        # Second user takes questionaire
        #

        user = User.objects.get(email='dummy@multigence.com')

        # get questionaries
        url = self.url_root + 'user/' + str(user.uuid) + '/questionary/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        questionary_response = response.data[0]
        questionary_uuid = str(questionary_response['uuid'])
        self.assertEqual(questionary_response['status'], "CREATED")

        # qet questions
        response = self.client.get(url + questionary_uuid + "/")
        questions = response.data['questions']

        self.assertEqual(2, len(questions))

        # answer questions
        question_1 = questions[0]
        self.assertEqual(question_1['text'], "Question 2")
        options_1 = question_1['options']
        self.assertEqual(len(options_1), 7)

        question_1_uuid = str(question_1['uuid'])
        payload = {'questionId': question_1_uuid, 'options': [
            {'uuid': str(QuestionOption.objects.get(question_id=question_1_uuid, text__en='option1').uuid), 'points': 0},
            {'uuid': str(QuestionOption.objects.get(question_id=question_1_uuid, text__en='option2').uuid), 'points': 2},
            {'uuid': str(QuestionOption.objects.get(question_id=question_1_uuid, text__en='option3').uuid), 'points': 1},
            {'uuid': str(QuestionOption.objects.get(question_id=question_1_uuid, text__en='option4').uuid), 'points': 19},
        ]}

        response = self.client.post(url + questionary_uuid + "/answer/", payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # next question
        question_2 = questions[1]
        self.assertEqual(question_2['text'], "Question 1")

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
