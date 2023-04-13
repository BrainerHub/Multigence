from rest_framework import exceptions
from rest_framework import authentication


def get_authorization_token(request):
    auth = authentication.get_authorization_header(request).split()

    if auth:
        if len(auth) == 1:
            msg = 'Invalid token header. No credentials provided.'
            raise exceptions.AuthenticationFailed(msg)
        elif len(auth) > 2:
            msg = 'Invalid token header. Token string should not contain spaces.'
            raise exceptions.AuthenticationFailed(msg)
        elif auth[0].lower() != b'token':
            msg = 'Invalid token header. Header should start with Token'
            raise exceptions.AuthenticationFailed(msg)

        try:
            token = auth[1].decode()
        except UnicodeError:
            msg = 'Invalid token header. Token string should not contain invalid characters.'
            raise exceptions.AuthenticationFailed(msg)

    else:
        token = request.GET.get('token', None)

    return token

class ParamTokenAuthentication(authentication.TokenAuthentication):
    def authenticate(self, request):
        token = get_authorization_token(request)
        return self.authenticate_credentials(token)
