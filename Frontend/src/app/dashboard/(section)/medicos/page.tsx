"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Users, Search, Plus } from "lucide-react";
import { Medico, getMedicos, createMedico } from "@/lib/api/medicos";

export default function MedicosPage() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMedicos, setFilteredMedicos] = useState<Medico[]>([]);
  const [nuevoMedico, setNuevoMedico] = useState<Omit<Medico, 'id'>>({
    nombre: "",
    apellido: "",
    especialidad: ""
  });

  // Cargar médicos
  useEffect(() => {
    const cargarMedicos = async () => {
      try {
        const data = await getMedicos();
        setMedicos(data);
        setFilteredMedicos(data);
      } catch (error) {
        console.error("Error al cargar médicos", error);
      } finally {
        setLoading(false);
      }
    };

    cargarMedicos();
  }, []);

  // Filtrar médicos
  useEffect(() => {
    const filtered = medicos.filter(medico => 
      medico.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medico.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medico.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMedicos(filtered);
  }, [searchTerm, medicos]);

  // Manejar cambios en el formulario de nuevo médico
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoMedico(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Agregar nuevo médico
  const handleAgregarMedico = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const medicoCreado = await createMedico(nuevoMedico);
      setMedicos(prev => [...prev, medicoCreado]);
      // Resetear formulario
      setNuevoMedico({
        nombre: "",
        apellido: "",
        especialidad: ""
      });
      // Cerrar diálogo (esto requeriría manejar el estado del diálogo)
    } catch (error) {
      console.error("Error al crear médico", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 p-4">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Médicos</h1>
        </div>
        
        {/* Botón Agregar Médico */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">
              <Plus className="w-4 h-4 mr-2" /> Agregar Médico
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Médico</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAgregarMedico} className="space-y-4">
              <div>
                <label htmlFor="nombre" className="block mb-2">Nombre</label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={nuevoMedico.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="apellido" className="block mb-2">Apellido</label>
                <Input
                  id="apellido"
                  name="apellido"
                  value={nuevoMedico.apellido}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="especialidad" className="block mb-2">Especialidad</label>
                <Input
                  id="especialidad"
                  name="especialidad"
                  value={nuevoMedico.especialidad}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="submit" variant="default">
                  Guardar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Barra de Búsqueda */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Buscar médicos por nombre, apellido o especialidad"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Search className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* Tabla de Médicos */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Nombre Completo</th>
              <th className="p-3 text-left">Especialidad</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center p-4">
                  Cargando médicos...
                </td>
              </tr>
            ) : filteredMedicos.length > 0 ? (
              filteredMedicos.map((medico) => (
                <tr 
                  key={medico.id} 
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="p-3">{medico.id}</td>
                  <td className="p-3">
                    {medico.nombre} {medico.apellido}
                  </td>
                  <td className="p-3">{medico.especialidad}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center p-4">
                  No se encontraron médicos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}