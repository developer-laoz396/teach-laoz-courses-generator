const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItContainer = require('markdown-it-container');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Configuración de Markdown-it
const md = markdownIt({
    html: true,
    linkify: true,
    typographer: true
})
    .use(markdownItAnchor, {
        slugify: (s) => String(s).trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
    })
    .use(markdownItContainer, 'NOTE', {
        render: function (tokens, idx) {
            if (tokens[idx].nesting === 1) {
                return '<div class="alert alert-note"><strong>NOTA</strong>: ';
            } else {
                return '</div>\n';
            }
        }
    })
    .use(markdownItContainer, 'WARNING', {
        render: function (tokens, idx) {
            if (tokens[idx].nesting === 1) {
                return '<div class="alert alert-warning"><strong>ADVERTENCIA</strong>: ';
            } else {
                return '</div>\n';
            }
        }
    });

// Custom fence renderer para Mermaid
const defaultFence = md.renderer.rules.fence || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
};

md.renderer.rules.fence = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const info = token.info ? String(token.info).trim() : '';

    if (info === 'mermaid') {
        return '<div class="mermaid">\n' + token.content + '\n</div>\n';
    }

    return defaultFence(tokens, idx, options, env, self);
};

const argv = yargs(hideBin(process.argv))
    .option('course', { alias: 'c', type: 'string', demandOption: true })
    .option('output', { alias: 'o', type: 'string', default: 'Curso_Completo_v2.pdf' })
    .argv;

// Helper para generar IDs limpios
const slugify = (s) => String(s).trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

let globalSolucionario = []; // Acumulador de respuestas
let tocData = []; // Acumulador para TOC

function processContent(content, modTitle, fileName) {
    // 1. Detectar si es Evaluación
    const isEvaluation = fileName.includes('evaluacion');

    // 2. Extraer Respuestas si es evaluación
    if (isEvaluation) {
        const split = content.split(/##\s*Respuestas/i);
        if (split.length > 1) {
            content = split[0]; // Quedarse solo con preguntas
            const respuestas = split[1].trim();
            // Guardar para el final
            globalSolucionario.push({
                module: modTitle,
                context: content.split('\n')[0].replace(/^#+\s*/, ''), // Intentar sacar titulo
                answers: respuestas
            });
        }
    }

    // 3. Formatear Preguntas (convertir a) b) c) en checklist visual)
    content = content.replace(/^(\s*)([a-z])\)\s+(.*)/gm, (match, space, letter, text) => {
        return `${space}- [ ] **${letter})** ${text}`; // Convertir a lista de markdown con checkbox
    });

    // 4. Procesar Headers para TOC (y ajustar nivel si es necesario)
    const lines = content.split('\n');
    const processedLines = lines.map(line => {
        const match = line.match(/^(#{1,3})\s+(.*)/);
        if (match) {
            const level = match[1].length;
            const text = match[2];
            const id = slugify(text);
            if (level <= 2) {
                tocData.push({ level, text, id });
            }
        }
        return line;
    });

    return processedLines.join('\n');
}

async function main() {
    const coursePath = path.resolve(argv.course);
    const outputPath = path.resolve(coursePath, argv.output); // Guardar en raiz del curso

    console.log(`📑 Procesando curso: ${coursePath}`);

    // Título del curso
    let courseTitle = 'Manual del Curso';
    const envPath = path.join(coursePath, '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const match = envContent.match(/COURSE_TOPIC=(.*)/);
        if (match) courseTitle = match[1];
    }

    let modulesHTML = '';

    // Iterar Módulos
    const modulesDir = path.join(coursePath, 'modulos');
    if (fs.existsSync(modulesDir)) {
        const modules = fs.readdirSync(modulesDir).sort();

        for (const mod of modules) {
            const modPath = path.join(modulesDir, mod);
            if (fs.statSync(modPath).isDirectory()) {
                const modNiceName = mod.replace(/_/g, ' ').toUpperCase();

                // Header del Módulo
                modulesHTML += `<div class="module-section">
                    <h1 id="${slugify(modNiceName)}" class="module-title">${modNiceName}</h1>
                </div>\n`;
                tocData.push({ level: 1, text: modNiceName, id: slugify(modNiceName) });

                // Archivos del módulo (Excluyendo guiones)
                const files = fs.readdirSync(modPath)
                    .filter(f => f.endsWith('.md') && !f.includes('guion'))
                    .sort();

                for (const file of files) {
                    const filePath = path.join(modPath, file);
                    let rawContent = fs.readFileSync(filePath, 'utf-8');

                    // Limpieza Frontmatter
                    rawContent = rawContent.replace(/^---[\s\S]*?---\n/, '');

                    // Procesamiento Inteligente
                    rawContent = processContent(rawContent, modNiceName, file);

                    // Ajuste de Rutas de Imagen
                    rawContent = rawContent.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, src) => {
                        if (!src.startsWith('http') && !src.startsWith('file:')) {
                            let absSrc = path.resolve(modPath, src);
                            if (!fs.existsSync(absSrc)) { // Fallback a media raiz
                                const mediaRoot = path.join(coursePath, 'media', path.basename(src));
                                if (fs.existsSync(mediaRoot)) absSrc = mediaRoot;
                            }
                            return `![${alt}](file://${absSrc.replace(/\\/g, '/')})`;
                        }
                        return match;
                    });

                    // Render HTML
                    let html = md.render(rawContent);

                    // Contenedor para salto de pagina
                    modulesHTML += `<div class="content-block">\n${html}\n</div>\n<div style="page-break-after: always; break-after: page;"></div>\n`;
                }
            }
        }
    }

    // Generar HTML del TOC
    let tocHTML = `<ul class="toc-list">`;
    tocData.forEach(item => {
        tocHTML += `<li class="toc-item-${item.level}"><a href="#${item.id}">${item.text}</a></li>`;
    });
    tocHTML += `</ul>`;

    // Generar HTML del Solucionario
    let solucionarioHTML = '';
    if (globalSolucionario.length > 0) {
        solucionarioHTML += `<div style="page-break-after: always; break-after: page;"></div><h1 id="solucionario">Solucionario</h1>`;
        tocData.push({ level: 1, text: 'Solucionario', id: 'solucionario' });

        globalSolucionario.forEach(item => {
            solucionarioHTML += `<div class="solution-block">
                <h3>${item.context} (${item.module})</h3>
                <div class="solution-content">${md.render(item.answers)}</div>
            </div>`;
        });
    }

    // CSS
    const cssContent = fs.readFileSync(path.resolve(__dirname, '../templates/styles.css'), 'utf-8');

    // Plantilla Final
    const fullHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>${cssContent}</style>
        <!-- Mermaid CDN -->
        <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
        <!-- Paged.js Polyfill para Paginación Real -->
        <script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>
        
        <style>
            @page {
                size: A4;
                margin: 20mm;
                @bottom-center {
                    content: "Página " counter(page);
                    font-size: 10pt;
                    color: #94a3b8;
                }
            }
        </style>

        <script>
            mermaid.initialize({
                startOnLoad: false, // Control manual
                theme: 'neutral',
            });
            window.PagedConfig = {
                auto: false // Importante: control manual
            };
        </script>
    </head>
    <body>
        <div class="cover-page">
            <div class="logo-container">
                <img src="file://${path.resolve(__dirname, '../templates/logo.svg')}" class="logo">
            </div>
            <h1 class="main-title">${courseTitle}</h1>
            <p class="subtitle">Manual del Estudiante</p>
            <div class="meta">Generated by Teach Laoz AI | ${new Date().toLocaleDateString()}</div>
        </div>
        
        <div class="page-break"></div>

        <main>
            ${modulesHTML}
        </main>

        <section class="solucionario-section">
            ${solucionarioHTML}
        </section>

        <div class="page-break"></div>

        <div class="toc-container">
            <h1>Tabla de Contenidos</h1>
            ${tocHTML}
        </div>

        <!-- Hook para iniciar Paged.js -->
        <!-- Hook para iniciar Paged.js -->
        <script>
            window.startPDFGeneration = async function() {
                try {
                    console.log("🚀 Iniciando renderizado gráfico...");
                    
                    // 1. Renderizar Mermaid explícitamente
                    await mermaid.run({
                        nodes: document.querySelectorAll('.mermaid')
                    });
                    console.log("✅ Mermaid completado.");

                    // Pequeña pausa para asegurar DOM estable
                    await new Promise(r => setTimeout(r, 100));

                    // 2. Iniciar Paged.js
                    console.log("📖 Iniciando Paged.js...");
                    await window.PagedPolyfill.preview();
                    
                    window.renderingComplete = true; // Signal for Puppeteer
                    console.log("✅ Paged.js completado.");
                } catch(e) {
                    console.error("Render Error", e);
                    window.renderingComplete = true; // Signal anyway
                }
            };
        </script>
    </body>
    </html>
    `;

    console.log(`🚀 Iniciando renderizado PDF... HTML Len: ${fullHTML.length}`);

    // --- NUEVO: Uso de archivo temporal ---
    const tempHtmlPath = path.resolve(coursePath, 'temp_render.html');
    fs.writeFileSync(tempHtmlPath, fullHTML, 'utf-8');

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-web-security', '--allow-file-access-from-files']
    });
    const page = await browser.newPage();

    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

    await page.emulateMediaType('screen');

    // Cargar via file://
    await page.goto(`file://${tempHtmlPath}`, { waitUntil: 'networkidle0' });

    // Iniciar Paged.js manualmente
    await page.evaluate(() => {
        if (window.startPDFGeneration) {
            console.log("Starting PDF Generation Sequence...");
            window.startPDFGeneration();
        } else {
            console.error("No startPDFGeneration function found!");
        }
    });

    // Esperar señal
    try {
        await page.waitForFunction('window.renderingComplete === true', { timeout: 120000 });
    } catch (e) {
        console.log("⚠️ Render timeout, printing current state.");
    }

    await page.pdf({
        path: outputPath,
        preferCSSPageSize: true,
        printBackground: true,
        displayHeaderFooter: false
    });

    await browser.close();

    // if (fs.existsSync(tempHtmlPath)) fs.unlinkSync(tempHtmlPath);
    console.log(`✅ PDF v2 Generado: ${outputPath}`);
}

main().catch(console.error);
