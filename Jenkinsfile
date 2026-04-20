pipeline {
  agent any

  options {
    timestamps()
    ansiColor('xterm')
    disableConcurrentBuilds()
  }

  environment {
    COMPOSE_FILE = 'docker-compose.yml'
    COMPOSE_PROJECT_NAME = 'virtualclass-ci'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Frontend Install') {
      steps {
        dir('frontend') {
          sh 'npm ci'
        }
      }
    }

    stage('Frontend Build') {
      steps {
        dir('frontend') {
          sh 'npm run build'
        }
      }
    }

    stage('Backend Install') {
      steps {
        dir('backend') {
          sh 'npm ci'
        }
      }
    }

    stage('Backend Lint') {
      steps {
        dir('backend') {
          sh 'npm run lint'
        }
      }
    }

    stage('Backend Test') {
      steps {
        dir('backend') {
          sh 'npm run test -- --runInBand'
        }
      }
    }

    stage('Docker Compose Validate') {
      steps {
        sh 'docker compose config > /tmp/virtualclass-compose-validated.yaml'
      }
    }

    stage('Build Images') {
      steps {
        sh 'docker compose build backend frontend'
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'frontend/dist/**', allowEmptyArchive: true
      junit allowEmptyResults: true, testResults: 'backend/coverage/**/junit*.xml,backend/**/junit*.xml'
      cleanWs(cleanWhenNotBuilt: false, deleteDirs: true, disableDeferredWipeout: true)
    }
  }
}
