// src/lib/api/resumen.ts

// Interfaz para consulta de médico
export interface ConsultaMedico {
  descripcion: string;
  fecha: string;
  paciente_id: number;
  paciente_nombre?: string;
  nombre_medico?: string;
}

// Interfaz para consulta de paciente
export interface ConsultaPaciente {
  descripcion: string;
  fecha: string;
  nombre_medico: string;
  paciente_id: number;
}

// Interfaz para el resumen de médico
export interface ResumenMedico {
  medico?: {
    id: number;
    nombre: string;
    apellido?: string;
    especialidad: string;
  };
  consultas: ConsultaMedico[];
}

// Interfaz para el resumen de paciente
export interface ResumenPaciente {
  paciente?: {
    id: number;
    nombre: string;
    dni: string;
    fecha_nac: string;
    sexo: string;
  };
  consultas: ConsultaPaciente[];
  contactos?: any[];
}

// Tipo de búsqueda
export type TipoBusqueda = 'medico' | 'paciente';

// Tipo union para resumen
export type Resumen = ResumenMedico | ResumenPaciente;

// Tipo union para consultas
export type Consulta = ConsultaMedico | ConsultaPaciente;

// URL base de la API
const API_URL = "http://p1-77815598.us-east-1.elb.amazonaws.com:5002";

// Función para formatear fecha
export const formatearFecha = (fechaISO: string): string => {
  try {
    return new Date(fechaISO).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error("Error al formatear fecha:", error);
    return fechaISO; // Devolver el string original si hay error
  }
};

// Función para obtener resumen
export async function obtenerResumen(
  tipo: TipoBusqueda, 
  id: number
): Promise<Resumen | null> {
  try {
    // Primero intentamos obtener desde la API
    const response = await fetch(`${API_URL}/resumen/${tipo}/${id}`);
    
    // Si la respuesta es exitosa, devolvemos los datos
    if (response.ok) {
      return await response.json();
    }
    
    // Si hay un error pero estamos en desarrollo, usamos datos mock
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Usando datos mock para ${tipo} con ID ${id}`);
      
      // Para propósitos de demostración, si el ID es 1, devolvemos datos mock
      if (id === 1) {
        if (tipo === 'medico') {
          console.log("Devolviendo mock de médico");
          return {...mockResumenMedico};
        } else {
          console.log("Devolviendo mock de paciente");
          return {...mockResumenPaciente};
        }
      }
    }
    
    // Si llegamos aquí, no pudimos obtener los datos y no hay mock aplicable
    throw new Error(`Error al obtener resumen de ${tipo} (${response.status})`);
  } catch (error) {
    console.error(`Error en obtenerResumen de ${tipo}:`, error);
    
    // En desarrollo, ofrecemos datos mock como fallback para testing
    if (process.env.NODE_ENV === 'development' && id === 1) {
      console.warn(`Fallback a datos mock para ${tipo} con ID 1`);
      return tipo === 'medico' ? {...mockResumenMedico} : {...mockResumenPaciente};
    }
    
    return null;
  }
}

// Datos mock para desarrollo y pruebas
export const mockResumenMedico: ResumenMedico = {
  medico: {
    id: 1,
    nombre: "Victor",
    apellido: "Gutierrez",
    especialidad: "Cardiología"
  },
  consultas: [
    {
      descripcion: "Consulta de rutina, presión arterial elevada.",
      fecha: "2025-04-15T10:30:00Z",
      paciente_id: 101,
      paciente_nombre: "María López"
    },
    {
      descripcion: "Evaluación post-operatoria, evolución favorable.",
      fecha: "2025-04-10T15:45:00Z",
      paciente_id: 102,
      paciente_nombre: "Carlos Ruiz"
    },
    {
      descripcion: "Primera consulta, dolor en el pecho al ejercitarse.",
      fecha: "2025-04-08T09:15:00Z",
      paciente_id: 103,
      paciente_nombre: "Ana Gómez"
    }
  ]
};

export const mockResumenPaciente: ResumenPaciente = {
  paciente: {
    id: 101,
    nombre: "María López",
    dni: "12345678",
    fecha_nac: "1985-06-12T00:00:00Z",
    sexo: "Femenino"
  },
  consultas: [
    {
      descripcion: "Consulta de rutina, presión arterial elevada.",
      fecha: "2025-04-15T10:30:00Z",
      nombre_medico: "Dr. Juan Pérez",
      paciente_id: 101
    },
    {
      descripcion: "Análisis de sangre anual.",
      fecha: "2025-03-22T11:00:00Z",
      nombre_medico: "Dra. Laura Sánchez",
      paciente_id: 101
    },
    {
      descripcion: "Vacunación contra la gripe.",
      fecha: "2025-02-05T14:30:00Z",
      nombre_medico: "Dr. Roberto Díaz",
      paciente_id: 101
    }
  ]
};