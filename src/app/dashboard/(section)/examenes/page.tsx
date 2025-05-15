"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Alert,
  AlertDescription 
} from "@/components/ui/alert";
import { 
  Search, 
  Users, 
  User, 
  FileText, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight 
} from "lucide-react";

import { 
  ConsultaMedico,
  ConsultaPaciente,
  ResumenMedico,
  ResumenPaciente,
  TipoBusqueda,
  Resumen,
  Consulta,
  formatearFecha,
  obtenerResumen
} from "@/lib/api/examenes";

export default function ResumenPage() {
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [tipoBusqueda, setTipoBusqueda] = useState<TipoBusqueda>('medico');
  const [error, setError] = useState<string | null>(null);

  // Manejar tecla Enter en el campo de búsqueda
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return;

    setLoading(true);
    setResumen(null);
    setError(null);

    try {
      const resultado = await obtenerResumen(tipoBusqueda, Number(searchId));
      if (resultado) {
        setResumen(resultado);
      } else {
        setError(`No se encontró el ${tipoBusqueda} con el ID proporcionado`);
      }
    } catch (error) {
      console.error("Error en búsqueda", error);
      setError(`Ocurrió un error al buscar el ${tipoBusqueda}`);
    } finally {
      setLoading(false);
    }
  };

  // Manejar paginación de consultas
  const [paginaActual, setPaginaActual] = useState(0);
  const TAMANIO_PAGINA = 5;

  const consultas = resumen ? resumen.consultas : [];
  const consultasPaginadas = consultas.slice(
    paginaActual * TAMANIO_PAGINA,
    (paginaActual + 1) * TAMANIO_PAGINA
  );

  const totalPaginas = Math.ceil(consultas.length / TAMANIO_PAGINA);

  // Función para obtener etiqueta de persona en la tabla de consultas
  const obtenerEtiquetaPersona = (consulta: Consulta, tipo: TipoBusqueda) => {
    if (tipo === 'medico') {
      // Para resumen de médico, usa paciente_nombre si existe
      const consultaMedico = consulta as ConsultaMedico;
      return consultaMedico.paciente_nombre 
        ? `${consultaMedico.paciente_nombre} (ID: ${consultaMedico.paciente_id})`
        : `ID: ${consultaMedico.paciente_id}`;
    } else {
      // Para resumen de paciente, usa nombre_medico
      const consultaPaciente = consulta as ConsultaPaciente;
      return consultaPaciente.nombre_medico;
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {tipoBusqueda === 'medico' ? 
            <Users className="w-6 h-6 text-primary" /> : 
            <FileText className="w-6 h-6 text-primary" />
          }
          <h1 className="text-2xl font-bold">
            Resumen de {tipoBusqueda === 'medico' ? 'Médico' : 'Paciente'}
          </h1>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-2">
        Busca el resumen de un {tipoBusqueda === 'medico' ? 'médico' : 'paciente'} por su ID.
      </p>

      {/* Selector de tipo y búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Selector de tipo de búsqueda */}
        <div className="flex gap-2">
          <Button 
            variant={tipoBusqueda === 'medico' ? 'default' : 'outline'}
            onClick={() => {
              setTipoBusqueda('medico');
              setResumen(null);
              setError(null);
            }}
            className="flex gap-2 items-center"
          >
            <Users className="w-4 h-4" />
            Médico
          </Button>
          <Button 
            variant={tipoBusqueda === 'paciente' ? 'default' : 'outline'}
            onClick={() => {
              setTipoBusqueda('paciente');
              setResumen(null);
              setError(null);
            }}
            className="flex gap-2 items-center"
          >
            <User className="w-4 h-4" />
            Paciente
          </Button>
        </div>

        {/* Búsqueda */}
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <div className="relative flex flex-1 sm:flex-initial items-center">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={`Buscar ${tipoBusqueda === 'medico' ? 'médico' : 'paciente'} por ID`}
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 w-full sm:w-64"
              type="number"
              min="1"
            />
          </div>
          <Button onClick={handleSearch} variant="default">
            Buscar
          </Button>
        </div>
      </div>

      {/* Manejo de errores */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="mt-6 space-y-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
          ))}
        </div>
      ) : resumen && (
        <div className="mt-6 space-y-6">
          {/* Tarjeta de Información */}
          <div className="bg-background border rounded-lg p-6 flex flex-col sm:flex-row items-center gap-6">
            {/* Imagen de usuario por defecto */}
            <div className="bg-gray-100 rounded-full p-4 mb-4 sm:mb-0">
              <User className="w-20 h-20 text-gray-500" />
            </div>
            
            {/* Detalles */}
            <div>
              {tipoBusqueda === 'medico' ? (
                // Información de Médico
                <MedicoInfo 
                  medico={(resumen as ResumenMedico).medico} 
                />
              ) : (
                // Información de Paciente
                <PacienteInfo 
                  paciente={(resumen as ResumenPaciente).paciente} 
                />
              )}
            </div>
          </div>

          {/* Tabla de Consultas */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Historial de Consultas</h3>
            
            {consultas.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left">Fecha</th>
                      {tipoBusqueda === 'medico' ? (
                        <th className="p-3 text-left">Paciente</th>
                      ) : (
                        <th className="p-3 text-left">Médico</th>
                      )}
                      <th className="p-3 text-left">Descripción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consultasPaginadas.map((consulta, index) => (
                      <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="p-3">{formatearFecha(consulta.fecha)}</td>
                        <td className="p-3">
                          {obtenerEtiquetaPersona(consulta, tipoBusqueda)}
                        </td>
                        <td className="p-3">{consulta.descripcion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg bg-gray-50">
                <p className="text-muted-foreground">No hay consultas registradas.</p>
              </div>
            )}

            {/* Controles de Paginación */}
            {consultas.length > 0 && totalPaginas > 1 && (
              <div className="flex justify-between items-center mt-4">
                <Button 
                  onClick={() => setPaginaActual(p => Math.max(0, p - 1))}
                  disabled={paginaActual === 0}
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" /> Anterior
                </Button>
                <span className="text-sm text-muted-foreground">
                  Página {paginaActual + 1} de {totalPaginas}
                </span>
                <Button 
                  onClick={() => setPaginaActual(p => 
                    p + 1 < totalPaginas ? p + 1 : p
                  )}
                  disabled={paginaActual >= totalPaginas - 1}
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  Siguiente <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para información de Médico
function MedicoInfo({ medico }: { medico?: ResumenMedico['medico'] }) {
  if (!medico) return null;

  return (
    <>
      <h2 className="text-3xl font-bold mb-2 text-center sm:text-left">
        {medico.nombre} {medico.apellido || ''}
      </h2>
      <div className="space-y-2">
        <p className="text-lg">
          <span className="text-muted-foreground">ID:</span> {medico.id}
        </p>
        <p className="text-lg">
          <span className="text-muted-foreground">Especialidad:</span> {medico.especialidad}
        </p>
      </div>
    </>
  );
}

// Componente para información de Paciente
function PacienteInfo({ paciente }: { paciente?: ResumenPaciente['paciente'] }) {
  if (!paciente) return null;

  return (
    <>
      <h2 className="text-3xl font-bold mb-2 text-center sm:text-left">
        {paciente.nombre}
      </h2>
      <div className="space-y-2">
        <p className="text-lg">
          <span className="text-muted-foreground">ID:</span> {paciente.id}
        </p>
        <p className="text-lg">
          <span className="text-muted-foreground">DNI:</span> {paciente.dni}
        </p>
        <p className="text-lg">
          <span className="text-muted-foreground">Fecha Nacimiento:</span> {formatearFecha(paciente.fecha_nac)}
        </p>
        <p className="text-lg">
          <span className="text-muted-foreground">Sexo:</span> {paciente.sexo}
        </p>
      </div>
    </>
  );
}