# CI/CD Pipeline Documentation

## Overview

This project uses GitHub Actions for Continuous Integration and Continuous Deployment (CI/CD). The pipeline includes automated testing, building, security scanning, and deployment.

## Workflows

### 1. Main CI/CD Pipeline (`.github/workflows/ci-cd.yml`)

**Triggers:**

- Push to `main`, `develop`, or `feature/*` branches
- Pull requests to `main` or `develop`

**Jobs:**

- **test**: Runs backend and frontend tests with PostgreSQL service
- **build**: Builds the application and uploads artifacts
- **docker-build**: Creates Docker image (only for main/build-test-deploy branches)
- **e2e-tests**: Runs end-to-end tests with Cypress
- **security-scan**: OWASP dependency vulnerability check
- **quality-gate**: SonarQube code quality analysis (PRs only)

### 2. Quick CI (`.github/workflows/quick-ci.yml`)

**Triggers:**

- Push to `feature/*` branches
- Pull requests

**Jobs:**

- **quick-test**: Fast unit tests and linting
- **build-check**: Compilation verification

### 3. Deployment Pipeline (`.github/workflows/deploy.yml`)

**Triggers:**

- Push to `main` branch
- Git tags starting with `v`
- Manual workflow dispatch

**Jobs:**

- **build-and-push**: Builds and pushes Docker image to GitHub Container Registry
- **deploy-staging**: Deploys to staging environment
- **deploy-production**: Deploys to production (tags only)
- **notify**: Sends deployment notifications

## Environment Variables

Set these in your GitHub repository settings:

### Required Secrets

```
SONAR_TOKEN          # SonarCloud token for code quality analysis
```

### Optional Secrets

```
DOCKER_USERNAME      # Docker Hub username (if using Docker Hub)
DOCKER_PASSWORD      # Docker Hub password
SLACK_WEBHOOK        # Slack webhook for notifications
```

## CI Configuration

Environment variables are defined in `.ci/config.env`:

```bash
NODE_VERSION=18
JAVA_VERSION=17
TEST_TIMEOUT=10
COVERAGE_THRESHOLD=80
DOCKER_REGISTRY=ghcr.io
APP_NAME=jhipster-sample-app
SONAR_PROJECT_KEY=YK0317_jhipster-sample-app
SONAR_ORGANIZATION=yk0317
```

## Pipeline Stages

### 1. Test Stage

- **Backend Tests**: JUnit tests with Maven
- **Frontend Tests**: Karma/Jasmine tests with Angular CLI
- **Code Coverage**: Jacoco (backend) + Istanbul (frontend)
- **Linting**: ESLint for frontend code

### 2. Build Stage

- **Application Build**: Maven production build
- **Artifact Upload**: JAR files stored for deployment

### 3. Docker Build Stage

- **Image Creation**: Multi-stage Docker build
- **Image Testing**: Health check verification
- **Registry Push**: GitHub Container Registry

### 4. Security Stage

- **Dependency Check**: OWASP vulnerability scanning
- **Container Scanning**: Docker image security analysis

### 5. Quality Gate

- **SonarQube Analysis**: Code quality and technical debt
- **Coverage Check**: Minimum coverage threshold
- **Quality Metrics**: Maintainability and reliability scores

### 6. E2E Testing

- **Cypress Tests**: Full application workflow testing
- **Visual Testing**: Screenshot comparison
- **Performance Testing**: Basic performance metrics

## Local CI Testing

### Run CI scripts locally:

```bash
# Frontend tests (CI mode)
npm run test:ci

# Frontend linting
npm run lint:ci

# Backend tests
./mvnw test

# Build application
npm run build:ci

# E2E tests
npm run e2e:headless
```

### Docker build testing:

```bash
# Build Docker image
docker build -t jhipstersampleapplication:test .

# Test Docker image
docker run --rm -p 8080:8080 jhipstersampleapplication:test
```

## Branch Protection Rules

Recommended GitHub branch protection rules for `main`:

- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging
  - `test`
  - `build`
  - `quick-test`
- ✅ Require branches to be up to date before merging
- ✅ Require linear history
- ✅ Include administrators

## Monitoring and Notifications

### Build Status Badges

Add to your README.md:

```markdown
[![CI/CD Pipeline](https://github.com/YK0317/jhipster-sample-app/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/YK0317/jhipster-sample-app/actions/workflows/ci-cd.yml)
[![Quick CI](https://github.com/YK0317/jhipster-sample-app/actions/workflows/quick-ci.yml/badge.svg)](https://github.com/YK0317/jhipster-sample-app/actions/workflows/quick-ci.yml)
```

### Deployment Status

- **Staging**: Automatic deployment on main branch push
- **Production**: Manual approval required or tag-based deployment

## Troubleshooting

### Common CI Issues

1. **Test Failures**

   - Check test logs in GitHub Actions
   - Run tests locally: `npm run test:ci` and `./mvnw test`

2. **Build Failures**

   - Verify dependencies: `npm ci` and `./mvnw dependency:resolve`
   - Check for compilation errors

3. **Docker Build Issues**

   - Test Dockerfile locally: `docker build -t test .`
   - Check .dockerignore file

4. **E2E Test Failures**
   - Verify application starts correctly
   - Check Cypress configuration
   - Review test screenshots/videos in artifacts

### Performance Optimization

- **Caching**: Gradle and npm dependencies are cached
- **Parallel Jobs**: Tests run in parallel where possible
- **Conditional Builds**: Docker builds only for specific branches
- **Artifact Cleanup**: Automatic cleanup after 1-7 days

## Security Considerations

- **Secrets Management**: Use GitHub Secrets for sensitive data
- **Dependency Scanning**: Automated vulnerability checks
- **Container Security**: Regular base image updates
- **Access Control**: Limited deployment permissions

## Future Improvements

- [ ] Integration with external monitoring tools
- [ ] Automated rollback mechanisms
- [ ] Blue-green deployment strategy
- [ ] Multi-environment promotion pipeline
- [ ] Performance regression testing
- [ ] Automated changelog generation
