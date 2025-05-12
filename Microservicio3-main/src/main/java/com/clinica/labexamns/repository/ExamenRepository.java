package com.clinica.labexamns.repository;

import com.clinica.labexamns.model.Examen;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamenRepository extends MongoRepository<Examen, String> {

    // Buscar exámenes por ID de paciente
    List<Examen> findByPacienteId(String pacienteId);

    // Buscar exámenes por estado
    List<Examen> findByEstado(String estado);

    // Buscar por tipo de examen
    List<Examen> findByTipoExamen(String tipoExamen);
}
