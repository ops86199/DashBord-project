# Stage 1: Build the application
FROM maven:3.8.1-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Build the project, creating the JAR in the 'target' directory
RUN mvn package -DskipTests

# Stage 2: Create the final runtime image
FROM openjdk:17-jre-slim
WORKDIR /app
# Copy the JAR from the 'build' stage
COPY --from=build /app/target/monitor-backend-1.0.0.jar /app/app.jar

EXPOSE 8081
CMD ["java", "-jar", "app.jar"]
