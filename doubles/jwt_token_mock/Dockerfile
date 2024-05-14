FROM python:3.12-slim

# Configure files and directories
WORKDIR /app

RUN apt-get update --yes && \
    apt-get install --yes \
      build-essential \
      curl

ENV POETRY_HOME="/opt/poetry"

ENV PATH="$POETRY_HOME/bin:$PATH"

RUN curl -sSL https://install.python-poetry.org | python3 -

COPY . .

RUN poetry config virtualenvs.create false && \
    poetry install --no-root

CMD python3 main.py