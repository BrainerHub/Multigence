import getpass
from uuid import UUID

from django.core.management import BaseCommand, CommandError

from multigence_server.core.models import User, Company
from multigence_server.core.services import get_default_department, create_questionary_result

class Command(BaseCommand):
    help = 'Creates a new User of company-uuid with email & password'

    def add_arguments(self, parser):
        parser.add_argument('uuid', nargs=1, type=UUID)

    def handle(self, *args, **options):
        company_uuid = options['uuid'][0]
        if not Company.objects.filter(uuid=company_uuid).exists():
            raise CommandError('Company with uuid "{}" does not exist'.format(company_uuid))

        company = Company.objects.get(uuid=company_uuid)
        default_department = get_default_department(company)

        email = input("Email address: ")
        if not email:
            raise CommandError("Email required")
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
        role = User.EMPLOYEE

        user = User.objects.create_user(email=email, password=password, first_name=first_name, last_name=last_name, department=default_department, role=role, title=title)

        questionary = company.questionary
        create_questionary_result(questionary, user)

        self.stdout.write(self.style.SUCCESS('Company Employee created with uuid = ' + str(user.uuid)))
