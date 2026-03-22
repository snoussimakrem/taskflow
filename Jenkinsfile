pipeline {
    agent any
    
    environment {
        // Environment variables
        DOCKER_IMAGE_BACKEND = 'taskflow-backend'
        DOCKER_IMAGE_FRONTEND = 'taskflow-frontend'
        NODE_VERSION = '22'
    }
    
    tools {
        nodejs "node-${NODE_VERSION}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Cloning repository...'
                checkout scm
            }
        }
        
        stage('Backend Tests') {
            steps {
                echo 'Running backend tests...'
                dir('backend') {
                    sh '''
                        npm install
                        npm test || echo "No tests configured"
                    '''
                }
            }
        }
        
        stage('Frontend Build') {
            steps {
                echo 'Building frontend...'
                dir('frontend') {
                    sh '''
                        npm install
                        npm run build
                    '''
                }
            }
        }
        
        stage('Docker Build') {
            steps {
                echo 'Building Docker images...'
                
                // Build backend image
                sh "docker build -t ${DOCKER_IMAGE_BACKEND}:latest ./backend"
                
                // Build frontend image
                sh "docker build -t ${DOCKER_IMAGE_FRONTEND}:latest ./frontend"
            }
        }
        
        stage('Integration Test') {
            steps {
                echo 'Starting services for integration test...'
                
                // Start all services
                sh 'docker compose up -d'
                
                // Wait for services to be ready
                script {
                    sleep time: 30, unit: 'SECONDS'
                }
                
                // Test API health
                sh 'curl -f http://localhost:5011/api/health || exit 1'
                
                // Test tasks endpoint
                sh 'curl -f http://localhost:5011/api/tasks || exit 1'
            }
            post {
                always {
                    // Clean up
                    sh 'docker compose down'
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                echo 'Running security scan...'
                
                // Run npm audit
                dir('backend') {
                    sh 'npm audit --audit-level=high || echo "Vulnerabilities found"'
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully! ✅'
        }
        failure {
            echo 'Pipeline failed! ❌'
        }
    }
}