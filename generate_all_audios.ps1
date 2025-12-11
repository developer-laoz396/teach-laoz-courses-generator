param(
    [Parameter(Mandatory=$true)]
    [string]$BaseDirectory,
    
    [Parameter(Mandatory=$false)]
    [string]$OutputDirectory = "",
    
    [Parameter(Mandatory=$false)]
    [string]$VoiceName = "Microsoft Sabina Desktop"
)

# Voces preferidas en orden de prioridad
$preferredVoices = @(
    "Microsoft Sabina Desktop",                        # Predeterminada (España)
    "Microsoft Salome Desktop - Spanish (Colombia)",  # Alternativa Colombia
    "Microsoft Helena Desktop"                         # Alternativa España
)

# Función para extraer el texto del guión
function Extract-ScriptText {
    param(
        [string]$FilePath
    )
    
    try {
        $content = Get-Content -Path $FilePath -Raw -Encoding UTF8
        
        # Intentar extraer texto con el marcador **[LOCUTOR]**
        # Soporta dos formatos:
        # 1. **[LOCUTOR]**: texto en la misma línea
        # 2. **[LOCUTOR]**:\n texto en la siguiente línea
        $pattern = '\*\*\[LOCUTOR\]\*\*:?\s*(.*?)(?=\n###|\*\*\[LOCUTOR\]\*\*|\z)'
        $matches = [regex]::Matches($content, $pattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
        
        $extractedText = @()
        
        if ($matches.Count -gt 0) {
            # Formato con marcador [LOCUTOR]
            foreach ($match in $matches) {
                $text = $match.Groups[1].Value.Trim()
                if ([string]::IsNullOrWhiteSpace($text)) {
                    continue
                }
                # Limpiar el texto: remover saltos de línea extras y normalizar espacios
                $text = $text -replace '\r\n', ' ' -replace '\n', ' ' -replace '\s+', ' '
                $extractedText += $text
            }
        }
        else {
            # Formato sin marcador [LOCUTOR] - usar todo el contenido
            # Remover metadatos comunes (líneas que empiezan con #, -, **, etc.)
            $lines = $content -split '\r?\n'
            $textLines = @()
            
            foreach ($line in $lines) {
                $trimmed = $line.Trim()
                # Saltar líneas vacías y metadatos
                if ([string]::IsNullOrWhiteSpace($trimmed)) { continue }
                if ($trimmed -match '^#{1,6}\s') { continue }  # Títulos markdown
                if ($trimmed -match '^-{3,}$') { continue }    # Separadores
                if ($trimmed -match '^\*\*[^:]+\*\*:\s*$') { continue }  # Etiquetas sin contenido
                if ($trimmed -match '^-\s*\*\*') { continue }  # Listas de metadatos
                
                $textLines += $trimmed
            }
            
            if ($textLines.Count -gt 0) {
                $extractedText = $textLines
            }
        }
        
        # Unir todos los fragmentos con un espacio
        $finalText = ($extractedText -join ' ').Trim()
        
        # Limpiar comentarios y direcciones de producción
        # Remover secciones "NOTAS DE PRODUCCIÓN" completas
        # Coincide con: NOTAS DE PRODUCCIÓN (con/sin asteriscos) hasta el siguiente título ## o final
        $finalText = $finalText -replace '(?i)\*?\*?NOTAS?\s+DE\s+PRODUCCI[OÓ]N\*?\*?:?.*?(?=##|\z)', ''
        
        # Remover contenido entre corchetes [...]
        $finalText = $finalText -replace '\[[^\]]*\]', ''
        
        # Remover asteriscos (markdown bold)
        $finalText = $finalText -replace '\*\*', ''
        
        # Remover guiones bajos (markdown italic)
        $finalText = $finalText -replace '_', ''
        
        # Remover backticks (código inline)
        $finalText = $finalText -replace '`', ''
        
        # Remover marcadores de tiempo [00:00-00:00]
        $finalText = $finalText -replace '\[\d{2}:\d{2}-\d{2}:\d{2}\]', ''
        $finalText = $finalText -replace '\[\d{2}:\d{2}\s*-\s*\d{2}:\d{2}\]', ''
        
        # Remover etiquetas HTML comunes
        $finalText = $finalText -replace '<[^>]+>', ''
        
        # Normalizar espacios múltiples
        $finalText = $finalText -replace '\s+', ' '
        
        return $finalText.Trim()
    }
    catch {
        Write-Error "Error al procesar el archivo $FilePath : $_"
        return $null
    }
}

# Función para extraer el identificador del archivo (modulo_X_tema_X.X_subtema_X.X.X)
function Get-AudioFileName {
    param(
        [string]$GuionFilePath,
        [string]$BaseDir
    )
    
    $fileName = [System.IO.Path]::GetFileNameWithoutExtension($GuionFilePath)
    # Remover el sufijo '_guion' del nombre
    $audioName = $fileName -replace '_guion$', ''
    
    # Extraer el número de módulo del path
    $relativePath = $GuionFilePath.Replace($BaseDir, '').TrimStart('\', '/')
    if ($relativePath -match 'modulo_(\d+)') {
        $moduloNum = $matches[1]
        return "modulo_${moduloNum}_${audioName}.wav"
    }
    
    return "${audioName}.wav"
}

# Validar que el directorio base existe
if (-not (Test-Path $BaseDirectory)) {
    Write-Error "El directorio especificado no existe: $BaseDirectory"
    exit 1
}

# Si no se especifica directorio de salida, usar media/ dentro del directorio base
if ([string]::IsNullOrWhiteSpace($OutputDirectory)) {
    $OutputDirectory = Join-Path $BaseDirectory "media"
}

# Crear el directorio de salida si no existe
if (-not (Test-Path $OutputDirectory)) {
    New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
    Write-Host "Directorio de salida creado: $OutputDirectory"
}

# Buscar todos los archivos *_guion.md
$guionFiles = Get-ChildItem -Path $BaseDirectory -Filter "*_guion.md" -Recurse

if ($guionFiles.Count -eq 0) {
    Write-Warning "No se encontraron archivos *_guion.md en el directorio: $BaseDirectory"
    exit 0
}

Write-Host "Se encontraron $($guionFiles.Count) archivos de guión."
Write-Host "Voz seleccionada: $VoiceName"
Write-Host "Directorio de salida: $OutputDirectory"
Write-Host "---"

# Inicializar el sintetizador de voz
Add-Type -AssemblyName System.Speech
$synthesizer = New-Object System.Speech.Synthesis.SpeechSynthesizer

# Obtener voces instaladas
$installedVoices = $synthesizer.GetInstalledVoices() | ForEach-Object { $_.VoiceInfo.Name }

Write-Host "Voces instaladas en el sistema:" -ForegroundColor Cyan
$installedVoices | ForEach-Object {
    Write-Host "  - $_" -ForegroundColor Gray
}
Write-Host ""

# Seleccionar la mejor voz disponible
$selectedVoice = $null
foreach ($voice in $preferredVoices) {
    if ($installedVoices -contains $voice) {
        $selectedVoice = $voice
        break
    }
}

if ($null -eq $selectedVoice) {
    Write-Error "❌ No se encontró ninguna voz en español. Voces disponibles:"
    $installedVoices | ForEach-Object { Write-Host "  - $_" }
    Write-Host "`n⚠ Instala una voz en español desde:"
    Write-Host "  Configuración > Hora e idioma > Voz > Agregar voces"
    $synthesizer.Dispose()
    exit 1
}

try {
    $synthesizer.SelectVoice($selectedVoice)
    Write-Host "✓ Usando voz: '$selectedVoice'" -ForegroundColor Green
}
catch {
    Write-Error "❌ Error al configurar la voz: $_"
    $synthesizer.Dispose()
    exit 1
}

Write-Host "---"

# Contadores
$processedCount = 0
$errorCount = 0
$skippedCount = 0

# Procesar cada archivo de guión
foreach ($guionFile in $guionFiles) {
    $relPath = $guionFile.FullName.Replace($BaseDirectory, '').TrimStart('\', '/')
    Write-Host "[Procesando] $relPath"
    
    # Extraer el texto del guión
    $scriptText = Extract-ScriptText -FilePath $guionFile.FullName
    
    if ([string]::IsNullOrWhiteSpace($scriptText)) {
        Write-Warning "  ⚠ No se pudo extraer texto del guión. Saltando..."
        $skippedCount++
        continue
    }
    
    # Generar el nombre del archivo de audio
    $audioFileName = Get-AudioFileName -GuionFilePath $guionFile.FullName -BaseDir $BaseDirectory
    $audioFilePath = Join-Path $OutputDirectory $audioFileName
    
    try {
        # Configurar la salida de audio
        $synthesizer.SetOutputToWaveFile($audioFilePath)
        
        # Generar el audio
        $synthesizer.Speak($scriptText)
        
        Write-Host "  ✓ Audio generado: $audioFileName"
        $processedCount++
    }
    catch {
        Write-Error "  ✗ Error al generar audio: $_"
        $errorCount++
    }
}

# Liberar recursos
$synthesizer.Dispose()

# Resumen final
Write-Host "---"
Write-Host "RESUMEN:"
Write-Host "  ✓ Procesados correctamente: $processedCount"
if ($skippedCount -gt 0) {
    Write-Host "  ⚠ Saltados: $skippedCount"
}
if ($errorCount -gt 0) {
    Write-Host "  ✗ Errores: $errorCount"
}
Write-Host "---"
Write-Host "Proceso completado."
