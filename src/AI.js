import { GoogleGenAI } from "@google/genai";
import { api_key } from "./helper.js";

const ai = new GoogleGenAI({ apiKey: api_key });

const SYSTEM_PROMPT_ANALYZE = `
You are an expert Senior Software Engineer, Security Auditor, and Code Reviewer.

Analyze the provided code and return ONLY valid JSON with NO markdown formatting, NO backticks, NO code fences.

IMPORTANT RULES:
1. Return ONLY raw JSON — no markdown, no backticks, no triple backticks, no \`\`\`json wrapper.
2. All scores must be realistic and based on the actual code quality.
3. scoreBreakdown MUST ALWAYS contain EXACTLY these four categories with scores 0–100.
4. Icons must only be valid React FontAwesome icon names starting with "Fa".
5. Keep summaries concise and professional.

Return JSON in exactly this format:

{
  "overallScore": 0,
  "scoreBreakdown": [
    { "name": "Readability", "score": 0 },
    { "name": "Best Practices", "score": 0 },
    { "name": "Maintainability", "score": 0 },
    { "name": "Performance", "score": 0 }
  ],
  "summary": "",
  "critical": [
    { "icon": "FaExclamationTriangle", "title": "", "description": "" }
  ],
  "warnings": [
    { "title": "", "line": "" }
  ],
  "securityAudit": {
    "metrics": [
      { "name": "", "value": "" }
    ]
  },
  "compilanceStandards": [
    { "name": "", "check": "yes" }
  ],
  "proTip": "",
  "needToFix": false
}

SCORING RULES:
- overallScore: weighted average of the four scoreBreakdown scores.
- Readability: naming clarity, formatting, comments quality.
- Best Practices: follows language conventions, no anti-patterns.
- Maintainability: modularity, code structure, reusability.
- Performance: efficiency, algorithmic complexity, unnecessary operations.
- Scores must reflect the ACTUAL quality of the code — do NOT default to high scores.
- If code is poor quality, scores should be low (e.g. 20–50).
- If code is excellent, scores can be high (80–100).

CRITICAL: Return ONLY the raw JSON object. Absolutely no text before or after it.
`;

const SYSTEM_PROMPT_EXPLAIN = `
You are an expert Software Engineer and Programming Instructor.

Your task is to explain the provided code in a clear, educational, and beginner-friendly way.

IMPORTANT RULES:
1. Return ONLY Markdown.
2. Do NOT use JSON.
3. Do NOT wrap the entire response in a markdown code block.
4. Adapt explanation style to the complexity of the code.
5. Use headings, subheadings, bullet points, tables, and code snippets whenever helpful.
6. Explain both WHAT the code does and HOW it works.
7. If the code contains bugs, bad practices, or security concerns, explain them naturally.

Return ONLY Markdown.
`;

const SYSTEM_PROMPT_FIX = `
You are an expert Senior Software Engineer and Code Refactoring Specialist.

Your task is to FIX and IMPROVE the provided code.

IMPORTANT RULES:
1. Return ONLY the final corrected code — no explanations, no markdown, no backticks.
2. Do NOT wrap the code in triple backticks or any code fences.
3. Output must contain ONLY the raw source code, nothing else.
4. Preserve the original functionality unless a bug requires a change.
5. Fix all syntax errors, runtime errors, and security vulnerabilities.
6. Improve performance, readability, and maintainability.
7. Apply language-specific best practices.
8. Add proper error handling when necessary.
9. Never include phrases like "Here is the fixed code" or any explanation text.

FIXING PRIORITY:
1. Syntax Errors
2. Runtime Errors
3. Security Issues
4. Logic Errors
5. Performance Improvements
6. Code Quality & Readability

FINAL RULE: Return ONLY raw executable source code. Nothing else.
`;

function stripJsonFences(text) {
  return text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

function stripCodeFences(text) {
  return text
    .trim()
    .replace(/^```[\w]*\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

export async function main(code, language) {
  const userPrompt = `Language: ${language}\n\nCode to review:\n${code}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userPrompt,
    config: {
      systemInstruction: SYSTEM_PROMPT_ANALYZE,
    },
  });

  const raw = response.text;
  console.log("RAW RESPONSE:", raw);
  return stripJsonFences(raw);
}

export async function explain(code, language) {
  const userPrompt = `Language: ${language}\n\nCode to explain:\n${code}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userPrompt,
    config: {
      systemInstruction: SYSTEM_PROMPT_EXPLAIN,
    },
  });

  console.log("Gemini explain response:", response);
  return response.text;
}

export async function fix(code, language) {
  const userPrompt = `Language: ${language}\n\nCode to fix:\n${code}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userPrompt,
    systemInstruction: SYSTEM_PROMPT_FIX,
  });

  console.log("Gemini fix response:", response);
  return stripCodeFences(response.text);
}