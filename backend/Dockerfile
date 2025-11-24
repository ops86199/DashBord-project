# Use Temurin JRE 17
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Add the fat jar created by 'mvn package'
COPY target/monitor-backend-1.0.0.jar /app/app.jar

EXPOSE 8081

ENTRYPOINT ["java","-jar","/app/app.jar"]

