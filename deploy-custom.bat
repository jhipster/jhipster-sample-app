@echo off
echo Building and deploying JHipster application...
echo.

echo Step 1: Building the application...
call .\mvnw.cmd clean package -Pprod -DskipTests
if errorlevel 1 (
    echo Build failed!
    exit /b 1
)

echo Step 2: Building Docker image...
docker build -t jhipstersampleapplication .
if errorlevel 1 (
    echo Docker build failed!
    exit /b 1
)

echo Step 3: Deploying with Docker Compose...
docker compose -f docker-compose.custom.yml up -d
if errorlevel 1 (
    echo Deployment failed!
    exit /b 1
)

echo.
echo Deployment complete! Application should be available at:
echo http://localhost:8080
echo.
echo To check status: docker ps
echo To view logs: docker logs jhipster-sample-app-app-1
echo To stop: docker compose -f docker-compose.custom.yml down
