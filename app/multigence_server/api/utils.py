# from django.utils.encoding import force_text
from django.utils.encoding import force_str
from rest_framework.exceptions import APIException


class CustomValidationError(APIException):
    default_detail = 'A server error occurred.'

    def __init__(self, detail, status_code):
        self.status_code = status_code
        self.detail = force_str(detail)