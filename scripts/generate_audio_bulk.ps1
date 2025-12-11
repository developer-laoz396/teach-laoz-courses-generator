# Script para generación masiva de audio desde guiones optimizados
# Busca archivos *_guion_optimizada.txt y genera su correspondiente .wav

param (
    [string]$RootDirectory = "e:\repositories\teach-laoz-courses-generator\cursos\teach-laoz-curso_optimizacion_entrenamientos"
)

Add-Type -AssemblyName System.Speech
$synthesizer = New-Object System.Speech.Synthesis.SpeechSynthesizer

# Configurar voz (Intentar Sabina, si no Default)
try {
    $synthesizer.SelectVoice("Microsoft Sabina Desktop")
    Write-Host "Voz seleccionada: Microsoft Sabina Desktop" -ForegroundColor Green
} catch {
    Write-Host "Voz 'Microsoft Sabina Desktop' no encontrada. Usando voz predeterminada." -ForegroundColor Yellow
}

# Recursivamente encontrar todos los archivos _guion_optimizada.txt
$files = Get-ChildItem -Path $RootDirectory -Recurse -Filter "*_guion_optimizada.txt"

foreach ($file in $files) {
    $wavName = $file.Name -replace "_guion_optimizada.txt", "_audio.wav"
    $wavPath = Join-Path $file.DirectoryName $wavName
    
    # Check if needs generation (optional: could skip if exists)
    # For now, we overwrite to ensure latest version
    
    Write-Host "Generando audio para: $($file.Name)..." -NoNewline
    
    try {
        $text = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        if ([string]::IsNullOrWhiteSpace($text)) {
            Write-Host " [SKIPPED - EMPTY]" -ForegroundColor Red
            continue
        }

        $synthesizer.SetOutputToWaveFile($wavPath)
        $synthesizer.Speak($text)
        $synthesizer.SetOutputToNull() # Release file lock
        
        Write-Host " [OK] -> $wavName" -ForegroundColor Green
    } catch {
        Write-Host " [ERROR]" -ForegroundColor Red
        Write-Error $_
    }
}

$synthesizer.Dispose()
Write-Host "Proceso completado." -ForegroundColor Cyan
