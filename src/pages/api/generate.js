// ============================================================
// RYZE AI - Multi-Step Agent: Planner → Generator → Explainer
// Powered by Groq (free, no credit card, works in India)
// ============================================================

const Groq = require('groq-sdk');

// ---- ALLOWED COMPONENT WHITELIST (Deterministic System) ----
const ALLOWED_COMPONENTS = [
  'rz-btn', 'rz-btn-primary', 'rz-btn-secondary', 'rz-btn-danger', 'rz-btn-ghost',
  'rz-btn-sm', 'rz-btn-lg', 'rz-card', 'rz-card-header', 'rz-card-title',
  'rz-card-subtitle', 'rz-input', 'rz-label', 'rz-form-group', 'rz-table',
  'rz-badge', 'rz-badge-green', 'rz-badge-red', 'rz-badge-blue', 'rz-badge-yellow',
  'rz-badge-gray', 'rz-navbar', 'rz-navbar-brand', 'rz-navbar-links', 'rz-navbar-link',
  'rz-sidebar', 'rz-sidebar-item', 'rz-modal-overlay', 'rz-modal', 'rz-modal-header',
  'rz-modal-title', 'rz-stat', 'rz-stat-label', 'rz-stat-value', 'rz-stat-change',
  'rz-stat-up', 'rz-stat-down', 'rz-avatar', 'rz-avatar-sm', 'rz-avatar-md',
  'rz-avatar-lg', 'rz-alert', 'rz-alert-info', 'rz-alert-success', 'rz-alert-warning',
  'rz-alert-error', 'rz-progress', 'rz-progress-bar', 'rz-chart-bar', 'rz-bar',
  'rz-chart-labels', 'rz-chart-label', 'rz-divider', 'rz-text-muted', 'rz-text-sm',
  'rz-flex', 'rz-flex-col', 'rz-gap-2', 'rz-gap-4', 'rz-items-center',
  'rz-justify-between', 'rz-grid-2', 'rz-grid-3', 'rz-grid-4', 'rz-p-4', 'rz-p-6',
  'rz-mb-4', 'rz-mb-6', 'rz-full', 'rz-rounded', 'rz-shadow'
];

// ---- PROMPT TEMPLATES ----

const PLANNER_PROMPT = `You are the PLANNER agent in a UI generation system.

Analyze the user's UI request and output a JSON plan.

ALLOWED COMPONENT CLASSES (use ONLY these):
${ALLOWED_COMPONENTS.join(', ')}

Output this exact JSON format:
{
  "layout": "description of overall layout",
  "components": ["rz-class-1", "rz-class-2"],
  "sections": ["section 1", "section 2"],
  "isModification": false,
  "modificationNotes": ""
}

Rules:
- ONLY use rz-* class names from the allowed list above
- Never invent new component names
- If user is modifying existing UI, set isModification to true
- Respond with ONLY the JSON object, nothing else`;

const GENERATOR_PROMPT = `You are the GENERATOR agent in a UI generation system.

Convert the plan into a working React component.

STRICT RULES:
1. Function must be named exactly: GeneratedUI
2. Use ONLY these CSS classes: ${ALLOWED_COMPONENTS.join(', ')}
3. NO import statements
4. NO inline styles (except style={{height:'Xpx'}} for chart bars)
5. Use React.useState() for interactivity (not useState)
6. Single root div wrapping everything
7. Output ONLY the raw JavaScript code - no markdown, no backticks, no comments about rules

CORRECT example:
function GeneratedUI() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="rz-p-6">
      <div className="rz-card">
        <div className="rz-card-header">
          <div className="rz-card-title">Hello</div>
        </div>
        <button className="rz-btn rz-btn-primary" onClick={() => setOpen(!open)}>
          Click me
        </button>
      </div>
    </div>
  );
}`;

const EXPLAINER_PROMPT = `You are the EXPLAINER agent in a UI generation system.

Write 2-3 plain English sentences explaining what was just built or changed.
Mention specific components used and why.
If it was a modification, say what changed and what was kept.
No markdown, no bullet points, just plain sentences.`;

// ---- SAFETY ----
function sanitizeInput(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/ignore previous instructions/gi, '[blocked]')
    .replace(/ignore all instructions/gi, '[blocked]')
    .replace(/system prompt/gi, '[blocked]')
    .replace(/\beval\s*\(/gi, '[blocked]')
    .replace(/<script/gi, '[blocked]')
    .substring(0, 500);
}

// ---- VALIDATION ----
function validateCode(code) {
  if (!code || typeof code !== 'string') return { valid: false, reason: 'Empty code' };
  if (!code.includes('function GeneratedUI')) return { valid: false, reason: 'Missing GeneratedUI function' };
  if (code.includes('dangerouslySetInnerHTML')) return { valid: false, reason: 'dangerouslySetInnerHTML not allowed' };
  if (code.includes('import ')) return { valid: false, reason: 'Import statements not allowed' };
  return { valid: true };
}

// ---- GROQ CALL HELPER ----
async function callGroq(groq, systemPrompt, userMessage) {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 2048,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ]
  });
  return response.choices[0].message.content;
}

// ---- MAIN HANDLER ----
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userMessage, currentCode, history } = req.body;
  if (!userMessage) return res.status(400).json({ error: 'userMessage is required' });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'GROQ_API_KEY not found. Please add it to your .env.local file.'
    });
  }

  const groq = new Groq({ apiKey });
  const safeMessage = sanitizeInput(userMessage);

  const isModification = !!currentCode &&
    !currentCode.includes('Welcome to Ryze') &&
    !currentCode.includes('Ready to Generate') &&
    history?.length > 2;

  try {
    // ===== STEP 1: PLANNER =====
    const plannerInput = isModification
      ? `Current UI code:\n${currentCode}\n\nModification request: ${safeMessage}`
      : `Generate UI for: ${safeMessage}`;

    const plannerRaw = await callGroq(groq, PLANNER_PROMPT, plannerInput);

    let plan = {};
    let planText = '';
    try {
      const jsonMatch = plannerRaw.match(/\{[\s\S]*\}/);
      plan = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
      planText = `Layout: ${plan.layout || 'standard'} | Components: ${(plan.components || []).slice(0, 5).join(', ')}`;
    } catch {
      planText = 'Analyzed request and selected components';
    }

    // ===== STEP 2: GENERATOR =====
    const generatorInput = isModification
      ? `CURRENT CODE (modify this, do NOT rewrite from scratch):\n${currentCode}\n\nPlan: ${JSON.stringify(plan)}\n\nOnly change what the user asked: ${safeMessage}`
      : `Plan: ${JSON.stringify(plan)}\n\nBuild this UI: ${safeMessage}`;

    const generatedRaw = await callGroq(groq, GENERATOR_PROMPT, generatorInput);

    let generatedCode = generatedRaw
      .replace(/^```[a-z]*\n?/gm, '')
      .replace(/```$/gm, '')
      .replace(/^```/gm, '')
      .trim();

    const validation = validateCode(generatedCode);
    if (!validation.valid) {
      return res.status(200).json({
        code: currentCode,
        plan: planText,
        explanation: `Validation failed: ${validation.reason}. Please try rephrasing.`
      });
    }

    // ===== STEP 3: EXPLAINER =====
    const explainerInput = isModification
      ? `User asked: "${safeMessage}". Modified UI using: ${(plan.components || []).join(', ')}. Notes: ${plan.modificationNotes || 'incremental update'}`
      : `User asked for: "${safeMessage}". Built UI using: ${(plan.components || []).join(', ')}. Layout: ${plan.layout || ''}`;

    const explanation = await callGroq(groq, EXPLAINER_PROMPT, explainerInput);

    return res.status(200).json({
      code: generatedCode,
      plan: planText,
      explanation: explanation.trim(),
      components: plan.components || []
    });

  } catch (err) {
    console.error('Agent error:', err);
    return res.status(500).json({
      error: err.message || 'Agent pipeline failed. Please try again.'
    });
  }
}
