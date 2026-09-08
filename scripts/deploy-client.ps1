# ==============================================================================
# MARI PARTNER - LOCAL WINDOWS / LARAGON CLIENT PROVISIONING SCRIPT
# Versi: 1.0.0
# Deskripsi: Otomatisasi pengujian multi-instance klien di lingkungan Windows / Laragon.
# ==============================================================================

[CmdletBinding()]
param (
    [Parameter(Position = 0)]
    [ValidateSet("create", "list", "backup", "delete", "help")]
    [string]$Action = "help",

    [Parameter(Mandatory = $false)]
    [string]$Slug = "",

    [Parameter(Mandatory = $false)]
    [int]$Port = 0,

    [Parameter(Mandatory = $false)]
    [string]$DbName = "",

    [Parameter(Mandatory = $false)]
    [string]$DbUser = "root",

    [Parameter(Mandatory = $false)]
    [string]$DbPassword = "",

    [Parameter(Mandatory = $false)]
    [string]$AdminPass = "password",

    [Parameter(Mandatory = $false)]
    [switch]$SharedModules,

    [Parameter(Mandatory = $false)]
    [switch]$Help
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Split-Path -Parent $ScriptDir
$BaseDir = "d:\laragon\www\weddings"
$RegistryFile = Join-Path $BaseDir "clients_registry.json"

function Show-Banner {
    Write-Host "==========================================================================" -ForegroundColor Magenta
    Write-Host "   💍 MARI PARTNER - LOCAL CLIENT PROVISIONING (WINDOWS / LARAGON)" -ForegroundColor Magenta
    Write-Host "==========================================================================" -ForegroundColor Magenta
}

function Init-Registry {
    if (-not (Test-Path $BaseDir)) {
        New-Item -ItemType Directory -Path $BaseDir -Force | Out-Null
    }
    if (-not (Test-Path $RegistryFile)) {
        Set-Content -Path $RegistryFile -Value "[]" -Encoding UTF8
    }
}

function Find-AvailablePort {
    param ([int]$StartPort = 5001)
    $p = $StartPort
    while ($p -le 5999) {
        $conn = Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue
        if (-not $conn) {
            return $p
        }
        $p++
    }
    throw "Semua port 5001-5999 sedang digunakan!"
}

function Create-Client {
    Show-Banner

    $slugVal = $Slug
    if ([string]::IsNullOrWhiteSpace($slugVal)) {
        $slugVal = Read-Host "1. Masukkan Slug Klien (misal: budi-ani)"
    }
    $slugVal = $slugVal.ToLower().Replace(" ", "_")

    if ($slugVal -notmatch "^[a-z0-9_-]+$") {
        Write-Error "Slug hanya boleh berisi huruf, angka, strip (-), dan garis bawah (_)."
        return
    }

    $clientDir = Join-Path $BaseDir $slugVal
    if (Test-Path $clientDir) {
        Write-Error "Direktori klien '$clientDir' sudah ada! Harap pilih slug lain."
        return
    }

    $portVal = $Port
    if ($portVal -le 0) {
        $portVal = Find-AvailablePort
        Write-Host "Menggunakan port otomatis yang tersedia: $portVal" -ForegroundColor Cyan
    }

    $dbNameVal = $DbName
    if ([string]::IsNullOrWhiteSpace($dbNameVal)) {
        $dbNameClean = $slugVal.Replace("-", "_")
        $dbNameVal = "db_wedding_$dbNameClean"
    }

    Write-Host "`n[1/6] Menyiapkan direktori klien di $clientDir..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $clientDir -Force | Out-Null

    # Salin berkas (kecualikan .git, dist, node_modules, uploads)
    Write-Host "[2/6] Menyalin aset proyek..." -ForegroundColor Cyan
    $excludeList = @(".git", "node_modules", "dist", ".env", "server\uploads")
    Get-ChildItem -Path $RootDir -Exclude $excludeList | ForEach-Object {
        Copy-Item -Path $_.FullName -Destination $clientDir -Recurse -Force
    }

    # Penanganan node_modules (Symlink vs Copy)
    if ($SharedModules -or (Test-Path (Join-Path $RootDir "node_modules"))) {
        Write-Host "[3/6] Menautkan shared node_modules via Junction..." -ForegroundColor Cyan
        $sourceNodeModules = Join-Path $RootDir "node_modules"
        $destNodeModules = Join-Path $clientDir "node_modules"
        cmd /c mklink /J "$destNodeModules" "$sourceNodeModules" | Out-Null
    }

    # Konfigurasi Database MySQL Laragon
    Write-Host "[4/6] Membuat database MySQL di Laragon: $dbNameVal..." -ForegroundColor Cyan
    $mysqlCmd = "mysql"
    $mysqlArgs = "-h127.0.0.1 -P3306 -u$DbUser"
    if (-not [string]::IsNullOrWhiteSpace($DbPassword)) {
        $mysqlArgs += " -p$DbPassword"
    }

    try {
        & mysql.exe -h127.0.0.1 -P3306 "-u$DbUser" -e "CREATE DATABASE IF NOT EXISTS \`$dbNameVal\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    } catch {
        Write-Warning "Perintah mysql.exe tidak ditemukan di PATH sistem. Pastikan Laragon MySQL sudah berjalan di port 3306."
    }

    # Buat file .env lokal
    Write-Host "[5/6] Menggenerasi berkas .env..." -ForegroundColor Cyan
    $jwtSecret = [System.Guid]::NewGuid().ToString("N") + [System.Guid]::NewGuid().ToString("N")
    $envContent = @"
VITE_API_URL=http://localhost:$portVal
PORT=$portVal
NODE_ENV=production
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=$DbUser
DB_PASSWORD=$DbPassword
DB_NAME=$dbNameVal
JWT_SECRET=$jwtSecret
CORS_ORIGIN=http://localhost:$portVal
"@
    Set-Content -Path (Join-Path $clientDir ".env") -Value $envContent -Encoding UTF8

    # Migrasi, Seed & Build
    Write-Host "[6/6] Menjalankan migrasi, seed, dan kompilasi build..." -ForegroundColor Cyan
    Push-Location $clientDir
    try {
        npm run db:migrate
        npm run db:seed
        npm run build
        New-Item -ItemType Directory -Path (Join-Path $clientDir "server\uploads") -Force | Out-Null
    } finally {
        Pop-Location
    }

    # Catat ke Registry
    Init-Registry
    $reg = Get-Content $RegistryFile -Raw -Encoding UTF8 | ConvertFrom-Json
    $clientRecord = [PSCustomObject]@{
        slug = $slugVal
        domain = "http://localhost:$portVal"
        port = $portVal
        db_name = $dbNameVal
        status = "active"
        admin_user = "superadmin"
        admin_pass = $AdminPass
        created_at = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
    }
    $reg += $clientRecord
    $reg | ConvertTo-Json -Depth 5 | Set-Content $RegistryFile -Encoding UTF8

    Write-Host "`n==========================================================================" -ForegroundColor Green
    Write-Host "   🎉 INSTANCE KLIEN LOKAL BERHASIL DIBUAT!" -ForegroundColor Green
    Write-Host "==========================================================================" -ForegroundColor Green
    Write-Host "   🔗 URL Undangan     : http://localhost:$portVal" -ForegroundColor Cyan
    Write-Host "   🔐 URL Admin Panel  : http://localhost:$portVal/login" -ForegroundColor Cyan
    Write-Host "   👤 Akun Admin       : superadmin / $AdminPass"
    Write-Host "   💾 Database MySQL   : $dbNameVal"
    Write-Host "   📂 Folder Instance  : $clientDir"
    Write-Host "==========================================================================" -ForegroundColor Green
    Write-Host "Untuk menjalankan instance lokal ini di terminal baru:" -ForegroundColor Yellow
    Write-Host "cd $clientDir && npm run server" -ForegroundColor Yellow
    Write-Host ""
}

function List-Clients {
    Show-Banner
    Init-Registry
    Write-Host "DAFTAR INSTANCE KLIEN LOKAL (REGISTRY):`n" -ForegroundColor Cyan

    $reg = Get-Content $RegistryFile -Raw -Encoding UTF8 | ConvertFrom-Json
    if ($reg.Count -eq 0) {
        Write-Host "Belum ada instance klien lokal yang dibuat." -ForegroundColor Yellow
        return
    }

    $reg | Format-Table slug, port, status, domain, created_at -AutoSize
}

function Delete-Client {
    if ([string]::IsNullOrWhiteSpace($Slug)) {
        Write-Error "Harap tentukan -Slug <nama-klien> yang ingin dihapus."
        return
    }

    $clientDir = Join-Path $BaseDir $Slug
    if (-not (Test-Path $clientDir)) {
        Write-Error "Direktori klien '$clientDir' tidak ditemukan."
        return
    }

    $confirm = Read-Host "Apakah Anda yakin ingin menghapus instance '$Slug'? (Ketik 'HAPUS' untuk konfirmasi)"
    if ($confirm -ne "HAPUS") {
        Write-Host "Penghapusan dibatalkan." -ForegroundColor Yellow
        return
    }

    Remove-Item -Path $clientDir -Recurse -Force
    Init-Registry
    $reg = Get-Content $RegistryFile -Raw -Encoding UTF8 | ConvertFrom-Json
    $reg = @($reg | Where-Object { $_.slug -ne $Slug })
    $reg | ConvertTo-Json -Depth 5 | Set-Content $RegistryFile -Encoding UTF8

    Write-Host "Instance lokal '$Slug' berhasil dihapus." -ForegroundColor Green
}

function Show-Help {
    Show-Banner
    Write-Host "PANDUAN PENGGUNAAN SKRIP POWERSHELL LOKAL:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Membuat Instance Baru (Interaktif):"
    Write-Host "   powershell -ExecutionPolicy Bypass -File .\scripts\deploy-client.ps1 -Action create"
    Write-Host ""
    Write-Host "2. Membuat Instance Baru (Satu Baris):"
    Write-Host "   powershell -ExecutionPolicy Bypass -File .\scripts\deploy-client.ps1 -Action create -Slug budi-ani -Port 5002 -SharedModules"
    Write-Host ""
    Write-Host "3. Melihat Daftar Klien:"
    Write-Host "   powershell -ExecutionPolicy Bypass -File .\scripts\deploy-client.ps1 -Action list"
    Write-Host ""
    Write-Host "4. Menghapus Klien:"
    Write-Host "   powershell -ExecutionPolicy Bypass -File .\scripts\deploy-client.ps1 -Action delete -Slug budi-ani"
    Write-Host ""
}

switch ($Action.ToLower()) {
    "create" { Create-Client }
    "list"   { List-Clients }
    "delete" { Delete-Client }
    default  { Show-Help }
}
