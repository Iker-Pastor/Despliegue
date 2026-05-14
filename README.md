# 🐳 Docker Compose Cheat Sheet

Guía rápida para la gestión de contenedores y depuración del stack **Frontend (React)** + **Backend (Spring API)**.

---

## 🚀 Comandos de Uso Diario

| Acción | Comando |
| :--- | :--- |
| **Levantar todo** (segundo plano) | `docker compose up -d` |
| **Levantar y Reconstruir todo** | `docker compose up -d --build` |
| **Parar y Eliminar** contenedores/redes | `docker compose down` |
| **Ver logs** en tiempo real | `docker compose logs -f` |
| **Ver estado** de los servicios | `docker compose ps` |

---

## ⚡ Reconstrucción Selectiva (Ahorra tiempo)

Si solo has modificado el código de un servicio, no reinicies todo el stack:

## Reconstruir y actualizar solo el frontend
docker compose up -d --build frontend

## Reconstruir y actualizar solo el backend
docker compose up -d --build backend

---

## 🚀 Rutas de Acceso y Pruebas

Para probar la aplicación en el entorno de desarrollo local, utiliza los siguientes enlaces:

### 🌍 Interfaz de Usuario
* **Aplicación Principal:** [http://localhost](http://localhost)


### 🛠️ Herramientas de Desarrollo
| Componente | URL de Acceso | Descripción |
| :--- | :--- | :--- |
| **Consola H2** | [http://localhost/h2-console/](http://localhost/h2-console/) | Gestión de la base de datos en memoria. |
| **Swagger UI** | [http://localhost/swagger-ui/index.html](http://localhost/swagger-ui/index.html) | Documentación interactiva de la API. |

---

### 🔑 Configuración de Acceso a H2
Al acceder a la consola de H2, asegúrate de rellenar los campos con los siguientes valores para establecer la conexión correctamente:

* **JDBC URL:** `jdbc:h2:mem:testdb`
* **User Name:** `sa`
* **Password:** *(dejar en blanco)*

# AngularAdmin

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.22.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
