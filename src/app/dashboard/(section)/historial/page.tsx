"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { FileText, Search, Plus, Edit, Trash2, AlertTriangle } from "lucide-react";
import { 
  Alert, 
  AlertDescription 
} from "@/components/ui/alert";
import { Examen, getExamenes, getExamenPorId, actualizarExamen, eliminarExamen, crearExamen } from "@/lib/api/historial";

export default function ExamenesPage() {
  // Estados principales
  const [allExamenes, setAllExamenes] = useState<Examen[]>([]); // Almacena todos los exámenes
  const [examenes, setExamenes] = useState<Examen[]>([]); // Exámenes paginados
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  
  // Estados para diálogos y formularios
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Estado para el examen actual (para agregar/editar)
  const [currentExamen, setCurrentExamen] = useState<Partial<Examen>>({
    pacienteId: "",
    medicoId: "",
    tipoExamen: "",
    estado: "pendiente",
    fecha: new Date().toISOString(),
    resultado: {},
    comentarios: ""
  });
  
  // ID del examen seleccionado
  const [selectedExamenId, setSelectedExamenId] = useState<string | null>(null);

  // Cargar exámenes
  useEffect(() => {
    const cargarExamenes = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getExamenes(100); // Obtener más exámenes
        setAllExamenes(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (error) {
        console.error("Error al cargar exámenes", error);
        setError("No se pudieron cargar los exámenes. Por favor, intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    cargarExamenes();
  }, []);

  // Efecto para manejar la paginación
  useEffect(() => {
    // Obtener exámenes para la página actual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedExamenes = allExamenes.slice(startIndex, startIndex + itemsPerPage);
    
    setExamenes(paginatedExamenes);
  }, [allExamenes, currentPage]);

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentExamen((prev: Partial<Examen>) => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar búsqueda
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Resetear a primera página
  };

  // Manejar tecla Enter en la búsqueda
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      buscarExamenPorId();
    }
  };

  // Realizar búsqueda usando getExamenPorId
  const buscarExamenPorId = async () => {
    if (!searchTerm.trim()) {
      // Si el campo está vacío, mostrar todos los exámenes
      const data = await getExamenes(100);
      setAllExamenes(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const examen = await getExamenPorId(searchTerm.trim());
      
      if (examen) {
        // Si encuentra el examen, mostrar solo ese
        setAllExamenes([examen]);
        setTotalPages(1);
        setCurrentPage(1);
      } else {
        // Si no encuentra el examen, mostrar mensaje
        setAllExamenes([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error al buscar examen por ID", error);
      setError("No se pudo encontrar el examen con ese ID. Por favor, intente nuevamente.");
      setAllExamenes([]);
    } finally {
      setLoading(false);
    }
  };

  // Preparar creación de examen
  const prepararCreacion = () => {
    setCurrentExamen({
      pacienteId: "",
      medicoId: "",
      tipoExamen: "",
      estado: "pendiente",
      fecha: new Date().toISOString(),
      resultado: {},
      comentarios: ""
    });
    setIsAddDialogOpen(true);
  };

  // Preparar edición de examen
  const prepararEdicion = async (examen: Examen) => {
    try {
      // Obtener detalles completos del examen
      const examenCompleto = await getExamenPorId(examen.id);
      if (examenCompleto) {
        setCurrentExamen(examenCompleto);
        setSelectedExamenId(examen.id);
        setIsEditDialogOpen(true);
      }
    } catch (error) {
      console.error("Error al preparar edición", error);
      setError("No se pudo cargar el examen para editar. Por favor, intente nuevamente.");
    }
  };

  // Crear nuevo examen
  const handleCreateExamen = async () => {
    try {
      // Validar datos mínimos requeridos
      if (!currentExamen.pacienteId || !currentExamen.tipoExamen) {
        setError("Por favor complete los campos obligatorios: ID del paciente y tipo de examen");
        return;
      }
      
      // Preparar el examen para enviar
      const nuevoExamen = {
        pacienteId: currentExamen.pacienteId || "",
        medicoId: currentExamen.medicoId || "",
        tipoExamen: currentExamen.tipoExamen || "",
        fecha: currentExamen.fecha || new Date().toISOString(),
        estado: currentExamen.estado as 'completado' | 'cancelado' | 'pendiente' || 'pendiente',
        resultado: currentExamen.resultado || {},
        comentarios: currentExamen.comentarios || null
      };
      
      const examenCreado = await crearExamen(nuevoExamen);
      
      if (examenCreado) {
        // Actualizar lista de exámenes
        setAllExamenes(prev => [examenCreado, ...prev]);
        
        // Cerrar diálogo
        setIsAddDialogOpen(false);
        setCurrentExamen({});
        setError(null);
      }
    } catch (error) {
      console.error("Error al crear examen", error);
      setError("Error al crear el examen. Por favor, intente nuevamente.");
    }
  };

  // Actualizar examen
  const handleUpdateExamen = async () => {
    if (!selectedExamenId) return;

    try {
      // Validar datos mínimos requeridos
      if (!currentExamen.pacienteId || !currentExamen.tipoExamen) {
        setError("Por favor complete los campos obligatorios: ID del paciente y tipo de examen");
        return;
      }
      
      const examenActualizado = await actualizarExamen(selectedExamenId, currentExamen);
      
      if (examenActualizado) {
        // Actualizar lista de exámenes
        setAllExamenes(prev => 
          prev.map(e => e.id === selectedExamenId ? examenActualizado : e)
        );
        
        // Cerrar diálogo
        setIsEditDialogOpen(false);
        setSelectedExamenId(null);
        setCurrentExamen({});
        setError(null);
      }
    } catch (error) {
      console.error("Error al actualizar examen", error);
      setError("Error al actualizar el examen. Por favor, intente nuevamente.");
    }
  };

  // Preparar eliminación
  const prepararEliminacion = (examen: Examen) => {
    setSelectedExamenId(examen.id);
    setIsDeleteDialogOpen(true);
  };

  // Eliminar examen
  const handleDeleteExamen = async () => {
    if (!selectedExamenId) return;

    try {
      const eliminado = await eliminarExamen(selectedExamenId);
      
      if (eliminado) {
        // Actualizar lista de exámenes
        setAllExamenes(prev => 
          prev.filter(e => e.id !== selectedExamenId)
        );
        
        // Cerrar diálogo
        setIsDeleteDialogOpen(false);
        setSelectedExamenId(null);
        setError(null);
      }
    } catch (error) {
      console.error("Error al eliminar examen", error);
      setError("Error al eliminar el examen. Por favor, intente nuevamente.");
    }
  };

  // Navegación de paginación
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Mensajes de error */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Exámenes</h1>
        </div>
        
        {/* Búsqueda y añadir */}
        <div className="flex gap-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              value={searchTerm}
              onChange={handleSearch}
              onKeyPress={handleKeyPress}
              placeholder="Buscar examen por ID..." 
              className="pl-10 w-64"
            />
            <Button 
              variant="secondary" 
              className="ml-2"
              onClick={buscarExamenPorId}
            >
              Buscar
            </Button>
          </div>
          
          <Button onClick={prepararCreacion}>
            <Plus className="w-4 h-4 mr-2" /> Nuevo Examen
          </Button>
        </div>
      </div>

      {/* Tabla de Exámenes */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Paciente ID</th>
              <th className="p-3 text-left">Tipo Examen</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center p-4">Cargando...</td>
              </tr>
            ) : examenes.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  {searchTerm ? "No se encontró ningún examen con ese ID" : "No hay exámenes disponibles"}
                </td>
              </tr>
            ) : (
              examenes.map((examen) => (
                <tr key={examen.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{examen.id}</td>
                  <td className="p-3">{examen.pacienteId}</td>
                  <td className="p-3">{examen.tipoExamen}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      examen.estado === 'completado' ? 'bg-green-100 text-green-800' : 
                      examen.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {examen.estado === 'completado' ? 'Completado' : 
                       examen.estado === 'pendiente' ? 'Pendiente' : 
                       'Cancelado'}
                    </span>
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => prepararEdicion(examen)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => prepararEliminacion(examen)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Botón para restablecer búsqueda */}
      {searchTerm && (
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={async () => {
              setSearchTerm("");
              setLoading(true);
              try {
                const data = await getExamenes(100);
                setAllExamenes(data);
                setTotalPages(Math.ceil(data.length / itemsPerPage));
              } catch (error) {
                console.error("Error al cargar exámenes", error);
                setError("No se pudieron cargar los exámenes. Por favor, intente nuevamente.");
              } finally {
                setLoading(false);
              }
            }}
          >
            Mostrar todos los exámenes
          </Button>
        </div>
      )}

      {/* Paginación */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, allExamenes.length)} de {allExamenes.length} exámenes
          </div>
          <div className="flex gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => goToPage(1)} 
              disabled={currentPage === 1}
            >
              Primera
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => goToPage(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            
            {/* Números de página */}
            <div className="flex gap-1 mx-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Mostrar páginas alrededor de la actual
                let pageToShow;
                if (totalPages <= 5) {
                  pageToShow = i + 1;
                } else if (currentPage <= 3) {
                  pageToShow = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageToShow = totalPages - 4 + i;
                } else {
                  pageToShow = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageToShow}
                    variant={currentPage === pageToShow ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(pageToShow)}
                    className="w-8"
                  >
                    {pageToShow}
                  </Button>
                );
              })}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => goToPage(currentPage + 1)} 
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => goToPage(totalPages)} 
              disabled={currentPage === totalPages}
            >
              Última
            </Button>
          </div>
        </div>
      )}

      {/* Diálogo para Agregar Examen */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Examen</DialogTitle>
            <DialogDescription>Ingrese los detalles del nuevo examen</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paciente ID <span className="text-red-500">*</span>
              </label>
              <Input 
                name="pacienteId"
                value={currentExamen.pacienteId || ''} 
                onChange={handleInputChange} 
                placeholder="Ingrese ID del paciente"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Médico ID
              </label>
              <Input 
                name="medicoId"
                value={currentExamen.medicoId || ''} 
                onChange={handleInputChange} 
                placeholder="Ingrese ID del médico"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Examen <span className="text-red-500">*</span>
              </label>
              <Input 
                name="tipoExamen"
                value={currentExamen.tipoExamen || ''} 
                onChange={handleInputChange} 
                placeholder="Ej: Sangre, Orina, Rayos X"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select 
                name="estado"
                value={currentExamen.estado || 'pendiente'}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="pendiente">Pendiente</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comentarios
              </label>
              <Input 
                name="comentarios"
                value={currentExamen.comentarios || ''} 
                onChange={handleInputChange} 
                placeholder="Comentarios adicionales"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateExamen}>Crear Examen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Examen</DialogTitle>
            <DialogDescription>Modifique los detalles del examen</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paciente ID <span className="text-red-500">*</span>
              </label>
              <Input 
                name="pacienteId"
                value={currentExamen.pacienteId || ''} 
                onChange={handleInputChange} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Médico ID
              </label>
              <Input 
                name="medicoId"
                value={currentExamen.medicoId || ''} 
                onChange={handleInputChange} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Examen <span className="text-red-500">*</span>
              </label>
              <Input 
                name="tipoExamen"
                value={currentExamen.tipoExamen || ''} 
                onChange={handleInputChange} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select 
                name="estado"
                value={currentExamen.estado || 'pendiente'}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="pendiente">Pendiente</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comentarios
              </label>
              <Input 
                name="comentarios"
                value={currentExamen.comentarios || ''} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateExamen}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Eliminación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Eliminar Examen
            </DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar este examen? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-red-50 p-3 rounded-lg border border-red-200 my-2">
            <p className="text-sm text-red-800">
              Al eliminar este examen, se perderán todos los datos asociados y no podrán ser recuperados.
            </p>
          </div>
          
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteExamen}
            >
              Confirmar Eliminación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}