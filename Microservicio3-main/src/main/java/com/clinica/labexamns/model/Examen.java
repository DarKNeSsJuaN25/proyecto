package com.clinica.labexamns.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Representa un examen de laboratorio para un paciente.
 * Este modelo se utiliza para almacenar la información de los exámenes
 * en la base de datos MongoDB.
 */
@Data
@Document(collection = "examenes")
@Schema(description = "Modelo que representa un examen de laboratorio realizado a un paciente.")
public class Examen {

    @Id
    @Schema(description = "ID único del examen generado por MongoDB.", required = true, example = "5f8b77f9e4b0a75f9873b8fc")
    private String id;

    @Schema(description = "ID del paciente asociado a este examen.", required = true, example = "123456789")
    private String pacienteId;

    @Schema(description = "ID del médico que solicitó o realizó el examen.", required = true, example = "987654321")
    private String medicoId;

    @Schema(description = "Tipo de examen realizado (ej: análisis de sangre, radiografía, etc.).", required = true, example = "Análisis de sangre")
    private String tipoExamen;

    @Schema(description = "Fecha y hora en que se realizó el examen.", required = true, example = "2025-05-10T15:30:00")
    private LocalDateTime fecha;

    @Schema(description = "Estado del examen, puede ser: pendiente, completado, o cancelado.", required = true, example = "completado")
    private String estado;

    @Schema(description = "Resultados del examen en formato de mapa clave-valor, donde las claves representan los tipos de pruebas realizadas y los valores contienen los resultados obtenidos.", required = false)
    private Map<String, Object> resultado;

    @Schema(description = "Comentarios adicionales relacionados con el examen (por ejemplo, observaciones del médico).", required = false, example = "Todo en orden, no hay anomalías.")
    private String comentarios;
}
