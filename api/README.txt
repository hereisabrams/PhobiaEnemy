REQUISITOS:

* python3.x
* sqlite3 (provavelmente já vem instalado em linux)


INSTALAÇÃO - FAZER 1 VEZ:

No directório "api/":

$ pip install virtualenv

$ virtualenv venv

$ source venv/bin/activate

$ pip install -r requirements.txt

$ python3 manage.py runserver 0.0.0.0:8000


DAS OUTRAS VEZES:

$ source venv/bin/activate

$ python3 manage.py runserver 0.0.0.0:8000
