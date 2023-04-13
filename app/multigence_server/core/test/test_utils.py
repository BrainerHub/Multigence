from multigence_server.core.models import Sphere, Questionary, Question, QuestionOption, QuestionaryQuestion


def create_questionary(company):
    sphere_1 = Sphere.objects.create(name="sphere1", type=Sphere.COLLECTIVE)
    sphere_2 = Sphere.objects.create(name="sphere2", type=Sphere.COLLECTIVE)
    sphere_3 = Sphere.objects.create(name="sphere3", type=Sphere.COLLECTIVE)
    sphere_4 = Sphere.objects.create(name="sphere4", type=Sphere.NONE)
    sphere_5 = Sphere.objects.create(name="sphere5", type=Sphere.INDIVIDUAL)
    sphere_6 = Sphere.objects.create(name="sphere6", type=Sphere.INDIVIDUAL)
    sphere_7 = Sphere.objects.create(name="sphere7", type=Sphere.INDIVIDUAL)

    questionary = Questionary.objects.create(name="Default questionary", company=company)

    question_1 = Question.objects.create(text={"en": "Question 1", "de": "Frage 1"})
    QuestionOption.objects.create(text={"en": "option1", "de": "optionDe1"}, question=question_1, sphere=sphere_1)
    QuestionOption.objects.create(text={"en": "option2", "de": "optionDe2"}, question=question_1, sphere=sphere_2)
    QuestionOption.objects.create(text={"en": "option3", "de": "optionDe3"}, question=question_1, sphere=sphere_3)
    QuestionOption.objects.create(text={"en": "option4", "de": "optionDe4"}, question=question_1, sphere=sphere_4)
    QuestionOption.objects.create(text={"en": "option5", "de": "optionDe5"}, question=question_1, sphere=sphere_5)
    QuestionOption.objects.create(text={"en": "option6", "de": "optionDe6"}, question=question_1, sphere=sphere_6)
    QuestionOption.objects.create(text={"en": "option7", "de": "optionDe7"}, question=question_1, sphere=sphere_7)
    QuestionaryQuestion.objects.create(questionary=questionary, question=question_1)

    question_2 = Question.objects.create(text={"en": "Question 2", "de": "Frage 2"})
    QuestionOption.objects.create(text={"en": "option1", "de": "optionDe1"}, question=question_2, sphere=sphere_1)
    QuestionOption.objects.create(text={"en": "option2", "de": "optionDe2"}, question=question_2, sphere=sphere_2)
    QuestionOption.objects.create(text={"en": "option3", "de": "optionDe3"}, question=question_2, sphere=sphere_3)
    QuestionOption.objects.create(text={"en": "option4", "de": "optionDe4"}, question=question_2, sphere=sphere_4)
    QuestionOption.objects.create(text={"en": "option5", "de": "optionDe5"}, question=question_2, sphere=sphere_5)
    QuestionOption.objects.create(text={"en": "option6", "de": "optionDe6"}, question=question_2, sphere=sphere_6)
    QuestionOption.objects.create(text={"en": "option7", "de": "optionDe7"}, question=question_2, sphere=sphere_7)
    QuestionaryQuestion.objects.create(questionary=questionary, question=question_2, index=1)

    return questionary

