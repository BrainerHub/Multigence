from rest_framework import status
from rest_framework.test import APITestCase

from multigence_server.core.models import QuestionaryQuestion, Question, QuestionOption, Sphere, Company, Department, User, Questionary, \
    Position
from multigence_server.core.services import random_answer_questionary


class CorridorApiTestCase(APITestCase):
    fixtures = ['fixtures/test-data.json',]

    url_root = '/api/'

    def test_corridor_responses(self):
        user = User.objects.get(email='admin@multigence.com')
        self.client.force_authenticate(user=user)

        # Create company, departments and users
        company = Company.objects.create(name="TestCompany")
        it_department = Department.objects.create(name="IT department", company=company)
        hr_department = Department.objects.create(name="HR department", company=company)

        position = Position.objects.create(name="0001 IT developer", company=company)
        
        applicant = User.objects.create_user("applicant@email.com",department=it_department, role=User.APPLICANT, position=position)
        applicant_2 = User.objects.create_user("applicant2@email.com",department=hr_department, role=User.APPLICANT, position=position)
        ceo = User.objects.create_user("ceo@email.com", department=hr_department, role=User.EMPLOYEE, title="CEO")
        it_developer = User.objects.create_user("itdev@email.com", department=it_department, role=User.EMPLOYEE, title="It developer")

        # Create questionary
        questionary = Questionary.objects.create(name="Default questionary", company=company)

        question_1 = Question.objects.create(text={"en": "Question 1", "de": "Frage 1"})
        QuestionOption.objects.create(text={"en": "option1", "de": "optionDe1"}, question=question_1, sphere=Sphere.objects.get(name='sphere1'))
        QuestionOption.objects.create(text={"en": "option2", "de": "optionDe2"}, question=question_1, sphere=Sphere.objects.get(name='sphere2'))
        QuestionOption.objects.create(text={"en": "option3", "de": "optionDe3"}, question=question_1, sphere=Sphere.objects.get(name='sphere3'))
        QuestionOption.objects.create(text={"en": "option4", "de": "optionDe4"}, question=question_1, sphere=Sphere.objects.get(name='sphere4'))
        QuestionOption.objects.create(text={"en": "option5", "de": "optionDe5"}, question=question_1, sphere=Sphere.objects.get(name='sphere5'))
        QuestionOption.objects.create(text={"en": "option6", "de": "optionDe6"}, question=question_1, sphere=Sphere.objects.get(name='sphere6'))
        QuestionOption.objects.create(text={"en": "option7", "de": "optionDe7"}, question=question_1, sphere=Sphere.objects.get(name='sphere7'))
        QuestionaryQuestion.objects.create(questionary=questionary, question=question_1)

        question_2 = Question.objects.create(text={"en": "Question 2", "de": "Frage 2"})
        QuestionOption.objects.create(text={"en": "option1", "de": "optionDe1"}, question=question_2, sphere=Sphere.objects.get(name='sphere1'))
        QuestionOption.objects.create(text={"en": "option2", "de": "optionDe2"}, question=question_2, sphere=Sphere.objects.get(name='sphere2'))
        QuestionOption.objects.create(text={"en": "option3", "de": "optionDe3"}, question=question_2, sphere=Sphere.objects.get(name='sphere3'))
        QuestionOption.objects.create(text={"en": "option4", "de": "optionDe4"}, question=question_2, sphere=Sphere.objects.get(name='sphere4'))
        QuestionOption.objects.create(text={"en": "option5", "de": "optionDe5"}, question=question_2, sphere=Sphere.objects.get(name='sphere5'))
        QuestionOption.objects.create(text={"en": "option6", "de": "optionDe6"}, question=question_2, sphere=Sphere.objects.get(name='sphere6'))
        QuestionOption.objects.create(text={"en": "option7", "de": "optionDe7"}, question=question_2, sphere=Sphere.objects.get(name='sphere7'))
        QuestionaryQuestion.objects.create(questionary=questionary, question=question_2, index=1)

        # create answers
        base_url = self.url_root + 'organization/' + str(company.uuid) + '/report/corridor/?source={}&destination={}'

        random_answer_questionary(questionary, applicant)
        random_answer_questionary(questionary, applicant_2)
        random_answer_questionary(questionary, ceo)
        random_answer_questionary(questionary, it_developer)

        # All
        response = self.client.get(base_url.format("employees", "all"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["users"]), 4)
        self.assertEqual(len(response.data["data"]), 7)

        # only CEOs
        response = self.client.get(base_url.format("employees", "title:CEO"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["users"]), 1)
        self.assertEqual(len(response.data["data"]), 7)

        # only Employees
        response = self.client.get(base_url.format("employees", "employees"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["users"]), 2)

        # only Applicants
        response = self.client.get(base_url.format("employees", "candidates"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["users"]), 2)

        # only Position "IT developer"
        response = self.client.get(base_url.format("employees", "position:"+str(position.uuid)))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["users"]), 2)
