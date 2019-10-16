import jetbrains.buildServer.configs.kotlin.v2018_2.*
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.dockerSupport
import jetbrains.buildServer.configs.kotlin.v2018_2.buildSteps.PowerShellStep
import jetbrains.buildServer.configs.kotlin.v2018_2.buildSteps.powerShell
import jetbrains.buildServer.configs.kotlin.v2018_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2018_2.projectFeatures.dockerRegistry
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.VcsTrigger
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.finishBuildTrigger
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.retryBuild
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.schedule
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.vcs

version = "2019.1"

project {

    description = "Branches of Cinegy Workspace from public GitHub"

    buildType(Build)
    
    buildTypesOrder = arrayListOf(Build)

    features {
        dockerRegistry {
            id = "PROJECT_EXT_26"
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

    buildNumberPattern = "%build.revisions.short%"
    artifactRules = "./dist/** => Cinegy_Workspace_%teamcity.build.branch%_%build.number%.zip"

    vcs {
        root(DslContext.settingsRoot)

        cleanCheckout = true
    }

    steps { 
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
        schedule {
            enabled = false
            schedulingPolicy = daily {
                hour = 23
            }
            branchFilter = ""
            triggerBuild = always()
        }
        vcs {
            enabled = false
            quietPeriodMode = VcsTrigger.QuietPeriodMode.USE_CUSTOM
            quietPeriod = 60
        }
        retryBuild {
            enabled = false
        }
    }

    features {
        dockerSupport {
            loginToRegistry = on {
                dockerRegistryId = "PROJECT_EXT_26"
            }
        }
    }
})
