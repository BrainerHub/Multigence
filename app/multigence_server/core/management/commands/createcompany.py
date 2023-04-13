import getpass
from django.core.management import BaseCommand, CommandError

from multigence_server.core import services
from multigence_server.core.models import User, Company, Department, Questionary, QuestionaryQuestion, Question
from multigence_server.core.services import create_questionary_result


class Command(BaseCommand):
    help = 'Creates a new company and auto-generates questionary'

    def handle(self, *args, **options):
        name = input("Company name: ")
        company = Company.objects.create(name=name)

        default_department = input("Default department: ")
        department = Department.objects.create(name=default_department, company=company)

        self.stdout.write(self.style.SUCCESS('Company created with uuid = ' + str(company.uuid)))

        # create questionary
        questionary = services.create_questionary(company, "Questionary " + name)

        email = input("Do you want to create a manager as well? If so, enter email address (return to skip): ")
        if email:
            email = email.lower()
            if User.objects.filter(email=email).exists():
                raise CommandError('User with email "{}" already exists'.format(email))

            password = getpass.getpass("password: ")
            password_1 = getpass.getpass("repeat password: ")

            if not password == password_1:
                raise CommandError('Passwords not equal')

            first_name = input("First name: ")
            last_name = input("Last name: ")

            title = input("Title: ")
            role = User.MANAGER

            user = User.objects.create_user(email=email, password=password, first_name=first_name, last_name=last_name, department=department, role=role, title=title)

            create_questionary_result(questionary, user)

            self.stdout.write(self.style.SUCCESS('Company manager created with uuid = ' + str(user.uuid)))
        else:
            self.stdout.write(self.style.SUCCESS('Done'))
