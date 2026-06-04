"use client";

import { useState, useEffect } from 'react';
import { BriefInput, OutputType, StrictnessLevel } from '@/lib/types';

interface Props {
  initial?: Partial<BriefInput>;
  onGenerate: (input: BriefInput) => void;
  onSave?: () => void;
}

const outputTypes: OutputType[] = [
  'Code change',
  'Documentation update',
  'Bug investigation',
  'Repo cleanup',
  'PR review',
  'Research report',
  'General task',
];

const strictnessLevels: StrictnessLevel[] = [
  'Fast pass',
  'Careful pass',
  'Production pass',
  'Ruthless QA pass',
];

export default function BriefForm({ initial, onGenerate }: Props) {
  const [title, setTitle] = useState(initial?.title || '');
  const [instruction, setInstruction] = useState(initial?.instruction || '');
  const [context, setContext] = useState(initial?.context || '');
  const [folderTree, setFolderTree] = useState(initial?.folderTree || '');
  const [avoid, setAvoid] = useState(initial?.avoid || '');
  const [outputType, setOutputType] = useState<OutputType>(initial?.outputType || 'General task');
  const [strictness, setStrictness] = useState<StrictnessLevel>(initial?.strictness || 'Production pass');
  const [inspectRepo, setInspectRepo] = useState(initial?.inspectRepo ?? true);
  const [requireAcceptanceCriteria, setRequireAcceptanceCriteria] = useState(initial?.requireAcceptanceCriteria ?? false);
  const [requireSummary, setRequireSummary] = useState(initial?.requireSummary ?? true);
  const [requireTests, setRequireTests] = useState(initial?.requireTests ?? false);
  const [requireDocs, setRequireDocs] = useState(initial?.requireDocs ?? false);
  const [preventUnrelated, setPreventUnrelated] = useState(initial?.preventUnrelated ?? true);
  const [requireCommit, setRequireCommit] = useState(initial?.requireCommit ?? true);

  // Synchronise state when initial changes (e.g., loading a saved brief)
  useEffect(() => {
    setTitle(initial?.title || '');
    setInstruction(initial?.instruction || '');
    setContext(initial?.context || '');
    setFolderTree(initial?.folderTree || '');
    setAvoid(initial?.avoid || '');
    setOutputType(initial?.outputType || 'General task');
    setStrictness(initial?.strictness || 'Production pass');
    setInspectRepo(initial?.inspectRepo ?? true);
    setRequireAcceptanceCriteria(initial?.requireAcceptanceCriteria ?? false);
    setRequireSummary(initial?.requireSummary ?? true);
    setRequireTests(initial?.requireTests ?? false);
    setRequireDocs(initial?.requireDocs ?? false);
    setPreventUnrelated(initial?.preventUnrelated ?? true);
    setRequireCommit(initial?.requireCommit ?? true);
  }, [initial]);

  // keyboard shortcuts: Cmd/Ctrl+Enter to generate
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === 'Enter') {
        e.preventDefault();
        handleGenerate();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  function handleGenerate() {
    const input: BriefInput = {
      title,
      instruction,
      context,
      folderTree,
      avoid,
      outputType,
      strictness,
      inspectRepo,
      requireAcceptanceCriteria,
      requireSummary,
      requireTests,
      requireDocs,
      preventUnrelated,
      requireCommit,
    };
    onGenerate(input);
  }

  return (
    <div className="glass p-6 space-y-4 overflow-auto h-full">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="title">Brief title</label>
        <input
          id="title"
          type="text"
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a short, descriptive title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="instruction">Messy instruction / brain dump</label>
        <textarea
          id="instruction"
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 h-24 resize-vertical focus:outline-none focus:ring-2 focus:ring-accent"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="Paste your task description here"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="context">Project context</label>
        <textarea
          id="context"
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 h-20 resize-vertical focus:outline-none focus:ring-2 focus:ring-accent"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Optional context about the repository or project"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="folderTree">Folder tree / relevant files</label>
        <textarea
          id="folderTree"
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 h-20 resize-vertical focus:outline-none focus:ring-2 focus:ring-accent"
          value={folderTree}
          onChange={(e) => setFolderTree(e.target.value)}
          placeholder="Optional list of relevant folders or files"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="avoid">Files or folders to avoid</label>
        <textarea
          id="avoid"
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 h-16 resize-vertical focus:outline-none focus:ring-2 focus:ring-accent"
          value={avoid}
          onChange={(e) => setAvoid(e.target.value)}
          placeholder="Optional list of files/folders to avoid"
        />
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1" htmlFor="outputType">Desired output type</label>
          <select
            id="outputType"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
            value={outputType}
            onChange={(e) => setOutputType(e.target.value as OutputType)}
          >
            {outputTypes.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1" htmlFor="strictness">Strictness level</label>
          <select
            id="strictness"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
            value={strictness}
            onChange={(e) => setStrictness(e.target.value as StrictnessLevel)}
          >
            {strictnessLevels.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Checkbox
          label="Ask agent to inspect repo before editing"
          checked={inspectRepo}
          onChange={setInspectRepo}
        />
        <Checkbox
          label="Require acceptance criteria"
          checked={requireAcceptanceCriteria}
          onChange={setRequireAcceptanceCriteria}
        />
        <Checkbox
          label="Require file-by-file change summary"
          checked={requireSummary}
          onChange={setRequireSummary}
        />
        <Checkbox
          label="Require tests or validation steps"
          checked={requireTests}
          onChange={setRequireTests}
        />
        <Checkbox
          label="Require docs/progress updates"
          checked={requireDocs}
          onChange={setRequireDocs}
        />
        <Checkbox
          label="Prevent touching unrelated files"
          checked={preventUnrelated}
          onChange={setPreventUnrelated}
        />
        <Checkbox
          label="Require final git commit packet"
          checked={requireCommit}
          onChange={setRequireCommit}
        />
      </div>
      <button
        onClick={handleGenerate}
        className="mt-4 w-full px-4 py-2 bg-accent text-white rounded hover:bg-blue-600"
      >
        Generate Agent Brief
      </button>
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (val: boolean) => void; }) {
  return (
    <label className="flex items-center space-x-2 text-sm">
      <input
        type="checkbox"
        className="form-checkbox h-4 w-4 text-accent bg-gray-800 border-gray-600 focus:ring-accent"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}