import os
from .base import *

DATABASES["default"]["ENGINE"] = "django.db.backends.postgresql_psycopg2"
DATABASES["default"]["NAME"] = "multigence3"
DATABASES["default"]["HOST"] = os.getenv("POSTGRES_PORT_5432_TCP_ADDR", "localhost")
DATABASES["default"]["PORT"] = os.getenv("POSTGRES_PORT_5432_TCP_PORT", 5432)

DATABASES["default"]["USER"] = os.getenv("POSTGRES_USER", "postgres")
DATABASES["default"]["PASSWORD"] = os.getenv("POSTGRES_PASSWORD", "abcd1234")


CORS_ORIGIN_ALLOW_ALL = True

try:
    from .development_local import *
except ImportError:
    pass
