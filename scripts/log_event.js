const fs = require("fs");
const path = require("path");

const LOGS_DIR = path.join(__dirname, "..", "logs");
const METRICS_FILE = path.join(LOGS_DIR, "metrics-current.json");
const LOGS_FILE = path.join(LOGS_DIR, "logs-current.json");

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

const args = process.argv.slice(2);
if (args.length < 3) {
  console.log(
    "Usage: node log_event.js <AgentName> <Phase> <Message> [Status: info/success/error/warning]"
  );
  process.exit(1);
}

const [agentName, phase, message, status = "info"] = args;

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

console.log(`Logged: ${status.toUpperCase()} - [${agentName}] ${message}`);
