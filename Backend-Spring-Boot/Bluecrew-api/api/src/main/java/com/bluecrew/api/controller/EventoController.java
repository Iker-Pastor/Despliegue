package com.bluecrew.api.controller;

import com.bluecrew.api.model.EstadoEvento;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;

import com.bluecrew.api.model.Evento;
import com.bluecrew.api.service.EventoService;
import com.bluecrew.api.service.LogService;

@Tag(name = "Eventos", description = "API para gestión de eventos")
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    @Autowired
    private LogService logService;

    // ***************************************************************************
    // CONSULTAS
    // ***************************************************************************

    // http://localhost:8080/bluecrew/api/eventos
    // ***************************************************************************
    @Operation(summary = "Obtener todos los eventos", description = "Retorna una lista con todos los eventos disponibles")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Eventos obtenidos con éxito")
    })
    @GetMapping("/eventos")
    public ResponseEntity<List<Evento>> showEventos() {
        return ResponseEntity.ok(eventoService.findAll());
    }

    // http://localhost:8080/bluecrew/api/eventos/2
    @Operation(summary = "Obtener un evento", description = "Retorna una evento con todos sus datos")
    @GetMapping("/eventos/{id}")
    public ResponseEntity<Evento> showById(@PathVariable int id) {
        Evento evento = eventoService.findById(id);
        if (evento == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(null);
        } else {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(evento);
        }
    }

    // http://localhost:8080/bluecrew/api/eventos/count
    @Operation(summary = "Cuenta la cantidad de eventos que hay", description = "Retorna la cantidad de eventos que hay")
    @GetMapping("/eventos/count")
    public ResponseEntity<Map<String, Object>> count() {
        ResponseEntity<Map<String, Object>> response = null;
        Map<String, Object> map = new HashMap<>();
        map.put("count", eventoService.count());
        response = ResponseEntity
                .status(HttpStatus.OK)
                .body(map);
        return response;
    }

    @Operation(summary = "Obtiene eventos sin finalizar", description = "Retorna una lista deloseventos que no han terminado para mostrarlos en la página web")
    @GetMapping("/eventos/activos")
    public ResponseEntity<List<Object[]>> eventoSinFinalizar() {
        return ResponseEntity.status(HttpStatus.OK).body(eventoService.findEventoSinFinalizar());
    }

    @Operation(summary = "Obtiene eventos pendientes de calificar", description = "Retorna una lista de eventos pendientes de calificar")
    @GetMapping("/eventos/pendientes/{id}")
    public ResponseEntity<List<Evento>> findPendientesCalificarByUsuario(@PathVariable int id) {
        return ResponseEntity.status(HttpStatus.OK).body(eventoService.findPendientesCalificarByUsuario(id));
    }

    @Operation(summary = "Obtiene eventos sin finalizar y no inscritos", description = "Retorna una lista de eventos sin finalizar y no inscritos")
    @GetMapping("/eventos/activos/{id}")
    public ResponseEntity<List<Object[]>> findEventoSinFinalizarYNoInscrito(@PathVariable int id) {
        return ResponseEntity.status(HttpStatus.OK).body(eventoService.findEventoSinFinalizarYNoInscrito(id));
    }

    @Operation(summary = "Obtiene los eventos a los que se ha inscrito un usuario", description = "Retorna una lista de eventos a los que se ha inscrito un usuario")
    @GetMapping("/mis-eventos/inscritos/{id}")
    public ResponseEntity<List<Object[]>> findEventosByInscripcionUsuario(@PathVariable int id) {
        return ResponseEntity.status(HttpStatus.OK).body(eventoService.findEventosByInscripcionUsuario(id));
    }

    @Operation(summary = "Obtiene los eventos que ha publicado un usuario", description = "Retorna una lista de eventos que ha publicado un usuario")
    @GetMapping("/mis-eventos/publicados/{id}")
    public ResponseEntity<List<Object[]>> findEventosByInscripcionOrganizacion(@PathVariable int id) {
        return ResponseEntity.status(HttpStatus.OK).body(eventoService.findEventosPublicadosByUsuario(id));
    }

    @Operation(summary = "Obtiene los eventos pendientes de aprobación de un usuario", description = "Retorna una lista de eventos pendientes de aprobación de un usuario")
    @GetMapping("/mis-eventos/pendientes/{id}")
    public ResponseEntity<List<Object[]>> findEventosPendientesAprobacionByUsuario(@PathVariable int id) {
        return ResponseEntity.status(HttpStatus.OK).body(eventoService.findEventosPendientesAprobacionByUsuario(id));
    }

    @Operation(summary = "Obtiene los eventos publicados por una ONG", description = "Retorna una lista de eventos publicados por una ONG")
    @GetMapping("/mis-eventos/publicados/ong/{id}")
    public ResponseEntity<List<Object[]>> findEventosPublicadosByOng(@PathVariable int id) {
        return ResponseEntity.status(HttpStatus.OK).body(eventoService.findEventosPublicadosByOng(id));
    }


    // ***************************************************************************
    // ACTUALIZACIONES
    // ***************************************************************************

    // ****************************************************************************
    // INSERT (POST)
    // http://localhost:8080/bluecrew/api/eventos
    @Operation(summary = "Crea un evento", description = "Inserta un evento en la base de datos")
    @PostMapping("/eventos")
    public ResponseEntity<Map<String, Object>> create(
            @RequestPart("evento") Evento evento,
            @RequestPart(value = "imagen", required = false) MultipartFile imagen) {

        if (evento == null) {
            Map<String, Object> map = new HashMap<>();
            map.put("error", "El cuerpo de la solicitud no puede estar vacío");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(map);

        } else {
            if (evento.getTitulo() == null || evento.getTitulo().isEmpty()) {
                Map<String, Object> map = new HashMap<>();
                map.put("error", "El título del evento es obligatorio");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(map);

            }
            if (evento.getUsuario() == null && evento.getOrganizacion() == null) {
                Map<String, Object> map = new HashMap<>();
                map.put("error", "El evento debe estar asociado a un usuario o a una organización");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(map);

            }
            if (imagen != null && !imagen.isEmpty()) {
                try {
                    String uploadDir = "uploads/";
                    Path uploadPath = Paths.get(uploadDir);

                    // Si no existe la carpeta, la creamos
                    if (!Files.exists(uploadPath)) {
                        Files.createDirectories(uploadPath);
                    }

                    // Obtenemos el nombre original y lo guardamos tal cual
                    String originalFilename = imagen.getOriginalFilename();
                    Path filePath = uploadPath.resolve(originalFilename);
                    Files.write(filePath, imagen.getBytes());

                    // Actualizamos el objeto evento con el nombre de la imagen para la BD
                    evento.setImagen(originalFilename);

                } catch (IOException e) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("error", "No se pudo guardar la imagen: " + e.getMessage());
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
                }
            }

            if (evento.getEstadoEvento() == null) {
                evento.setEstadoEvento(EstadoEvento.PENDIENTE);
            }
            if (evento.getFinalizado() == null) {
                evento.setFinalizado(false);
            }

            Evento objPost = eventoService.save(evento);

            logService.log("CREATE", "EVENTO", "ADMIN", "Se ha creado el evento: " + evento.getTitulo());

            Map<String, Object> map = new HashMap<>();
            map.put("mensaje", "Evento creado con éxito");
            map.put("insertRealizado", objPost);
            return ResponseEntity.status(HttpStatus.CREATED).body(map);
        }
    }

    // ***************************************************************************
    // ACTUALIZAR (PUT)
    // ***************************************************************************
    @Operation(summary = "Actualizar un evento", description = "Actualiza los datos de un evento existente usando su ID")
    @PutMapping(value="/eventos/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Map<String, Object>> update(
            @PathVariable int id,
            @RequestPart(value = "evento", required = false) Evento eventoActualizado,
            @RequestPart(value = "imagen", required = false) MultipartFile imagen) {

        if (eventoActualizado == null) {
            Map<String, Object> map = new HashMap<>();
            map.put("error", "El cuerpo de la solicitud no puede estar vacío");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(map);
        }

        Evento existingEvento = eventoService.findById(id);

        if (existingEvento == null) {
            Map<String, Object> map = new HashMap<>();
            map.put("error", "Evento no encontrado");
            map.put("id", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(map);
        }

        // Lógica para guardar la nueva imagen si se proporciona una
        if (imagen != null && !imagen.isEmpty()) {
            try {
                String uploadDir = "uploads/";
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String originalFilename = imagen.getOriginalFilename();
                Path filePath = uploadPath.resolve(originalFilename);
                Files.write(filePath, imagen.getBytes());

                existingEvento.setImagen(originalFilename);
            } catch (IOException e) {
                Map<String, Object> map = new HashMap<>();
                map.put("error", "No se pudo guardar la nueva imagen: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
            }
        }

        // Actualizamos solo los campos que vengan en el JSON (que no sean nulos)
        if (eventoActualizado.getTitulo() != null)
            existingEvento.setTitulo(eventoActualizado.getTitulo());
        if (eventoActualizado.getDescripcion() != null)
            existingEvento.setDescripcion(eventoActualizado.getDescripcion());
        if (eventoActualizado.getImagen() != null)
            existingEvento.setImagen(eventoActualizado.getImagen());
        if (eventoActualizado.getFechaInicio() != null)
            existingEvento.setFechaInicio(eventoActualizado.getFechaInicio());
        if (eventoActualizado.getFechaFin() != null)
            existingEvento.setFechaFin(eventoActualizado.getFechaFin());
        if (eventoActualizado.getUbicacion() != null)
            existingEvento.setUbicacion(eventoActualizado.getUbicacion());
        if (eventoActualizado.getEstadoEvento() != null)
            existingEvento.setEstadoEvento(eventoActualizado.getEstadoEvento());
        if (eventoActualizado.getParticipantes() != null)
            existingEvento.setParticipantes(eventoActualizado.getParticipantes());
        if (eventoActualizado.getFinalizado() != null)
            existingEvento.setFinalizado(eventoActualizado.getFinalizado());
        if (eventoActualizado.getMaterialNecesario() != null)
            existingEvento.setMaterialNecesario(eventoActualizado.getMaterialNecesario());
        if (eventoActualizado.getUsuario() != null)
            existingEvento.setUsuario(eventoActualizado.getUsuario());
        if (eventoActualizado.getOrganizacion() != null)
            existingEvento.setOrganizacion(eventoActualizado.getOrganizacion());

        Evento objPut = eventoService.save(existingEvento);

        logService.log("UPDATE", "EVENTO", "ADMIN", "Se ha actualizado el evento ID: " + id);

        Map<String, Object> map = new HashMap<>();
        map.put("mensaje", "Evento actualizado con éxito");
        map.put("eventoActualizado", objPut);

        return ResponseEntity.status(HttpStatus.OK).body(map);
    }

    // ***************************************************************************
    // ELIMINAR (DELETE)
    // ***************************************************************************
    @Operation(summary = "Eliminar un evento", description = "Borra un evento de la base de datos a partir de su ID")
    @DeleteMapping("/eventos/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable int id) {
        Evento existingObj = eventoService.findById(id);

        if (existingObj == null) {
            Map<String, Object> map = new HashMap<>();
            map.put("error", "Evento no encontrado");
            map.put("id", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(map);
        } else {
            eventoService.deleteById(id);

            logService.log("DELETE", "EVENTO", "ADMIN", "Se ha eliminado el evento ID: " + id);

            Map<String, Object> map = new HashMap<>();
            map.put("mensaje", "Evento eliminado con éxito");
            map.put("deletedRealizado", existingObj);
            return ResponseEntity.status(HttpStatus.OK).body(map);
        }
    }

}
