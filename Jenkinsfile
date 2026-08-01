@Library("shared") _
pipeline {
    agent { label "vinod" }
    stages {
        stage("Hello"){
            steps{
              script{
                 hello()
                }
            }
        }
        stage("Code") {
            steps {
                script{
                    clone("https://github.com/Nizamuddin-1/nodejs-cicd-server.git","main")
                }
            }
        }
        stage("Build & Deploy") {
            steps {
                script{
                    build()
                }
            }
        }
        stage("Push to DockerHub") {
            steps {
               script{
                   pushDocker('nodejs-cicd-app:latest', 'nizamuddinpasha', 'node-server-app', 'latest')
               }
            }
        }
    }
}
