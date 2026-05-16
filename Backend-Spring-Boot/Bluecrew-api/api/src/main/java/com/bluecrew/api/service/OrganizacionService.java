package com.bluecrew.api.service;

import com.bluecrew.api.model.EstadoAprobacionOrganizacion;
import com.bluecrew.api.model.Organizacion;
import com.bluecrew.api.repository.OrganizacionRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrganizacionService {

    @Autowired
    public OrganizacionRepository organizacionRepository;

    // ************************
    // CONSULTAS
    // ************************
    @Transactional(readOnly = true)
    public List<Organizacion> findAll() {
        return organizacionRepository.findSqlAll();
    }

    @Transactional(readOnly = true)
    public Organizacion findById(int orgId) {
        return organizacionRepository.findSqlById(orgId);
    }

    @Transactional(readOnly = true)
    public Long count() {
        return organizacionRepository.countSql();
    }

    // ************************
    // ACTUALIZACIONES
    // ************************
    @Transactional
    public Organizacion save(Organizacion org) {
        return organizacionRepository.save(org);
    }

    @Transactional
    public Organizacion update(int id, Organizacion orgDetails) {
        Organizacion org = organizacionRepository.findSqlById(id);
        if (org == null) {
            throw new RuntimeException("Organización no encontrada");
        }

      
        if (orgDetails.getNombreOrganizacion() != null) {
            org.setNombreOrganizacion(orgDetails.getNombreOrganizacion());
        }
        if (orgDetails.getDescripcion() != null) {
            org.setDescripcion(orgDetails.getDescripcion());
        }
        if (orgDetails.getSitioWeb() != null) {
            org.setSitioWeb(orgDetails.getSitioWeb());
        }
        if (orgDetails.getLogo() != null) {
            org.setLogo(orgDetails.getLogo());
        }
        if (orgDetails.getPasswordHash() != null) {
            org.setPasswordHash(orgDetails.getPasswordHash());
        }
        if (orgDetails.getTelefono() != null) {
            org.setTelefono(orgDetails.getTelefono());
        }
        if (orgDetails.getEmail() != null) {
            org.setEmail(orgDetails.getEmail());
        }

      
        if (orgDetails.getEstadoAprobacion() != null) {
            org.setEstadoAprobacion(orgDetails.getEstadoAprobacion());

           
            if (orgDetails.getEstadoAprobacion() == EstadoAprobacionOrganizacion.APROBADO && org.getFechaAprobacion() == null) {
                org.setFechaAprobacion(LocalDateTime.now());
            }
        }

        if (orgDetails.getAprobadoPor() != null) {
            org.setAprobadoPor(orgDetails.getAprobadoPor());
        }

        return organizacionRepository.save(org);
    }

    @Transactional
    public void deleteById(int id) {
        if (!organizacionRepository.existsById(id)) {
            throw new RuntimeException("Organización no encontrada");
        }
        organizacionRepository.deleteById(id);
    }

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Transactional(readOnly = true)
    public Organizacion login(String email, String passwordPlano) {
       
        Optional<Organizacion> organizacionOpt = organizacionRepository.findByEmail(email);

        if (organizacionOpt.isPresent()) {
            Organizacion organizacion = organizacionOpt.get();
          
            if (passwordEncoder.matches(passwordPlano, organizacion.getPasswordHash())) {
                return organizacion; 
            }
        }
        return null;
    }

    @Transactional(readOnly = true) 
    public Optional<Organizacion> findByEmail(String email) {
        return organizacionRepository.findByEmail(email);
    }

    @Transactional(readOnly = true)
    public List<Object[]> findRankingByEventos() {
        return organizacionRepository.findSqlRankingByEventos();
    }
}
