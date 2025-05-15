// src/lib/api/historial.ts

// Interfaz para el resultado del examen (genérico para manejar diferentes tipos)
interface ResultadoExamen {
  [key: string]: string;
}

// Interfaz para el modelo de Examen
export interface Examen {
  id: string;
  pacienteId: string;
  medicoId: string;
  tipoExamen: string;
  fecha: string;
  estado: 'completado' | 'cancelado' | 'pendiente';
  resultado: ResultadoExamen;
  comentarios?: string | null;
}

// URL base de la API
const API_URL = "http://p1-77815598.us-east-1.elb.amazonaws.com:8080";

// Obtener todos los exámenes
export async function getExamenes(limite: number = 50): Promise<Examen[]> {
  try {
    const response = await fetch(`${API_URL}/api/examenes`);
    if (!response.ok) {
      throw new Error('Error al obtener los exámenes');
    }
    const data = await response.json();
    // Limitar el número de exámenes devueltos
    return data.slice(0, limite);
  } catch (error) {
    console.error('Error:', error);
    // Devolver datos mock si hay un error
    return mockExamenes.slice(0, limite);
  }
}

// Obtener un examen por ID
export async function getExamenPorId(id: string): Promise<Examen | null> {
  try {
    const response = await fetch(`${API_URL}/api/examenes/${id}`);
    if (!response.ok) {
      throw new Error(`Error al obtener el examen con ID ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    // Buscar en los datos mock si hay un error
    return mockExamenes.find(examen => examen.id === id) || null;
  }
}

// Actualizar un examen
export async function actualizarExamen(id: string, examenActualizado: Partial<Examen>): Promise<Examen | null> {
  try {
    const response = await fetch(`${API_URL}/api/examenes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(examenActualizado),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar el examen con ID ${id}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    // Simular actualización en datos mock
    const index = mockExamenes.findIndex(examen => examen.id === id);
    if (index !== -1) {
      mockExamenes[index] = { ...mockExamenes[index], ...examenActualizado };
      return mockExamenes[index];
    }
    return null;
  }
}

// Eliminar un examen
export async function eliminarExamen(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/examenes/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar el examen con ID ${id}`);
    }

    return true;
  } catch (error) {
    console.error('Error:', error);
    // Simular eliminación en datos mock
    const index = mockExamenes.findIndex(examen => examen.id === id);
    if (index !== -1) {
      mockExamenes.splice(index, 1);
    }
    return false;
  }
}

// Crear un nuevo examen
export async function crearExamen(nuevoExamen: Omit<Examen, 'id'>): Promise<Examen> {
  try {
    const response = await fetch(`${API_URL}/api/examenes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoExamen),
    });

    if (!response.ok) {
      throw new Error('Error al crear el examen');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    // Simular creación con datos mock
    const examenConId = {
      id: `mock-${Date.now()}`,
      ...nuevoExamen
    };
    mockExamenes.push(examenConId);
    return examenConId;
  }
}

// Datos mock para desarrollo y manejo de errores
export const mockExamenes: Examen[] = [
  {
    id: "6823df56ead11ad8ce0f1164",
    pacienteId: "52506561",
    medicoId: "3",
    tipoExamen: "Sangre",
    fecha: "2025-05-14T00:09:58.979143",
    estado: "cancelado",
    resultado: {
      "Hemoglobina": "17.0 g/dL",
      "Glóbulos blancos": "4082 /µL",
      "Plaquetas": "377694 /µL"
    },
    comentarios: "Observación general del examen 1"
  },
  {
    id: "6823df57ead11ad8ce0f1165",
    pacienteId: "88135756",
    medicoId: "29",
    tipoExamen: "Orina",
    fecha: "2025-05-14T00:09:59.068227",
    estado: "completado",
    resultado: {
      "Color": "Ámbar",
      "Proteínas": "Negativo",
      "Glucosa": "Positivo"
    },
    comentarios: "Observación general del examen 2"
  },
  {
    id: "6823df57ead11ad8ce0f1166",
    pacienteId: "97243678",
    medicoId: "30",
    tipoExamen: "Sangre",
    fecha: "2025-05-14T00:09:59.06921",
    estado: "completado",
    resultado: {
      "Hemoglobina": "16.1 g/dL",
      "Glóbulos blancos": "5648 /µL",
      "Plaquetas": "188353 /µL"
    },
    comentarios: "Observación general del examen 3"
  }
];