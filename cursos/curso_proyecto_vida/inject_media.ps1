param(
    [string]$CourseDir = "e:\repositories\teach-laoz-courses-generator\cursos\curso_proyecto_vida"
)

$mediaDir = Join-Path $CourseDir "media"
$modulesDir = Join-Path $CourseDir "modulos"

Write-Host "Iniciando inyección de medios en: $modulesDir"

# Obtener todos los archivos de contenido
$contentFiles = Get-ChildItem -Path $modulesDir -Filter "*_contenido.md" -Recurse

foreach ($file in $contentFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $fileName = $file.Name
    $baseName = $file.BaseName -replace "_contenido$", "" 
    # $baseName ejemplo: tema_1.1__el_espejo_interior_

    # 1. BUSCAR AUDIO CORRESPONDIENTE
    # Los audios tienen formato: modulo_X_tema_X.X_..._.wav
    # Buscamos un archivo en media que contenga el baseName (menos el prefijo de modulo si es necesario, 
    # pero el baseName es bastante único).
    
    # Intento de match simple
    $audioMatch = Get-ChildItem -Path $mediaDir -Filter "*$baseName.wav" | Select-Object -First 1

    $hasChanges = $false
    $newContent = $content

    # Inyeccion de Audio
    if ($audioMatch) {
        $audioFileName = $audioMatch.Name
        $relativePath = "../../media/$audioFileName"
        $audioTag = "<audio controls src=`"$relativePath`" style=`"width: 100%; margin-bottom: 20px;`"></audio>"
        
        if ($content -notmatch "<audio") {
            # Insertar después del primer título H1 o al inicio
            if ($newContent -match "(?m)^# .+$") {
                $newContent = $newContent -replace "(?m)(^# .+$)", "`$1`n`n$audioTag"
            } else {
                $newContent = "$audioTag`n`n$newContent"
            }
            Write-Host "  [AUDIO] Inyectado en $fileName"
            $hasChanges = $true
        }
    }

    # 2. INYECCION DE IMAGENES ESPECIFICAS
    # Tema 2.1 -> brujula_foda.png
    if ($fileName -match "tema_2.1") {
        $imageTag = "`n![FODA Personal](../../media/brujula_foda.png)`n"
        if ($content -notmatch "brujula_foda.png") {
            # Insertar antes de "## 2. LA HERRAMIENTA FODA" si existe, o al final de la intro
            if ($newContent -match "## 2.") {
                $newContent = $newContent -replace "(## 2.)", "$imageTag`n`$1"
            } else {
                $newContent = "$newContent`n$imageTag"
            }
            Write-Host "  [IMAGEN] Brujula FODA inyectada en $fileName"
            $hasChanges = $true
        }
    }

    # Tema 4.1 -> vision_futuro.png
    if ($fileName -match "tema_4.1") {
        $imageTag = "`n![Visión de Futuro](../../media/vision_futuro.png)`n"
        if ($content -notmatch "vision_futuro.png") {
            # Insertar despues del titulo
             if ($newContent -match "(?m)^# .+$") {
                $newContent = $newContent -replace "(?m)(^# .+$)", "`$1`n`n$imageTag"
            } else {
                $newContent = "$newContent`n$imageTag"
            }
            Write-Host "  [IMAGEN] Visión Futuro inyectada en $fileName"
            $hasChanges = $true
        }
    }

    if ($hasChanges) {
        $newContent | Set-Content $file.FullName -Encoding UTF8
    }
}

Write-Host "Proceso finalizado."
