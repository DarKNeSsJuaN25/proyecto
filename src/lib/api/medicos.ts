// src/lib/api/medicos.ts
export interface Medico {
  id?: number;
  nombre: string;
  apellido: string;
  especialidad: string;
}

// URL base de la API desde las variables de entorno
const API_URL = "http://p1-77815598.us-east-1.elb.amazonaws.com:3000";

// Obtener todos los médicos
export async function getMedicos(): Promise<Medico[]> {
  try {
    const response = await fetch(`${API_URL}/medicos`);
    if (!response.ok) {
      throw new Error('Error al obtener los médicos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    // Por ahora, devolvemos datos de ejemplo
    return mockMedicos;
  }
}

// Crear un nuevo médico
export async function createMedico(medico: Omit<Medico, 'id'>): Promise<Medico> {
  try {
    const response = await fetch(`${API_URL}/medico`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medico),
    });
    
    if (!response.ok) {
      throw new Error('Error al crear el médico');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    // Simulamos una respuesta
    return {
      id: Math.floor(Math.random() * 1000),
      ...medico
    };
  }
}

// Datos mock para desarrollo mientras no hay API
export const mockMedicos: Medico[] = [
  {
    id: 11,
    nombre: "Luis",
    apellido: "Pérez",
    especialidad: "Cardiología"
  },
  {
    id: 12,
    nombre: "Ana",
    apellido: "García",
    especialidad: "Pediatría"
  },
  {
    id: 13,
    nombre: "Carlos",
    apellido: "Martínez",
    especialidad: "Neurología"
  },
  {
    id: 14,
    nombre: "Elena",
    apellido: "Rodríguez",
    especialidad: "Dermatología"
  },
  {
    id: 15,
    nombre: "Javier",
    apellido: "López",
    especialidad: "Traumatología"
  }
];