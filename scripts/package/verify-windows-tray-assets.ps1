param(
    [Parameter(Mandatory = $true)]
    [string]$Root,

    [switch]$SkipExe
)

$ErrorActionPreference = "Stop"

$resolvedRoot = (Resolve-Path $Root).Path
$required = @(
    "media\logo\logo.ico",
    "media\logo\logo.png",
    "media\logo\logo-128.png"
)

if (-not $SkipExe) {
    $required = @("aw-qt.exe") + $required
}

$missing = @()
foreach ($relativePath in $required) {
    $path = Join-Path $resolvedRoot $relativePath
    if (-not (Test-Path $path -PathType Leaf)) {
        $missing += $relativePath
        continue
    }

    $file = Get-Item $path
    if ($file.Length -le 0) {
        $missing += "$relativePath (empty file)"
        continue
    }

    Write-Host "PASS: $relativePath ($($file.Length) bytes)"
}

if ($missing.Count -gt 0) {
    Write-Host ""
    Write-Host "FAIL: Missing required aw-qt tray assets under $resolvedRoot"
    $missing | ForEach-Object { Write-Host " - $_" }
    Write-Host ""
    Write-Host "Expected layout:"
    Write-Host " - aw-qt.exe"
    Write-Host " - media\logo\logo.ico"
    Write-Host " - media\logo\logo.png"
    Write-Host " - media\logo\logo-128.png"
    exit 1
}

Write-Host "PASS: aw-qt tray assets are present under $resolvedRoot"
