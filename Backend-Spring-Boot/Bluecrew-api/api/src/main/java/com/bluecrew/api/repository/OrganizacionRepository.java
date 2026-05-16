package com.bluecrew.api.repository;

import com.bluecrew.api.model.Organizacion;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrganizacionRepository extends JpaRepository<Organizacion, Integer> {

    @Query(value = "SELECT * FROM organizaciones", nativeQuery = true)
    List<Organizacion> findSqlAll();

    @Query(value = "SELECT * FROM organizaciones WHERE id_organizacion = :id", nativeQuery = true)
    Organizacion findSqlById(@Param("id") int orgId);

    @Query(value = "SELECT COUNT(*) as num_organizaciones FROM organizaciones", nativeQuery = true)
    Long countSql();

    @Query(value = "SELECT * FROM ORGANIZACIONES WHERE email = :email", nativeQuery = true)
    Optional<Organizacion> findByEmail(@Param("email") String email);

    @Query(value = "SELECT o.nombre_organizacion, COUNT(e.id_evento) as total_eventos " +
                   "FROM organizaciones o " +
                   "LEFT JOIN eventos e ON o.id_organizacion = e.id_organizacion " +
                   "GROUP BY o.id_organizacion, o.nombre_organizacion " +
                   "ORDER BY total_eventos DESC", nativeQuery = true)
    List<Object[]> findSqlRankingByEventos();
}
