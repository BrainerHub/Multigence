from django.db import connection


def get_positions(company_uuid):
    query = """
    select distinct position from core_user
    JOIN core_department ON (core_user.department_id = core_department.uuid)
    JOIN core_company ON (core_department.company_id = core_company.uuid)
    WHERE core_company.uuid = '{}';
    """.format(company_uuid)
    cursor = connection.cursor()
    cursor.execute(query)
    rows = cursor.fetchall()
    return [position_tupel[0] for position_tupel in rows if position_tupel[0]]