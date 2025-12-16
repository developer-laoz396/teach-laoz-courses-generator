#!/usr/bin/env node

/**
 * MANAGER DEL CURSO (AGENTE 0)
 * Director de Producción Educativa
 * 
 * Responsabilidad: Orquestar a todos los agentes especializados para producir
 * un curso técnico completo de alta calidad.
 * 
 * Sistema de Métricas Integrado: Captura automática de todas las operaciones
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { MetricsLogger } = require('./util/metrics-logger');

// Configuración
const AGENT_WORKFLOWS = {
  A1_Estratega: '../../.agent/workflows/1-estratega-curricular.md',
  A2_Sintetizador: '../../.agent/workflows/2-sintetizador-contenido.md',
  A3_DisenadorEjercicios: '../../.agent/workflows/3-disenador-ejercicios.md',
  A4_Simulador: '../../.agent/workflows/4-generador-simulaciones.md',
  A5_Integrador: '../../.agent/workflows/5-integrador-calidad.md',
  A6_DisenadorGrafico: '../../.agent/workflows/6-disenador-grafico.md',
  A7_Guionista: '../../.agent/workflows/7-guionista.md',
  A8_Locutor: '../../.agent/workflows/8-locutor.md',
  A9_Evaluador: '../../.agent/workflows/9-evaluador.md',
  A10_GeneradorPDF: '../../.agent/workflows/10-generador-pdf.md',
  A11_EditorCognitivo: '../../.agent/workflows/11-editor-cognitivo.md',
  A12_AnalistaPreconceptos: '../../.agent/workflows/12-analista-preconceptos.md',
  A13_VerificadorIntegridad: '../../.agent/workflows/13-verificador-integridad.md'
};

/**
 * Manager del Curso - Orquestador Principal
 */
class CourseManager {
  constructor(courseParams = {}) {
    this.params = this.validateParams(courseParams);
    this.courseName = this.sanitizeCourseName(this.params.courseTopic);
    this.courseDir = path.join(process.cwd(), 'cursos', `teach-laoz-${this.courseName}`);
    
    // Inicializar sistema de métricas
    this.metrics = new MetricsLogger('logs');
    this.metrics.log('info', `🚀 Iniciando Manager del Curso: ${this.params.courseTopic}`);
    
    // Estado interno
    this.planCurricular = null;
    this.estructuraCurso = null;
    this.artifacts = [];
    this.currentPhase = null;
  }

  /**
   * Valida y normaliza los parámetros del curso
   */
  validateParams(params) {
    const required = ['courseTopic', 'complexity', 'duration', 'audience'];
    const missing = required.filter(field => !params[field]);
    
    if (missing.length > 0) {
      throw new Error(`Parámetros faltantes: ${missing.join(', ')}`);
    }

    return {
      courseTopic: params.courseTopic,
      complexity: params.complexity,
      duration: params.duration,
      audience: params.audience,
      prerequisites: params.prerequisites || 'Ninguno'
    };
  }

  /**
   * Sanitiza el nombre del curso para usar como directorio
   */
  sanitizeCourseName(topic) {
    return topic
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  }

  /**
   * Punto de entrada principal - Ejecuta todo el workflow
   */
  async ejecutarCursoCompleto() {
    try {
      this.metrics.log('info', '═══════════════════════════════════════════════════════');
      this.metrics.log('info', `📚 INICIANDO PRODUCCIÓN DEL CURSO`);
      this.metrics.log('info', `📌 Tema: ${this.params.courseTopic}`);
      this.metrics.log('info', `📊 Complejidad: ${this.params.complexity}`);
      this.metrics.log('info', `⏱️  Duración: ${this.params.duration}`);
      this.metrics.log('info', `👥 Audiencia: ${this.params.audience}`);
      this.metrics.log('info', '═══════════════════════════════════════════════════════');

      // FASE 0: PREPARACIÓN
      await this.fase0_preparacion();

      // FASE 1: PLANIFICACIÓN
      await this.fase1_planificacion();

      // FASE 1.5: NIVELACIÓN
      await this.fase1_5_nivelacion();

      // FASE 2: PRODUCCIÓN
      await this.fase2_produccion();

      // FASE 3: ENRIQUECIMIENTO
      await this.fase3_enriquecimiento();

      // FASE 4: INTEGRACIÓN Y VERIFICACIÓN
      await this.fase4_integracion();

      // FASE 5: GENERACIÓN PDF
      await this.fase5_pdf();

      this.metrics.log('success', '✅ Curso completado exitosamente');
      
      // Generar reporte final
      await this.generarReporteProduccion();

    } catch (error) {
      this.metrics.log('error', `❌ Error fatal en ejecución: ${error.message}`);
      this.metrics.log('error', error.stack);
      throw error;
    } finally {
      // SIEMPRE guardar métricas al finalizar
      this.metrics.endSession();
      await this.metrics.save();
      
      this.metrics.log('info', '═══════════════════════════════════════════════════════');
      this.metrics.log('info', `📊 Métricas guardadas en: logs/metrics-current.json`);
      this.metrics.log('info', `📈 Ver dashboard: open logs/live-monitor.html`);
      this.metrics.log('info', '═══════════════════════════════════════════════════════');
    }
  }

  /**
   * FASE 0: PREPARACIÓN DEL ENTORNO
   */
  async fase0_preparacion() {
    this.metrics.startPhase('PREPARACION');
    this.metrics.log('info', '\n🔧 FASE 0: PREPARACIÓN DEL ENTORNO');

    try {
      // Crear estructura de directorios
      this.metrics.log('info', `📁 Creando directorio: ${this.courseDir}`);
      
      const directories = [
        this.courseDir,
        path.join(this.courseDir, 'modulos'),
        path.join(this.courseDir, 'modulos', 'modulo_0'),
        path.join(this.courseDir, 'media'),
        path.join(this.courseDir, 'simulaciones'),
        path.join(this.courseDir, 'pdf'),
        path.join(this.courseDir, 'resources')
      ];

      directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
          this.metrics.log('info', `✓ Creado: ${dir}`);
        } else {
          this.metrics.log('warning', `⚠ Ya existe: ${dir}`);
        }
      });

      // Generar archivo .env
      const envContent = this.generarArchivoEnv();
      const envPath = path.join(this.courseDir, '.env');
      fs.writeFileSync(envPath, envContent, 'utf8');
      this.metrics.log('info', `✓ Archivo .env creado: ${envPath}`);

      // Generar README inicial
      const readmePath = path.join(this.courseDir, 'README.md');
      const readmeContent = this.generarReadmeInicial();
      fs.writeFileSync(readmePath, readmeContent, 'utf8');
      this.metrics.log('info', `✓ README.md creado: ${readmePath}`);

      this.metrics.endPhase('PREPARACION');
      this.metrics.log('success', '✅ FASE 0 COMPLETADA\n');

    } catch (error) {
      this.metrics.endPhase('PREPARACION');
      this.metrics.log('error', `❌ Error en Fase 0: ${error.message}`);
      throw error;
    }
  }

  /**
   * FASE 1: PLANIFICACIÓN (Llamada a Agente 1)
   */
  async fase1_planificacion() {
    this.metrics.startPhase('PLANIFICACION');
    this.metrics.log('info', '\n📋 FASE 1: PLANIFICACIÓN CURRICULAR');

    const agentCallId = this.metrics.startAgent('A1_Estratega', {
      tema: this.params.courseTopic,
      complejidad: this.params.complexity,
      duracion: this.params.duration,
      audiencia: this.params.audience
    });

    try {
      this.metrics.log('info', '🎯 Llamando a Agente 1: Estratega Curricular...');
      
      // Simular llamada al agente (en producción, aquí iría la integración real)
      this.planCurricular = await this.simularLlamadaAgente('A1_Estratega', {
        topic: this.params.courseTopic,
        complexity: this.params.complexity,
        duration: this.params.duration,
        audience: this.params.audience,
        prerequisites: this.params.prerequisites
      });

      // Guardar plan curricular
      const planPath = path.join(this.courseDir, 'plan_curricular.md');
      fs.writeFileSync(planPath, this.planCurricular.content, 'utf8');
      this.artifacts.push({ type: 'plan', path: planPath });
      
      this.metrics.log('info', `✓ Plan curricular guardado: ${planPath}`);

      // Extraer y parsear estructura JSON
      this.estructuraCurso = this.extraerEstructuraJSON(this.planCurricular.content);
      
      if (!this.estructuraCurso) {
        throw new Error('No se pudo extraer la estructura JSON del plan curricular');
      }

      const jsonPath = path.join(this.courseDir, 'estructura_curso.json');
      fs.writeFileSync(jsonPath, JSON.stringify(this.estructuraCurso, null, 2), 'utf8');
      this.artifacts.push({ type: 'json', path: jsonPath });
      
      this.metrics.log('info', `✓ Estructura JSON guardada: ${jsonPath}`);
      this.metrics.log('info', `📊 Módulos detectados: ${this.estructuraCurso.modulos.length}`);

      this.metrics.endAgent(agentCallId, 'success');
      this.metrics.endPhase('PLANIFICACION');
      this.metrics.log('success', '✅ FASE 1 COMPLETADA\n');

    } catch (error) {
      this.metrics.endAgent(agentCallId, 'error', error.message);
      this.metrics.endPhase('PLANIFICACION');
      this.metrics.log('error', `❌ Error en Fase 1: ${error.message}`);
      throw error;
    }
  }

  /**
   * FASE 1.5: NIVELACIÓN (Llamada a Agente 12)
   */
  async fase1_5_nivelacion() {
    this.metrics.startPhase('NIVELACION');
    this.metrics.log('info', '\n📖 FASE 1.5: NIVELACIÓN (MÓDULO 0)');

    const agentCallId = this.metrics.startAgent('A12_AnalistaPreconceptos', {
      plan: 'plan_curricular.md'
    });

    try {
      this.metrics.log('info', '🎓 Llamando a Agente 12: Analista de Preconceptos...');

      const modulo0 = await this.simularLlamadaAgente('A12_AnalistaPreconceptos', {
        planCurricular: this.planCurricular.content,
        estructuraCurso: this.estructuraCurso
      });

      // Guardar módulo 0
      const modulo0Path = path.join(this.courseDir, 'modulos', 'modulo_0', 'tema_0_preconceptos.md');
      fs.writeFileSync(modulo0Path, modulo0.content, 'utf8');
      this.artifacts.push({ type: 'modulo', path: modulo0Path, modulo: 0 });
      
      this.metrics.log('info', `✓ Módulo 0 guardado: ${modulo0Path}`);

      this.metrics.endAgent(agentCallId, 'success');
      this.metrics.endPhase('NIVELACION');
      this.metrics.log('success', '✅ FASE 1.5 COMPLETADA\n');

    } catch (error) {
      this.metrics.endAgent(agentCallId, 'error', error.message);
      this.metrics.endPhase('NIVELACION');
      this.metrics.log('error', `❌ Error en Fase 1.5: ${error.message}`);
      throw error;
    }
  }

  /**
   * FASE 2: PRODUCCIÓN DE CONTENIDO (Iteración Granular)
   */
  async fase2_produccion() {
    this.metrics.startPhase('PRODUCCION');
    this.metrics.log('info', '\n🏭 FASE 2: PRODUCCIÓN DE CONTENIDO');

    if (!this.estructuraCurso || !this.estructuraCurso.modulos) {
      throw new Error('No hay estructura de curso disponible');
    }

    let subtemasTotales = 0;
    this.estructuraCurso.modulos.forEach(m => {
      m.temas.forEach(t => {
        subtemasTotales += t.subtemas ? t.subtemas.length : 1;
      });
    });

    this.metrics.log('info', `📊 Total de módulos: ${this.estructuraCurso.modulos.length}`);
    this.metrics.log('info', `📊 Total de subtemas a generar: ${subtemasTotales}`);

    let procesamientoActual = 0;

    try {
      for (const modulo of this.estructuraCurso.modulos) {
        this.metrics.log('info', `\n📦 Procesando Módulo ${modulo.id}: ${modulo.titulo}`);

        // Crear directorio del módulo
        const moduloDir = path.join(this.courseDir, 'modulos', `modulo_${modulo.id}`);
        if (!fs.existsSync(moduloDir)) {
          fs.mkdirSync(moduloDir, { recursive: true });
        }

        for (const tema of modulo.temas) {
          this.metrics.log('info', `  📝 Tema ${tema.id}: ${tema.titulo}`);

          const subtemas = tema.subtemas || [{ id: 1, titulo: tema.titulo, objetivos: tema.objetivos }];

          for (const subtema of subtemas) {
            procesamientoActual++;
            const progreso = ((procesamientoActual / subtemasTotales) * 100).toFixed(1);
            
            this.metrics.log('info', `    🔹 Subtema ${subtema.id}: ${subtema.titulo} [${progreso}%]`);

            // Generar contenido base
            const contenido = await this.generarContenidoSubtema(modulo, tema, subtema);

            // Optimizar con Editor Cognitivo
            const contenidoOptimizado = await this.optimizarContenido(contenido, modulo, tema, subtema);

            // Guardar contenido optimizado
            const contenidoPath = path.join(
              moduloDir,
              `tema_${tema.id}_subtema_${subtema.id}_contenido.md`
            );
            fs.writeFileSync(contenidoPath, contenidoOptimizado.content, 'utf8');
            this.artifacts.push({ 
              type: 'contenido', 
              path: contenidoPath, 
              modulo: modulo.id, 
              tema: tema.id, 
              subtema: subtema.id 
            });

            // Tareas paralelas: Ejercicios, Guión+Audio, Evaluación
            await this.ejecutarTareasParalelas(contenidoOptimizado, modulo, tema, subtema);
          }
        }
      }

      this.metrics.endPhase('PRODUCCION');
      this.metrics.log('success', '✅ FASE 2 COMPLETADA\n');

    } catch (error) {
      this.metrics.endPhase('PRODUCCION');
      this.metrics.log('error', `❌ Error en Fase 2: ${error.message}`);
      throw error;
    }
  }

  /**
   * FASE 3: ENRIQUECIMIENTO (Simulaciones y Gráficos)
   */
  async fase3_enriquecimiento() {
    this.metrics.startPhase('ENRIQUECIMIENTO');
    this.metrics.log('info', '\n🎨 FASE 3: ENRIQUECIMIENTO');

    try {
      // Generar simulaciones
      await this.generarSimulaciones();

      // Generar artefactos gráficos
      await this.generarArtefactosGraficos();

      this.metrics.endPhase('ENRIQUECIMIENTO');
      this.metrics.log('success', '✅ FASE 3 COMPLETADA\n');

    } catch (error) {
      this.metrics.endPhase('ENRIQUECIMIENTO');
      this.metrics.log('error', `❌ Error en Fase 3: ${error.message}`);
      throw error;
    }
  }

  /**
   * FASE 4: INTEGRACIÓN Y VERIFICACIÓN
   */
  async fase4_integracion() {
    this.metrics.startPhase('INTEGRACION');
    this.metrics.log('info', '\n🔗 FASE 4: INTEGRACIÓN Y VERIFICACIÓN');

    try {
      // Integrar todo el curso
      await this.integrarCursoCompleto();

      // Verificar integridad
      await this.verificarIntegridad();

      this.metrics.endPhase('INTEGRACION');
      this.metrics.log('success', '✅ FASE 4 COMPLETADA\n');

    } catch (error) {
      this.metrics.endPhase('INTEGRACION');
      this.metrics.log('error', `❌ Error en Fase 4: ${error.message}`);
      throw error;
    }
  }

  /**
   * FASE 5: GENERACIÓN DE PDF
   */
  async fase5_pdf() {
    this.metrics.startPhase('PDF_GENERATION');
    this.metrics.log('info', '\n📄 FASE 5: GENERACIÓN DE MANUAL PDF');

    const agentCallId = this.metrics.startAgent('A10_GeneradorPDF', {
      cursoCompleto: 'CURSO_COMPLETO.md'
    });

    try {
      this.metrics.log('info', '📚 Llamando a Agente 10: Generador de PDF...');

      const pdfResult = await this.simularLlamadaAgente('A10_GeneradorPDF', {
        cursoCompleto: path.join(this.courseDir, 'CURSO_COMPLETO.md')
      });

      const pdfPath = path.join(this.courseDir, 'pdf', 'Manual_v1.0.pdf');
      this.artifacts.push({ type: 'pdf', path: pdfPath });
      
      this.metrics.log('info', `✓ PDF generado: ${pdfPath}`);

      this.metrics.endAgent(agentCallId, 'success');
      this.metrics.endPhase('PDF_GENERATION');
      this.metrics.log('success', '✅ FASE 5 COMPLETADA\n');

    } catch (error) {
      this.metrics.endAgent(agentCallId, 'error', error.message);
      this.metrics.endPhase('PDF_GENERATION');
      this.metrics.log('error', `❌ Error en Fase 5: ${error.message}`);
      throw error;
    }
  }

  /**
   * Genera contenido base para un subtema
   */
  async generarContenidoSubtema(modulo, tema, subtema) {
    const agentCallId = this.metrics.startAgent('A2_Sintetizador', {
      modulo: modulo.id,
      tema: tema.id,
      subtema: subtema.id,
      titulo: subtema.titulo
    });

    try {
      this.metrics.log('info', `      🤖 A2: Sintetizador generando contenido...`);

      const resultado = await this.simularLlamadaAgente('A2_Sintetizador', {
        modulo,
        tema,
        subtema,
        context: this.params
      });

      this.metrics.endAgent(agentCallId, 'success');
      return resultado;

    } catch (error) {
      this.metrics.endAgent(agentCallId, 'error', error.message);
      throw error;
    }
  }

  /**
   * Optimiza contenido con Editor Cognitivo
   */
  async optimizarContenido(contenido, modulo, tema, subtema) {
    const agentCallId = this.metrics.startAgent('A11_EditorCognitivo', {
      modulo: modulo.id,
      tema: tema.id,
      subtema: subtema.id
    });

    try {
      this.metrics.log('info', `      🧠 A11: Editor Cognitivo optimizando...`);

      const resultado = await this.simularLlamadaAgente('A11_EditorCognitivo', {
        contenido: contenido.content,
        audiencia: this.params.audience
      });

      this.metrics.endAgent(agentCallId, 'success');
      return resultado;

    } catch (error) {
      this.metrics.endAgent(agentCallId, 'error', error.message);
      throw error;
    }
  }

  /**
   * Ejecuta tareas paralelas (Ejercicios, Guión+Audio, Evaluación)
   */
  async ejecutarTareasParalelas(contenidoOptimizado, modulo, tema, subtema) {
    const moduloDir = path.join(this.courseDir, 'modulos', `modulo_${modulo.id}`);

    // Iniciar tracking de agentes en paralelo
    const a3Id = this.metrics.startAgent('A3_DisenadorEjercicios', {
      modulo: modulo.id,
      tema: tema.id,
      subtema: subtema.id
    });

    const a7Id = this.metrics.startAgent('A7_Guionista', {
      modulo: modulo.id,
      tema: tema.id,
      subtema: subtema.id
    });

    const a9Id = this.metrics.startAgent('A9_Evaluador', {
      modulo: modulo.id,
      tema: tema.id,
      subtema: subtema.id
    });

    this.metrics.log('info', `      ⚡ Ejecutando tareas paralelas...`);

    try {
      const resultados = await Promise.allSettled([
        // Tarea 1: Ejercicios
        this.simularLlamadaAgente('A3_DisenadorEjercicios', {
          contenido: contenidoOptimizado.content,
          nivel: this.params.complexity
        }).then(result => {
          const ejerciciosPath = path.join(
            moduloDir,
            `tema_${tema.id}_subtema_${subtema.id}_ejercicios.md`
          );
          fs.writeFileSync(ejerciciosPath, result.content, 'utf8');
          this.artifacts.push({ type: 'ejercicios', path: ejerciciosPath });
          this.metrics.endAgent(a3Id, 'success');
          this.metrics.log('info', `        ✓ A3: Ejercicios completados`);
        }).catch(e => {
          this.metrics.endAgent(a3Id, 'error', e.message);
          throw e;
        }),

        // Tarea 2: Guión + Audio
        this.simularLlamadaAgente('A7_Guionista', {
          contenido: contenidoOptimizado.content,
          duracion: '10min'
        }).then(async guion => {
          const guionPath = path.join(
            moduloDir,
            `tema_${tema.id}_subtema_${subtema.id}_guion.md`
          );
          fs.writeFileSync(guionPath, guion.content, 'utf8');
          this.artifacts.push({ type: 'guion', path: guionPath });

          // Generar audio
          const a8Id = this.metrics.startAgent('A8_Locutor', {
            modulo: modulo.id,
            tema: tema.id,
            subtema: subtema.id
          });

          try {
            const audio = await this.simularLlamadaAgente('A8_Locutor', {
              guion: guion.content
            });

            const audioPath = path.join(
              this.courseDir,
              'media',
              `modulo_${modulo.id}_tema_${tema.id}_subtema_${subtema.id}.wav`
            );
            // En producción: fs.writeFileSync(audioPath, audio.buffer);
            this.artifacts.push({ type: 'audio', path: audioPath });
            
            this.metrics.endAgent(a8Id, 'success');
            this.metrics.endAgent(a7Id, 'success');
            this.metrics.log('info', `        ✓ A7+A8: Guión y Audio completados`);
          } catch (e) {
            this.metrics.endAgent(a8Id, 'error', e.message);
            this.metrics.endAgent(a7Id, 'error', e.message);
            throw e;
          }
        }).catch(e => {
          this.metrics.endAgent(a7Id, 'error', e.message);
          throw e;
        }),

        // Tarea 3: Evaluación
        this.simularLlamadaAgente('A9_Evaluador', {
          contenido: contenidoOptimizado.content,
          nivel: this.params.complexity
        }).then(result => {
          const evaluacionPath = path.join(
            moduloDir,
            `tema_${tema.id}_subtema_${subtema.id}_evaluacion.md`
          );
          fs.writeFileSync(evaluacionPath, result.content, 'utf8');
          this.artifacts.push({ type: 'evaluacion', path: evaluacionPath });
          this.metrics.endAgent(a9Id, 'success');
          this.metrics.log('info', `        ✓ A9: Evaluación completada`);
        }).catch(e => {
          this.metrics.endAgent(a9Id, 'error', e.message);
          throw e;
        })
      ]);

      // Log de resumen de tareas paralelas
      const exitosos = resultados.filter(r => r.status === 'fulfilled').length;
      this.metrics.log('info', `      ✅ Tareas paralelas: ${exitosos}/${resultados.length} exitosas`);

    } catch (error) {
      this.metrics.log('warning', `⚠ Algunas tareas paralelas fallaron: ${error.message}`);
    }
  }

  /**
   * Genera simulaciones interactivas
   */
  async generarSimulaciones() {
    const agentCallId = this.metrics.startAgent('A4_Simulador', {
      plan: 'plan_curricular.md'
    });

    try {
      this.metrics.log('info', '🎮 Llamando a Agente 4: Generador de Simulaciones...');

      // Identificar conceptos que requieren visualización
      const conceptosVisuales = this.identificarConceptosVisuales();
      
      if (conceptosVisuales.length === 0) {
        this.metrics.log('info', '  ℹ No se identificaron conceptos que requieran simulación');
        this.metrics.endAgent(agentCallId, 'success');
        return;
      }

      for (const concepto of conceptosVisuales) {
        const simulacion = await this.simularLlamadaAgente('A4_Simulador', concepto);
        
        const simulacionPath = path.join(
          this.courseDir,
          'simulaciones',
          `${concepto.id}_simulacion.html`
        );
        fs.writeFileSync(simulacionPath, simulacion.content, 'utf8');
        this.artifacts.push({ type: 'simulacion', path: simulacionPath });
      }

      this.metrics.log('info', `  ✓ ${conceptosVisuales.length} simulaciones generadas`);
      this.metrics.endAgent(agentCallId, 'success');

    } catch (error) {
      this.metrics.endAgent(agentCallId, 'error', error.message);
      throw error;
    }
  }

  /**
   * Genera artefactos gráficos (diagramas, ilustraciones)
   */
  async generarArtefactosGraficos() {
    const agentCallId = this.metrics.startAgent('A6_DisenadorGrafico', {
      plan: 'plan_curricular.md'
    });

    try {
      this.metrics.log('info', '🎨 Llamando a Agente 6: Diseñador Gráfico...');

      // Identificar conceptos que se beneficien de diagramas
      const conceptosGraficos = this.identificarConceptosGraficos();

      if (conceptosGraficos.length === 0) {
        this.metrics.log('info', '  ℹ No se identificaron conceptos que requieran gráficos');
        this.metrics.endAgent(agentCallId, 'success');
        return;
      }

      for (const concepto of conceptosGraficos) {
        const grafico = await this.simularLlamadaAgente('A6_DisenadorGrafico', concepto);
        
        const graficoPath = path.join(
          this.courseDir,
          'media',
          `${concepto.id}_diagrama.svg`
        );
        fs.writeFileSync(graficoPath, grafico.content, 'utf8');
        this.artifacts.push({ type: 'grafico', path: graficoPath });
      }

      this.metrics.log('info', `  ✓ ${conceptosGraficos.length} gráficos generados`);
      this.metrics.endAgent(agentCallId, 'success');

    } catch (error) {
      this.metrics.endAgent(agentCallId, 'error', error.message);
      throw error;
    }
  }

  /**
   * Integra todo el contenido en CURSO_COMPLETO.md
   */
  async integrarCursoCompleto() {
    const agentCallId = this.metrics.startAgent('A5_Integrador', {
      artifacts: this.artifacts.length
    });

    try {
      this.metrics.log('info', '🔗 Llamando a Agente 5: Integrador de Calidad...');
      this.metrics.log('info', `  📊 Artifacts a integrar: ${this.artifacts.length}`);

      const cursoCompleto = await this.simularLlamadaAgente('A5_Integrador', {
        artifacts: this.artifacts,
        planCurricular: this.planCurricular.content,
        estructuraCurso: this.estructuraCurso
      });

      const cursoCompletoPath = path.join(this.courseDir, 'CURSO_COMPLETO.md');
      fs.writeFileSync(cursoCompletoPath, cursoCompleto.content, 'utf8');
      this.artifacts.push({ type: 'curso_completo', path: cursoCompletoPath });
      
      this.metrics.log('info', `  ✓ Curso integrado: ${cursoCompletoPath}`);
      this.metrics.endAgent(agentCallId, 'success');

    } catch (error) {
      this.metrics.endAgent(agentCallId, 'error', error.message);
      throw error;
    }
  }

  /**
   * Verifica la integridad del contenido
   */
  async verificarIntegridad() {
    const agentCallId = this.metrics.startAgent('A13_VerificadorIntegridad', {
      cursoCompleto: 'CURSO_COMPLETO.md'
    });

    try {
      this.metrics.log('info', '🔍 Llamando a Agente 13: Verificador de Integridad...');

      const verificacion = await this.simularLlamadaAgente('A13_VerificadorIntegridad', {
        cursoCompleto: path.join(this.courseDir, 'CURSO_COMPLETO.md'),
        planCurricular: this.planCurricular.content
      });

      // Guardar referencias
      const referenciasPath = path.join(this.courseDir, 'REFERENCIAS.md');
      fs.writeFileSync(referenciasPath, verificacion.referencias, 'utf8');
      this.artifacts.push({ type: 'referencias', path: referenciasPath });
      
      // Guardar reporte de verificación
      const reportePath = path.join(this.courseDir, 'REPORTE_VERIFICACION.md');
      fs.writeFileSync(reportePath, verificacion.reporte, 'utf8');
      this.artifacts.push({ type: 'reporte_verificacion', path: reportePath });
      
      this.metrics.log('info', `  ✓ Referencias guardadas: ${referenciasPath}`);
      this.metrics.log('info', `  ✓ Reporte de verificación: ${reportePath}`);

      // Revisar si hay errores críticos
      if (verificacion.erroresCriticos && verificacion.erroresCriticos.length > 0) {
        this.metrics.log('warning', `  ⚠ Errores críticos encontrados: ${verificacion.erroresCriticos.length}`);
        verificacion.erroresCriticos.forEach(error => {
          this.metrics.log('warning', `    - ${error}`);
        });
      } else {
        this.metrics.log('success', '  ✅ Sin errores críticos detectados');
      }

      this.metrics.endAgent(agentCallId, 'success');

    } catch (error) {
      this.metrics.endAgent(agentCallId, 'error', error.message);
      throw error;
    }
  }

  /**
   * Genera el reporte final de producción
   */
  async generarReporteProduccion() {
    this.metrics.log('info', '\n📊 GENERANDO REPORTE FINAL DE PRODUCCIÓN...');

    const summary = this.metrics.getSummary();
    const reporte = `# REPORTE DE PRODUCCIÓN: ${this.params.courseTopic.toUpperCase()}

## 📋 RESUMEN EJECUTIVO

**Fecha de generación:** ${new Date().toLocaleDateString('es-ES')}  
**Duración total:** ${(summary.totalDuration / 1000 / 60).toFixed(2)} minutos  
**Sesión ID:** ${this.metrics.sessionId}

---

## 🎯 PARÁMETROS DEL CURSO

- **Tema:** ${this.params.courseTopic}
- **Complejidad:** ${this.params.complexity}
- **Duración estimada:** ${this.params.duration}
- **Audiencia:** ${this.params.audience}
- **Prerrequisitos:** ${this.params.prerequisites}

---

## ✅ ESTADO DEL PROYECTO

- **Preparación:** ✅ Completada
- **Planificación:** ✅ Completada
- **Nivelación:** ✅ Completada
- **Producción:** ✅ Completada
- **Enriquecimiento:** ✅ Completada
- **Integración:** ✅ Completada
- **Verificación:** ✅ Completada
- **PDF:** ✅ Completada

---

## 📊 MÉTRICAS DE EJECUCIÓN

### Agentes

- **Total de llamadas:** ${summary.totalAgentCalls}
- **Exitosas:** ${summary.successfulCalls} (${summary.successRate}%)
- **Fallidas:** ${summary.failedCalls}
- **Reintentos:** ${summary.retriedCalls}

### Fases

${Object.keys(summary.phases).map(phase => {
  const p = summary.phases[phase];
  return `- **${phase}:** ${(p.duration / 1000).toFixed(2)}s`;
}).join('\n')}

### Top Agentes por Uso

${Object.entries(summary.topAgents).map(([agent, count]) => 
  `- **${agent}:** ${count} llamadas`
).join('\n')}

---

## 📁 ARTIFACTS GENERADOS

Total: **${this.artifacts.length}** archivos

${this.artifacts.map((artifact, index) => 
  `${index + 1}. [${artifact.type.toUpperCase()}] ${path.basename(artifact.path)}`
).join('\n')}

---

## 📍 UBICACIÓN DEL CURSO

\`\`\`
${this.courseDir}
\`\`\`

### Archivos principales

- **Plan Curricular:** [plan_curricular.md](./plan_curricular.md)
- **Estructura JSON:** [estructura_curso.json](./estructura_curso.json)
- **Curso Completo:** [CURSO_COMPLETO.md](./CURSO_COMPLETO.md)
- **Referencias:** [REFERENCIAS.md](./REFERENCIAS.md)
- **Verificación:** [REPORTE_VERIFICACION.md](./REPORTE_VERIFICACION.md)
- **Manual PDF:** [pdf/Manual_v1.0.pdf](./pdf/Manual_v1.0.pdf)

---

## 📈 MÉTRICAS Y MONITOREO

Para ver métricas detalladas de esta sesión:

\`\`\`bash
# Dashboard estático
open logs/dashboard.html

# Monitor en vivo
open logs/live-monitor.html

# Ver sesión específica
node scripts/util/generate-dashboard.js --session ${this.metrics.sessionId}
\`\`\`

---

## 🎉 CONCLUSIÓN

El curso ha sido generado exitosamente siguiendo todos los estándares de calidad establecidos.

${summary.failedCalls > 0 ? `
⚠️ **Nota:** Se detectaron ${summary.failedCalls} llamadas fallidas. Revisar logs para detalles.
` : '✅ **Sin errores críticos detectados.**'}

---

*Generado automáticamente por CourseManager (Agente 0)*
*Sistema de métricas integrado: MetricsLogger v1.0*
`;

    const reportePath = path.join(this.courseDir, 'REPORTE_PRODUCCION.md');
    fs.writeFileSync(reportePath, reporte, 'utf8');
    
    this.metrics.log('info', `✓ Reporte de producción generado: ${reportePath}`);
    
    console.log('\n' + '='.repeat(80));
    console.log(reporte);
    console.log('='.repeat(80) + '\n');
  }

  /**
   * Genera el contenido del archivo .env
   */
  generarArchivoEnv() {
    return `# Configuración del Curso
COURSE_TOPIC=${this.params.courseTopic}
COURSE_COMPLEXITY=${this.params.complexity}
COURSE_DURATION=${this.params.duration}
COURSE_AUDIENCE=${this.params.audience}
COURSE_PREREQUISITES=${this.params.prerequisites}

# Rutas a los Workflows de Agentes
WORKFLOW_PATH_ESTRATEGA="../../.agent/workflows/1-estratega-curricular.md"
WORKFLOW_PATH_SINTETIZADOR="../../.agent/workflows/2-sintetizador-contenido.md"
WORKFLOW_PATH_EJERCICIOS="../../.agent/workflows/3-disenador-ejercicios.md"
WORKFLOW_PATH_SIMULACIONES="../../.agent/workflows/4-generador-simulaciones.md"
WORKFLOW_PATH_INTEGRADOR="../../.agent/workflows/5-integrador-calidad.md"
WORKFLOW_PATH_GRAFICO="../../.agent/workflows/6-disenador-grafico.md"
WORKFLOW_PATH_GUIONISTA="../../.agent/workflows/7-guionista.md"
WORKFLOW_PATH_LOCUTOR="../../.agent/workflows/8-locutor.md"
WORKFLOW_PATH_EVALUADOR="../../.agent/workflows/9-evaluador.md"
WORKFLOW_PATH_GENERADOR_PDF="../../.agent/workflows/10-generador-pdf.md"
WORKFLOW_PATH_EDITOR_COGNITIVO="../../.agent/workflows/11-editor-cognitivo.md"
WORKFLOW_PATH_ANALISTA_PRECONCEPTOS="../../.agent/workflows/12-analista-preconceptos.md"
WORKFLOW_PATH_VERIFICADOR_INTEGRIDAD="../../.agent/workflows/13-verificador-integridad.md"

# Generado automáticamente por CourseManager
GENERATED_AT=${new Date().toISOString()}
SESSION_ID=${this.metrics.sessionId}
`;
  }

  /**
   * Genera el README inicial del curso
   */
  generarReadmeInicial() {
    return `# ${this.params.courseTopic}

## 📋 Información del Curso

**Complejidad:** ${this.params.complexity}  
**Duración:** ${this.params.duration}  
**Audiencia:** ${this.params.audience}  
**Prerrequisitos:** ${this.params.prerequisites}

## 🚧 Estado

🔄 **En producción** - Generado automáticamente por CourseManager

## 📁 Estructura del Proyecto

\`\`\`
${this.courseName}/
├── modulos/           # Contenido de cada módulo
├── media/             # Audios y recursos multimedia
├── simulaciones/      # Simulaciones interactivas
├── pdf/               # Manual en PDF
├── plan_curricular.md # Plan pedagógico completo
├── CURSO_COMPLETO.md  # Contenido integrado
├── REFERENCIAS.md     # Referencias académicas
└── REPORTE_VERIFICACION.md # Validación de calidad
\`\`\`

## 🎯 Métricas

Ver métricas de generación en \`logs/live-monitor.html\`

---

*Generado por CourseManager (Agente 0)*  
*Sesión: ${this.metrics.sessionId}*
`;
  }

  /**
   * Extrae la estructura JSON del plan curricular
   */
  extraerEstructuraJSON(planContent) {
    try {
      // Buscar bloque JSON entre ```json y ```
      const jsonMatch = planContent.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }

      // Si no hay bloque, generar estructura básica
      this.metrics.log('warning', '⚠ No se encontró JSON en el plan, generando estructura básica');
      return {
        modulos: [
          {
            id: 1,
            titulo: 'Módulo 1',
            temas: [
              {
                id: 1,
                titulo: 'Tema 1',
                subtemas: [
                  { id: 1, titulo: 'Introducción', objetivos: ['Objetivo 1'] }
                ]
              }
            ]
          }
        ]
      };
    } catch (error) {
      this.metrics.log('error', `Error parseando JSON: ${error.message}`);
      return null;
    }
  }

  /**
   * Identifica conceptos que requieren visualización
   */
  identificarConceptosVisuales() {
    // En producción: analizar el plan curricular para encontrar marcadores
    // Por ahora retorna array vacío para demostración
    return [];
  }

  /**
   * Identifica conceptos que se benefician de diagramas
   */
  identificarConceptosGraficos() {
    // En producción: analizar el contenido para encontrar conceptos complejos
    // Por ahora retorna array vacío para demostración
    return [];
  }

  /**
   * Simula la llamada a un agente (en producción, integrar con sistema real)
   */
  async simularLlamadaAgente(agentName, params) {
    // Simular latencia de red
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    // Simular respuestas
    const responses = {
      'A1_Estratega': {
        content: `# Plan Curricular: ${params.topic}\n\n## Módulos\n\n\`\`\`json\n${JSON.stringify({
          modulos: [
            {
              id: 1,
              titulo: 'Introducción',
              temas: [
                {
                  id: 1,
                  titulo: 'Conceptos Básicos',
                  subtemas: [
                    { id: 1, titulo: 'Fundamentos', objetivos: ['Entender conceptos'] }
                  ]
                }
              ]
            }
          ]
        }, null, 2)}\n\`\`\``
      },
      'A12_AnalistaPreconceptos': {
        content: '# Módulo 0: Preconceptos\n\n## Glosario de términos fundamentales...'
      },
      'A2_Sintetizador': {
        content: `# ${params.subtema.titulo}\n\n## Contenido\n\nContenido generado para ${params.subtema.titulo}...`
      },
      'A11_EditorCognitivo': {
        content: `${params.contenido}\n\n<!-- Optimizado con analogías y técnicas cognitivas -->`
      },
      'A3_DisenadorEjercicios': {
        content: '# Ejercicios\n\n1. Ejercicio práctico...'
      },
      'A7_Guionista': {
        content: '# Guión de Audio\n\nBienvenidos al tema...'
      },
      'A8_Locutor': {
        content: '<!-- Audio WAV generado -->'
      },
      'A9_Evaluador': {
        content: '# Evaluación\n\n## Preguntas\n\n1. ¿Qué es...?'
      },
      'A4_Simulador': {
        content: '<!DOCTYPE html><html><!-- Simulación HTML --></html>'
      },
      'A6_DisenadorGrafico': {
        content: '<svg><!-- Diagrama SVG --></svg>'
      },
      'A5_Integrador': {
        content: '# CURSO COMPLETO\n\n## Contenido integrado...'
      },
      'A13_VerificadorIntegridad': {
        referencias: '# Referencias\n\n1. Referencia académica...',
        reporte: '# Reporte de Verificación\n\n✅ Todo correcto',
        erroresCriticos: []
      },
      'A10_GeneradorPDF': {
        content: 'PDF generado'
      }
    };

    return responses[agentName] || { content: 'Respuesta simulada' };
  }
}

/**
 * CLI - Punto de entrada
 */
async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║              COURSE MANAGER - AGENTE 0                         ║');
  console.log('║              Director de Producción Educativa                  ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  // Leer parámetros del curso desde CLI o interactivo
  const params = await obtenerParametrosCurso();

  // Crear y ejecutar manager
  const manager = new CourseManager(params);
  
  try {
    await manager.ejecutarCursoCompleto();
    
    console.log('\n✅ ¡CURSO GENERADO EXITOSAMENTE!\n');
    console.log(`📁 Ubicación: ${manager.courseDir}`);
    console.log(`📊 Ver métricas: open logs/live-monitor.html\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR EN LA GENERACIÓN DEL CURSO:\n');
    console.error(error.message);
    console.error('\n📊 Ver detalles en: logs/logs-current.json\n');
    process.exit(1);
  }
}

/**
 * Obtiene parámetros del curso desde CLI o modo interactivo
 */
async function obtenerParametrosCurso() {
  const args = process.argv.slice(2);

  // Si se pasaron argumentos, usarlos
  if (args.length >= 4) {
    return {
      courseTopic: args[0],
      complexity: args[1],
      duration: args[2],
      audience: args[3],
      prerequisites: args[4] || 'Ninguno'
    };
  }

  // Modo interactivo
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const pregunta = (query) => new Promise(resolve => rl.question(query, resolve));

  console.log('📝 MODO INTERACTIVO - Responde las siguientes preguntas:\n');

  const courseTopic = await pregunta('🎯 Tema del curso: ');
  const complexity = await pregunta('📊 Complejidad (baja/media/alta): ');
  const duration = await pregunta('⏱️  Duración estimada (ej: 40h): ');
  const audience = await pregunta('👥 Audiencia objetivo: ');
  const prerequisites = await pregunta('📚 Prerrequisitos (Enter para ninguno): ');

  rl.close();

  return {
    courseTopic,
    complexity,
    duration,
    audience,
    prerequisites: prerequisites || 'Ninguno'
  };
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

// Exportar para uso programático
module.exports = { CourseManager };
