# Student Management System – End-to-End DevOps

A Spring Boot + MySQL CRUD application with a frontend dashboard and a DevOps pipeline covering Git, Maven, tests, Jenkins, GitHub Actions, artifact versioning, Docker, container registry, Kubernetes, monitoring, logging and security scanning.

## 4 CRUD operations

- CREATE: Add Student
- READ: View Students
- UPDATE: Edit Student
- DELETE: Delete Student

## Local run

### Option A: Docker Compose (recommended)
```powershell
docker compose up --build
```
Open: http://localhost:8080

### Option B: Maven + local MySQL
Create a MySQL database named `studentdb`, then:
```powershell
.\mvnw.cmd clean test
.\mvnw.cmd spring-boot:run
```
Open: http://localhost:8080

## Actuator / monitoring endpoints

- http://localhost:8080/actuator/health
- http://localhost:8080/actuator/metrics
- http://localhost:8080/actuator/prometheus

## Git flow

```text
main
  ↑
Pull Request / merge
  ↑
develop
  ↑
feature/student-crud
```

Typical commands:
```powershell
git init
git add .
git commit -m "Initial student management application"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main

git checkout -b develop
git push -u origin develop

git checkout -b feature/student-crud
# make changes
git add .
git commit -m "Add student CRUD"
git push -u origin feature/student-crud
```

Create a Pull Request from `feature/student-crud` to `develop`. After testing, merge `develop` into `main`.

## Versioning

Update the version in `pom.xml`, for example:
`1.0.0` -> `1.1.0`

Then:
```powershell
git add pom.xml
git commit -m "Release version 1.1.0"
git tag v1.1.0
git push origin main --tags
```

The GitHub Actions workflow publishes a Docker image to GHCR when a `v*` tag is pushed.

## Docker

```powershell
docker build -t student-management-devops:1.0.0 .
docker run --name student-management-app -p 8080:8080 `
  -e DB_URL="jdbc:mysql://host.docker.internal:3306/studentdb?useSSL=false&allowPublicKeyRetrieval=true" `
  -e DB_USERNAME=root -e DB_PASSWORD=root `
  student-management-devops:1.0.0
```

For local database + app together, prefer `docker compose up --build`.

## Kubernetes

1. Push a versioned image to GHCR.
2. Replace `YOUR-GITHUB-USERNAME` in `k8s/deployment.yaml`.
3. If GHCR is private, create an image pull secret or make the package accessible to the cluster.
4. Start Minikube or another Kubernetes cluster:
```powershell
minikube start
kubectl apply -f k8s/deployment.yaml
kubectl get pods
kubectl get services
```
5. Open:
```powershell
minikube service student-management --url
```

## Jenkins

Install Jenkins with Java 17 and add Maven, Git, Docker and Trivy to the Jenkins machine. Create a Pipeline job pointing to the GitHub repository. The included `Jenkinsfile` runs checkout, tests, Maven package, Docker build, security scan and archives the JAR.

## Logging

```powershell
docker compose logs -f app
kubectl logs -l app=student-management
```

## Security scanning

The GitHub Actions pipeline uses Trivy to scan the Docker image for HIGH and CRITICAL vulnerabilities. Jenkins also calls Trivy if it is installed on the Jenkins machine.
