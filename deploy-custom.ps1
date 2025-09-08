#!/usr/bin/env pwsh

Write-Host "Building and deploying JHipster application..." -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Building the application..." -ForegroundColor Yellow
& .\mvnw.cmd clean package -Pprod -DskipTests
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Step 2: Building Docker image..." -ForegroundColor Yellow
docker build -t jhipstersampleapplication .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Step 3: Deploying with Docker Compose..." -ForegroundColor Yellow
docker compose -f docker-compose.custom.yml up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Deployment complete! Application should be available at:" -ForegroundColor Green
Write-Host "http://localhost:8080" -ForegroundColor Cyan
Write-Host ""
Write-Host "To check status: docker ps" -ForegroundColor Blue
Write-Host "To view logs: docker logs jhipster-sample-app-app-1" -ForegroundColor Blue
Write-Host "To stop: docker compose -f docker-compose.custom.yml down" -ForegroundColor Blue
