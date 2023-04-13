login_url = "/api/login/"


def login(client, email, password):
    response = client.post(login_url, {'email': email, 'password': password}, format='json')
    token = response.data['token']
    client.credentials(HTTP_AUTHORIZATION='Token ' + token)
    return True
