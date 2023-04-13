import tokenlib
from django.conf import settings

from multigence_server.registration.models import Invitation, Token


def create_invitation(email, role, first_name, last_name, department=None, position=None):
    invitation = Invitation(email=email.lower(), role=role, first_name=first_name, last_name=last_name, position=position, department=department)
    invitation.save()
    return invitation


def create_token(content, value, timeout):
    manager = tokenlib.TokenManager(secret=settings.TOKEN_SECRET, timeout=timeout)
    token = manager.make_token(content)
    Token.objects.create(key=token, value=value)
    return token


def parse_token(key):
    if not Token.objects.filter(key=key).exists():
        raise tokenlib.errors.MalformedTokenError()
    manager = tokenlib.TokenManager(secret=settings.TOKEN_SECRET, timeout=settings.TOKEN_TIMEOUT)
    return manager.parse_token(key)


def delete_token(key):
    if Token.objects.filter(key=key).exists():
        Token.objects.get(key=key).delete()


def create_password_reset_token(email):
    return create_token({"email": email}, email, timeout=settings.TOKEN_TIMEOUT)


def get_email_from_password_reset_token(key):
    return parse_token(key)['email']

