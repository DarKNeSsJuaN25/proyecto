package com.clinica.labexamns.service;

import com.clinica.labexamns.model.Examen;
import com.clinica.labexamns.repository.ExamenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExamenService {

    @Autowired
    private ExamenRepository examenRepository;

    public List<Examen> obtenerTodos() {
        return examenRepository.findAll();
    }

    public Optional<Examen> obtenerPorId(String id) {
        return examenRepository.findById(id);
    }

    public Examen crear(Examen examen) {
        return examenRepository.save(examen);
    }

    public Examen actualizar(String id, Examen examenActualizado) {
        return examenRepository.findById(id).map(examen -> {
            examen.setPacienteId(examenActualizado.getPacienteId());
            examen.setMedicoId(examenActualizado.getMedicoId());
            examen.setTipoExamen(examenActualizado.getTipoExamen());
            examen.setFecha(examenActualizado.getFecha());
            examen.setEstado(examenActualizado.getEstado());
            examen.setResultado(examenActualizado.getResultado());
            examen.setComentarios(examenActualizado.getComentarios());
            return examenRepository.save(examen);
        }).orElse(null);
    }

    public boolean eliminar(String id) {
        if (examenRepository.existsById(id)) {
            examenRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Examen> buscarPorPaciente(String pacienteId) {
        return examenRepository.findByPacienteId(pacienteId);
    }

    public List<Examen> buscarPorEstado(String estado) {
        return examenRepository.findByEstado(estado);
    }

    public List<Examen> buscarPorTipo(String tipo) {
        return examenRepository.findByTipoExamen(tipo);
    }
}
