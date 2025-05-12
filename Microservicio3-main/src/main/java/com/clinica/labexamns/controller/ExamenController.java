package com.clinica.labexamns.controller;

import com.clinica.labexamns.model.Examen;
import com.clinica.labexamns.service.ExamenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/examenes")
public class ExamenController {

    @Autowired
    private ExamenService examenService;

    @Operation(summary = "Obtener todos los exámenes", description = "Devuelve una lista de todos los exámenes de laboratorio registrados.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Exámenes encontrados"),
            @ApiResponse(responseCode = "500", description = "Error interno en el servidor")
    })
    @GetMapping
    public ResponseEntity<List<Examen>> obtenerTodos() {
        return ResponseEntity.ok(examenService.obtenerTodos());
    }

    @Operation(summary = "Buscar exámenes por paciente", description = "Busca exámenes de laboratorio por ID de paciente.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Exámenes encontrados"),
            @ApiResponse(responseCode = "404", description = "No se encontraron exámenes")
    })
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<Examen>> buscarPorPaciente(
            @Parameter(description = "ID del paciente") @PathVariable String pacienteId) {
        return ResponseEntity.ok(examenService.buscarPorPaciente(pacienteId));
    }

    @Operation(summary = "Buscar exámenes por estado", description = "Busca exámenes de laboratorio filtrados por estado.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Exámenes encontrados"),
            @ApiResponse(responseCode = "404", description = "No se encontraron exámenes")
    })
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Examen>> buscarPorEstado(
            @Parameter(description = "Estado del examen") @PathVariable String estado) {
        return ResponseEntity.ok(examenService.buscarPorEstado(estado));
    }

    @Operation(summary = "Buscar exámenes por tipo", description = "Busca exámenes de laboratorio filtrados por tipo.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Exámenes encontrados"),
            @ApiResponse(responseCode = "404", description = "No se encontraron exámenes")
    })
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<Examen>> buscarPorTipo(
            @Parameter(description = "Tipo de examen") @PathVariable String tipo) {
        return ResponseEntity.ok(examenService.buscarPorTipo(tipo));
    }

    @Operation(summary = "Obtener examen por ID", description = "Busca un examen por su ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Examen encontrado"),
            @ApiResponse(responseCode = "404", description = "Examen no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Examen> obtenerPorId(
            @Parameter(description = "ID del examen a buscar") @PathVariable String id) {
        return examenService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Crear un examen", description = "Permite crear un nuevo examen de laboratorio.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Examen creado"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PostMapping
    public ResponseEntity<Examen> crear(@RequestBody Examen examen) {
        return ResponseEntity.ok(examenService.crear(examen));
    }

    @Operation(summary = "Actualizar un examen", description = "Permite actualizar un examen de laboratorio existente.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Examen actualizado"),
            @ApiResponse(responseCode = "404", description = "Examen no encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Examen> actualizar(
            @Parameter(description = "ID del examen a actualizar") @PathVariable String id,
            @RequestBody Examen examen) {
        Examen actualizado = examenService.actualizar(id, examen);
        if (actualizado != null) {
            return ResponseEntity.ok(actualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Eliminar un examen", description = "Elimina un examen de laboratorio por su ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Examen eliminado"),
            @ApiResponse(responseCode = "404", description = "Examen no encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @Parameter(description = "ID del examen a eliminar") @PathVariable String id) {
        if (examenService.eliminar(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
