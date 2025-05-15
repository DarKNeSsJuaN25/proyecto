"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Alert, 
  AlertDescription 
} from "@/components/ui/alert";
import { Paciente } from "@/lib/api/pacientes";
import { getPacientes } from "@/lib/api/pacientes";
import { 
  Search, 
  Users, 
  Venus, 
  Mars, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw
} from "lucide-react";

const ITEMS_PER_PAGE = 10; // Cambiado a 10 para mejor experiencia de paginación

export default function PacientesPage() {
  // Estados principales
  const [allPacientes, setAllPacientes] = useState<Paciente[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchId, setSearchId] = useState("");
  const [filteredPaciente, setFilteredPaciente] = useState<Paciente | null>(null);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1); // Comienza en 1 para mejor UX
  const [totalPages, setTotalPages] = useState(1);

  // Cargar pacientes
  useEffect(() => {
    const loadPacientes = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getPacientes();
        setAllPacientes(data);
        setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
      } catch (error) {
        console.error("Error al cargar pacientes", error);
        setError("No se pudieron cargar los pacientes. Por favor, intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    loadPacientes();
  }, []);

  // Efecto para manejar la paginación
  useEffect(() => {
    // Si hay un paciente filtrado, no usar paginación
    if (filteredPaciente) {
      setPacientes([filteredPaciente]);
      return;
    }
    
    // Obtener pacientes para la página actual
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedPacientes = allPacientes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    
    setPacientes(paginatedPacientes);
  }, [allPacientes, currentPage, filteredPaciente]);

  // Manejar búsqueda
  const handleSearch = () => {
    if (!searchId.trim()) {
      // Si el campo está vacío, mostrar todos
      setFilteredPaciente(null);
      return;
    }
    
    const found = allPacientes.find((p) => p.id === Number(searchId)) || null;
    
    if (found) {
      setFilteredPaciente(found);
      // No es necesario actualizar la página porque useEffect ya manejará mostrar este paciente
    } else {
      setError(`No se encontró ningún paciente con ID: ${searchId}`);
      // Mantener la lista actual si no se encuentra
    }
  };

  // Manejar tecla Enter en la búsqueda
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchId("");
    setFilteredPaciente(null);
    setError(null);
  };

  // Navegación de paginación
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Formatear fecha de nacimiento
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Si no es una fecha válida, devolver el string original
      
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return dateString; // En caso de error, devolver el string original
    }
  };

  // Renderizar icono de sexo
  const renderSexoIcon = (sexo: string) => {
    if (sexo.toLowerCase() === "femenino") {
      return (
        <span className="font-semibold text-pink-600">F</span>
      );
    } else if (sexo.toLowerCase() === "masculino") {
      return (
        <span className="font-semibold text-blue-600">M</span>
      );
    }
    return sexo;
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
          <Users className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Pacientes</h1>
        </div>
        
        {/* Búsqueda */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Buscar paciente por ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 w-64"
            />
            <Button onClick={handleSearch} variant="secondary" className="ml-2">
              Buscar
            </Button>
          </div>
          
          {filteredPaciente && (
            <Button 
              variant="outline" 
              onClick={clearSearch}
              className="flex gap-1 items-center"
            >
              <RefreshCw className="h-4 w-4" />
              Ver todos
            </Button>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Aquí puedes ver los pacientes registrados en el sistema.
        {filteredPaciente 
          ? " Mostrando resultado de búsqueda." 
          : ` Mostrando página ${currentPage} de ${totalPages}.`}
      </p>

      {/* Tabla de Pacientes */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Nombre</TableHead>
              <TableHead className="font-semibold">DNI</TableHead>
              <TableHead className="font-semibold">Fecha Nacimiento</TableHead>
              <TableHead className="font-semibold">Sexo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Skeleton loading
              [...Array(ITEMS_PER_PAGE)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                </TableRow>
              ))
            ) : pacientes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No hay pacientes para mostrar
                </TableCell>
              </TableRow>
            ) : (
              pacientes.map((paciente) => (
                <TableRow key={paciente.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{paciente.id}</TableCell>
                  <TableCell>{paciente.nombre}</TableCell>
                  <TableCell>{paciente.dni}</TableCell>
                  <TableCell>{formatDate(paciente.fecha_nac)}</TableCell>
                  <TableCell>{renderSexoIcon(paciente.sexo)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      {!loading && !filteredPaciente && totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, allPacientes.length)} de {allPacientes.length} pacientes
          </div>
          <div className="flex gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => goToPage(1)} 
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => goToPage(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
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
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => goToPage(totalPages)} 
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}