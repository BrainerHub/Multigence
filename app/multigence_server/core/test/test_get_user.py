from django.test import TestCase

from multigence_server.core import services
from multigence_server.core.models import *
from multigence_server.core.services import *
from multigence_server.core.test.test_utils import create_questionary


class GetUserTestCase(TestCase):

    def test_get_user(self):
        company = Company.objects.create(name="company")
        department_1 = Department.objects.create(name="Department1", company=company)
        department_2 = Department.objects.create(name="Department2", company=company)

        pos1 = Position.objects.create(name="Pos1", company=company)

        # Users
        user_1_A_created = User.objects.create_user("1AInvited@company.com", "adminpassword", first_name="1", last_name="A Created", department=department_1, role=User.APPLICANT, position=pos1)
        user_1_A_in_progress = User.objects.create_user("1AProgress@company.com", "adminpassword", first_name="1", last_name="A In Progress", department=department_1, role=User.APPLICANT, position=pos1)
        user_1_A = User.objects.create_user("1A@company.com", "adminpassword", first_name="1", last_name="A", department=department_1, role=User.APPLICANT, position=pos1)
        user_2_A = User.objects.create_user("2A@company.com", "adminpassword", first_name="2", last_name="A", department=department_2, role=User.APPLICANT, position=pos1)
        user_1_E_in_progress = User.objects.create_user("1EProgress@company.com", "adminpassword", first_name="1", last_name="E In Progress", department=department_1, role=User.EMPLOYEE, title="Title1")
        user_1_E = User.objects.create_user("1E@company.com", "adminpassword", first_name="1", last_name="E", department=department_1, role=User.EMPLOYEE, title="Title1")
        user_2_E = User.objects.create_user("2E@company.com", "adminpassword", first_name="2", last_name="E", department=department_2, role=User.EMPLOYEE, title="Title2")
        user_2_E_2 = User.objects.create_user("2E2@company.com", "adminpassword", first_name="2", last_name="E2", department=department_2, role=User.EMPLOYEE, title="Title3")
        manager = User.objects.create_user("manager@company.com", "adminpassword", first_name="man", last_name="manager", department=department_2, role=User.MANAGER, title="CEO")

        # Setup questionaries
        questionary = create_questionary(company)
        random_answer_questionary(questionary, user_1_A)
        random_answer_questionary(questionary, user_2_A)
        random_answer_questionary(questionary, user_1_E)
        random_answer_questionary(questionary, user_2_E)
        random_answer_questionary(questionary, user_2_E_2)
        random_answer_questionary(questionary, manager)

        create_questionary_result(questionary, user_1_A_created)
        random_answer_question(questionary, questionary.questions.all()[0], create_questionary_result(questionary, user_1_A_in_progress))
        random_answer_question(questionary, questionary.questions.all()[0], create_questionary_result(questionary, user_1_E_in_progress))

        all_finished_users = list(get_user(company))
        self.assertEquals(len(all_finished_users), 6)

        all_applicants = list(get_user(company, role=User.APPLICANT))
        self.assertEquals(len(all_applicants), 2)

        all_employees = list(get_user(company, role=User.EMPLOYEE))
        self.assertEquals(len(all_employees), 4)

        all_department_1 = list(get_user(company, department=department_1))
        self.assertEquals(len(all_department_1), 2)

        all_department_2 = list(get_user(company, department=department_2))
        self.assertEquals(len(all_department_2), 4)

        department_2_employees = list(get_user(company, role=User.EMPLOYEE, department=department_2))
        self.assertEquals(len(department_2_employees), 3)

        # ---------------------
        # second company with manager
        # ---------------------

        company_B = Company.objects.create(name="company_B")
        department_1_B = Department.objects.create(name="Department1", company=company_B)
        department_2_B = Department.objects.create(name="Department2", company=company_B)


        # Users
        user_1_A_created_B = User.objects.create_user("1AInvited@company_B.com", "adminpassword", first_name="1", last_name="A Created", department=department_1_B, role=User.APPLICANT, position=pos1)
        user_1_A_in_progress_B = User.objects.create_user("1AProgress@company_B.com", "adminpassword", first_name="1", last_name="A In Progress", department=department_1_B, role=User.APPLICANT, position=pos1)
        user_1_A_B = User.objects.create_user("1A@company_B.com", "adminpassword", first_name="1", last_name="A", department=department_1_B, role=User.APPLICANT, position=pos1)
        user_2_A_B = User.objects.create_user("2A@company_B.com", "adminpassword", first_name="2", last_name="A", department=department_2_B, role=User.APPLICANT, position=pos1)
        user_1_E_in_progress_B = User.objects.create_user("1EProgress@company_B.com", "adminpassword", first_name="1", last_name="E In Progress", department=department_1_B, role=User.EMPLOYEE, title="Title1")
        user_1_E_B = User.objects.create_user("1E@company_B.com", "adminpassword", first_name="1", last_name="E", department=department_1_B, role=User.EMPLOYEE, title="Title1")
        user_2_E_B = User.objects.create_user("2E@company_B.com", "adminpassword", first_name="2", last_name="E", department=department_2_B, role=User.EMPLOYEE, title="Title2")
        user_2_E_2_B = User.objects.create_user("2E2@company_B.com", "adminpassword", first_name="2", last_name="E2", department=department_2_B, role=User.EMPLOYEE, title="Title3")

        questionary2 = services.create_questionary(company_B, "default")
        random_answer_questionary(questionary2, user_1_A_B)
        random_answer_questionary(questionary2, user_2_A_B)
        random_answer_questionary(questionary2, user_1_E_B)
        random_answer_questionary(questionary2, user_2_E_B)
        random_answer_questionary(questionary2, user_2_E_2_B)

        create_questionary_result(questionary2, user_1_A_created_B)
        random_answer_question(questionary2, questionary.questions.all()[0], create_questionary_result(questionary2, user_1_A_in_progress_B))
        random_answer_question(questionary2, questionary.questions.all()[0], create_questionary_result(questionary2, user_1_E_in_progress_B))

        all_finished_users = list(get_user(company_B))
        self.assertEquals(len(all_finished_users), 5)

        all_applicants = list(get_user(company, role=User.APPLICANT))
        self.assertEquals(len(all_applicants), 2)

        all_employees = list(get_user(company, role=User.EMPLOYEE))
        self.assertEquals(len(all_employees), 4)

        all_manager = list(get_user(company, role=User.MANAGER))
        self.assertEquals(len(all_manager), 1)

        all_department_1_B = list(get_user(company, department=department_1_B))
        self.assertEquals(len(all_department_1_B), 2)

        all_department_2_B = list(get_user(company, department=department_2_B))
        self.assertEquals(len(all_department_2_B), 3)

        department_2_B_employees = list(get_user(company, role=User.EMPLOYEE, department=department_2_B))
        self.assertEquals(len(department_2_B_employees), 2)



