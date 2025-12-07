const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const coursesDir = path.resolve(__dirname, '../curso_optimizacion_entrenamientos/modulos');
const tempTxtPath = path.resolve(__dirname, 'temp_speech.txt');

function speak(text, outputPath) {
    return new Promise((resolve, reject) => {
        // Limpiar texto básico
        const cleanText = text.replace(/[*#]/g, '').trim();
        if (!cleanText) return resolve();

        // Escribir a archivo temporal para evitar problemas de escape en CLI
        fs.writeFileSync(tempTxtPath, cleanText, 'utf-8');

        // Comando PowerShell para leer del archivo y hablar
        // Add-Type para SpeechSynthesizer
        const psCommand = `
            Add-Type -AssemblyName System.Speech; 
            $speak = New-Object System.Speech.Synthesis.SpeechSynthesizer; 
            $speak.Rate = 0; 
            $text = Get-Content -Path '${tempTxtPath}' -Encoding UTF8 -Raw;
            $speak.SetOutputToWaveFile('${outputPath}'); 
            $speak.Speak($text); 
            $speak.Dispose()
        `;

        // Ejecutar powershell terminando con exit para liberar retorno
        exec(`powershell -Command "${psCommand.replace(/\n/g, ' ')}"`, (error, stdout, stderr) => {
            if (error) {
                console.warn(`⚠️ Error generando audio para ${path.basename(outputPath)}: ${error.message}`);
            } else {
                console.log(`✅ Audio generado: ${path.basename(outputPath)}`);
            }
            resolve();
        });
    });
}

async function main() {
    console.log('🎙️ Iniciando Agente 8 (V2): Locución Robusta...');

    if (!fs.existsSync(coursesDir)) return;

    const modules = fs.readdirSync(coursesDir);

    for (const mod of modules) {
        const modPath = path.join(coursesDir, mod);
        if (fs.statSync(modPath).isDirectory()) {
            const files = fs.readdirSync(modPath).filter(f => f.endsWith('_guion.md'));

            for (const file of files) {
                const filePath = path.join(modPath, file);
                const content = fs.readFileSync(filePath, 'utf-8');
                const audioPath = filePath.replace('_guion.md', '_audio.wav');

                // Extraer diálogo LOCUTOR
                const lines = content.split('\n');
                let scriptText = "";
                lines.forEach(line => {
                    if (line.includes('**LOCUTOR**:')) {
                        scriptText += line.replace('**LOCUTOR**:', '').trim() + " ";
                    }
                });

                if (scriptText) {
                    await speak(scriptText, audioPath);
                    // Pequeña pausa para no saturar el proceso de spawn de powershell
                    await new Promise(r => setTimeout(r, 1000));
                }
            }
        }
    }

    // Limpieza
    if (fs.existsSync(tempTxtPath)) fs.unlinkSync(tempTxtPath);
    console.log('🎉 Generación de audio completada.');
}

main();
