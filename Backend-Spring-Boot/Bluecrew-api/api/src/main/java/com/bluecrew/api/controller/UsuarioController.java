package com.bluecrew.api.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;

import com.bluecrew.api.model.Rol;
import com.bluecrew.api.model.Usuario;
import com.bluecrew.api.service.UsuarioService;
import com.bluecrew.api.service.LogService;

@Tag(name = "Usuarios", description = "API para gestión de usuarios")
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private com.bluecrew.api.repository.UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private LogService logService;

    // ***************************************************************************
    // CONSULTAS
    // ***************************************************************************
    @Operation(summary = "Obtener todos los usuarios", description = "Retorna una lista con todos los usuarios disponibles")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuarios obtenidos con éxito")
    })
    @GetMapping
    public ResponseEntity<List<Usuario>> showUsers() {
        return ResponseEntity.ok(usuarioService.findAll());
    }

    // http://localhost:8080/api/usuarios/2
    @Operation(summary = "Obtener un usuarios por id", description = "Retorna una usuario con todos los datos")
    @GetMapping("/{id}")
    public ResponseEntity<?> getUsuarioById(@PathVariable int id) {

        Usuario usuario = usuarioService.findById(id);

        if (usuario == null) {
            Map<String, Object> map = new HashMap<>();
            map.put("error", "Usuario no encontrado");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(map);
        }
        Map<String, Object> map = new HashMap<>();
        map.put("id", usuario.getId());
        map.put("nombre", usuario.getNombre());
        map.put("apellido", usuario.getApellido());
        map.put("email", usuario.getEmail());
        map.put("biografia", usuario.getBiografia());
        map.put("foto", usuario.getFoto());
        map.put("localidad", usuario.getLocalidad());
        map.put("rol", usuario.getRol());

        map.put("eventosCompletados", usuario.getEventosCompletados());

        return ResponseEntity.status(HttpStatus.OK).body(map);
    }

    // http://localhost:8080/api/usuarios/count
    @Operation(summary = "Obtener la cantidad de usuarios", description = "Retorna la cantidad de usuarios")
    @GetMapping("/count")
    public ResponseEntity<Map<String, Object>> count() {
        ResponseEntity<Map<String, Object>> response = null;
        Map<String, Object> map = new HashMap<>();
        map.put("count", usuarioService.count());
        response = ResponseEntity
                .status(HttpStatus.OK)
                .body(map);
        return response;
    }

    // http://localhost:8080/api/usuarios/activos
    @Operation(summary = "Obtener todos los usuarios activos", description = "Retorna una lista con todos los usuarios activos")
    @GetMapping("/activos")
    public ResponseEntity<Map<String, Object>> countActivos() {
        ResponseEntity<Map<String, Object>> response = null;
        Map<String, Object> map = new HashMap<>();
        map.put("countSqlActivos", usuarioService.countActivos());
        response = ResponseEntity
                .status(HttpStatus.OK)
                .body(map);
        return response;
    }

    // ***************************************************************************
    // ACTUALIZACIONES (INSERT - POST - DELETE)
    // ***************************************************************************

    // ****************************************************************************
    // INSERT (POST)
    // http://localhost:8080/api/usuarios
    @Operation(summary = "Inserta un usuario", description = "Inserta un usuario en la base de datos")
    @PostMapping(consumes = { "multipart/form-data" })
    public ResponseEntity<Map<String, Object>> create(
            @Valid @RequestPart("usuario") Usuario usuario,
            @RequestPart(value = "imagen", required = false) MultipartFile imagen) {
        ResponseEntity<Map<String, Object>> response;

        if (usuario == null) {
            Map<String, Object> map = new HashMap<>();
            map.put("error", "El cuerpo de la solicitud no puede estar vacío");
            response = ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(map);
        } else {
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

                    usuario.setFoto(originalFilename);
                } catch (IOException e) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("error", "No se pudo guardar la imagen: " + e.getMessage());
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
                }
            }

            if (usuario.getNombre() == null || usuario.getNombre().trim().isEmpty() ||
                    usuario.getApellido() == null || usuario.getApellido().trim().isEmpty() ||
                    usuario.getEmail() == null || usuario.getEmail().trim().isEmpty() ||
                    usuario.getPassword_hash() == null || usuario.getPassword_hash().trim().isEmpty()) {

                Map<String, Object> map = new HashMap<>();
                map.put("error", "Los campos nombre, apellido, email y password_hash son obligatorios");
                response = ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(map);
            } else {

                String rawPassword = usuario.getPassword_hash();
                usuario.setPassword_hash(passwordEncoder.encode(rawPassword));

                if (usuario.getEventosCompletados() == null) {
                    usuario.setEventosCompletados(0);
                }
                if (usuario.getActivo() == null) {
                    usuario.setActivo(true);
                }
                if (usuario.getRol() == null) {
                    usuario.setRol(Rol.USER);
                }

                try {
                    Usuario objPost = usuarioService.save(usuario);
                    
                    logService.log("CREATE", "USUARIO", "ADMIN", "Se ha creado el usuario: " + usuario.getEmail());

                    Map<String, Object> map = new HashMap<>();
                    map.put("mensaje", "Usuario creado con éxito");
                    map.put("insertRealizado", objPost);
                    response = ResponseEntity
                            .status(HttpStatus.CREATED)
                            .body(map);
                } catch (Exception e) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("error", "Error interno al guardar en BD: " + e.getMessage());
                    response = ResponseEntity
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(map);
                }
            }
        }
        return response;
    }

    // ***************** ***********************************************************
    // UPDATE (PUT)
    // http://localhost:8080/api/usuarios/{id}
    @Operation(summary = "Actualizar un usuario existente", description = "Reemplaza completamente los datos de un usuario identificado por su ID")
    @PutMapping(value = "/{id}", consumes = { "multipart/form-data" })
    public ResponseEntity<Map<String, Object>> updateUser(
            @PathVariable int id,
            @RequestPart(value = "usuario", required = false) Usuario userUpdate,
            @RequestPart(value = "imagen", required = false) MultipartFile imagen) {

        if (userUpdate == null && imagen == null) {
            Map<String, Object> map = new HashMap<>();
            map.put("error", "El cuerpo de la solicitud no puede estar vacío");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(map);
        }
        Usuario existingUser = usuarioService.findById(id);

        if (existingUser == null) {
            Map<String, Object> map = new HashMap<>();
            map.put("error", "Usuario no encontrado");
            map.put("id", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(map);
        }

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

                existingUser.setFoto(originalFilename);
            } catch (IOException e) {
                Map<String, Object> map = new HashMap<>();
                map.put("error", "No se pudo guardar la nueva imagen: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
            }
        }

        if (userUpdate != null) {
            if (userUpdate.getNombre() != null) {
                existingUser.setNombre(userUpdate.getNombre());
            }
            if (userUpdate.getApellido() != null) {
                existingUser.setApellido(userUpdate.getApellido());
            }
            if (userUpdate.getEmail() != null) {
                existingUser.setEmail(userUpdate.getEmail());
            }
            if (userUpdate.getBiografia() != null) {
                existingUser.setBiografia(userUpdate.getBiografia());
            }
            if (userUpdate.getFoto() != null) {
                existingUser.setFoto(userUpdate.getFoto());
            }
            if (userUpdate.getLocalidad() != null) {
                existingUser.setLocalidad(userUpdate.getLocalidad());
            }
            if (userUpdate.getRol() != null) {
                existingUser.setRol(userUpdate.getRol());
            }
            if (userUpdate.getActivo() != null) {
                existingUser.setActivo(userUpdate.getActivo());
            }

            if (userUpdate.getPassword_hash() != null && !userUpdate.getPassword_hash().trim().isEmpty()) {
                existingUser.setPassword_hash(passwordEncoder.encode(userUpdate.getPassword_hash()));
            }
        }

        Usuario usuPut = usuarioRepository.save(existingUser);

        logService.log("UPDATE", "USUARIO", "ADMIN", "Se ha actualizado el usuario ID: " + id);

        Map<String, Object> map = new HashMap<>();
        map.put("mensaje", "Usuario actualizado con éxito");
        map.put("updatedUser", usuPut);

        return ResponseEntity.status(HttpStatus.OK).body(map);
    }

    // ****************************************************************************
    // DELETE
    // http://localhost:8080/api/usuarios/{id}
    @Operation(summary = "Eliminar un usuario", description = "Elimina un usuario de la base de datos a partir de su ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable int id) {
        Usuario existingUser = usuarioService.findById(id);

        if (existingUser == null) {
            Map<String, Object> map = new HashMap<>();
            map.put("error", "Usuario no encontrado");
            map.put("id", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(map);
        }

        usuarioService.deleteById(id);

        logService.log("DELETE", "USUARIO", "ADMIN", "Se ha eliminado el usuario ID: " + id);

        Map<String, Object> map = new HashMap<>();
        map.put("mensaje", "Usuario eliminado con éxito");
        map.put("idEliminado", id);

        return ResponseEntity.status(HttpStatus.OK).body(map);
    }
}