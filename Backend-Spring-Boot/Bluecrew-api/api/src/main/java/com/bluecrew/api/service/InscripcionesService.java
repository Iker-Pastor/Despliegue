package com.bluecrew.api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bluecrew.api.model.Evento;
import com.bluecrew.api.model.InscripcionId;
import com.bluecrew.api.model.Inscripciones;
import com.bluecrew.api.model.Usuario;
import com.bluecrew.api.repository.InscripcionesRepository;

import jakarta.transaction.Transactional;

@Service
public class InscripcionesService {
    @Autowired
    InscripcionesRepository inscripcionesRepository;

    @Transactional
    public List<Inscripciones> findAll() {
        return inscripcionesRepository.findSqlAll();
    }

    @Transactional
    public Long count() {
        return inscripcionesRepository.count();
    }

    @Transactional
    public List<Usuario> findUsuariosPorElEvento(int id) {
        return inscripcionesRepository.findSqlUsuariosPorElEvento(id);
    }

    @Transactional
    public List<Evento> findEventosPorElUsuario(int id) {
        return inscripcionesRepository.findSqlEventosPorElUsuario(id);
    }

    @Transactional
    public Long countCantidadUsuariosPorElEvento(int id) {
        return inscripcionesRepository.findSqlCantidadUsuariosPorElEvento(id);
    }

    @Transactional
    public List<Usuario> findUsuariosAsistieronEvento(int id) {
        return inscripcionesRepository.findSqlUsuariosAsistieronEvento(id);
    }

    @Transactional
    public List<Object[]> findRankingInsasistencias() {
        return inscripcionesRepository.findSqlRankingInsasistencias();
    }

    @Transactional
    public List<Object[]> countInscripcionesPorDia() {
        return inscripcionesRepository.countInscripcionesPorDia();
    }

    @Transactional
    public Integer findExisteInscripcion(Integer idEvento, Integer idUsuario) {
        return inscripcionesRepository.findSqlExisteInscripcion(idEvento, idUsuario);
    }

    @Transactional
    public Inscripciones save(Inscripciones inscripcion) {
        return inscripcionesRepository.save(inscripcion);
    }

    @Transactional
    public void delete(Integer idEvento, Integer idUsuario) {
        // Creamos la llave compuesta para que JPA sepa qué buscar
        InscripcionId id = new InscripcionId(idEvento, idUsuario);

        if (inscripcionesRepository.existsById(id)) {
            inscripcionesRepository.deleteById(id);
        } else {
            throw new RuntimeException("La inscripción no existe");
        }
    }

    @Transactional
    public Inscripciones updateAsistencia(Integer idEvento, Integer idUsuario, Boolean asistio) {
        InscripcionId id = new InscripcionId(idEvento, idUsuario);
        Inscripciones inscripcion = inscripcionesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inscripción no encontrada"));
        inscripcion.setAsistio(asistio);
        return inscripcionesRepository.save(inscripcion);
    }
}