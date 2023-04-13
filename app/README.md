# Multigence MVP backend

[ ![Codeship Status for devialab/multigence-server](https://codeship.com/projects/67c0ee80-ded5-0133-4f74-4612197ec823/status?branch=master)](https://codeship.com/projects/144830)

## Local installation

Install `requirements.txt` via preferred virtual enviroment manager.

Requires postgres db running with a database named `multigencedb`.

Create a superuser to access admin & browsable api: `python manage.py createsuperuser`.

Rename `config/settings/development_local.py.sample` to `development_local.py` (and adjust if needed)_
 
## Run locally
 
Cd into `multigence_server` and run backend with `python ./manage.py runserver`

## Generate answers command

To generate random answers for a questionary run the `generateanswers` admin command like this:

    python manage.py generateanswers <Questionary-UUID>

with `<Questionary.UUID>` being the uuid of an existing questionary. The command then creates users (randomly selecting departments of the company of the questionary) and generates answers for each user for each question in the questionary.

## Delete generated users

To delete generated users (in case you want to re-run `generateanswers` on a questionary) run:

    python manage.py deletetestuser


## Create a company (and optionally a manager)

To create a new company, run `createcompany` command and follow instructions. This tasks allows optionally to create a manager as well. One example:

    (venv)multigence-server$ python manage.py createcompany
    Company name: Google
    Default department: HR department
    Company created with uuid = f152ebdf-ca2f-49be-9f06-9877c72ac573
    Do you want to create a manager as well? If so, enter email address (return to skip): eric.schmidt@google.com
    password: 
    repeat password: 
    First name: Eric
    Last name: Schmidt
    Title: CEO
    Company manager created with uuid = d42251c1-f0b8-4d95-9e5e-99a13301a636



## Create a company manager

To create a new company manager, run `createmanager <COMPANY_UUID>` command and follow instructions. For example:

    (venv)multigence-server$ python manage.py createmanager fe01379e-7f57-43c8-94c3-745a2c7c4c6a
    Email address: manager@multigence.com
    password: 
    repeat password: 
    First name: Thomas
    Last name: Meier
    Title: PM Manager
    Company manager created

