from custodypy:latest

WORKDIR /app/custody_backend
ADD . /app/custody_backend

ENV PYTHONPATH "${PYTHONPATH}:/app/custody_backend"


CMD gunicorn --workers=4 -b 0.0.0.0:5002 custody.admin.autoapp:app
