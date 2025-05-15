from flask import Flask, jsonify
import requests
from dotenv import load_dotenv
import os
from flasgger import Swagger, swag_from
from flask_cors import CORS
load_dotenv()

swagger_template = {
    "swagger": "2.0",
    "info": {
        "title": "API del Orquestador - MV1",
        "version": "1.0",
        "description": "API para gestionar pacientes y medicos"
    },
}
app = Flask(__name__)
CORS(app=app)
Swagger(app,template=swagger_template)

PACIENTES_API_URL = os.getenv('PACIENTES_API_URL', 'http://pacientes:5000')
CONSULTAS_API_URL = os.getenv('CONSULTAS_API_URL', 'http://consultas-medicas:3000')


@app.route('/resumen/paciente/<int:paciente_id>', methods=['GET'])
@swag_from({
    'tags': ['Orquestador'],
    'parameters': [
        {
            'name': 'paciente_id',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'ID del paciente'
        }
    ],
    'responses': {
        200: {
            'description': 'Resumen del paciente incluyendo contactos y consultas'
        },
        404: {
            'description': 'Paciente no encontrado'
        },
        500: {
            'description': 'Error interno del servidor'
        }
    }
})
def resumen_paciente(paciente_id):
    try:
        paciente_resp = requests.get(f'{PACIENTES_API_URL}/pacientes/{paciente_id}')
        if paciente_resp.status_code != 200:
            return jsonify({'error': 'Paciente no encontrado'}), 404
        paciente = paciente_resp.json()

        contactos_resp = requests.get(f'{PACIENTES_API_URL}/pacientes/{paciente_id}/contacto')
        contactos = contactos_resp.json() if contactos_resp.status_code == 200 else []

        consultas_resp = requests.get(f'{CONSULTAS_API_URL}/consultas/paciente/{paciente_id}')
        consultas = consultas_resp.json() if consultas_resp.status_code == 200 else []
        return jsonify({
            'paciente': paciente,
            'contactos': contactos,
            'consultas': consultas
        }), 200
    except Exception as e:
        print('Error:', e)
        return jsonify({'error': 'Error interno'}), 500


@app.route('/resumen/medico/<int:medico_id>', methods=['GET'])
@swag_from({
    'tags': ['Orquestador'],
    'parameters': [
        {
            'name': 'medico_id',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'ID del médico'
        }
    ],
    'responses': {
        200: {
            'description': 'Resumen del médico con sus consultas'
        },
        404: {
            'description': 'Médico no encontrado'
        },
        500: {
            'description': 'Error interno del servidor'
        }
    }
})
def resumen_medico(medico_id):
    try:
        medico_resp = requests.get(f'{CONSULTAS_API_URL}/medico/{medico_id}')
        if medico_resp.status_code != 200:
            return jsonify({'error': 'Médico no encontrado'}), 404
        medico = medico_resp.json()

        consultas_resp = requests.get(f'{CONSULTAS_API_URL}/consultas/medico/{medico_id}')
        consultas = consultas_resp.json() if consultas_resp.status_code == 200 else []

        return jsonify({
            'medico': medico,
            'consultas': consultas
        }), 200
    except Exception as e:
        print('Error:', e)
        return jsonify({'error': 'Error interno'}), 500


@app.route('/', methods=['GET'])
@swag_from({
    'tags': ['Root'],
    'responses': {
        200: {
            'description': 'Microservicio Orquestador activo'
        }
    }
})
def index():
    return jsonify({'message': 'Microservicio Orquestador'}), 200


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)
