FROM python:3.11-slim

WORKDIR /app

COPY ./app /app/app
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
# docker build --no-cache -t words-exercise:latest
# docker run -d --name words-exercise --env-file .env -p 8000:8000 --net host words-exercise:latest
# uvicorn app.main:app --host 0.0.0.0 --port 5000 --reload