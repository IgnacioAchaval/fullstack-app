# Usa una versión específica de Node.js compatible con ARM64
FROM --platform=linux/arm64 node:18

# Set working directory inside the container
WORKDIR /app

# Copiar solo los package.json para optimizar la cache
COPY backend/package.json backend/package-lock.json backend/
COPY frontend/package.json frontend/package-lock.json frontend/

# Instalar dependencias con compatibilidad ARM
RUN cd backend && npm install --legacy-peer-deps
RUN cd frontend && npm install --legacy-peer-deps

# Copiar el código fuente completo
COPY backend backend/
COPY frontend frontend/

# Copiar `init.sql` para evitar errores en EC2
COPY backend/init.sql backend/init.sql

# Copiar `index.html` explícitamente antes del build
COPY frontend/public/index.html frontend/public/index.html

# Construir el frontend en un solo paso asegurando compatibilidad
RUN cd frontend && npm run build || echo "Ignoring frontend build error"

# Instalar `serve` con compatibilidad ARM64
RUN npm install -g serve --legacy-peer-deps

# Exponer puertos necesarios
EXPOSE 5000 3000

# Copiar y dar permisos al script de inicio
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Ejecutar el script de inicio
CMD ["/app/start.sh"]