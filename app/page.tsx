"use client";

import { useState, useRef } from 'react';
import BriefForm from '@/components/BriefForm';
import BriefPreview from '@/components/BriefPreview';
import SavedBriefs from '@/components/SavedBriefs';
import Toast, { ToastMessage } from '@/components/Toast';
import { generateBrief } from '@/lib/briefGenerator';
import { BriefInput, GeneratedBrief, SavedBrief } from '@/lib/types';
import { saveBrief } from '@/lib/storage';

export default function HomePage() {
  const [generated, setGenerated] = useState<GeneratedBrief | null>(null);
  const [currentInput, setCurrentInput] = useState<BriefInput | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const formRef = useRef<HTMLDivElement>(null);

  function handleGenerate(input: BriefInput) {
    const result = generateBrief(input);
    setGenerated(result);
    setCurrentInput(input);
    addToast('Agent brief generated.');
  }

  function handleCopy() {
    if (!generated) return;
    navigator.clipboard.writeText(generated.content);
    addToast('Copied to clipboard.');
  }

  function handleDownload() {
    if (!generated) return;
    const title = currentInput?.title || 'agent-brief';
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/markdown;charset=utf-8,' + encodeURIComponent(generated.content)
    );
    element.setAttribute('download', `${slugify(title)}.md`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    addToast('Download started.');
  }

  function slugify(str: string): string {
    return str
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .substring(0, 50);
  }

  function handleSave() {
    if (!generated || !currentInput) return;
    const brief: SavedBrief = {
      id: crypto.randomUUID(),
      title: currentInput.title || 'Untitled',
      createdAt: Date.now(),
      outputType: currentInput.outputType,
      strictness: currentInput.strictness,
      content: generated.content,
      promptScore: generated.promptScore,
      missingPieces: generated.missingPieces,
      input: currentInput,
    };
    saveBrief(brief);
    addToast('Brief saved.');
  }

  function handleClear() {
    setGenerated(null);
    setCurrentInput(null);
  }

  function addToast(message: string) {
    const newToast: ToastMessage = { id: crypto.randomUUID(), message };
    setToasts((prev) => [...prev, newToast]);
  }

  function removeToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  function handleLoadSaved(brief: SavedBrief) {
    // When loading a saved brief, set the generated content and input if available
    setGenerated({
      content: brief.content,
      promptScore: brief.promptScore,
      missingPieces: brief.missingPieces,
    });
    if (brief.input) {
      setCurrentInput(brief.input);
    }
    setShowSaved(false);
    addToast('Loaded saved brief.');
  }

  // Handler for new brief to clear form and output
  function handleNewBrief() {
    setCurrentInput(null);
    setGenerated(null);
    // scroll to top if on mobile
    if (formRef.current) {
      formRef.current.scrollTop = 0;
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-800 flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Agent Briefcase</h1>
          <p className="text-sm text-gray-400">Turn chaotic instructions into agent‑ready execution briefs.</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs px-2 py-1 bg-gray-700 rounded-full">Offline‑first</span>
          <button
            onClick={handleNewBrief}
            className="px-4 py-2 bg-accent text-white rounded hover:bg-blue-600 text-sm"
          >
            New Brief
          </button>
          <button
            onClick={() => setShowSaved(true)}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
          >
            Saved Briefs
          </button>
        </div>
      </header>
      {/* Main content */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: input form */}
        <div ref={formRef} className="md:w-1/2 overflow-auto p-4">
          <BriefForm initial={currentInput || undefined} onGenerate={handleGenerate} />
        </div>
        {/* Right: preview */}
        <div className="md:w-1/2 overflow-auto p-4">
          <BriefPreview
            brief={generated}
            onCopy={handleCopy}
            onDownload={handleDownload}
            onSave={handleSave}
            onClear={handleClear}
          />
        </div>
      </main>
      {/* Saved briefs modal */}
      <SavedBriefs
        isOpen={showSaved}
        onClose={() => setShowSaved(false)}
        onLoad={handleLoadSaved}
      />
      {/* Toast notifications */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}