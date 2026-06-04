"use client";

import { GeneratedBrief } from '@/lib/types';
import PromptScore from '@/components/PromptScore';

interface Props {
  brief: GeneratedBrief | null;
  onCopy: () => void;
  onDownload: () => void;
  onSave: () => void;
  onClear: () => void;
}

export default function BriefPreview({ brief, onCopy, onDownload, onSave, onClear }: Props) {
  if (!brief) {
    return (
      <div className="glass p-6 flex flex-col items-center justify-center h-full">
        <p className="text-gray-400">Generate an agent brief to see it here.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto glass p-6 scrollbar-hide">
        {/* Markdown preview: just preformatted text with wrapping */}
        <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
          {brief.content}
        </div>
        {typeof brief.promptScore === 'number' && (
          <PromptScore score={brief.promptScore} missingPieces={brief.missingPieces} />
        )}
      </div>
      <div className="mt-4 flex space-x-2 flex-wrap">
        <button
          className="px-4 py-2 bg-accent text-white rounded hover:bg-blue-600"
          onClick={onCopy}
        >
          Copy full prompt
        </button>
        <button
          className="px-4 py-2 bg-accent text-white rounded hover:bg-blue-600"
          onClick={onDownload}
        >
          Download as .md
        </button>
        <button
          className="px-4 py-2 bg-accent text-white rounded hover:bg-blue-600"
          onClick={onSave}
        >
          Save brief
        </button>
        <button
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          onClick={onClear}
        >
          Clear output
        </button>
      </div>
    </div>
  );
}