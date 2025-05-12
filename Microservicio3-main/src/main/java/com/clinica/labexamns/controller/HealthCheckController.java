package com.clinica.labexamns.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint básico para verificar el estado de la API.
 * Útil para balanceadores de carga y monitoreo básico.
 */
@RestController
public class HealthCheckController {

    /**
     * Endpoint raíz para verificar que el servicio está activo.
     * Utilizado por balanceadores de carga o herramientas de monitoreo.
     *
     * @return String indicando que el microservicio está activo.
     */
    @Operation(summary = "Verificación de la salud del microservicio",
            description = "Endpoint básico para verificar si el microservicio está activo.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Microservicio activo")
    })
    @GetMapping("/")
    public ResponseEntity<String> rootCheck() {
        return ResponseEntity.ok("Microservicio de Exámenes de Laboratorio activo");
    }

    /**
     * Endpoint dedicado para realizar un Health Check del servicio.
     * Utilizado por balanceadores de carga o herramientas de monitoreo.
     *
     * @return Estado del servicio con código 200 si está activo.
     */
    @Operation(summary = "Health Check",
            description = "Verifica si el microservicio está funcionando correctamente.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OK")
    })
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("OK");
    }
}
