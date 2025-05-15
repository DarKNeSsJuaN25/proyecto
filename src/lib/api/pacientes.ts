// src/lib/api/pacientes.ts

export interface Paciente {
  id?: number;
  nombre: string;
  dni: string;
  fecha_nac: string; // formato YYYY-MM-DD
  sexo: "M" | "F";
}

// URL base de la API desde las variables de entorno o directamente
const API_URL = "http://p1-77815598.us-east-1.elb.amazonaws.com:5000";

// Obtener todos los pacientes
export async function getPacientes(): Promise<Paciente[]> {
  try {
    const response = await fetch(`${API_URL}/pacientes`);
    if (!response.ok) {
      throw new Error('Error al obtener los pacientes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return mockPacientes; // Datos mock si falla la API
  }
}

// Crear un nuevo paciente
export async function createPaciente(paciente: Omit<Paciente, "id">): Promise<Paciente> {
  try {
    const response = await fetch(`${API_URL}/pacientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paciente),
    });

    if (!response.ok) {
      throw new Error('Error al crear el paciente');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return {
      id: Math.floor(Math.random() * 1000),
      ...paciente
    };
  }
}

// Datos mock para desarrollo local si no hay conexión a la API
export const mockPacientes: Paciente[] = [
  {
    id: 1,
    nombre: "María",
    dni: "12345678",
    fecha_nac: "1985-04-23",
    sexo: "F"
  },
  {
    id: 2,
    nombre: "José",
    dni: "87654321",
    fecha_nac: "1979-11-05",
    sexo: "M"
  }
];
