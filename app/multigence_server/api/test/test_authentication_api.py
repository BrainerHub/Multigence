from rest_framework import status
from rest_framework.test import APITestCase

from multigence_server.api.test import utils
from multigence_server.core.models import User


class AuthenticationApiTestCase(APITestCase):
    fixtures = ['fixtures/test-data.json',]

    url_root = '/api/'

    def test_login(self):
        # login
        utils.login(self.client, 'employee@multigence.com', 'employeepassword')

        # get questionaries
        user = User.objects.get(email='employee@multigence.com')
        url = self.url_root + 'user/' + str(user.uuid) + '/questionary/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        questionary_response = response.data[0]
        self.assertEqual(questionary_response['status'], "CREATED")

    def test_unauthorized(self):
        # get questionaries
        user = User.objects.get(email='employee@multigence.com')
        url = self.url_root + 'user/' + str(user.uuid) + '/questionary/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
