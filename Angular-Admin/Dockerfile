# Etapa 1: Construcción
FROM node:20-alpine AS build
WORKDIR /app

# Copiar configuración de paquetes e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el código fuente y compilar la aplicación Angular (cliente y SSR)
COPY . .
RUN npm run build

# Etapa 2: Servidor SSR en Producción
FROM node:20-alpine
WORKDIR /app

# Copiar el package.json y los artefactos compilados desde la etapa anterior
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist

# Instalar únicamente las dependencias de producción necesarias para el servidor Express/SSR
RUN npm install --omit=dev

# Exponer el puerto por defecto del servidor SSR de Angular
EXPOSE 4000

# Definir la variable de entorno PORT por si acaso
ENV PORT=4000

# Ejecutar el servidor SSR
CMD ["node", "dist/Angular-Admin/server/server.mjs"]
