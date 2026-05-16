package com.bluecrew.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bluecrew.api.model.LogActividad;
import com.bluecrew.api.repository.LogActividadRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@Tag(name = "Auditoría", description = "Endpoints para visualizar los logs de actividad del sistema")
public class AuditController {

    @Autowired
    private LogActividadRepository logActividadRepository;

    @Operation(summary = "Obtener logs de actividad", description = "Retorna la lista de todas las acciones registradas en el sistema")
    @GetMapping("/logs/actividad")
    public ResponseEntity<List<LogActividad>> getLogs() {
        return ResponseEntity.status(HttpStatus.OK)
                .body(logActividadRepository.findAll());
    }
}
