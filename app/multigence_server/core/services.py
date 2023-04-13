import random
from django.conf import settings

from multigence_server.core.models import Answer, AnswerQuestionOptionPoints, QuestionOption, QuestionaryResult, Department, User, Questionary, \
    Question, QuestionaryQuestion


def get_default_department(company):
    return Department.objects.filter(company=company)[0]

# Test taking


def random_answer_questionary(questionary, user, questionary_result=None):
    if not questionary_result:
        questionary_result = create_questionary_result(questionary, user)
    questions = questionary.get_questions()
    for question in questions:
        random_answer_question(questionary, question, questionary_result)
    set_to_done_if_all_answered(questionary_result)


def random_answer_question(questionary, question, questionary_result):
    max_points = questionary.max_points
    question_options = list(QuestionOption.objects.filter(question=question).all())
    random.shuffle(question_options)
    remaining_points = max_points
    current_index = 0
    answers = [0] * len(question_options)

    while remaining_points > 0:
        if current_index + 1 == len(question_options):
            points = remaining_points
        else:
            points = random.randint(1, remaining_points)
        remaining_points = remaining_points - points
        answers[current_index] = points
        current_index += 1

    for index, p in enumerate(answers):
        selected_option = question_options[index]
        create_answer(questionary_result, selected_option, p)


def create_questionary(company, questionary_name):
    questionary = Questionary.objects.create(name=questionary_name, company=company)
    for question in Question.objects.all():
        QuestionaryQuestion.objects.create(questionary=questionary, question=question)
    return questionary


def create_questionary_result(questionary, user):
    return QuestionaryResult.objects.create(questionary=questionary, user=user)


def create_answer(questionary_result, question_option, points):
    answer = Answer.objects.get_or_create(questionary_result=questionary_result)[0]
    answer_points = AnswerQuestionOptionPoints.objects.filter(answer=answer, question_option=question_option).first()
    if not answer_points:
        answer_points = AnswerQuestionOptionPoints(answer=answer, question_option=question_option)
    answer_points.points = points
    answer_points.save()

    if questionary_result.status == QuestionaryResult.CREATED:
        questionary_result.status = QuestionaryResult.IN_PROGRESS
        questionary_result.save()

    return answer, answer_points


def set_to_done_if_all_answered(questionary_result):
    # All questions answered, i.e. each question has AnswerQuestionOptionPoints
    questions = questionary_result.questionary.get_questions()
    for question in questions:
        question_options = QuestionOption.objects.filter(question=question)
        answers = AnswerQuestionOptionPoints.objects.filter(question_option__in=question_options, answer=questionary_result.answer)
        if len(answers) == 0:
            return False
    questionary_result.status = QuestionaryResult.DONE
    questionary_result.save()
    return True

# Question languages
def get_element_of_lang(list, language_code):
    index = settings.MULTIGENCE_LANGUAGES.index(language_code)
    return list[index]

def validate_languages(json_with_language):
    languages = settings.MULTIGENCE_LANGUAGES
    for language in languages:
        if language not in json_with_language:
            return False
    return True


def get_language_code_from_request(request):
    languages = settings.MULTIGENCE_LANGUAGES
    if "HTTP_ACCEPT_LANGUAGE" in request.META:
        accepted_language = request.META['HTTP_ACCEPT_LANGUAGE']
        for language in languages:
            if accepted_language == language:
                return language

    return languages[0]

# User retrieval


def get_user(company, role=None, status=QuestionaryResult.DONE, department=None):
    if not department:
        query = """
            SELECT * FROM core_user
              JOIN core_questionaryresult ON (core_questionaryresult.user_id = core_user.uuid)
              JOIN core_department ON (core_user.department_id = core_department.uuid)
              JOIN core_company ON (core_department.company_id = core_company.uuid)
            WHERE
              core_questionaryresult.status = '{}'
              AND core_company.uuid = '{}'
            """.format(status, company.uuid)
    else:
        query = """
            SELECT * FROM core_user
              JOIN core_questionaryresult ON (core_questionaryresult.user_id = core_user.uuid)
            WHERE
              core_questionaryresult.status = '{}'
              AND core_user.department_id = '{}'
            """.format(status, department.uuid)
    if role:
        # Manager should be included in employees
        if role == User.EMPLOYEE:
            query += "\nAND (core_user.role = '{}' or core_user.role = '{}')".format(role, User.MANAGER)
        else:
            query += "\nAND core_user.role = '{}'".format(role)

    # never return an Admin
    query += "\nAND NOT core_user.role = '{}'".format(User.ADMIN)

    return User.objects.raw(query)

# random name generator

def get_random_name():
   return random.choice(settings.RANDOM_FIRST_NAMES).title(), random.choice(settings.RANDOM_LAST_NAMES).title()