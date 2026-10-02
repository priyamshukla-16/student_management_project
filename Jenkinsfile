pipeline {
    agent any

    tools {
        jdk 'JDK-17'
        maven 'Maven-3.9.16'
    }

    environment {
        IMAGE_NAME = 'student-management-devops'
        IMAGE_TAG = '1.0.10'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Unit Test') {
            steps {
                bat 'mvn clean test'
            }
        }

        stage('Build Maven Artifact') {
            steps {
                bat 'mvn package -DskipTests'
            }
        }

        stage('Docker Build') {
            steps {
                bat "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
            }
        }

        stage('Security Scan') {
            steps {
                bat "\"C:\\Program Files\\Trivy\\trivy.exe\" image --exit-code 0 --severity HIGH,CRITICAL ${IMAGE_NAME}:${IMAGE_TAG}"
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'target/*.jar',
                             fingerprint: true
        }
    }
}