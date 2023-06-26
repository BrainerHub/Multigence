import numpy as np

from django.db import connection
from multigence_server.core.models import AnswerQuestionOptionPoints, Sphere, QuestionaryResult, QuestionOption, Answer, \
    User


#
# Ranking
#


def distance(x, y):
    return np.linalg.norm(np.array(x) - np.array(y))

#
# Corridor
#

# -- Destination


def get_corridor_destination_data(user_id):
    data = []
    spheres = Sphere.objects.all().order_by('index')
    for sphere in spheres:
        sphere_points = get_sphere_points(sphere, user_id=user_id)
        data.append({'sphereId': sphere.uuid, 'totalPoints': sphere_points})
    return data


def get_corridor_destination_data_v2(user_id):
    data = []
    spheres = Sphere.objects.all().order_by('index')
    for sphere in spheres:
        sphere_points = get_sphere_points_v2(sphere, user_id=user_id)
        data.append({'sphereId': sphere.uuid, 'totalPoints': sphere_points})

    sphere_list = []
    point_list = []
    for i in data:
        sphere_list.append(str(i['sphereId']))
        for j in i['totalPoints']:
            if len(point_list) == len(i['totalPoints']):
                for d in point_list:
                    if d and d['question'] and d['question'] == j['question']:
                        d['point'] += j['point']
            else:
                point_list.append({
                    'question': j['question'],
                    'point': j['point']
                })
    return {'spheres': sphere_list, 'points': point_list}

# -- Source

def get_corridor_source_data(company, role=None, user_id=None, department_uuid=None):
    data = []
    spheres = Sphere.objects.all().order_by('index')
    questionary = company.questionary
    number_of_questions = questionary.questions.count()
    for sphere in spheres:
        sphere_points = get_sphere_points(sphere, company, role=role, user_id=user_id, department_uuid=department_uuid)
        sphere_count = get_sphere_count(sphere, company, role=role, user_id=user_id, department_uuid=department_uuid)
        if sphere_count == 0:
            data.append({'sphereId': sphere.uuid, 'totalPoints': 0})
        else:
            total_points = round(number_of_questions * sphere_points / sphere_count)
            data.append({'sphereId': sphere.uuid, 'totalPoints': total_points})
    return data


def extract_sphere_points(sphere_points_list):
    sphere_points = []
    for item in sphere_points_list:
        sphere_points.append(item['totalPoints'])
    return sphere_points

def extract_sphere_points_v2(sphere_points_list):
    spheres = []
    points = []
    for item in sphere_points_list:
        points.append(item['totalPoints'])
        spheres.append(item['sphereId'])
    
    return {'spheres': spheres, 'points': points}

# -- retrieve sphere points


def get_sphere_query(sphere, company=None, role=None, user_id=None, department_uuid=None, title=None, position=None):
    # Get all answers for all questionaries for that sphere
    query = """
    from core_answerquestionoptionpoints p
        JOIN core_answer ON (p.answer_id = core_answer.uuid)
        JOIN core_questionaryresult ON (core_answer.questionary_result_id = core_questionaryresult.uuid)
        JOIN core_questionary ON (core_questionaryresult.questionary_id = core_questionary.uuid)
        JOIN core_user ON (core_questionaryresult.user_id = core_user.uuid)
        JOIN core_department ON (core_user.department_id = core_department.uuid)
        LEFT JOIN core_position ON (core_user.position_id = core_position.uuid)
        JOIN core_company ON (core_department.company_id = core_company.uuid)

        JOIN core_questionoption ON (core_questionoption.uuid = p.question_option_id)
        JOIN core_sphere ON (core_questionoption.sphere_id = core_sphere.uuid)

        WHERE core_questionaryresult.status = '{}' AND core_sphere.uuid = '{}'
    """.format(QuestionaryResult.DONE, sphere.uuid)

    if role:
        if role == User.EMPLOYEE:
            # Manager counts as employee
            query += "\nAND (core_user.role = '{}' or core_user.role = '{}')".format(role, User.MANAGER)
        else:
            query += "\nAND core_user.role = '{}'".format(role)
    if user_id:
        query += "\nAND core_questionaryresult.user_id = '{}'".format(user_id)
    if company:
        query += "\nAND core_company.uuid = '{}'".format(company.uuid)
    if department_uuid:
        query += "\nAND core_department.uuid = '{}'".format(department_uuid)
    if title:
        query += "\nAND core_user.title = '{}'".format(title)
    if position:
        query += "\nAND core_position.uuid = '{}'".format(position.uuid)

    return query


def get_sphere_points(sphere, company=None, role=None, user_id=None, department_uuid=None, title=None, position=None):
    query = "select p.uuid, p.points, p.question_option_id " + get_sphere_query(sphere, company=company, role=role, user_id=user_id, department_uuid=department_uuid, title=title, position=position)
    answer_points = AnswerQuestionOptionPoints.objects.raw(query)
    return sum(answer_point.points for answer_point in answer_points)


def get_sphere_points_v2(sphere, company=None, role=None, user_id=None, department_uuid=None, title=None, position=None):
    query = "select p.uuid, p.points, p.question_option_id " + get_sphere_query(sphere, company=company, role=role, user_id=user_id, department_uuid=department_uuid, title=title, position=position)
    answer_points = AnswerQuestionOptionPoints.objects.raw(query)
    q_dict = []
    for point in answer_points:
        dict_ = {
            'question': point.question_option.question.text['en'],
            'point': [point.points]
        }
        q_dict.append(dict_)
    return q_dict


def get_sphere_count(sphere, company=None, role=None, user_id=None, department_uuid=None, title=None, position=None):
    query = "select count(p.uuid) " + get_sphere_query(sphere, company=company, role=role, user_id=user_id, department_uuid=department_uuid, title=title, position=position)
    cursor = connection.cursor()
    cursor.execute(query)
    row = cursor.fetchone()
    return row[0]

# --- User report that returns his points per question

def get_answer_report_as_json(questionary_result):
    report = []
    questionary = questionary_result.questionary
    if Answer.objects.filter(questionary_result=questionary_result).exists():
        answer = Answer.objects.get(questionary_result=questionary_result)
        for question in questionary.get_questions():
            options = []
            for option in QuestionOption.objects.filter(question=question):
                points = AnswerQuestionOptionPoints.objects.get(answer=answer, question_option=option).points
                options.append({"uuid": option.uuid, "points": points})
            report.append({"questionId" : question.uuid, "options": options})
    return report

def get_answer_report_as_csv(questionary_result):
    report = []
    questionary = questionary_result.questionary
    if Answer.objects.filter(questionary_result=questionary_result).exists():
        answer = Answer.objects.get(questionary_result=questionary_result)
        spheres = Sphere.objects.all().order_by('index')
        for question in questionary.get_questions():
            result_row = {"Question": question.text}
            for sphere in spheres:
                option = QuestionOption.objects.filter(question=question, sphere=sphere)
                if AnswerQuestionOptionPoints.objects.filter(answer=answer, question_option=option).exists():
                    points = AnswerQuestionOptionPoints.objects.get(answer=answer, question_option=option).points
                else:
                    points = 0
                result_row[sphere.name] = points
            report.append(result_row)
    return report