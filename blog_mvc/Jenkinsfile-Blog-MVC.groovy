// Jenkins-Blog-MVC.groovy

def buildApp() {
    dir("blog_mvc") {
        sh "npm install"
    }
}

def testApp() {
    dir("blog_mvc") {
        sh "ls"
        echo "Checking NPM version"
        sh "npm --version"
        echo "Starting the testing"
        sh "npm run pipeline-test"
        sh "ls"
        sh "cat test.txt"
        sh "ls"
        
        script {
            def testResult = sh(script: "grep 'FAIL' test.txt", returnStatus: true)
            if (testResult == 0) {
                error("Tests failed! Marking the pipeline as failed.")
            }
        }
    }
}

def appTestCoverage() {
    dir("blog_mvc") {
        sh "ls"
        sh "npm --version"
        echo "Starting Coverage Test Result"
        
        // Run Jest with coverage and save output to coverage.txt
        sh "npm run pipeline-coverage"
        echo "Check if coverage is added"
        sh "ls"
        
        script {
            def funcsCoveragePercentage = sh(
                script: """
                    grep 'All files' coverage.txt | awk -F '|' '{print \$5}' | tr -d '%'
                """,
                returnStdout: true
            ).trim()
            
            if (funcsCoveragePercentage == "") {
                error("Failed to extract functions coverage percentage from coverage.txt")
            }
            
            echo "Total Functions Coverage Percentage: ${funcsCoveragePercentage}%"

            sh "ls"
            
            def coverageValue = funcsCoveragePercentage.toFloat()
            if (coverageValue < 30) { // change to 60% when I build more tests
                error("Functions coverage is below 30%. Failing the pipeline.")
            } else {
                echo "Functions coverage is sufficient. Proceeding with the pipeline."
            }
        }
    }
}

def buildDockerMvcImage() {
    withCredentials([file(credentialsId: "blog_mvc_env", variable: "ENV_FILE_MVC")]) {
        echo "Current directory before moving into blog_mvc"
        sh "pwd"

        echo "Current directory inside blog_mvc"
        dir("blog_mvc") {
            sh "pwd"
            sh "ls"
            
            script {
                sh """
                set -a
                . \$ENV_FILE_MVC
                set +a

                # Build Docker image with environment variables
                docker build \
                    --build-arg PORT=\$PORT \
                    --build-arg NODE_ENV=\$NODE_ENV \
                    --build-arg DB_USER=\$DB_USER \
                    --build-arg DB_HOST=\$DB_HOST \
                    --build-arg DB_NAME=\$DB_NAME \
                    --build-arg DB_PASSWORD=\$DB_PASSWORD \
                    --build-arg DB_PORT=\$DB_PORT \
                    --build-arg JWT_SECRET=\$JWT_SECRET \
                    -t customhaven/blog_mvc:${env.BUILD_TAG} .
                """
                env.DOCKER_IMAGE_MVC = "customhaven/blog_mvc:${env.BUILD_TAG}"
            }
        }
    }
}

def pushDockerMvcImage() {
    script {
        docker.withRegistry("", "dockerhub") {
            sh "docker push ${env.DOCKER_IMAGE_MVC}"
        }
    }
}

// Return the functions to be used
return [
    buildApp: buildApp,
    testApp: testApp,
    appTestCoverage: appTestCoverage,
    buildDockerMvcImage: buildDockerMvcImage,
    pushDockerMvcImage: pushDockerMvcImage
]