// src/lib/api/orquestador.ts

// URL base de la API
const API_URL = "http://p1-77815598.us-east-1.elb.amazonaws.com:5002";
// Interfaz genérica para los resúmenes
interface Resumen {
  id: number;
  [key: string]: any; // Permite campos adicionales flexibles
}

// Función genérica para obtener resumen de médico
export async function obtenerResumenMedico(medicoId: number): Promise<Resumen | null> {
  try {
    const response = await fetch(`${API_URL}/resumen/medico/${medicoId}`);
    
    if (!response.ok) {
      throw new Error(`Error al obtener resumen de médico (${response.status})`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en obtenerResumenMedico:', error);
    return null;
  }
}

// Función genérica para obtener resumen de paciente
export async function obtenerResumenPaciente(pacienteId: number): Promise<Resumen | null> {
  try {
    const response = await fetch(`${API_URL}/resumen/paciente/${pacienteId}`);
    
    if (!response.ok) {
      throw new Error(`Error al obtener resumen de paciente (${response.status})`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en obtenerResumenPaciente:', error);
    return null;
  }
}

// Función de orquestación para obtener múltiples resúmenes
export async function orquestarResumenes(
  tipo: 'medico' | 'paciente', 
  ids: number[]
): Promise<Resumen[]> {
  try {
    // Selector de función basado en el tipo
    const obtenerResumen = tipo === 'medico' 
      ? obtenerResumenMedico 
      : obtenerResumenPaciente;

    // Obtener resúmenes de forma concurrente
    const resumenes = await Promise.all(
      ids.map(async (id) => {
        const resumen = await obtenerResumen(id);
        return resumen;
      })
    );

    // Filtrar resultados nulos
    return resumenes.filter((resumen): resumen is Resumen => resumen !== null);
  } catch (error) {
    console.error(`Error en orquestación de resúmenes (${tipo}):`, error);
    return [];
  }
}

// Ejemplo de uso
async function ejemploOrquestacion() {
  try {
    // Obtener resumen de médico con ID 1
    const resumenMedico = await obtenerResumenMedico(1);
    console.log('Resumen de médico:', resumenMedico);

    // Obtener resumen de paciente con ID 2
    const resumenPaciente = await obtenerResumenPaciente(2);
    console.log('Resumen de paciente:', resumenPaciente);

    // Obtener múltiples resúmenes de médicos
    const resumenesMedicos = await orquestarResumenes('medico', [1, 2, 3]);
    console.log('Resúmenes de médicos:', resumenesMedicos);
  } catch (error) {
    console.error('Error en ejemplo de orquestación:', error);
  }
}

// Exportar funciones
export {
  ejemploOrquestacion
};