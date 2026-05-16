package com.bluecrew.api.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bluecrew.api.service.CategoriaService;
import com.bluecrew.api.service.EventoService;
import com.bluecrew.api.service.InscripcionesService;
import com.bluecrew.api.service.OrganizacionService;
import com.bluecrew.api.service.RecoleccionResiduosService;
import com.bluecrew.api.service.UsuarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@Tag(name = "Estadísticas", description = "Operaciones relacionadas con estadísticas globales y analíticas")
public class EstadisticasController {

    @Autowired
    private EventoService eventoService;

    @Autowired
    private RecoleccionResiduosService recoleccionResiudosService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private InscripcionesService inscripcionesService;

    @Autowired
    private CategoriaService categoriaService;

    @Autowired
    private OrganizacionService organizacionService;

    @GetMapping("/estadisticas/globales")
    @Operation(summary = "Obtiene estadísticas globales", description = "Retorna una lista con los voluntarios activos, eventos finalizados y total de basura recolectada")
    public ResponseEntity<Map<String, Number>> getEstadisticasGlobales() {
        Map<String, Number> stats = new HashMap<>();
        stats.put("Voluntarios_Activos", usuarioService.countActivos());
        stats.put("Eventos_Finalizados", eventoService.findEventosFinalizados());
        stats.put("Total_Basura", recoleccionResiudosService.findSum());

        return ResponseEntity.status(HttpStatus.OK)
                .body(stats);
    }

    @GetMapping("/estadisticas/mensuales")
    @Operation(summary = "Obtiene inscripciones mensuales", description = "Retorna el conteo de inscripciones agrupadas por fecha")
    public ResponseEntity<List<Object[]>> getEstadisticasMensuales() {
        return ResponseEntity.ok(inscripcionesService.countInscripcionesPorDia());
    }

    @GetMapping("/estadisticas/categorias/popularidad")
    @Operation(summary = "Popularidad por categorías", description = "Retorna el conteo de eventos por cada categoría")
    public ResponseEntity<List<Object[]>> getPopularidadCategorias() {
        return ResponseEntity.ok(categoriaService.findPopularidadCategorias());
    }

    @GetMapping("/estadisticas/organizaciones/ranking")
    @Operation(summary = "Ranking de organizaciones", description = "Retorna las organizaciones con más eventos creados")
    public ResponseEntity<List<Object[]>> getRankingOrganizaciones() {
        return ResponseEntity.ok(organizacionService.findRankingByEventos());
    }

}
