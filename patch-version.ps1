# PowerShell Cinegy Build Script
# COPYRIGHT Cinegy GmbH 2019
Param([string]$BuildCounter=0,[string]$SourceRevisionValue="FFFFFF",[string]$OverrideMinorVersion="")

#read major / minor version values from a file held in source control
$majorVer=99
$minorVer=99

#if this is a build triggered via AppVeyor, force minor to 99 (only Cinegy TeamCity master builds get non-99 numbers)
if($Env:APPVEYOR_REPO_BRANCH) {
    $OverrideMinorVersion = 99
}

#define various regular expressions to be used when hunting in files
$versionSniffingRegex = "(\s*#define\s+(\S+)\s+)(\d+)"

Get-Content ".\version.h" |  Where-Object { $_ -match $versionSniffingRegex } | ForEach-Object {
	switch ($Matches[2])
	{
		"VERSION_MAJOR" { $majorVer = $Matches[3] }
		"VERSION_MINOR" { $minorVer = $Matches[3] }
	}	
}

if($OverrideMinorVersion)
{
    $minorVer = $OverrideMinorVersion
}

#calculte a UInt16 from the commit hash to use as 4th version flag
$shortRev = $SourceRevisionValue.Substring(0,4)
$sourceAsDecimal = [System.Convert]::ToUInt16($shortRev, 16)

$SoftwareVersion = "$majorVer.$minorVer.$buildCounter.$sourceAsDecimal"

#make teamcity update with this new version number
Write-Host "##teamcity[buildNumber '$SoftwareVersion']"

#make appveyor update with this new version number
if($Env:APPVEYOR_REPO_BRANCH){
    if($Env:APPVEYOR_REPO_BRANCH -ne "master") {
        #remove any prefix on branch, in case of pull requests
        $lastSlash = $($Env:APPVEYOR_REPO_BRANCH).LastIndexOf('/')
        if($lastSlash -gt 0) {
            $branchName = $($Env:APPVEYOR_REPO_BRANCH).Substring($lastSlash + 1)
        }
        else {
            $branchName = $Env:APPVEYOR_REPO_BRANCH
        }
        Update-AppveyorBuild -Version "$SoftwareVersion-$branchName"
    }
    else {
        Update-AppveyorBuild -Version $SoftwareVersion
    }
}

#find TS configuration files and update versions
$MajorRegex = "(^\s*public readonly major\s*=\s*')(.*)(';)"
$MinorRegex = "(^\s*public readonly minor\s*=\s*')(.*)(';)"
$BuildRegex = "(^\s*public readonly build\s*=\s*')(.*)(';)"
$CommitRegex = "(^\s*public readonly commit\s*=\s*')(.*)(';)"

Get-ChildItem -Path "./src/app/*/ws-configuration.ts" -Recurse | ForEach-Object {
    $fileName = $_
    Write-Host "Processing metadata changes for file: $fileName"

    $FileLines = Get-Content -path $fileName 
    
    for($i=0;$i -lt $FileLines.Count;$i++)
    {
        $FileLines[$i] = $FileLines[$i] -Replace $MajorRegex, "`${1}$majorVer`$3"
        $FileLines[$i] = $FileLines[$i] -Replace $MinorRegex, "`${1}$minorVer`$3"
        $FileLines[$i] = $FileLines[$i] -Replace $BuildRegex, "`${1}$BuildCounter`$3"
        $FileLines[$i] = $FileLines[$i] -Replace $CommitRegex, "`${1}$sourceAsDecimal`$3"
    }

    $FileLines | Out-File -Encoding utf8 $fileName.FullName
}
