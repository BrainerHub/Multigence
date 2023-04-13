from django.test import TestCase

from multigence_server.report import services


class DataModelTestCase(TestCase):

    def test_ranking(self):
        avg = [30, 45, 22, 71, 80, 10, 20]
        user_1 = [35, 15, 23, 65, 70, 10, 33]

        rank = services.distance(user_1, avg)

        self.assertEquals(35, round(rank))
