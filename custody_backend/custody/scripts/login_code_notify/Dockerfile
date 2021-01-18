from custodypy:latest

WORKDIR /app/custody
ADD . /app/custody

ENV PYTHONPATH "${PYTHONPATH}:/app/custody"

CMD python3 custody/scripts/login_code_notify/main.py
