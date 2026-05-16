package com.bluecrew.api.service;

import com.bluecrew.api.model.Categoria;
import com.bluecrew.api.repository.CategoriaRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoriaService {

    @Autowired
    public CategoriaRepository categoriaRepository;

    // ************************
    // CONSULTAS
    // ************************
    @Transactional(readOnly = true)
    public List<Categoria> findAll() {
        return categoriaRepository.findSqlAll();
    }

    @Transactional(readOnly = true)
    public Categoria findById(int catId) {
        return categoriaRepository.findSqlById(catId);
    }

    @Transactional(readOnly = true)
    public Long count() {
        return categoriaRepository.countSql();
    }

    // ************************
    // ACTUALIZACIONES
    // ************************
    @Transactional
    public Categoria save(Categoria cat) {
        return categoriaRepository.save(cat);
    }

    @Transactional
    public Categoria update(int id, Categoria catDetails) {

        // Buscamos la categoría existente en la base de datos
        Categoria cat = categoriaRepository.findSqlById(id);
        if (cat == null) {
            throw new RuntimeException("Categoría no encontrada");
        }

        // Actualizamos solo los campos que vengan con información nueva (no nulos)
        if (catDetails.getNombreCategoria() != null) {
            cat.setNombreCategoria(catDetails.getNombreCategoria());
        }

        if (catDetails.getDescripcion() != null) {
            cat.setDescripcion(catDetails.getDescripcion());
        }

        if (catDetails.getAprobado() != null) {
            cat.setAprobado(catDetails.getAprobado());

            // Si el admin la aprueba, le ponemos la fecha actual
            if (catDetails.getAprobado() && cat.getFechaAprobacion() == null) {
                cat.setFechaAprobacion(java.time.LocalDateTime.now());
            }
        }

        // La fecha de creación no se actualiza porque es inmutable
        // El creador normalmente tampoco se cambia de autor una vez creada

        // Guardamos los cambios
        return categoriaRepository.save(cat);
    }

    @Transactional
    public void deleteById(int id) {
        if (!categoriaRepository.existsById(id)) {
            throw new RuntimeException("Categoría no encontrada");
        }
        categoriaRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Object[]> findPopularidadCategorias() {
        return categoriaRepository.findSqlPopularidadCategorias();
    }
}
