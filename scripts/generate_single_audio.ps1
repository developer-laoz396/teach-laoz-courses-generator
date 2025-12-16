# Script simplificado de generación de audio
# Genera un archivo de audio por vez

param(
    [string]$InputFile,
    [string]$OutputFile
)

if (-not $InputFile -or -not $OutputFile) {
    Write-Host "Uso: .\generate_single_audio.ps1 -InputFile 'ruta\al\guion.txt' -OutputFile 'ruta\salida.wav'"
    exit 1
}

if (-not (Test-Path $InputFile)) {
    Write-Host "Error: No se encontró el archivo $InputFile"
    exit 1
}

Write-Host "Generando audio desde: $InputFile"

Add-Type -AssemblyName System.Speech
$synthesizer = New-Object System.Speech.Synthesis.SpeechSynthesizer

# Leer texto
$text = Get-Content -Path $InputFile -Raw -Encoding UTF8

# Configurar salida
$synthesizer.SetOutputToWaveFile($OutputFile)

# Generar audio
$synthesizer.Speak($text)

# Limpiar
$synthesizer.Dispose()

if (Test-Path $OutputFile) {
    $size = (Get-Item $OutputFile).Length / 1KB
    Write-Host "✓ Audio generado: $OutputFile ($([math]::Round($size, 2)) KB)"
    exit 0
}
else {
    Write-Host "✗ Error al generar audio"
    exit 1
}
