# Usa una imagen base oficial de Node.js
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el código fuente de la aplicación
COPY . .

# Expone el puerto en el que la app corre
EXPOSE 3000

# Define el comando para correr la aplicación
CMD ["npm", "start"]
