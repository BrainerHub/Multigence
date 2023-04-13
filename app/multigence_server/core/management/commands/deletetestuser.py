from django.core.management import BaseCommand

from multigence_server.core.models import User


class Command(BaseCommand):
    help = 'Deletes users that start with testuser...'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Deleting test users...'))

        users = User.objects.filter(first_name__startswith='test', last_name__startswith='user')

        for user in users:
            user.delete()
            self.stdout.write(self.style.SUCCESS('Deleted user: "%s"' % user.email))


