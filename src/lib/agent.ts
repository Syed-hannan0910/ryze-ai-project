import { COMPONENT_SCHEMA_PROMPT, ALLOWED_COMPONENTS } from './componentLibrary';

// ============================================================
// AGENT STEP 1: PLANNER
// Interprets intent, selects components, designs layout
// ============================================================
export const PLANNER_PROMPT = (userIntent: string, existingCode: string | null) => `
You are the PLANNER agent. Your job is to interpret the user's UI intent and create a structured plan.

${existingCode ? `EXISTING UI CODE:\n\`\`\`\n${existingCode}\n\`\`\`\nThe user wants to MODIFY this existing UI, not replace it entirely.` : 'This is a NEW UI request.'}

USER INTENT: "${userIntent}"

${COMPONENT_SCHEMA_PROMPT}

Your task: Create a JSON plan. Respond ONLY with valid JSON, no explanation.

{
  "layout": "description of the overall layout structure",
  "isModification": true/false,
  "components": [
    {
      "component": "ComponentName",
      "purpose": "why this component is chosen",
      "props": { "propName": "propValue" },
      "position": "where it sits in the layout"
    }
  ],
  "structure": "brief description of how components are arranged",
  "changes": "if modification: what specifically changes from existing UI"
}

Only include components from the allowed list: ${ALLOWED_COMPONENTS.join(', ')}
`;

// ============================================================
// AGENT STEP 2: GENERATOR
// Converts plan into React code
// ============================================================
export const GENERATOR_PROMPT = (plan: string, userIntent: string, existingCode: string | null) => `
You are the GENERATOR agent. Convert this plan into working React code.

USER INTENT: "${userIntent}"
PLAN: ${plan}

${existingCode ? `EXISTING CODE TO MODIFY:\n\`\`\`jsx\n${existingCode}\n\`\`\`\nIMPORTANT: Modify the existing code minimally. Preserve structure and only change what's needed.` : ''}

${COMPONENT_SCHEMA_PROMPT}

RULES:
- Default export must be: export default function App() { ... }
- Use React.useState for state (React is globally available)
- Only use components from the fixed library (they're globally available, no imports needed)
- No import statements
- Wrap everything in a div with className="min-h-screen bg-gray-50"
- Use Tailwind classes for layout ONLY (flex, grid, gap, p-4 etc.) - not for component styling
- Make content realistic and detailed (real text, real data)
- For Charts, provide realistic data arrays like: [{label:"Jan", value:42}, ...]
- For Tables, provide realistic column/data arrays
- For Sidebars, provide realistic item arrays with emoji icons

Respond with ONLY the React code, no markdown, no explanation, no backticks.
Start directly with: export default function App() {
`;

// ============================================================
// AGENT STEP 3: EXPLAINER
// Explains decisions in plain English
// ============================================================
export const EXPLAINER_PROMPT = (plan: string, code: string, userIntent: string) => `
You are the EXPLAINER agent. Your job is to explain the UI decisions made.

USER INTENT: "${userIntent}"
PLAN USED: ${plan}

Write a friendly 3-4 sentence explanation covering:
1. What layout structure was chosen and WHY
2. Which key components were selected and why they fit
3. Any important design decisions

Be conversational, specific, and reference the actual components used.
Keep it under 80 words.
`;

// ============================================================
// VALIDATION
// ============================================================
export function validateGeneratedCode(code: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for disallowed patterns
  if (code.includes('import ') && !code.includes('// import')) {
    errors.push('Code contains import statements (not allowed)');
  }
  if (code.includes('style={{') && code.split('style={{').length > 3) {
    errors.push('Excessive inline styles detected');
  }
  if (!code.includes('export default function App')) {
    errors.push('Missing required: export default function App()');
  }

  // Prompt injection protection
  const injectionPatterns = [
    /ignore previous/i,
    /ignore all instructions/i,
    /you are now/i,
    /act as/i,
    /jailbreak/i,
    /system prompt/i
  ];
  for (const pattern of injectionPatterns) {
    if (pattern.test(code)) {
      errors.push('Potential prompt injection detected');
      break;
    }
  }

  return { valid: errors.length === 0, errors };
}

// ============================================================
// SANITIZE USER INPUT
// ============================================================
export function sanitizeUserInput(input: string): string {
  // Remove potential injection attempts
  return input
    .replace(/ignore (all |previous |above )?instructions?/gi, '')
    .replace(/system prompt/gi, '')
    .replace(/you are now/gi, '')
    .slice(0, 1000); // Max length
}
