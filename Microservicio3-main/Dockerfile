# Etapa de construcción: usa Maven con Java 21 para compilar la aplicación
FROM maven:3.9.6-eclipse-temurin-21 AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia todos los archivos del proyecto al contenedor
COPY . .

# Compila el proyecto y genera el archivo .jar, omitiendo los tests
RUN mvn clean package -DskipTests

# Etapa de ejecución: imagen más liviana solo con Java Runtime
FROM eclipse-temurin:21-jre

# Establece el directorio de trabajo en el contenedor final
WORKDIR /app

# Copia el JAR generado desde la etapa de construcción
COPY --from=builder /app/target/lab-examns-0.0.1-SNAPSHOT.jar app.jar

# Expone el puerto donde correrá la aplicación
EXPOSE 8080

# Comando para ejecutar el JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
