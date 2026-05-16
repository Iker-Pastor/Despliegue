package com.bluecrew.api.repository;

import com.bluecrew.api.model.Categoria;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {

    @Query(value = "SELECT * FROM categorias", nativeQuery = true)
    List<Categoria> findSqlAll();

    @Query(value = "SELECT * FROM categorias WHERE id_categoria = :id", nativeQuery = true)
    Categoria findSqlById(@Param("id") int catId);

    @Query(value = "SELECT COUNT(*) as num_categorias FROM categorias", nativeQuery = true)
    Long countSql();

    @Query(value = "SELECT c.nombre_categoria, COUNT(e.id_evento) as total_eventos " +
                   "FROM categorias c " +
                   "LEFT JOIN eventos e ON c.id_categoria = e.id_categoria " +
                   "GROUP BY c.id_categoria, c.nombre_categoria " +
                   "ORDER BY total_eventos DESC", nativeQuery = true)
    List<Object[]> findSqlPopularidadCategorias();

}
