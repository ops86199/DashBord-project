# Stage 1: Build the application
FROM maven:3.8.1-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Runtime image
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY target/monitor-backend-1.0.0.jar /app/app.jar

EXPOSE 8081
CMD ["java", "-jar", "app.jar"]
