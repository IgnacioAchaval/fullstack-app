# Usamos una imagen oficial de Node.js
FROM node:18

# Definir el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package.json package-lock.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto 5000
EXPOSE 5000

# Comando de inicio del servidor
CMD ["node", "index.js"]