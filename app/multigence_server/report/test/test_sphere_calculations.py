from django.contrib.auth.models import User
from django.test import TestCase

from multigence_server.core import services
from multigence_server.core.models import *
from multigence_server.core.services import create_answer, set_to_done_if_all_answered, create_questionary_result
from multigence_server.report.services import get_sphere_points, get_corridor_source_data, get_corridor_destination_data


class SphereCalculationTestCase(TestCase):
    fixtures = ['fixtures/test-data.json', ]

    def get_totalpoints_from_corridor(self, corridor, sphere):
        for data in corridor:
            sphere_id = data['sphereId']
            totalPoints = data['totalPoints']
            if sphere_id == sphere.uuid:
                return totalPoints

    def get_totalpoints_from_users(self, users, user_id, sphere):
        for user in users:
            if user['uuid'] == user_id:
                data = user['data']
                sphere_id = data['sphereId']
                totalPoints = data['totalPoints']
                if sphere_id == sphere.uuid:
                    return totalPoints
        raise Exception("Could not find user with uuid = " + user_id + " or sphere_id = " + sphere.uuid + " in data")

    def create_answer(self, questionary_result, question, s1, s2, s3, s4, s5, s6, s7):
        sphere1_option = QuestionOption.objects.get(question=question, sphere=Sphere.objects.get(name='sphere1'))
        sphere2_option = QuestionOption.objects.get(question=question, sphere=Sphere.objects.get(name='sphere2'))
        sphere3_option = QuestionOption.objects.get(question=question, sphere=Sphere.objects.get(name='sphere3'))
        sphere4_option = QuestionOption.objects.get(question=question, sphere=Sphere.objects.get(name='sphere4'))
        sphere5_option = QuestionOption.objects.get(question=question, sphere=Sphere.objects.get(name='sphere5'))
        sphere6_option = QuestionOption.objects.get(question=question, sphere=Sphere.objects.get(name='sphere6'))
        sphere7_option = QuestionOption.objects.get(question=question, sphere=Sphere.objects.get(name='sphere7'))

        create_answer(questionary_result, sphere1_option, s1)
        create_answer(questionary_result, sphere2_option, s2)
        create_answer(questionary_result, sphere3_option, s3)
        create_answer(questionary_result, sphere4_option, s4)
        create_answer(questionary_result, sphere5_option, s5)
        create_answer(questionary_result, sphere6_option, s6)
        create_answer(questionary_result, sphere7_option, s7)

        set_to_done_if_all_answered(questionary_result)

    def assert_sphere_points(self, company, s1, s2, s3, s4, s5, s6, s7, department_uuid=None, role=None, user_uuid=None,
                             title=None, position=None):
        self.assertEquals(
            get_sphere_points(Sphere.objects.get(name='sphere1'), company=company, department_uuid=department_uuid,
                              role=role, user_id=user_uuid, title=title, position=position), s1)
        self.assertEquals(
            get_sphere_points(Sphere.objects.get(name='sphere2'), company=company, department_uuid=department_uuid,
                              role=role, user_id=user_uuid, title=title, position=position), s2)
        self.assertEquals(
            get_sphere_points(Sphere.objects.get(name='sphere3'), company=company, department_uuid=department_uuid,
                              role=role, user_id=user_uuid, title=title, position=position), s3)
        self.assertEquals(
            get_sphere_points(Sphere.objects.get(name='sphere4'), company=company, department_uuid=department_uuid,
                              role=role, user_id=user_uuid, title=title, position=position), s4)
        self.assertEquals(
            get_sphere_points(Sphere.objects.get(name='sphere5'), company=company, department_uuid=department_uuid,
                              role=role, user_id=user_uuid, title=title, position=position), s5)
        self.assertEquals(
            get_sphere_points(Sphere.objects.get(name='sphere6'), company=company, department_uuid=department_uuid,
                              role=role, user_id=user_uuid, title=title, position=position), s6)
        self.assertEquals(
            get_sphere_points(Sphere.objects.get(name='sphere7'), company=company, department_uuid=department_uuid,
                              role=role, user_id=user_uuid, title=title, position=position), s7)

    def assert_corridor(self, corridor, s1, s2, s3, s4, s5, s6, s7):
        self.assertAlmostEquals(self.get_totalpoints_from_corridor(corridor, Sphere.objects.get(name='sphere1')), s1)
        self.assertAlmostEquals(self.get_totalpoints_from_corridor(corridor, Sphere.objects.get(name='sphere2')), s2)
        self.assertAlmostEquals(self.get_totalpoints_from_corridor(corridor, Sphere.objects.get(name='sphere3')), s3)
        self.assertAlmostEquals(self.get_totalpoints_from_corridor(corridor, Sphere.objects.get(name='sphere4')), s4)
        self.assertAlmostEquals(self.get_totalpoints_from_corridor(corridor, Sphere.objects.get(name='sphere5')), s5)
        self.assertAlmostEquals(self.get_totalpoints_from_corridor(corridor, Sphere.objects.get(name='sphere6')), s6)
        self.assertAlmostEquals(self.get_totalpoints_from_corridor(corridor, Sphere.objects.get(name='sphere7')), s7)

    def test_sphere_points(self):
        user = User.objects.get(email='employee@multigence.com')
        company = Company.objects.get(name='multigence')
        it_department = Department.objects.get(company=company, name__contains='IT')
        hr_department = Department.objects.get(company=company, name__contains='HR')
        questionary = company.questionary

        questionary_result = QuestionaryResult.objects.get(questionary=questionary, user=user)
        questions = questionary.get_questions()
        question1 = questions[0]
        question2 = questions[1]

        # Answer question 1

        self.assertTrue(questionary_result.status == QuestionaryResult.CREATED)
        self.create_answer(questionary_result, question1, 10, 2, 2, 3, 0, 3, 2)
        self.assertTrue(questionary_result.status == QuestionaryResult.IN_PROGRESS)
        self.assert_sphere_points(company, 0, 0, 0, 0, 0, 0, 0)
        self.assert_sphere_points(company, 0, 0, 0, 0, 0, 0, 0, user_uuid=user.uuid)

        corridor = get_corridor_source_data(company)
        self.assert_corridor(corridor, 0, 0, 0, 0, 0, 0, 0)

        # Answer question 2
        self.create_answer(questionary_result, question2, 2, 2, 2, 3, 0, 3, 10)
        self.assertTrue(questionary_result.status == QuestionaryResult.DONE)
        self.assert_sphere_points(company, 12, 4, 4, 6, 0, 6, 12)
        self.assert_sphere_points(company, 12, 4, 4, 6, 0, 6, 12, user_uuid=user.uuid)

        corridor = get_corridor_source_data(company)
        self.assert_corridor(corridor, 12, 4, 4, 6, 0, 6, 12)

        corridor = get_corridor_destination_data(user.uuid)
        self.assert_corridor(corridor, 12, 4, 4, 6, 0, 6, 12)

        corridor = get_corridor_source_data(company, department_uuid=it_department.uuid)
        self.assert_corridor(corridor, 12, 4, 4, 6, 0, 6, 12)

        corridor = get_corridor_source_data(company, department_uuid=hr_department.uuid)
        self.assert_corridor(corridor, 0, 0, 0, 0, 0, 0, 0)

        # Another user
        user_2 = User.objects.get(email='dummy@multigence.com')
        questionary_result = QuestionaryResult.objects.get(user=user_2)

        # Answer question 1

        self.create_answer(questionary_result, question1, 0, 8, 8, 6, 0, 0, 0)
        self.assertTrue(questionary_result.status == QuestionaryResult.IN_PROGRESS)
        self.assert_sphere_points(company, 12, 4, 4, 6, 0, 6, 12)

        corridor = get_corridor_source_data(company)
        self.assert_corridor(corridor, 12, 4, 4, 6, 0, 6, 12)

        corridor = get_corridor_destination_data(user.uuid)
        self.assert_corridor(corridor, 12, 4, 4, 6, 0, 6, 12)

        corridor = get_corridor_destination_data(user_2.uuid)
        self.assert_corridor(corridor, 0, 0, 0, 0, 0, 0, 0)

        # Answer question 2

        self.create_answer(questionary_result, question2, 0, 8, 8, 6, 0, 0, 0)
        self.assertTrue(questionary_result.status == QuestionaryResult.DONE)
        self.assert_sphere_points(company, 12, 20, 20, 18, 0, 6, 12)

        corridor = get_corridor_source_data(company)
        self.assert_corridor(corridor, 6, 10, 10, 9, 0, 3, 6)

        corridor = get_corridor_destination_data(user.uuid)
        self.assert_corridor(corridor, 12, 4, 4, 6, 0, 6, 12)

        corridor = get_corridor_destination_data(user_2.uuid)
        self.assert_corridor(corridor, 0, 2 * 8, 2 * 8, 2 * 6, 0, 0, 0)

    def test_sphere_points_2(self):
        company = Company.objects.get(name='multigence')
        it_department = Department.objects.get(company=company, name__contains='IT')
        hr_department = Department.objects.get(company=company, name__contains='HR')
        questionary = company.questionary

        user_1 = User.objects.get(email='employee@multigence.com')
        self.assertEquals(user_1.department.uuid, it_department.uuid)
        questionary_result_1 = QuestionaryResult.objects.get(questionary=questionary, user=user_1)
        user_2 = User.objects.get(email='dummy@multigence.com')
        self.assertEquals(user_2.department.uuid, hr_department.uuid)
        questionary_result_2 = QuestionaryResult.objects.get(questionary=questionary, user=user_2)

        questions = questionary.get_questions()
        question1 = questions[0]
        question2 = questions[1]

        # User 1 IT Department, Employee

        # Answer question 1  & 2

        self.create_answer(questionary_result_1, question1, 10, 8, 4, 0, 0, 0, 0)
        self.create_answer(questionary_result_1, question2, 10, 8, 4, 0, 0, 0, 0)
        self.assert_sphere_points(company, 20, 16, 8, 0, 0, 0, 0)

        corridor = get_corridor_source_data(company)
        self.assert_corridor(corridor, 20, 16, 8, 0, 0, 0, 0)

        # User 2 HR Department, Applicant

        # Answer question 1 & 2

        self.create_answer(questionary_result_2, question1, 0, 0, 0, 0, 4, 8, 10)
        self.create_answer(questionary_result_2, question2, 0, 0, 0, 0, 4, 8, 10)

        self.assert_sphere_points(company, 20, 16, 8, 0, 8, 16, 20)
        self.assert_sphere_points(company, 0, 0, 0, 0, 8, 16, 20, department_uuid=hr_department.uuid)
        self.assert_sphere_points(company, 0, 0, 0, 0, 8, 16, 20, department_uuid=hr_department.uuid,
                                  role=User.APPLICANT)
        self.assert_sphere_points(company, 0, 0, 0, 0, 8, 16, 20, role=User.APPLICANT)
        self.assert_sphere_points(company, 0, 0, 0, 0, 8, 16, 20, department_uuid=hr_department.uuid,
                                  role=User.APPLICANT, user_uuid=user_2.uuid)

        self.assert_sphere_points(company, 20, 16, 8, 0, 0, 0, 0, department_uuid=it_department.uuid)
        self.assert_sphere_points(company, 20, 16, 8, 0, 0, 0, 0, department_uuid=it_department.uuid,
                                  role=User.EMPLOYEE)
        self.assert_sphere_points(company, 20, 16, 8, 0, 0, 0, 0, role=User.EMPLOYEE)
        self.assert_sphere_points(company, 20, 16, 8, 0, 0, 0, 0, user_uuid=user_1.uuid)

        self.assert_sphere_points(company, 0, 0, 0, 0, 0, 0, 0, department_uuid=it_department.uuid, role=User.APPLICANT)

        corridor = get_corridor_source_data(company)
        self.assert_corridor(corridor, 10, 8, 4, 0, 4, 8, 10)

        corridor = get_corridor_source_data(company, department_uuid=hr_department.uuid)
        self.assert_corridor(corridor, 0, 0, 0, 0, 8, 16, 20)

        corridor = get_corridor_source_data(company, department_uuid=it_department.uuid)
        self.assert_corridor(corridor, 20, 16, 8, 0, 0, 0, 0)

        # User 3 IT Department, Applicant
        position_it_developer = Position.objects.create(name="0001 IT developer", company=company)
        position_it_developer_2 = Position.objects.create(name="0002 IT developer", company=company)

        user_3 = User.objects.create_user("applicant@email.com", department=it_department, role=User.APPLICANT,
                                          title="CEO", position=position_it_developer)
        questionary_result_3 = create_questionary_result(questionary=questionary, user=user_3)

        # Answer question 1 & 2

        self.create_answer(questionary_result_3, question1, 22, 0, 0, 0, 0, 0, 0)
        self.create_answer(questionary_result_3, question2, 22, 0, 0, 0, 0, 0, 0)

        # test title and postion
        self.assert_sphere_points(company, 44, 0, 0, 0, 0, 0, 0, title="CEO")
        self.assert_sphere_points(company, 0, 0, 0, 0, 0, 0, 0, title="CTO")
        self.assert_sphere_points(company, 44, 0, 0, 0, 0, 0, 0, position=position_it_developer)
        self.assert_sphere_points(company, 0, 0, 0, 0, 0, 0, 0, position=position_it_developer_2)

        # unchanged: Employees, HR Department
        self.assert_sphere_points(company, 20, 16, 8, 0, 0, 0, 0, role=User.EMPLOYEE)
        self.assert_sphere_points(company, 0, 0, 0, 0, 8, 16, 20, department_uuid=hr_department.uuid)
        corridor = get_corridor_source_data(company, role=User.EMPLOYEE)
        self.assert_corridor(corridor, 20, 16, 8, 0, 0, 0, 0)
        corridor = get_corridor_source_data(company, department_uuid=hr_department.uuid)
        self.assert_corridor(corridor, 0, 0, 0, 0, 8, 16, 20)

        # unchanged: user_id filter
        self.assert_sphere_points(company, 44, 0, 0, 0, 0, 0, 0, user_uuid=user_3.uuid)
        corridor = get_corridor_source_data(company, user_id=user_3.uuid)
        self.assert_corridor(corridor, 44, 0, 0, 0, 0, 0, 0)

        # changed: it department corridor
        self.assert_sphere_points(company, 64, 16, 8, 0, 0, 0, 0, department_uuid=it_department.uuid)
        corridor = get_corridor_source_data(company, department_uuid=it_department.uuid)
        self.assert_corridor(corridor, 32, 8, 4, 0, 0, 0, 0)

        # changed: applicant corridor
        self.assert_sphere_points(company, 44, 0, 0, 0, 8, 16, 20, role=User.APPLICANT)
        corridor = get_corridor_source_data(company, role=User.APPLICANT)
        self.assert_corridor(corridor, 22, 0, 0, 0, 4, 8, 10)

        # changed: total corridor
        self.assert_sphere_points(company, 64, 16, 8, 0, 8, 16, 20)
        corridor = get_corridor_source_data(company)
        self.assert_corridor(corridor, 21, 5, 3, 0, 3, 5, 7)
