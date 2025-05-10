FROM python:3.9-slim
WORKDIR /pacientes-api
COPY . /pacientes-api/
COPY .env /pacientes-api/
COPY wait-for-it.sh /pacientes-api/

RUN pip install --no-cache-dir -r requirements.txt
CMD ["./wait-for-it.sh", "mysql-db:3306", "--", "python", "main.py"]
