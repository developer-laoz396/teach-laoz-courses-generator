const fs = require("fs");
const path = require("path");
const http = require("http");

const LOGS_DIR = path.join(__dirname, "..", "logs");
const METRICS_FILE = path.join(LOGS_DIR, "metrics-current.json");
const LOGS_FILE = path.join(LOGS_DIR, "logs-current.json");

// Configuración de la API
const API_URL = process.env.API_URL || "http://localhost:3001";
const USE_API = process.env.USE_API !== "false"; // Por defecto usa API

// Ensure logs dir exists
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

function loadJSON(file, defaultVal) {
  try {
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, "utf8"));
    }
  } catch (e) {
    console.error(`Error loading ${file}:`, e.message);
  }
  return defaultVal;
}

function saveJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

/**
 * Envía un log a la API REST
 */
async function sendToAPI(logData) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_URL}/api/logs`);
    const postData = JSON.stringify(logData);

    const options = {
      hostname: url.hostname,
      port: url.port || 3001,
      path: url.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
      timeout: 5000, // 5 segundos de timeout
    };

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`API returned status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Fallback: Guarda en archivos JSON si la API no está disponible
 */
function saveToJSON(agentName, phase, message, status) {
  // Load existing state
  let metrics = loadJSON(METRICS_FILE, {
    sessionId: `session-${Date.now()}`,
    startTime: new Date().toISOString(),
    agents: {},
    summary: { totalAgentCalls: 0, successfulCalls: 0 },
    phases: {},
    errors: [],
    warnings: [],
  });

  let logs = loadJSON(LOGS_FILE, []);

  // Update Metrics
  if (!metrics.phases[phase]) {
    metrics.phases[phase] = {
      name: phase,
      startTime: new Date().toISOString(),
      status: "running",
      agentCalls: 0,
    };
  }

  // Track Agent
  const agentId = agentName.replace(/\s+/g, "_");
  if (!metrics.agents[agentId]) {
    metrics.agents[agentId] = {
      id: agentId,
      name: agentName,
      executions: [],
      totalCalls: 0,
    };
  }

  // Add execution record (simplified)
  const execId = `${agentId}-${Date.now()}`;
  metrics.agents[agentId].executions.push({
    executionId: execId,
    phase: phase,
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    status: status === "error" ? "error" : "success",
    output: message,
  });
  metrics.agents[agentId].totalCalls++;
  metrics.summary.totalAgentCalls++;
  if (status === "success" || status === "info")
    metrics.summary.successfulCalls++;

  metrics.phases[phase].agentCalls++;

  // Add Log Entry
  logs.push({
    timestamp: new Date().toISOString(),
    level: status,
    message: `[${agentName}] ${message}`,
    data: { phase, agentId },
    sessionId: metrics.sessionId,
  });

  // Save
  saveJSON(METRICS_FILE, metrics);
  saveJSON(LOGS_FILE, logs);
}

/**
 * Obtiene o crea la sesión actual
 */
async function getCurrentSession() {
  try {
    const url = new URL(`${API_URL}/api/sessions/current`);
    
    return new Promise((resolve, reject) => {
      http.get(url, { timeout: 3000 }, (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => {
          if (res.statusCode === 200) {
            const response = JSON.parse(data);
            resolve(response.data.id);
          } else if (res.statusCode === 404) {
            // No hay sesión activa, crear una nueva
            resolve(null);
          } else {
            reject(new Error(`Status ${res.statusCode}`));
          }
        });
      }).on("error", reject).on("timeout", () => reject(new Error("Timeout")));
    });
  } catch (error) {
    return null;
  }
}

/**
 * Crea una nueva sesión
 */
async function createSession() {
  const sessionId = `session-${Date.now()}`;
  const postData = JSON.stringify({ id: sessionId });

  return new Promise((resolve, reject) => {
    const url = new URL(`${API_URL}/api/sessions`);
    const options = {
      hostname: url.hostname,
      port: url.port || 3001,
      path: url.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
      timeout: 3000,
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(sessionId);
        } else {
          reject(new Error(`Status ${res.statusCode}`));
        }
      });
    });

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Timeout"));
    });

    req.write(postData);
    req.end();
  });
}

// ============================================================================
// MAIN
// ============================================================================

const args = process.argv.slice(2);
if (args.length < 3) {
  console.log(
    "Usage: node log_event.js <AgentName> <Phase> <Message> [Status: info/success/error/warning]"
  );
  process.exit(1);
}

const [agentName, phase, message, status = "info"] = args;

(async () => {
  let success = false;

  if (USE_API) {
    try {
      // Intentar obtener o crear sesión
      let sessionId = await getCurrentSession();
      if (!sessionId) {
        sessionId = await createSession();
        console.log(`📝 Nueva sesión creada: ${sessionId}`);
      }

      // Preparar datos del log
      const logData = {
        session_id: sessionId,
        level: status,
        message: `[${agentName}] ${message}`,
        agent_id: agentName.replace(/\s+/g, "_"),
        phase: phase,
        data: { agentName, phase },
      };

      // Enviar a la API
      await sendToAPI(logData);
      console.log(
        `✅ Logged to API: ${status.toUpperCase()} - [${agentName}] ${message}`
      );
      success = true;
    } catch (error) {
      console.warn(`⚠️  API no disponible (${error.message}), usando fallback JSON`);
    }
  }

  // Fallback a JSON si la API falló o está deshabilitada
  if (!success) {
    saveToJSON(agentName, phase, message, status);
    console.log(
      `💾 Logged to JSON: ${status.toUpperCase()} - [${agentName}] ${message}`
    );
  }
})();
