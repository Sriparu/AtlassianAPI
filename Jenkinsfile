pipeline {
    agent any

    tools {
        maven '3.9.12'   // Must match Jenkins Global Tool Config
        jdk   'jdk-25.0.2'
    }

    environment {
        ATLASSIAN_USERNAME  = credentials('ATLASSIAN_USERNAME')
        ATLASSIAN_API_TOKEN = credentials('ATLASSIAN_API_TOKEN')
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Cloning repository...'
                checkout scm
            }
        }

        stage('Inject Credentials') {
            steps {
                echo 'Injecting credentials into config.properties...'

                withCredentials([
                    string(credentialsId: 'ATLASSIAN_USERNAME', variable: 'ATLASSIAN_USERNAME'),
                    string(credentialsId: 'ATLASSIAN_API_TOKEN', variable: 'ATLASSIAN_API_TOKEN')
                ]) {
                    script {
                        if (isUnix()) {
                            sh """
                                sed -i 's|auth.username=.*|auth.username=${ATLASSIAN_USERNAME}|' src/main/resources/config.properties
                                sed -i 's|auth.password=.*|auth.password=${ATLASSIAN_API_TOKEN}|' src/main/resources/config.properties
                            """
                        } else {
                            bat """
                                powershell -Command "(Get-Content 'src/main/resources/config.properties') -replace 'auth.username=.*', 'auth.username=%ATLASSIAN_USERNAME%' | Set-Content 'src/main/resources/config.properties'"
                                powershell -Command "(Get-Content 'src/main/resources/config.properties') -replace 'auth.password=.*', 'auth.password=%ATLASSIAN_API_TOKEN%' | Set-Content 'src/main/resources/config.properties'"
                            """
                        }
                    }
                }
            }
        }

        stage('Build & Compile') {
            steps {
                echo 'Compiling source code...'
                bat 'mvn clean compile test-compile -q'
            }
        }

        stage('Run API Tests') {
            steps {
                echo 'Running TestNG API tests...'
                bat 'mvn test -Dgroups=api -Dsurefire.suiteXmlFiles=src/test/resources/testng.xml'
            }
            post {
                always {
                    // Publish test results using JUnit publisher
                    junit 'target/surefire-reports/*.xml'
                }
            }
        }
    }

    post {
        success {
            echo 'All API tests PASSED!'
        }
        failure {
            echo 'One or more API tests FAILED. Check the TestNG report.'
            // Add email/Slack notification here if needed
        }
        always {
            // Archive surefire reports as build artifacts
            archiveArtifacts artifacts: 'target/surefire-reports/**', allowEmptyArchive: true
            cleanWs()
        }
    }
}
