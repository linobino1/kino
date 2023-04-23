pipeline {
    agent any
    stages {
        stage('Verify Tools') {
            steps {
                sh '''
                    docker info
                    docker version
                    docker compose version
                '''
            }
        }
        stage('Prune Docker') {
            steps {
                sh 'docker system prune -f'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying..'
                sh 'docker compose -f docker-compose.production.yaml up -d --build --force-recreate --remove-orphans'
            }
        }
    }
}