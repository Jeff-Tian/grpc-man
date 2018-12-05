pipeline {
    agent any

    stages {
        stage('SonarQube analysis'){
            steps {
                script {
                    def scannerHome = tool 'SonarQubeScanner3'
                    withSonarQubeEnv ('SonarTS') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }
        stage('SonarQube Quality Gate') {
            steps {
                waitForQualityGate abortPipeline: true
            }
        }
    }
}
