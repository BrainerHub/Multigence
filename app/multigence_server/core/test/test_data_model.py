from uuid import UUID

from django.test import TestCase

from multigence_server.core import services
from multigence_server.core.models import *
from multigence_server.core.services import create_questionary_result


class DataModelTestCase(TestCase):

    def dumpdb(self):
        from django.utils.six import StringIO
        from django.core.management import call_command
        out = StringIO()
        call_command('dumpdata', 'core', indent=2, stdout=out)
        print(out.getvalue()) # uncomment to print dump that can be used for fixtures

    def create_company(self, name):
        company = Company.objects.create(name=name)
        it_department = Department.objects.create(name="IT department", company=company)
        human_resources_department = Department.objects.create(name="HR department", company=company)

        # Users
        employee = User.objects.create_user("employee@" + name + ".com", "employeepassword", is_superuser=False, is_staff=True, first_name="EmployeeFirstName", last_name="EmployeeLastName", department=it_department, role=User.EMPLOYEE, title="System Employee")
        applicant = User.objects.create_user("dummy@" + name + ".com", "dummyuserpassword", is_superuser=False, is_staff=False, department=human_resources_department, first_name="DummyFirstName", last_name="DummyLastName", role=User.APPLICANT)
        manager = User.objects.create_user("manager@" + name + ".com", "managerpassword", is_superuser=False, is_staff=False, first_name="ProgramManagerFirstName", last_name="ProgramManagerLastName", department=human_resources_department, role=User.MANAGER)

        questionary = services.create_questionary(company, "default")
        create_questionary_result(questionary=questionary, user=employee)
        create_questionary_result(questionary=questionary, user=applicant)
        create_questionary_result(questionary=questionary, user=manager)

        return company

    def setUp(self):
        sphere_1 = Sphere.objects.create(name="sphere1", type=Sphere.COLLECTIVE)
        sphere_2 = Sphere.objects.create(name="sphere2", type=Sphere.COLLECTIVE)
        sphere_3 = Sphere.objects.create(name="sphere3", type=Sphere.COLLECTIVE)
        sphere_4 = Sphere.objects.create(name="sphere4", type=Sphere.NONE)
        sphere_5 = Sphere.objects.create(name="sphere5", type=Sphere.INDIVIDUAL)
        sphere_6 = Sphere.objects.create(name="sphere6", type=Sphere.INDIVIDUAL)
        sphere_7 = Sphere.objects.create(name="sphere7", type=Sphere.INDIVIDUAL)

        self.question_1 = Question.objects.create(text={"en": "Question 1", "de": "Frage 1"})
        QuestionOption.objects.create(text={"en": "option1", "de": "optionDe1"}, question=self.question_1, sphere=sphere_1)
        QuestionOption.objects.create(text={"en": "option2", "de": "optionDe2"}, question=self.question_1, sphere=sphere_2)
        QuestionOption.objects.create(text={"en": "option3", "de": "optionDe3"}, question=self.question_1, sphere=sphere_3)
        QuestionOption.objects.create(text={"en": "option4", "de": "optionDe4"}, question=self.question_1, sphere=sphere_4)
        QuestionOption.objects.create(text={"en": "option5", "de": "optionDe5"}, question=self.question_1, sphere=sphere_5)
        QuestionOption.objects.create(text={"en": "option6", "de": "optionDe6"}, question=self.question_1, sphere=sphere_6)
        QuestionOption.objects.create(text={"en": "option7", "de": "optionDe7"}, question=self.question_1, sphere=sphere_7)

        self.question_2 = Question.objects.create(text={"en": "Question 2", "de": "Frage 2"})
        QuestionOption.objects.create(text={"en": "option1", "de": "optionDe1"}, question=self.question_2, sphere=sphere_1)
        QuestionOption.objects.create(text={"en": "option2", "de": "optionDe2"}, question=self.question_2, sphere=sphere_2)
        QuestionOption.objects.create(text={"en": "option3", "de": "optionDe3"}, question=self.question_2, sphere=sphere_3)
        QuestionOption.objects.create(text={"en": "option4", "de": "optionDe4"}, question=self.question_2, sphere=sphere_4)
        QuestionOption.objects.create(text={"en": "option5", "de": "optionDe5"}, question=self.question_2, sphere=sphere_5)
        QuestionOption.objects.create(text={"en": "option6", "de": "optionDe6"}, question=self.question_2, sphere=sphere_6)
        QuestionOption.objects.create(text={"en": "option7", "de": "optionDe7"}, question=self.question_2, sphere=sphere_7)

        multigence = self.create_company("multigence")

        # create admin
        admin = User.objects.create_user("admin@multigence.com", "adminpassword", is_superuser=True, is_staff=True, first_name="AdminFirstName", last_name="AdminLastName", department=services.get_default_department(multigence), role=User.ADMIN, title="System Admin")

        self.create_company("google")
        self.dumpdb()


    def test_questionary_answer(self):
        multigence = Company.objects.get(name="multigence")
        questionary = multigence.questionary
        employee = User.objects.get(email="employee@multigence.com")
        questionary_result = QuestionaryResult.objects.get(questionary=questionary, user=employee)

        answer1 = Answer.objects.create(questionary_result=questionary_result)
        question1_options = QuestionOption.objects.filter(question=self.question_1)

        self.assertEquals(len(question1_options), 7)

        points1 = AnswerQuestionOptionPoints.objects.create(answer=answer1, question_option=question1_options[0], points=22)
        AnswerQuestionOptionPoints.objects.create(answer=answer1, question_option=question1_options[1], points=0)
        AnswerQuestionOptionPoints.objects.create(answer=answer1, question_option=question1_options[2], points=0)
        AnswerQuestionOptionPoints.objects.create(answer=answer1, question_option=question1_options[3], points=0)

        self.assertEquals(points1.answer_id, answer1.uuid)
        self.assertEquals(points1.question_option_id, question1_options[0].uuid)
        self.assertEquals(points1.points, 22)
