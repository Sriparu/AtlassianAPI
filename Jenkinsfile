pipeline {
    agent any

    tools {
        maven '3.9.12'   // Must match the name configured in Jenkins Global Tool Config
        jdk   'jdk-25.0.2'      // Must match the name configured in Jenkins Global Tool Config
    }

    environment {
        // Pull credentials from Jenkins Credential Store — never hardcode secrets
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
                // Overwrites config.properties at runtime with real credentials
                // The committed config.properties can contain placeholder values
                sh """
                    sed -i 's|auth.username=.*|auth.username=${ATLASSIAN_USERNAME}|' \\
                        src/main/resources/config.properties
                    sed -i 's|auth.password=.*|auth.password=${ATLASSIAN_API_TOKEN}|' \\
                        src/main/resources/config.properties
                """
            }
        }

        stage('Build & Compile') {
            steps {
                echo 'Compiling source code...'
                sh 'mvn clean compile test-compile -q'
            }
        }

        stage('Run API Tests') {
            steps {
                echo 'Running TestNG API tests...'
                sh 'mvn test -Dsurefire.suiteXmlFiles=src/test/resources/testng.xml'
            }
            post {
                always {
                    // Publish TestNG XML results
                    testNG results: 'target/surefire-reports/*.xml',
                           reportFilenamePattern: '**/testng-results.xml'

                    // Publish ExtentReports HTML (if configured)
                    publishHTML(target: [
                        allowMissing         : true,
                        alwaysLinkToLastBuild: true,
                        keepAll              : true,
                        reportDir            : 'reports',
                        reportFiles          : '*.html',
                        reportName           : 'Extent API Report'
                    ])
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
