package com.bluecrew.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.bluecrew.api.model.Evento;
import com.bluecrew.api.model.Inscripciones;
import com.bluecrew.api.model.Usuario;
import com.bluecrew.api.service.InscripcionesService;
import com.bluecrew.api.service.LogService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
@Tag(name = "Inscripciones", description = "Operaciones relacionadas con las inscripciones de usuarios a eventos")
public class InscripcionesController {

    @Autowired
    private InscripcionesService inscripcionesService;

    @Autowired
    private LogService logService;

    @Operation(summary = "Obtener todas las inscripciones", description = "Retorna una lista completa de todas las inscripciones registradas")
    @GetMapping("/inscripciones")
    public ResponseEntity<List<Inscripciones>> getMethodName() {
        return ResponseEntity.status(HttpStatus.OK)
                .body(inscripcionesService.findAll());
    }

    @Operation(summary = "Usuarios por evento", description = "Obtiene la lista de usuarios inscritos en un evento específico")
    @GetMapping("/eventos/{id}/inscripciones")
    public ResponseEntity<List<Usuario>> findUsuariosPorElEvento(
            @Parameter(description = "ID del evento") @PathVariable int id) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(inscripcionesService.findUsuariosPorElEvento(id));
    }

    @Operation(summary = "Cantidad de inscripciones", description = "Obtiene la cantidad de inscripciones")
    @GetMapping("/inscripciones/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.status(HttpStatus.OK)
                .body(inscripcionesService.count());
    }

    @Operation(summary = "Eventos por usuario", description = "Obtiene la lista de eventos a los que se ha inscrito un usuario")
    @GetMapping("/usuarios/{id}/inscripciones")
    public ResponseEntity<List<Evento>> findEventosPorElUsuario(
            @Parameter(description = "ID del usuario") @PathVariable int id) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(inscripcionesService.findEventosPorElUsuario(id));
    }

    @Operation(summary = "Contar asistentes", description = "Devuelve el número total de inscritos en un evento")
    @GetMapping("/eventos/{id}/inscripciones/cantidad")
    public ResponseEntity<Long> countCantidadUsuariosPorElEvento(@PathVariable int id) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(inscripcionesService.countCantidadUsuariosPorElEvento(id));
    }

    @Operation(summary = "Usuarios que asistieron", description = "Retorna los usuarios que marcaron asistencia en un evento")
    @GetMapping("/eventos/{id}/inscripciones/asistentes")
    public ResponseEntity<List<Usuario>> findUsuariosAsistieronEvento(@PathVariable int id) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(inscripcionesService.findUsuariosAsistieronEvento(id));
    }

    @Operation(summary = "Ranking de inasistencias", description = "Muestra un ranking de usuarios con más faltas (asistencia = false)")
    @GetMapping("/inscripciones/rankingInasistencias")
    public ResponseEntity<List<Object[]>> findRankingInsasistencias() {
        return ResponseEntity.status(HttpStatus.OK)
                .body(inscripcionesService.findRankingInsasistencias());
    }

    @Operation(summary = "Inscripciones por día", description = "Estadística de cuántas personas se inscriben por fecha")
    @GetMapping("/inscripciones/dia")
    public ResponseEntity<List<Object[]>> countInscripcionesPorDia() {
        return ResponseEntity.status(HttpStatus.OK)
                .body(inscripcionesService.countInscripcionesPorDia());
    }

    @Operation(summary = "Comprobar si un usuario esta inscrito en un evento", description = "Comprueba si un usuario está inscrito en un evento")
    @GetMapping("/inscripciones/evento/{idEvento}/usuario/{idUsuario}")
    public ResponseEntity<Integer> findSqlExisteInscripcion(@PathVariable Integer idEvento,
            @PathVariable Integer idUsuario) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(inscripcionesService.findExisteInscripcion(idEvento, idUsuario));
    }

    @Operation(summary = "Crear nueva inscripción", description = "Registra a un usuario en un evento")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Inscripción creada con éxito"),
            @ApiResponse(responseCode = "500", description = "Error interno o inscripción duplicada")
    })
    @PostMapping("/inscripciones")
    public ResponseEntity<Inscripciones> crearInscripcion(@RequestBody Inscripciones inscripcion) {
        try {
            Inscripciones nuevaInscripcion = inscripcionesService.save(inscripcion);
            
            logService.log("CREATE", "INSCRIPCION", "SISTEMA", "Nueva inscripción al evento ID: " + inscripcion.getEvento().getIdEvento());

            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaInscripcion);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Eliminar inscripción", description = "Borra la inscripción de un usuario a un evento usando sus IDs")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "No se encontró la inscripción")
    })
    @DeleteMapping("/inscripciones/evento/{idEvento}/usuario/{idUsuario}")
    public ResponseEntity<Void> eliminarInscripcion(
            @PathVariable Integer idEvento,
            @PathVariable Integer idUsuario) {
        try {
            inscripcionesService.delete(idEvento, idUsuario);

            logService.log("DELETE", "INSCRIPCION", "SISTEMA", "Cancelada inscripción al evento ID: " + idEvento);

            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Actualizar asistencia (Check-in)", description = "Marca si un usuario asistió o no a un evento")
    @PatchMapping("/inscripciones/evento/{idEvento}/usuario/{idUsuario}/check-in")
    public ResponseEntity<Inscripciones> actualizarAsistencia(
            @PathVariable Integer idEvento,
            @PathVariable Integer idUsuario,
            @RequestBody Boolean asistio) {
        try {
            Inscripciones updated = inscripcionesService.updateAsistencia(idEvento, idUsuario, asistio);
            
            String estado = asistio ? "ASISTIÓ" : "FALTÓ";
            logService.log("UPDATE", "ASISTENCIA", "ADMIN", "Check-in: Usuario " + idUsuario + " en Evento " + idEvento + " marcado como " + estado);

            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}