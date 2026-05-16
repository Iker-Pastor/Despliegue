package com.bluecrew.api.model;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "LOGS_ACTIVIDAD")
@Schema(description = "Registro de actividad del sistema")
public class LogActividad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @Schema(description = "Acción realizada (ej: CREATE, DELETE, UPDATE)")
    private String accion;

    @Column(nullable = false)
    @Schema(description = "Entidad afectada (ej: USUARIO, EVENTO)")
    private String entidad;

    @Column(nullable = false)
    @Schema(description = "Nombre o identificador del usuario que realizó la acción")
    private String usuario;

    @Column(nullable = false)
    @Schema(description = "Detalle de la acción realizada")
    private String detalle;

    @Column(name = "FECHA_LOG", nullable = false)
    @Schema(description = "Fecha y hora del registro")
    private LocalDateTime fecha = LocalDateTime.now();

    public LogActividad(String accion, String entidad, String usuario, String detalle) {
        this.accion = accion;
        this.entidad = entidad;
        this.usuario = usuario;
        this.detalle = detalle;
        this.fecha = LocalDateTime.now();
    }
}
