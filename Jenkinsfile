// ==============================================================================
// Declarative Jenkinsfile for Docker-based Node.js CI/CD Pipeline
// ==============================================================================
pipeline {
    // Execute this pipeline on any available Jenkins agent that has Docker installed
    agent any

    // Define environment variables used throughout the pipeline
    environment {
        IMAGE_NAME      = 'nodejs-cicd-app'
        IMAGE_TAG       = "build-${env.BUILD_NUMBER}"
        CONTAINER_NAME  = 'nodejs-cicd-container'
        HOST_PORT       = '80'
        CONTAINER_PORT  = '80'
    }

    // Define pipeline options
    options {
        // Keep only the last 10 builds to save disk space
        buildDiscarder(logRotator(numToKeepStr: '10'))
        // Add timestamps to console log output
        timestamps()
    }

    stages {
        // ----------------------------------------------------------------------
        // STAGE 1: Checkout Source Code from Git
        // ----------------------------------------------------------------------
        stage('1. Checkout Code 📥') {
            steps {
                echo "--> Checking out repository code..."
                checkout scm
            }
        }

        // ----------------------------------------------------------------------
        // STAGE 2: Verify Docker Environment
        // ----------------------------------------------------------------------
        stage('2. Verify Docker Environment 🔍') {
            steps {
                echo "--> Checking Docker installation and version..."
                sh '''
                    docker --version
                    docker info
                '''
            }
        }

        // ----------------------------------------------------------------------
        // STAGE 3: Build Docker Image
        // ----------------------------------------------------------------------
        stage('3. Build Docker Image 🐳') {
            steps {
                echo "--> Building Docker image: ${IMAGE_NAME}:${IMAGE_TAG} and ${IMAGE_NAME}:latest..."
                sh '''
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest .
                '''
            }
        }

        // ----------------------------------------------------------------------
        // STAGE 4: Deploy & Run Docker Container
        // ----------------------------------------------------------------------
        stage('4. Deploy Container 🚀') {
            steps {
                echo "--> Stopping and removing any existing container named '${CONTAINER_NAME}'..."
                sh '''
                    # Stop and remove old container if it exists (ignore error if not running)
                    docker rm -f ${CONTAINER_NAME} || true

                    # Start new container in detached mode (-d) with port mapping (-p)
                    docker run -d \
                        -p ${HOST_PORT}:${CONTAINER_PORT} \
                        --name ${CONTAINER_NAME} \
                        --restart unless-stopped \
                        ${IMAGE_NAME}:latest

                    # Display running containers
                    docker ps | grep ${CONTAINER_NAME}
                '''
            }
        }

        // ----------------------------------------------------------------------
        // STAGE 5: Verify Deployment (Health Check)
        // ----------------------------------------------------------------------
        stage('5. Verify Deployment ✅') {
            steps {
                echo "--> Verifying application health endpoint..."
                sh '''
                    # Wait 3 seconds for Express server to start inside container
                    sleep 3

                    # Check health endpoint (fails build if endpoint does not return 200 OK)
                    curl -f -s http://localhost:${HOST_PORT}/api/health || (echo "Health check failed!" && exit 1)
                '''
            }
        }
    }

    // --------------------------------------------------------------------------
    // POST-BUILD ACTIONS: Cleanup & Notifications
    // --------------------------------------------------------------------------
    post {
        success {
            echo "🎉 Pipeline SUCCESS: App deployed in Docker container '${CONTAINER_NAME}' on port ${HOST_PORT}!"
        }
        failure {
            echo "❌ Pipeline FAILED: Inspecting container logs for debugging..."
            sh 'docker logs ${CONTAINER_NAME} --tail 50 || true'
        }
        always {
            echo "🧹 Cleaning up old unused Docker images (dangling images)..."
            sh 'docker image prune -f || true'
        }
    }
}
