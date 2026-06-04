import { BriefInput, GeneratedBrief } from './types';

function section(title: string, body: string): string {
  return `## ${title}\n\n${body.trim()}`;
}

/**
 * Generates a deterministic agent brief from a user's input. The resulting
 * markdown contains clear sections and explicit instructions aligned with
 * the prompt quality rules. It does not rely on any remote API and can be
 * executed entirely offline. The function also returns a simple prompt
 * quality score and a list of missing pieces that could improve the brief.
 */
export function generateBrief(input: BriefInput): GeneratedBrief {
  const parts: string[] = [];

  // Mission section
  const missionLines: string[] = [];
  missionLines.push(input.title || 'Untitled Brief');
  missionLines.push(input.instruction.trim());
  parts.push(section('Mission', missionLines.join('\n\n')));

  // Context section
  let contextBody = '';
  if (input.context && input.context.trim().length > 0) {
    contextBody += `Project context:\n${input.context.trim()}`;
  }
  if (input.folderTree && input.folderTree.trim().length > 0) {
    if (contextBody) contextBody += '\n\n';
    contextBody += `Relevant folder tree or files:\n${input.folderTree.trim()}`;
  }
  if (!contextBody) {
    contextBody = 'No additional context provided. You may inspect the repository as needed before making changes.';
  }
  parts.push(section('Context', contextBody));

  // Scope section
  const scopeLines: string[] = [];
  scopeLines.push(`This task is classified as **${input.outputType}** with a **${input.strictness}** quality pass.`);
  scopeLines.push('Focus only on delivering the requested outcome without expanding the scope.');
  parts.push(section('Scope', scopeLines.join('\n\n')));

  // Non-goals section
  let nonGoals = '';
  if (input.avoid && input.avoid.trim().length > 0) {
    nonGoals = `Do not touch the following files or folders: ${input.avoid.trim()}.`;
  } else {
    nonGoals = 'Avoid modifying any files or parts of the codebase that are unrelated to this mission.';
  }
  parts.push(section('Non‑goals', nonGoals));

  // Files likely involved
  let likelyFiles = '';
  if (input.folderTree && input.folderTree.trim().length > 0) {
    likelyFiles = 'Based on the provided folder tree, focus on the relevant files listed above.';
  } else {
    likelyFiles = 'Determine which files are relevant to accomplish the mission after inspecting the repository.';
  }
  parts.push(section('Files likely involved', likelyFiles));

  // Files/folders to avoid section
  let avoidBody = '';
  if (input.avoid && input.avoid.trim().length > 0) {
    avoidBody = input.avoid.trim();
  } else {
    avoidBody = 'None specified. Use your judgment to avoid unrelated files and directories.';
  }
  parts.push(section('Files/folders to avoid', avoidBody));

  // Execution rules
  const execRules: string[] = [];
  // Always instruct to inspect the repo
  execRules.push('Inspect the repository structure and existing code before making any edits.');
  execRules.push('Avoid unrelated rewrites or refactors unless absolutely necessary for the requested task.');
  execRules.push('Only update global documentation or configuration files when it is directly relevant.');
  execRules.push('When appending logs or progress notes, append them to existing files instead of overwriting history.');
  execRules.push('Summarize every file you change, explaining why each change was made.');
  execRules.push('Clearly mention which tests were run and their outcomes.');
  execRules.push('Be transparent if any part of the mission is incomplete or requires follow‑up.');
  execRules.push('Do not ask unnecessary clarification questions if reasonable assumptions can be made.');
  // Additional rules based on checkboxes
  if (input.preventUnrelated) {
    execRules.push('Do not touch unrelated files or directories under any circumstances.');
  }
  parts.push(section('Execution rules', execRules.map((r) => `- ${r}`).join('\n')));

  // Required workflow
  const workflow: string[] = [];
  workflow.push('Understand the mission and determine the exact goal.');
  if (input.inspectRepo) workflow.push('Scan the project directory and relevant code to build context.');
  workflow.push('Plan the changes necessary to fulfill the task within scope.');
  workflow.push('Implement the changes in a clean and modular way.');
  if (input.requireTests) workflow.push('Write or update tests to cover the new or changed behaviour.');
  if (input.requireDocs) workflow.push('Update relevant documentation and comment on your changes.');
  workflow.push('Validate the functionality by running tests, lints, and manual checks.');
  workflow.push('Prepare a concise summary of changes for review.');
  if (input.requireCommit) workflow.push('Craft a final git commit with a meaningful message and prepare a PR if required.');
  parts.push(section('Required workflow', workflow.map((w) => `1. ${w}`).join('\n')));

  // Acceptance criteria
  let accept = '';
  if (input.requireAcceptanceCriteria) {
    accept = 'Define clear acceptance criteria before starting the work. The task is complete when it meets all criteria and passes validation checks.';
  } else {
    accept = 'No explicit acceptance criteria were provided. Use your judgement to ensure the work satisfies the mission description and passes validation checks.';
  }
  parts.push(section('Acceptance criteria', accept));

  // Validation checklist
  const checklist: string[] = [];
  checklist.push('Code compiles without errors and passes all existing and new tests.');
  checklist.push('No linter or type errors remain.');
  if (input.requireTests) checklist.push('All new tests cover key branches and edge cases.');
  if (input.requireDocs) checklist.push('Documentation reflects any new functionality or decisions.');
  checklist.push('Changed files are summarised clearly.');
  checklist.push('Commit message or PR description is well‑formed and follows repository conventions.');
  parts.push(section('Validation checklist', checklist.map((c) => `- [ ] ${c}`).join('\n')));

  // Final response format
  const finalResp: string[] = [];
  finalResp.push('Start your response with a high‑level summary of what was achieved.');
  finalResp.push('List each changed file with a short description of the modification.');
  finalResp.push('Include any important notes, assumptions, or follow‑ups.');
  finalResp.push('If tests were added or run, mention their outcomes.');
  finalResp.push('Do not include raw diffs; summarise instead.');
  parts.push(section('Final response format', finalResp.map((f) => `- ${f}`).join('\n')));

  // Git/PR packet
  const gitPacket: string[] = [];
  if (input.requireCommit) {
    gitPacket.push('Provide a ready‑to‑apply git commit message summarising your changes.');
    gitPacket.push('If applicable, outline the steps to create a pull request.');
    gitPacket.push('Ensure the commit message follows conventional commit or project standards.');
  } else {
    gitPacket.push('A commit packet is not strictly required, but summarising changes for version control is encouraged.');
  }
  parts.push(section('Git/PR packet', gitPacket.map((g) => `- ${g}`).join('\n')));

  // Assemble the final content
  const content = parts.join('\n\n');

  // Prompt quality scoring
  let score = 0;
  const missing: string[] = [];
  if (input.title && input.title.trim().length > 0) score += 10; else missing.push('title');
  if (input.instruction && input.instruction.trim().length > 0) score += 20; else missing.push('instruction');
  if (input.context && input.context.trim().length > 0) score += 10; else missing.push('project context');
  if (input.folderTree && input.folderTree.trim().length > 0) score += 10; else missing.push('folder tree / relevant files');
  if (input.avoid && input.avoid.trim().length > 0) score += 10; else missing.push('files/folders to avoid');
  if (input.requireAcceptanceCriteria) score += 10; else missing.push('acceptance criteria');
  if (input.requireTests) score += 5; else missing.push('tests or validation steps');
  if (input.requireDocs) score += 5; else missing.push('documentation updates');
  if (input.requireSummary) score += 5; else missing.push('file‑by‑file change summary');
  // Normalise score to 0–100 range
  const promptScore = Math.min(100, Math.max(0, score));

  return {
    content,
    promptScore,
    missingPieces: missing,
  };
}