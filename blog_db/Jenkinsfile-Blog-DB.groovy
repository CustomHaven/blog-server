def buildDockerDbImage() {
    echo "INSIDE THE DB PIPELINE"
    withCredentials([file(credentialsId: "blog_db_env", variable: "ENV_FILE_DB")]) {
        sh """
        set -a
        . \$ENV_FILE_DB
        set +a

        # Build Docker image with environment variables
        docker build \
            --build-arg POSTGRES_DB=\$POSTGRES_DB \
            --build-arg POSTGRES_PASSWORD=\$POSTGRES_PASSWORD \
            -t customhaven/blog_db:${env.BUILD_TAG} .
        """
        env.DOCKER_IMAGE_DB = "customhaven/blog_db:${env.BUILD_TAG}"
    }
}

def pushDockerDbImage() {
    script {
        docker.withRegistry("", "dockerhub") {
            sh "docker push ${env.DOCKER_IMAGE_DB}"
        }
    }
}

// Call the functions where needed
return [buildDockerDbImage: buildDockerDbImage, pushDockerDbImage: pushDockerDbImage]