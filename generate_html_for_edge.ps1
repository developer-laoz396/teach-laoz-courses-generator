param(
    [Parameter(Mandatory=$true)]
    [string]$BaseDirectory,
    
    [Parameter(Mandatory=$false)]
    [string]$OutputDirectory = ""
)

# Función para extraer y limpiar el contenido markdown
function Extract-ScriptText {
    param(
        [string]$FilePath
    )
    
    try {
        $content = Get-Content -Path $FilePath -Raw -Encoding UTF8
        
        # Remover secciones "NOTAS DE PRODUCCIÓN" completas
        $content = $content -replace '(?si)#+\s*NOTAS?\s+DE\s+PRODUCCI[OÓ]N.*?(?=\n#{1,3}\s|\z)', ''
        
        # Remover marcadores de tiempo [00:00-00:00]
        $content = $content -replace '\[\d{2}:\d{2}\s*-?\s*\d{2}:\d{2}\]', ''
        
        # Remover contenido entre corchetes [...] (comentarios de producción)
        $content = $content -replace '\[[^\]]*\]', ''
        
        # Remover separadores --- al inicio de línea
        $content = $content -replace '(?m)^-{3,}$', ''
        
        # Limpiar líneas vacías múltiples
        $content = $content -replace '(?m)^\s*$\n', "`n"
        
        return $content.Trim()
    }
    catch {
        Write-Error "Error al procesar el archivo $FilePath : $_"
        return $null
    }
}

# Función para convertir Markdown a HTML
function ConvertTo-HTML {
    param(
        [string]$Markdown
    )
    
    # Convertir títulos
    $html = $Markdown -replace '(?m)^### (.+)$', '<h3>$1</h3>'
    $html = $html -replace '(?m)^## (.+)$', '<h2>$1</h2>'
    $html = $html -replace '(?m)^# (.+)$', '<h1>$1</h1>'
    
    # Convertir negritas
    $html = $html -replace '\*\*([^\*]+)\*\*', '<strong>$1</strong>'
    
    # Convertir cursivas
    $html = $html -replace '\*([^\*]+)\*', '<em>$1</em>'
    
    # Convertir código inline
    $html = $html -replace '`([^`]+)`', '<code>$1</code>'
    
    # Convertir bloques de código
    $html = $html -replace '(?s)```(\w+)?\n(.*?)```', '<pre><code>$2</code></pre>'
    
    # Convertir listas
    $html = $html -replace '(?m)^- (.+)$', '<li>$1</li>'
    $html = $html -replace '(?m)^(\d+)\. (.+)$', '<li>$2</li>'
    
    # Envolver listas consecutivas en ul/ol
    $html = $html -replace '(<li>.*?</li>\n)+', '<ul>$0</ul>'
    
    # Convertir párrafos (líneas sin tags)
    $lines = $html -split '\n'
    $result = @()
    foreach ($line in $lines) {
        $trimmed = $line.Trim()
        if ($trimmed -and $trimmed -notmatch '^<(h\d|ul|ol|li|pre|code)') {
            $result += "<p>$trimmed</p>"
        } else {
            $result += $line
        }
    }
    
    return ($result -join "`n")
}

# Función para generar HTML optimizado para lectura en Edge
function Generate-HTML {
    param(
        [string]$Title,
        [string]$MarkdownContent
    )
    
    $htmlContent = ConvertTo-HTML -Markdown $MarkdownContent
    
    return @"
<!DOCTYPE html>
<html lang="es-CO">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$Title</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 900px;
            margin: 30px auto;
            padding: 20px;
            line-height: 1.8;
            font-size: 18px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: white;
            padding: 50px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 15px;
            margin-bottom: 30px;
        }
        h2 {
            color: #34495e;
            margin-top: 40px;
            margin-bottom: 20px;
            border-left: 4px solid #3498db;
            padding-left: 15px;
        }
        h3 {
            color: #546e7a;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        p {
            color: #333;
            text-align: justify;
            margin: 15px 0;
        }
        ul, ol {
            margin: 15px 0;
            padding-left: 30px;
        }
        li {
            margin: 8px 0;
            color: #333;
        }
        strong {
            color: #2c3e50;
        }
        em {
            color: #546e7a;
        }
        code {
            background-color: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 16px;
        }
        pre {
            background-color: #282c34;
            color: #abb2bf;
            padding: 20px;
            border-radius: 5px;
            overflow-x: auto;
            margin: 20px 0;
        }
        pre code {
            background-color: transparent;
            color: inherit;
            padding: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        $htmlContent
    </div>
</body>
</html>
"@
}

# Validar que el directorio base existe
if (-not (Test-Path $BaseDirectory)) {
    Write-Error "El directorio base no existe: $BaseDirectory"
    exit 1
}

# Si no se especifica directorio de salida, usar html_audios/ dentro del directorio base
if ([string]::IsNullOrWhiteSpace($OutputDirectory)) {
    $OutputDirectory = Join-Path $BaseDirectory "html_audios"
}

# Crear el directorio de salida si no existe
if (-not (Test-Path $OutputDirectory)) {
    New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
    Write-Host "Directorio de salida creado: $OutputDirectory" -ForegroundColor Green
}

# Buscar todos los archivos *_guion.md
$guionFiles = Get-ChildItem -Path $BaseDirectory -Filter "*_guion.md" -Recurse

if ($guionFiles.Count -eq 0) {
    Write-Warning "No se encontraron archivos *_guion.md en el directorio: $BaseDirectory"
    exit 0
}

Write-Host "`n===========================================" -ForegroundColor Cyan
Write-Host "  GENERADOR DE HTML PARA LECTURA EN EDGE" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "Archivos encontrados: $($guionFiles.Count)" -ForegroundColor Yellow
Write-Host "Directorio de salida: $OutputDirectory" -ForegroundColor Yellow
Write-Host "---`n"

# Contadores
$processedCount = 0
$errorCount = 0
$skippedCount = 0

# Procesar cada archivo de guión
foreach ($guionFile in $guionFiles) {
    $relPath = $guionFile.FullName.Replace($BaseDirectory, '').TrimStart('\', '/')
    Write-Host "[Procesando] $relPath" -ForegroundColor Cyan
    
    # Extraer el texto del guión
    $scriptText = Extract-ScriptText -FilePath $guionFile.FullName
    
    if ([string]::IsNullOrWhiteSpace($scriptText)) {
        Write-Warning "  ⚠ No se pudo extraer texto del guión. Saltando..."
        $skippedCount++
        continue
    }
    
    # Generar título desde el nombre del archivo
    $fileName = [System.IO.Path]::GetFileNameWithoutExtension($guionFile.Name)
    $title = $fileName -replace '_guion$', '' -replace '_', ' '
    $title = (Get-Culture).TextInfo.ToTitleCase($title.ToLower())
    
    # Generar el nombre del archivo HTML
    $htmlFileName = $fileName -replace '_guion$', ''
    $htmlFileName = "$htmlFileName.html"
    $htmlFilePath = Join-Path $OutputDirectory $htmlFileName
    
    try {
        # Generar HTML
        $htmlContent = Generate-HTML -Title $title -Content $scriptText
        
        # Guardar archivo
        $htmlContent | Out-File -FilePath $htmlFilePath -Encoding UTF8
        
        Write-Host "  ✓ HTML generado: $htmlFileName" -ForegroundColor Green
        $processedCount++
    }
    catch {
        Write-Error "  ✗ Error al generar HTML: $_"
        $errorCount++
    }
}

# Generar página índice
Write-Host "`n[Generando índice]" -ForegroundColor Cyan
$indexContent = @"
<!DOCTYPE html>
<html lang="es-CO">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Índice de Guiones - Lectura en Edge</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1000px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        .stats {
            background-color: #e8f4f8;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .file-list {
            list-style: none;
            padding: 0;
        }
        .file-list li {
            padding: 12px;
            margin: 8px 0;
            background-color: #f8f9fa;
            border-left: 4px solid #3498db;
            border-radius: 4px;
            transition: all 0.3s;
        }
        .file-list li:hover {
            background-color: #e3f2fd;
            transform: translateX(5px);
        }
        .file-list a {
            text-decoration: none;
            color: #2980b9;
            font-weight: 500;
        }
        .file-list a:hover {
            color: #3498db;
        }
        .instructions {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📚 Índice de Guiones para Lectura en Edge</h1>
        
        <div class="instructions">
            <h2>🎧 Cómo usar:</h2>
            <ol>
                <li>Haz clic en cualquier guión de la lista</li>
                <li>En la página que se abre, haz clic derecho → <strong>"Leer en voz alta"</strong> (o <strong>Ctrl+Shift+U</strong>)</li>
                <li>Selecciona la voz <strong>es-CO-SalomeNeural</strong> en las opciones</li>
                <li>Disfruta de la lectura con voz natural de Salome (Colombia)</li>
            </ol>
        </div>
        
        <div class="stats">
            <strong>Total de guiones generados:</strong> $processedCount
        </div>
        
        <ul class="file-list">
"@

# Agregar enlaces a todos los archivos HTML generados
$htmlFiles = Get-ChildItem -Path $OutputDirectory -Filter "*.html" | Where-Object { $_.Name -ne "index.html" } | Sort-Object Name

foreach ($htmlFile in $htmlFiles) {
    $displayName = [System.IO.Path]::GetFileNameWithoutExtension($htmlFile.Name) -replace '_', ' '
    $displayName = (Get-Culture).TextInfo.ToTitleCase($displayName.ToLower())
    $indexContent += "            <li><a href=`"$($htmlFile.Name)`">$displayName</a></li>`n"
}

$indexContent += @"
        </ul>
    </div>
</body>
</html>
"@

$indexPath = Join-Path $OutputDirectory "index.html"
$indexContent | Out-File -FilePath $indexPath -Encoding UTF8
Write-Host "  ✓ Índice generado: index.html" -ForegroundColor Green

# Resumen final
Write-Host "`n===========================================" -ForegroundColor Cyan
Write-Host "  RESUMEN" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  ✓ Procesados correctamente: $processedCount" -ForegroundColor Green
if ($skippedCount -gt 0) {
    Write-Host "  ⚠ Saltados: $skippedCount" -ForegroundColor Yellow
}
if ($errorCount -gt 0) {
    Write-Host "  ✗ Errores: $errorCount" -ForegroundColor Red
}
Write-Host "---"
Write-Host "📂 Archivos generados en: $OutputDirectory" -ForegroundColor Cyan
Write-Host "🌐 Abre 'index.html' en Edge para comenzar" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Cyan

# Preguntar si quiere abrir el índice
$response = Read-Host "`n¿Deseas abrir el índice en Edge ahora? (S/N)"
if ($response -eq 'S' -or $response -eq 's') {
    Start-Process msedge $indexPath
}
