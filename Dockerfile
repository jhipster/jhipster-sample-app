FROM eclipse-temurin:17-jre-focal

# Set working directory
WORKDIR /app

# Copy the application jar
COPY target/jhipster-sample-application-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Set the startup command
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
