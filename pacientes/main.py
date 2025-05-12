from flask import Flask, request, jsonify
from flasgger import Swagger, swag_from
import mysql.connector
from dotenv import load_dotenv
import os

app = Flask(__name__)
Swagger(app)  # Swagger habilitado

load_dotenv()

DB_HOST = os.getenv('DB_HOST')
DB_USER = os.getenv('MYSQL_USER')
DB_PASSWORD = os.getenv('MYSQL_PASSWORD')
DB_NAME = os.getenv('MYSQL_DATABASE')
DB_PORT = os.getenv('MYSQL_PORT')


def db_connection():
    try:
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            port=DB_PORT,
            database=DB_NAME
        )
        return conn
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None


def create_database():
    conn = mysql.connector.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD
    )
    cursor = conn.cursor()
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
    conn.commit()
    cursor.close()
    conn.close()


def create_tables():
    conn = db_connection()
    if conn is None:
        print("No se pudo conectar a la base de datos.")
        return

    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS pacientes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100),
        dni VARCHAR(20),
        fecha_nac DATE,
        sexo VARCHAR(1)
    )
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS contactos_pacientes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        paciente_id INT,
        telefono VARCHAR(15),
        direccion VARCHAR(255),
        FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
    )
    """)
    conn.commit()
    cursor.close()
    conn.close()


@app.route('/pacientes', methods=['POST'])
@swag_from({
    'tags': ['Pacientes'],
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'nombre': {'type': 'string'},
                    'dni': {'type': 'string'},
                    'fecha_nac': {'type': 'string', 'format': 'date'},
                    'sexo': {'type': 'string', 'enum': ['M', 'F']}
                },
                'required': ['nombre', 'dni', 'fecha_nac', 'sexo']
            }
        }
    ],
    'responses': {
        201: {'description': 'Paciente creado exitosamente'},
        400: {'description': 'Faltan datos'},
        500: {'description': 'Error de conexión con la base de datos'}
    }
})
def add_paciente():
    data = request.get_json()

    if not all(k in data for k in ('nombre', 'dni', 'fecha_nac', 'sexo')):
        return jsonify({'error': 'Faltan datos'}), 400

    conn = db_connection()
    if conn is None:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500

    cursor = conn.cursor()
    sql = "INSERT INTO pacientes (nombre, dni, fecha_nac, sexo) VALUES (%s, %s, %s, %s)"
    values = (data['nombre'], data['dni'], data['fecha_nac'], data['sexo'])
    cursor.execute(sql, values)
    conn.commit()

    paciente_id = cursor.lastrowid
    cursor.close()
    conn.close()

    return jsonify({'id': paciente_id}), 201


@app.route('/pacientes/<int:id>', methods=['GET'])
@swag_from({
    'tags': ['Pacientes'],
    'parameters': [
        {
            'name': 'id',
            'in': 'path',
            'type': 'integer',
            'required': True
        }
    ],
    'responses': {
        200: {'description': 'Paciente encontrado'},
        404: {'description': 'Paciente no encontrado'},
        500: {'description': 'Error de conexión con la base de datos'}
    }
})
def get_paciente(id):
    conn = db_connection()
    if conn is None:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM pacientes WHERE id = %s", (id,))
    paciente = cursor.fetchone()
    cursor.close()
    conn.close()

    if paciente:
        return jsonify(paciente), 200
    else:
        return jsonify({'error': 'Paciente no encontrado'}), 404

@app.route('/pacientes/contacto', methods=['POST'])
@swag_from({
    'tags': ['Contactos'],
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'id': {'type': 'integer'},
                    'telefono': {'type': 'string'},
                    'direccion': {'type': 'string'}
                },
                'required': ['id', 'telefono', 'direccion']
            }
        }
    ],
    'responses': {
        201: {'description': 'Contacto creado exitosamente'},
        400: {'description': 'Faltan datos'},
        404: {'description': 'Paciente no encontrado'},
        500: {'description': 'Error en la base de datos'}
    }
})
def add_contacto():
    data = request.get_json()

    if not all(k in data for k in ('id', 'telefono', 'direccion')):
        return jsonify({'error': 'Faltan datos'}), 400

    conn = db_connection()
    if conn is None:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500

    cursor = conn.cursor()

    # Verificar que el paciente exista
    cursor.execute("SELECT id FROM pacientes WHERE id = %s", (data['id'],))
    if cursor.fetchone() is None:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Paciente no encontrado'}), 404

    sql = "INSERT INTO contactos_pacientes (paciente_id, telefono, direccion) VALUES (%s, %s, %s)"
    values = (data['id'], data['telefono'], data['direccion'])
    cursor.execute(sql, values)
    conn.commit()

    contacto_id = cursor.lastrowid
    cursor.close()
    conn.close()

    return jsonify({'id': contacto_id}), 201

@app.route('/pacientes/<int:id>/contacto', methods=['GET'])
@swag_from({
    'tags': ['Contactos'],
    'parameters': [
        {
            'name': 'id',
            'in': 'path',
            'type': 'integer',
            'required': True
        }
    ],
    'responses': {
        200: {'description': 'Lista de contactos'},
        404: {'description': 'Paciente no encontrado o sin contactos'},
        500: {'description': 'Error en la base de datos'}
    }
})
def get_contactos(id):
    conn = db_connection()
    if conn is None:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500

    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM contactos_pacientes WHERE paciente_id = %s", (id,))
    contactos = cursor.fetchall()
    cursor.close()
    conn.close()

    if contactos:
        return jsonify(contactos), 200
    else:
        return jsonify({'error': 'No se encontraron contactos para el paciente'}), 404
@app.route('/pacientes', methods=['GET'])
@swag_from({
    'tags': ['Pacientes'],
    'responses': {
        200: {'description': 'Lista de pacientes'},
        500: {'description': 'Error en la base de datos'}
    }
})
def get_all_pacientes():
    conn = db_connection()
    if conn is None:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM pacientes")
    pacientes = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(pacientes), 200


@app.route('/contactos', methods=['GET'])
@swag_from({
    'tags': ['Contactos'],
    'responses': {
        200: {'description': 'Lista de contactos'},
        500: {'description': 'Error en la base de datos'}
    }
})
def get_all_contactos():
    conn = db_connection()
    if conn is None:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM contactos_pacientes")
    contactos = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(contactos), 200



@app.route('/', methods=['GET'])
def index():
    return jsonify({'message': 'API de Pacientes'}), 200


if __name__ == '__main__':
    create_database()
    create_tables()
    app.run(debug=True, port=5000, host='0.0.0.0')
