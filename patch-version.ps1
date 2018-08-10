Param(
[Parameter(Mandatory=$True,Position=1)]
[string]$buildCounter)

$fileName = "./src/app/ws-configuration/ws-configuration.ts"

$regex = "\s*public\s+readonly\s+commit\s+=\s+'\d+';\s*"

$replacement = "`tpublic readonly commit = '$buildCounter'"

(Get-Content $fileName) -replace $regex, $replacement | Out-File $fileName
