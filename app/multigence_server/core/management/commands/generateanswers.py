import random
from uuid import UUID

from django.core.management import BaseCommand, CommandError

from multigence_server import core
from multigence_server.core.models import Questionary, User, Department, Position
from multigence_server.core.services import random_answer_questionary


number_answers = 10

class Command(BaseCommand):
    help = 'Creates users and generates random answers for each new user for the given questionary'

    def add_arguments(self, parser):
        parser.add_argument('uuid', nargs=1, type=UUID)

    def handle(self, *args, **options):
        questionary_uuid = options['uuid'][0]
        if not Questionary.objects.filter(uuid=questionary_uuid).exists():
            raise CommandError('Questionary with uuid "{}" does not exist'.format(questionary_uuid))
        questionary = Questionary.objects.get(uuid=questionary_uuid)
        company = questionary.company
        departments = Department.objects.filter(company=company)
        titles = ['Project Manager', 'Developer', 'Human Resources Manager']
        positions = [
            Position.objects.create(name='0001 Manager', company=company),
            Position.objects.create(name='0002 Manager', company=company),
            Position.objects.create(name='0001 Developer', company=company),
            Position.objects.create(name='0002 Developer', company=company),
            Position.objects.create(name='0001 Human Resources Manager', company=company)
        ]

        self.stdout.write(self.style.SUCCESS('Creating users and answer for "%s"' % questionary.name))

        for i in range(1, number_answers):
            role = User.EMPLOYEE
            position = None
            title = random.choice(titles)
            if i >= number_answers / 2:
                role = User.APPLICANT
                position = random.choice(positions)
                title = None
            department = random.choice(departments)
            first_name = "test" + str(i)
            last_name = "user" + str(i)
            first_name_alias, last_name_alias = core.services.get_random_name()
            if User.objects.filter(first_name=first_name, last_name=last_name).exists():
                user = User.objects.get(first_name=first_name, last_name=last_name)
            else:
                user = User.objects.create_user(first_name + "." + last_name+"@multigence.com", is_superuser=False, is_staff=False, password="testuser" + str(i), first_name=first_name, last_name=last_name, first_name_alias=first_name_alias, last_name_alias=last_name_alias, role=role, department=department, title=title, position=position)
            self.stdout.write(self.style.SUCCESS('Created user: "%s"' % user.email))
            self.stdout.write(self.style.SUCCESS('Generating answers for %s with role: %s, department: %s, title: %s, position: %s' % (user.email, role, department, title, position)))
            random_answer_questionary(questionary, user)
