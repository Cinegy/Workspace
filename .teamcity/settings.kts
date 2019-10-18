import jetbrains.buildServer.configs.kotlin.v2018_2.*
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.dockerSupport
import jetbrains.buildServer.configs.kotlin.v2018_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2018_2.projectFeatures.dockerRegistry
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.VcsTrigger
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.finishBuildTrigger
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.retryBuild
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.schedule
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.vcs
import jetbrains.buildServer.configs.kotlin.v2018_2.buildSteps.exec

version = "2019.1"

project {

    description = "Branches of Cinegy Workspace from public GitHub"

    buildType(Build)
    buildType(Deploy)

    buildTypesOrder = arrayListOf(Build, Deploy)

    features {
        dockerRegistry {
            id = "CinegyRegistry"
            name = "Cinegy Docker Registry"
            url = "https://registry.cinegy.com"
            userName = "teamcity_service"
            password = "credentialsJSON:c0105573-8413-4bca-b9ca-c3cfc95d5fb2"
        }
    }

    cleanup {
        artifacts(builds = 10)
    }

}

object Build : BuildType({
    name = "Build"
    
    // check if the build is from master (until integration builds are implemented)
    val branchName = "%teamcity.build.branch%"
    var isMasterBranch = false
    if(branchName.compareTo("master") == 0){
        isMasterBranch = true
    }

    buildNumberPattern = "%build.revisions.short%"
    artifactRules = "./dist/** => Cinegy_Workspace_%teamcity.build.branch%_%build.number%.zip"

    vcs {
        root(DslContext.settingsRoot)

        cleanCheckout = true
    }

    steps {
        exec {
            name = "(patch) Generate Version Number"
            path = "pwsh"
            if (isMasterBranch) {
                arguments = "./patch-version.ps1 -BuildCounter %build.counter% -SourceRevisionValue %build.revisions.revision%"
            } 
            else {
                arguments = "./patch-version.ps1 -BuildCounter %build.counter% -SourceRevisionValue %build.revisions.revision% -OverrideMinorVersion " + branchName
            }   
            dockerImage = "registry.cinegy.com/docker/docker-builds/ubuntu1804/devbase:latest"
            dockerPull = true
        }
        script {
            name = "(build) NPM Install"
            scriptContent = """
                #!/bin/bash
                npm set registry https://registry.npmjs.org
                npm install
            """.trimIndent()
            dockerImage = "registry.cinegy.com/docker/docker-builds/ubuntu1804/node12angular8:latest"
            dockerPull = true
        }
        script {
            name = "(build) Workspace Build"
            scriptContent = """
                #!/bin/bash
                ng version    
                ng build > log.txt
            """.trimIndent()
            dockerImage = "registry.cinegy.com/docker/docker-builds/ubuntu1804/node12angular8:latest"
            dockerPull = true
        }
    }

    triggers {
        vcs {
            enabled = true
            quietPeriodMode = VcsTrigger.QuietPeriodMode.USE_CUSTOM
            quietPeriod = 60
        }
    }

    features {
        dockerSupport {
            loginToRegistry = on {
                dockerRegistryId = "CinegyRegistry"
            }
        }
    }
})


object Deploy : BuildType({
    name = "deploy"
    description = "Push to S3 static buckets"

    enablePersonalBuilds = false
    type = BuildTypeSettings.Type.DEPLOYMENT
    buildNumberPattern = "${Build.depParamRefs.buildNumber}-%build.counter%"
    maxRunningBuilds = 1

    params {
        select("Static_Bucket_Name", "cinegyqaworkspace-staticbucket-blue-teamcity", label = "Target Bucket",
                options = listOf("cinegyqaworkspace-staticbucket-blue-teamcity", "cinegyqaworkspace-staticbucket-green-teamcity"))
    }

    steps {
        exec {
            name = "S3 Upload"
            path = "aws"
            arguments = "s3 sync publish/Workspace s3://%Static_Bucket_Name%/%dep.CinegyAsAService_CinegyWorkspace_V11x_Build.teamcity.build.branch% --delete"
            dockerImage = "registry.cinegy.com/docker/docker-builds/ubuntu1804/terraform0.12:latest"
        }
    }
    
    triggers {
        finishBuildTrigger {
            buildType = "${Build.id}"
            successfulOnly = true
            branchFilter = "+:*"
        }
    }

    dependencies {
        dependency(Build) {
            snapshot {
                onDependencyCancel = FailureAction.CANCEL
            }

            artifacts {
                cleanDestination = true
                artifactRules = "Cinegy_Workspace_*.zip!**=>./publish"
            }
        }
    }

    features {
        dockerSupport {
            loginToRegistry = on {
                dockerRegistryId = "CinegyRegistry"
            }
        }
    }
})
