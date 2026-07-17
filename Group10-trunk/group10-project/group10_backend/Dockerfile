FROM python:3.11

WORKDIR /app

COPY group10_backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN pip install gunicorn

COPY group10_backend .

#COPY group10_backend/entrypoint.sh /app/entrypoint.sh
#RUN chmod +x /app/entrypoint.sh

RUN python manage.py migrate && python manage.py seed

EXPOSE 8000
CMD ["gunicorn", "group10_backend.wsgi:application", "--bind", "0.0.0.0:8000"]