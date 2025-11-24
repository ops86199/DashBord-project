pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = "us-east-1"
        EKS_CLUSTER = "my-cluster"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git url: 'https://github.com/ops86199/DashBord-projecrt.git', branch: 'main'
            }
        }

        stage ('Build Backend') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build & Push Backend Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh "docker login -u $DOCKER_USER -p $DOCKER_PASS"
                        sh "docker build -t $DOCKER_USER/dashboard-backend:latest backend/"
                        sh "docker push $DOCKER_USER/dashboard-backend:latest"
                    }
                }
            }
        }

        stage('Build & Push Frontend Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh "docker login -u $DOCKER_USER -p $DOCKER_PASS"
                        sh "docker build -t $DOCKER_USER/dashboard-frontend:latest frontend/"
                        sh "docker push $DOCKER_USER/dashboard-frontend:latest"
                    }
                }
            }
        }

        stage('Update kubeconfig for EKS') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-cred']]) {
                    
                 sh '''
                        export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
                        export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
                        export AWS_DEFAULT_REGION=us-east-1
                    
                        aws eks update-kubeconfig --region us-east-1 --name my-cluster

                        kubectl apply -f k8s/backend-deployment.yaml
                        kubectl apply -f k8s/backend-service.yaml
                        kubectl apply -f k8s/frontend-deployment.yaml
                        kubectl apply -f k8s/frontend-service.yaml
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "Deployment Successful!"
        }
        failure {
            echo "Pipeline Failed!"
        }
    }
}
