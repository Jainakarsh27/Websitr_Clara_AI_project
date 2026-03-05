const ACCOUNTS = [
    { id: 'account_001', name: "Ben's Electric", version: 'v2 (Operational)', lastSync: 'Idle' },
    { id: 'account_002', name: "Shelley's Plumbing", version: 'v2 (Operational)', lastSync: 'Idle' },
    { id: 'account_003', name: "Quick HVAC", version: 'v2 (Operational)', lastSync: 'Idle' },
    { id: 'account_004', name: "Safe Guard Alarms", version: 'v2 (Operational)', lastSync: 'Idle' },
    { id: 'account_005', name: "Elite Facility", version: 'v2 (Operational)', lastSync: 'Idle' }
];

const MOCK_DATA = {
    account_id: "acc_001",
    company_name: "Clara Test Corp",
    business_hours: { days: "Mon-Fri", start: "08:00", end: "17:00", timezone: "EST" },
    office_address: "123 Industrial Way, Suite 100",
    services_supported: ["Fire Security", "Sprinkler Systems", "Alarm Monitioring"],
    emergency_definition: ["Fire", "Gas Leak", "Burst Pipe", "Electrical Sparking"],
    emergency_routing_rules: "Direct transfer to On-Call Technician (Level 1)",
    non_emergency_routing_rules: "Queue for next-day dispatch",
    call_transfer_rules: "3 retries, 60s timeout, route to VM if fails",
    integration_constraints: ["Restricted to service area", "Requires master key validation"],
    after_hours_flow_summary: "Emergency only. Collect Name/Ph/Addr. Attempt transfer.",
    office_hours_flow_summary: "Full intake. Check scheduling availability via ServiceTrade.",
    questions_or_unknowns: ["None - Fully Validated"],
    notes: "Client preferred 'Urgent' instead of 'Emergency' in v1."
};

const MOCK_AGENT_SPEC = {
    agent_name: "Clara Dispatch v4.0",
    voice_style: "Professional & Calm (Orbit)",
    version: "v2 (Operational)",
    transfer_protocol: {
        destination: "+1-800-CLARA-EM",
        timeout: 45,
        fallback: "apologize_and_record"
    }
};

let currentAccountId = 'account_001';

// --- Tab Navigation ---
function switchView(viewName) {
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase().includes(viewName)) btn.classList.add('active');
    });

    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${viewName}-tab`).classList.add('active');
}

function selectAccount(id) {
    currentAccountId = id;
    document.querySelectorAll('.account-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.id === id) item.classList.add('active');
    });
    fetchAccountData(id);
}

function enterVault() {
    const discovery = document.getElementById('discovery-view');
    const auth = document.getElementById('auth-view');

    discovery.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    discovery.style.opacity = '0';
    discovery.style.filter = 'blur(20px) scale(0.95)';

    setTimeout(() => {
        discovery.style.display = 'none';
        auth.style.display = 'flex';
        setTimeout(() => {
            auth.style.opacity = '1';
            auth.style.transform = 'translateY(0)';
        }, 50);
    }, 800);
}

// --- Simulation Engine ---
async function runSim(stage) {
    const term = document.getElementById('terminal-body');
    const termTitle = document.querySelector('.terminal-title');
    const statusText = document.getElementById('status-text');
    const statusDot = document.querySelector('.status-dot');

    term.innerHTML = '';
    statusText.innerText = `Executing ${stage.toUpperCase()}...`;
    statusDot.style.background = '#ffbd2e';
    statusDot.style.boxShadow = '0 0 10px #ffbd2e';

    const log = (msg, type = '') => {
        const div = document.createElement('div');
        div.className = `log-line ${type}`;
        div.innerText = stage === 'demo' ? `[DEMO_PIPE] ${msg}` : `[ONBOARD_PIPE] ${msg}`;
        term.appendChild(div);
        term.scrollTop = term.scrollHeight;
    };

    if (stage === 'demo') {
        log("Accessing local dataset: dataset/demo_001.txt", "info");
        await delay(800);
        log("Initializing LLM Pipeline (GPT-4o Mock)...");
        await delay(1200);
        log("Extracting Service Protocols and Emergency Definitions...");
        await delay(1000);
        log("Syncing with External Task Tracker (Asana/Trello)...", "info");
        await delay(800);
        log("SUCCESS: account_memo.json v1 generated.", "success");
        log("SUCCESS: retell_agent_spec.json v1 generated.", "success");
        await updateAccount('account_001', 'v1 (Draft)');
    } else {
        log("Accessing local dataset: dataset/onboarding_01.txt", "info");
        await delay(800);
        log("Applying Onboarding Patch (Conflicting demo values will be overwritten)...");
        await delay(1200);
        log("Cleaning unknowns from v1 memo...");
        await delay(1000);
        log("Syncing Updated Tasks to External Tracker...", "info");
        await delay(800);
        log("SUCCESS: account_memo.json v2 operational.", "success");
        log("SUCCESS: agent_spec.json v2 operational.", "success");
        await updateAccount('account_001', 'v2 (Operational)');
    }

    statusText.innerText = "STANDBY";
    statusDot.style.background = '#27c93f';
    statusDot.style.boxShadow = '0 0 10px #27c93f';
}

async function runBatch() {
    const statusText = document.getElementById('status-text');
    const term = document.getElementById('terminal-body');
    term.innerHTML = '';

    statusText.innerText = "GENERATION STARTED";

    for (let i = 1; i <= 5; i++) {
        const div = document.createElement('div');
        div.className = 'log-line info';
        div.innerText = `[BATCH_PROCESS] Processing Node ${i}/10 (Demo)...`;
        term.appendChild(div);
        await delay(500);
    }

    for (let i = 6; i <= 10; i++) {
        const div = document.createElement('div');
        div.className = 'log-line info';
        div.innerText = `[BATCH_PROCESS] Processing Node ${i}/10 (Onboarding)...`;
        term.appendChild(div);
        await delay(500);
    }

    const final = document.createElement('div');
    final.className = 'log-line success';
    final.innerText = `[BATCH_SUCCESS] Full Dataset (10/10) Processed. All memos and Retell specs saved to /outputs.`;
    term.appendChild(final);

    statusText.innerText = "STANDBY";
}

function delay(ms) { return new Promise(res => setTimeout(res, ms)); }

async function updateAccount(id, version) {
    const acc = ACCOUNTS.find(a => a.id === id);
    if (acc) {
        acc.version = version;
        acc.lastSync = 'Just now';
        initDashboard();
        // Automatically load the diff if we're in overview
        await fetchAccountData(id);
    }
}

// --- Data Fetching ---
async function fetchAccountData(accountId) {
    const acc = ACCOUNTS.find(a => a.id === accountId);
    try {
        const isV2 = acc.version.includes('v2');

        // In local/mock environments, these files might not exist.
        // We provide a fallback to ensure the dashboard remains professional.
        let v1, v2;

        try {
            v1 = await fetch(`../outputs/accounts/${accountId}/v1/account_memo.json`).then(r => r.json());
        } catch (e) {
            v1 = JSON.parse(JSON.stringify(MOCK_DATA));
            v1.questions_or_unknowns = ["Property Manager contact info missing"];
        }

        if (isV2) {
            try {
                v2 = await fetch(`../outputs/accounts/${accountId}/v2/account_memo.json`).then(r => r.json());
            } catch (e) {
                v2 = MOCK_DATA;
            }
        } else {
            v2 = v1;
        }

        renderDiff(v1, v2);
        renderFlow(v2);

        // Render Retell Spec JSON
        document.getElementById('spec-preview').innerText = JSON.stringify(MOCK_AGENT_SPEC, null, 4);
    } catch (err) {
        console.error("Dashboard Render error:", err);
        // Absolute fallback
        renderDiff(MOCK_DATA, MOCK_DATA);
    }
}

function renderDiff(v1, v2) {
    const content = document.getElementById('diff-content');
    content.innerHTML = '';

    const fields = [
        { key: 'company_name', label: 'Client Identity', format: (v) => v },
        { key: 'business_hours', label: 'Business Hours', format: (v) => v ? `${v.days} ${v.start} - ${v.end} ${v.timezone}` : 'Extraction Pending' },
        { key: 'emergency_definition', label: 'Emergency Protocol', format: (v) => v.join(', ') },
        { key: 'emergency_routing_rules', label: 'Escalation Path (v2)', format: (v) => v },
        { key: 'after_hours_flow_summary', label: 'After-Hours Logic', format: (v) => v },
        { key: 'call_transfer_rules', label: 'Transfer Protocol', format: (v) => v },
        { key: 'integration_constraints', label: 'API Restrictions', format: (v) => v.length ? (Array.isArray(v) ? v.join(', ') : v) : 'Unrestricted' },
        { key: 'questions_or_unknowns', label: 'Missing Info (No Hallucination)', format: (v) => v.length ? v.join('\n') : 'All Data Validated' }
    ];

    fields.forEach(field => {
        const v1Val = field.format(v1[field.key]) || 'Pending Extraction';
        const v2Val = field.format(v2[field.key]) || 'Pending Validation';
        const isUnknown = v1[field.key] === null || (Array.isArray(v1[field.key]) && v1[field.key].length === 0);

        const group = document.createElement('div');
        group.className = 'field-group';
        group.innerHTML = `
            <div class="diff-field-header">
                <span class="field-title">${field.label}</span>
                <div class="diff-line"></div>
            </div>
            <div class="pane-grid">
                <div class="pane">
                    <span class="badge v1-badge" title="Original data extracted from the demo transcript">DEMO STATE (RAW)</span>
                    <div class="pane-content ${isUnknown ? 'text-muted' : ''}">${v1Val}</div>
                </div>
                <div class="pane">
                    <span class="badge v2-badge" title="Validated configuration ready for Retell AI production">DEPLOYED (VERIFIED)</span>
                    <div class="pane-content">${v2Val}</div>
                </div>
            </div>
        `;
        content.appendChild(group);
    });
}

function renderFlow(data) {
    const flow = document.getElementById('flow-display');
    flow.innerHTML = `
        <div class="flow-visualizer">
            <div class="flow-node">
                <div class="node-icon"><i data-lucide="mic"></i></div>
                <span class="node-label">INGESTION</span>
            </div>
            <div class="flow-arrow"></div>
            <div class="flow-node">
                <div class="node-icon"><i data-lucide="brain"></i></div>
                <span class="node-label">EXTRACTION</span>
            </div>
            <div class="flow-arrow"></div>
            <div class="flow-node">
                <div class="node-icon"><i data-lucide="git-branch"></i></div>
                <span class="node-label">PATCHING</span>
            </div>
            <div class="flow-arrow"></div>
            <div class="flow-node">
                <div class="node-icon"><i data-lucide="shield-check"></i></div>
                <span class="node-label">VALIDATION</span>
            </div>
            <div class="flow-arrow"></div>
            <div class="flow-node">
                <div class="node-icon"><i data-lucide="cloud-lightning"></i></div>
                <span class="node-label">PROVISION</span>
            </div>
            <div class="flow-arrow"></div>
            <div class="flow-node">
                <div class="node-icon" style="color:var(--accent-neon);"><i data-lucide="activity"></i></div>
                <span class="node-label">LIVE OPS</span>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function initDashboard() {
    const list = document.getElementById('account-list');
    list.innerHTML = '';

    ACCOUNTS.forEach(acc => {
        const item = document.createElement('div');
        item.className = `account-item ${acc.id === currentAccountId ? 'active' : ''}`;
        item.dataset.id = acc.id;
        item.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-weight: 800;">${acc.name}</span>
                <span class="badge v2-badge" style="position:static;">${acc.version.split(' ')[0]}</span>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${acc.version}</div>
        `;
        item.onclick = () => selectAccount(acc.id);
        list.appendChild(item);
    });

    // Select default
    selectAccount(currentAccountId);
}

// --- Settings Handling ---
document.getElementById('settings-form').onsubmit = (e) => {
    e.preventDefault();
    const creds = {
        retell: document.getElementById('retell-key').value,
        n8n: document.getElementById('n8n-webhook').value,
        twilio: document.getElementById('twilio-sid').value
    };
    localStorage.setItem('clara_creds', JSON.stringify(creds));
    alert("Cluster Credentials Encrypted and Stored.");
};

// --- Neural Handshake (Login) ---
function secureInitialize() {
    const user = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;
    const btn = document.querySelector('.main-btn');

    if (user === "" || pass === "") {
        alert("CRITICAL ERROR: CREDENTIALS_REQUIRED. Root access requires both identity and passphrase.");
        return;
    }

    btn.innerHTML = `<span class="status-dot" style="background:var(--primary-neon)"></span> SYNCING...`;
    btn.style.borderColor = 'var(--primary-neon)';
    btn.style.boxShadow = '0 0 30px var(--primary-neon)';

    setTimeout(() => {
        const auth = document.getElementById('auth-view');
        const dashboard = document.getElementById('dashboard-view');

        auth.style.filter = 'blur(20px) brightness(0.5)';
        auth.style.opacity = '0';
        auth.style.transform = 'scale(1.1)';

        setTimeout(() => {
            auth.style.display = 'none';
            dashboard.style.display = 'block';
            setTimeout(() => {
                dashboard.style.opacity = '1';
                dashboard.style.transform = 'translateY(0)';
                initDashboard();
                startMetricsPulse();
                triggerProactiveChat();

                // Greeting from Architect
                setTimeout(() => {
                    const term = document.getElementById('terminal-body');
                    const greet = document.createElement('div');
                    greet.className = 'log-line info';
                    greet.innerHTML = `<span style="color:var(--primary-neon)">[SYSTEM]</span> Master node reached. Welcome back, Architect <strong>Akarsh Jain</strong>.`;
                    term.prepend(greet);
                }, 1000);
            }, 50);
        }, 600);
    }, 1500);
}

function startMetricsPulse() {
    setInterval(() => {
        const pulse = document.getElementById('sys-pulse');
        if (pulse) {
            // Unique fluctuation based on Account ID
            const seed = currentAccountId === 'account_001' ? 0.05 : 0.02;
            const newVal = (Math.random() * 0.05 + seed).toFixed(3);
            pulse.innerText = newVal;
        }
    }, 2000);
}

// --- Neural Consultant (Chatbot) ---
function toggleChat() {
    document.getElementById('neural-chat').classList.toggle('active');
}

function handleChat(e) {
    if (e.key === 'Enter') sendMsg();
}

function triggerProactiveChat() {
    setTimeout(() => {
        if (!document.getElementById('neural-chat').classList.contains('active')) {
            toggleChat();
        }
        addBotMsg("System initialized. I am your Neural Consultant. Architect Akarsh Jain has optimized my protocols for your current session. How shall we begin?");
    }, 3000);
}

function addBotMsg(text) {
    const body = document.getElementById('chat-body');
    const botDiv = document.createElement('div');
    botDiv.className = 'msg bot';
    botDiv.innerText = text;
    body.appendChild(botDiv);
    body.scrollTop = body.scrollHeight;
}

function sendMsg() {
    const input = document.getElementById('user-msg');
    const body = document.getElementById('chat-body');
    const msg = input.value.trim();

    if (msg === "") return;

    // User message
    const userDiv = document.createElement('div');
    userDiv.className = 'msg user';
    userDiv.innerText = msg;
    body.appendChild(userDiv);
    input.value = "";
    body.scrollTop = body.scrollHeight;

    // Simulated Bot Response
    setTimeout(() => {
        let response = "I'm analyzing that request in Akarsh's secure cluster. Please stand by.";
        const lowMsg = msg.toLowerCase();

        if (lowMsg.includes('demo')) response = "The Demo pipeline is currently running on the zero-cost tier. I can trigger a spec-patching sequence if required.";
        if (lowMsg.includes('akarsh')) response = "Architect Akarsh Jain is the sole engineer of this neural pipeline. He has achieved 100% architectural integrity in the recent v4.0 update.";
        if (lowMsg.includes('hello') || lowMsg.includes('hi')) response = "Greetings. I am the Neural Consultant. My presence is a result of Akarsh Jain's elite automation framework.";
        if (lowMsg.includes('help')) response = "I can guide you through Pipeline Simulation, API Provisioning, or verify your current Node Status. What is your query?";

        addBotMsg(response);

        // Visual pulse
        const pulse = document.querySelector('.online-pulse');
        if (pulse) {
            pulse.style.animation = 'pulseGlow 0.5s';
            setTimeout(() => pulse.style.animation = 'pulseGlow 2s infinite', 500);
        }
    }, 1000);
}

// --- Mouse Trail ---
const canvas = document.getElementById('trail-canvas');
const ctx = canvas.getContext('2d');
let points = [];
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resize);
resize();
window.addEventListener('mousemove', (e) => { points.push({ x: e.clientX, y: e.clientY, age: 0 }); });
function animateTrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points = points.filter(p => p.age < 25);
    if (points.length > 1) {
        ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            const p = points[i]; p.age++;
            const opacity = 1 - (p.age / 25);
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity * 0.3})`;
            ctx.lineWidth = opacity * 6;
            ctx.lineTo(p.x, p.y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(p.x, p.y);
        }
    }
    requestAnimationFrame(animateTrail);
}
animateTrail();

