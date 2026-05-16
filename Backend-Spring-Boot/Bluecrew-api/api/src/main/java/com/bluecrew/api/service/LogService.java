package com.bluecrew.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.bluecrew.api.model.LogActividad;
import com.bluecrew.api.repository.LogActividadRepository;

@Service
public class LogService {

    @Autowired
    private LogActividadRepository logActividadRepository;

    public void log(String accion, String entidad, String usuario, String detalle) {
        LogActividad log = new LogActividad(accion, entidad, usuario, detalle);
        logActividadRepository.save(log);
    }
}
