stage("Build App") {
    steps {
        dir("blog_mvc") {
            sh "npm install"
        }
    }
}
stage("Test App") {
    steps {
        dir("blog_mvc") {
            sh "ls"
            echo "Checking NPM version"
            sh "npm --version"
            echo "starting the testing"
            sh "npm run pipeline-test"
            sh "ls"
            sh "cat test.txt"
            sh "ls"
            // Not needed but we keep it incase
            // Because Jenkins will judge the entire pipeline if the test is Failure
            script {
                def testResult = sh(script: "grep 'FAIL' test.txt", returnStatus: true)
                if (testResult == 0) {
                    error("Tests failed! Marking the pipeline as failed.")
                }
            }
        }
    }
}
stage("App Test Coverage") {
    steps {
        dir("blog_mvc") {
            sh "ls"
            sh "npm --version"
            echo "Starting Coverage Test Result"
            
            // Run Jest with coverage and save output to coverage.txt
            sh "npm run pipeline-coverage"
            echo "check if coverage is added"
            sh "ls"
            script {
                // Extract the functions coverage percentage from coverage.txt
                def funcsCoveragePercentage = sh(
                    script: """
                        grep 'All files' coverage.txt | awk -F '|' '{print \$5}' | tr -d '%'
                    """,
                    returnStdout: true
                ).trim()
                
                // Check if the coverage percentage was extracted correctly
                if (funcsCoveragePercentage == "") {
                    error("Failed to extract functions coverage percentage from coverage.txt")
                }
                
                echo "Total Functions Coverage Percentage: ${funcsCoveragePercentage}%"

                sh "ls"
                
                // Convert to a number and check if it's below 60
                def coverageValue = funcsCoveragePercentage.toFloat()
                if (coverageValue < 30) { // change to 60% when I build more tests
                    error("Functions coverage is below 60%. Failing the pipeline.")
                } else {
                    echo "Functions coverage is sufficient. Proceeding with the pipeline."
                }
            }
        }
    }
}
stage("Build Docker MVC Image") {
    steps {
        withCredentials([file(credentialsId: "blog_mvc_env", variable: "ENV_FILE_MVC")]) {
            echo "Current directory before moving into blog_mvc"
            sh "pwd"

            echo "Current directory inside blog_mvc"
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
                // dockerImageMVC = docker.image("customhaven/blog_mvc:${env.BUILD_TAG}")
            }
        }
    }
}
stage("Push Docker MVC Image") {
    steps {
        script {
            docker.withRegistry("", "dockerhub") {
                sh "docker push ${env.DOCKER_IMAGE_MVC}"
                // dockerImageMVC.push()
                // dockerImageMVC.push("${env.BUILD_TAG}")
            }
        }
    }
}