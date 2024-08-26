import hudson.model.*
import jenkins.model.*
import hudson.tasks.*
import hudson.FilePath
import hudson.util.*
import jenkins.plugins.publish_over_ssh.*
import org.jenkinsci.plugins.pipeline.modeldefinition.*
import org.jenkinsci.plugins.workflow.cps.*
import org.jenkinsci.plugins.workflow.steps.*
import org.jenkinsci.plugins.workflow.job.*

def runDockerDBPipeline() {
    return {
        pipeline {
            agent any
            stages {
                stage("Build Docker DB Image") {
                    steps {
                        echo "INSIDE THE DB PIPELINE"
                        withCredentials([file(credentialsId: "blog_db_env", variable: "ENV_FILE_DB")]) {
                            script {
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
                                // Save the image tag to a variable for use in later stages
                                env.DOCKER_IMAGE_DB = "customhaven/blog_db:${env.BUILD_TAG}"
                            }
                        }
                    }
                }
                stage("Push Docker DB Image") {
                    steps {
                        script {
                            docker.withRegistry("", "dockerhub") {
                                // using the env
                                sh "docker push ${env.DOCKER_IMAGE_DB}"
                            }
                        }
                    }
                }
            }
        }

    }
}