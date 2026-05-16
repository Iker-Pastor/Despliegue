package com.bluecrew.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.bluecrew.api.model.LogActividad;

public interface LogActividadRepository extends JpaRepository<LogActividad, Long> {
}
