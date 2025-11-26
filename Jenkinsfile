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

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build & Push Docker Images') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {

                        sh "docker login -u $DOCKER_USER -p $DOCKER_PASS"

                        // Backend Image
                        sh """
                        docker rmi $DOCKER_USER/dashboard-backend:latest || true
                        docker build -t $DOCKER_USER/dashboard-backend:latest backend/
                        docker push $DOCKER_USER/dashboard-backend:latest
                        """

                        // Frontend Image
                        sh """
                        docker rmi $DOCKER_USER/dashboard-frontend:latest || true
                        docker build -t $DOCKER_USER/dashboard-frontend:latest frontend/
                        docker push $DOCKER_USER/dashboard-frontend:latest
                        """
                    }
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-cred']]) {

                    sh '''
                        export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
                        export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
                        export AWS_DEFAULT_REGION=us-east-1

                        echo "Updating kubeconfig..."
                        aws eks update-kubeconfig --region us-east-1 --name my-cluster

                        echo "Applying Kubernetes Manifests..."
                        kubectl apply -f k8s/backend-deployment.yaml
                        kubectl apply -f k8s/backend-service.yaml
                        kubectl apply -f k8s/frontend-deployment.yaml
                        kubectl apply -f k8s/frontend-service.yaml

                        echo "Deployment Completed"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline Successful! 🚀"
        }
        failure {
            echo "Pipeline Failed ❌"
        }
    }
}
