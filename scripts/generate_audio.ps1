# Script de generación de audio para curso GitHub Principiantes
# Usa el motor TTS de Windows (System.Speech)

$courseDir = "e:\MyRepos\education\teach-laoz-courses-generator\cursos\teach-laoz-curso_github_Principiantes"
$modulesDir = Join-Path $courseDir "modulos"

# Lista de archivos de guiones optimizados
$audioScripts = @(
    @{Module = "modulo_0"; File = "tema_0.1_configuracion_guion_optimizada.txt"; Output = "tema_0.1_configuracion.wav" },
    @{Module = "modulo_0"; File = "tema_0.2_git_local_guion_optimizada.txt"; Output = "tema_0.2_git_local.wav" },
    @{Module = "modulo_1"; File = "tema_1.1_github_flow_guion_optimizada.txt"; Output = "tema_1.1_github_flow.wav" },
    @{Module = "modulo_1"; File = "tema_1.2_code_review_guion_optimizada.txt"; Output = "tema_1.2_code_review.wav" },
    @{Module = "modulo_1"; File = "tema_1.3_branch_protection_guion_optimizada.txt"; Output = "tema_1.3_branch_protection.wav" },
    @{Module = "modulo_2"; File = "tema_2.1_issues_guion_optimizada.txt"; Output = "tema_2.1_issues.wav" },
    @{Module = "modulo_2"; File = "tema_2.2_projects_guion_optimizada.txt"; Output = "tema_2.2_projects.wav" },
    @{Module = "modulo_2"; File = "tema_2.3_documentacion_guion_optimizada.txt"; Output = "tema_2.3_documentacion.wav" },
    @{Module = "modulo_3"; File = "tema_3.1_actions_fundamentos_guion_optimizada.txt"; Output = "tema_3.1_actions_fundamentos.wav" },
    @{Module = "modulo_3"; File = "tema_3.2_ci_implementacion_guion_optimizada.txt"; Output = "tema_3.2_ci_implementacion.wav" }
)

Write-Host "`n🎙️  GENERACIÓN DE ARCHIVOS DE AUDIO`n" -ForegroundColor Cyan

# Cargar el ensamblado de síntesis de voz
Add-Type -AssemblyName System.Speech

$synthesizer = New-Object System.Speech.Synthesis.SpeechSynthesizer

# Intentar seleccionar voz en español
try {
    # Listar voces disponibles
    Write-Host "Voces disponibles:" -ForegroundColor Yellow
    $synthesizer.GetInstalledVoices() | ForEach-Object {
        Write-Host "  - $($_.VoiceInfo.Name)" -ForegroundColor Gray
    }
    
    # Intentar seleccionar voz en español (común en Windows en español)
    $spanishVoices = @("Microsoft Sabina Desktop", "Microsoft Helena Desktop", "Microsoft Raul Desktop")
    $voiceSelected = $false
    
    foreach ($voice in $spanishVoices) {
        try {
            $synthesizer.SelectVoice($voice)
            Write-Host "`n✓ Usando voz: $voice`n" -ForegroundColor Green
            $voiceSelected = $true
            break
        }
        catch {
            # Continuar con la siguiente voz
        }
    }
    
    if (-not $voiceSelected) {
        Write-Host "`n⚠️  No se encontró voz en español, usando voz predeterminada`n" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "`n⚠️  Error al seleccionar voz, usando predeterminada`n" -ForegroundColor Yellow
}

# Configurar velocidad de habla (normal)
$synthesizer.Rate = 0

$generated = 0
$errors = 0

foreach ($script in $audioScripts) {
    $inputPath = Join-Path (Join-Path $modulesDir $script.Module) $script.File
    $outputPath = Join-Path (Join-Path $modulesDir $script.Module) $script.Output
    
    if (Test-Path $inputPath) {
        try {
            # Leer el texto del guion
            $text = Get-Content -Path $inputPath -Raw -Encoding UTF8
            
            # Limpiar el texto (remover caracteres problemáticos)
            $text = $text -replace '[^\x00-\x7F]+', ' '  # Remover caracteres no-ASCII problemáticos
            
            Write-Host "Generando: $($script.Module)/$($script.Output)..." -NoNewline
            
            # Configurar salida a archivo WAV
            $synthesizer.SetOutputToWaveFile($outputPath)
            
            # Generar el audio
            $synthesizer.Speak($text)
            
            # Verificar que se creó el archivo
            if (Test-Path $outputPath) {
                $size = (Get-Item $outputPath).Length
                $sizeKB = [math]::Round($size / 1KB, 2)
                Write-Host " ✓ ($sizeKB KB)" -ForegroundColor Green
                $generated++
            }
            else {
                Write-Host " ✗ (No se creó el archivo)" -ForegroundColor Red
                $errors++
            }
            
        }
        catch {
            Write-Host " ✗ (Error: $($_.Exception.Message))" -ForegroundColor Red
            $errors++
        }
    }
    else {
        Write-Host "⚠️  No encontrado: $inputPath" -ForegroundColor Yellow
        $errors++
    }
}

# Limpiar
$synthesizer.Dispose()

# Resumen
Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
Write-Host "📊 RESUMEN DE GENERACIÓN" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host "Archivos generados: $generated/$($audioScripts.Count)" -ForegroundColor $(if ($generated -eq $audioScripts.Count) { "Green" } else { "Yellow" })
Write-Host "Errores: $errors" -ForegroundColor $(if ($errors -eq 0) { "Green" } else { "Red" })
Write-Host ("=" * 60) -ForegroundColor Cyan

if ($generated -eq $audioScripts.Count) {
    Write-Host "`n✅ Generación de audio completada exitosamente`n" -ForegroundColor Green
    exit 0
}
else {
    Write-Host "`n⚠️  Generación completada con advertencias`n" -ForegroundColor Yellow
    exit 1
}
