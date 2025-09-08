FROM openjdk:17-jre-slim

# Set working directory
WORKDIR /app

# Copy the application jar
COPY target/*.jar app.jar

# Expose port
EXPOSE 8080

# Set the startup command
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
