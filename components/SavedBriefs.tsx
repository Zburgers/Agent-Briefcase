"use client";

import { useState, useEffect } from 'react';
import { SavedBrief } from '@/lib/types';
import { getSavedBriefs, deleteBrief, saveBrief } from '@/lib/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (brief: SavedBrief) => void;
}

export default function SavedBriefs({ isOpen, onClose, onLoad }: Props) {
  const [briefs, setBriefs] = useState<SavedBrief[]>([]);

  useEffect(() => {
    if (isOpen) {
      setBriefs(getSavedBriefs());
    }
  }, [isOpen]);

  function handleDelete(id: string) {
    deleteBrief(id);
    setBriefs(getSavedBriefs());
  }

  function handleDuplicate(brief: SavedBrief) {
    const dup: SavedBrief = {
      ...brief,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    saveBrief(dup);
    setBriefs(getSavedBriefs());
  }

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="glass p-6 w-11/12 md:w-2/3 max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Saved Briefs</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">✕</button>
        </div>
        {briefs.length === 0 && <p className="text-gray-400">No saved briefs yet.</p>}
        <ul className="space-y-4">
          {briefs.map((brief) => (
            <li key={brief.id} className="border border-gray-700 rounded p-3 flex flex-col md:flex-row md:items-center md:space-x-4">
              <div className="flex-1">
                <p className="font-semibold">{brief.title || 'Untitled'}</p>
                <p className="text-xs text-gray-400">{new Date(brief.createdAt).toLocaleString()}</p>
                <p className="text-xs text-gray-400">{brief.outputType} • {brief.strictness}</p>
              </div>
              <div className="flex space-x-2 mt-2 md:mt-0">
                <button
                  className="px-3 py-1 bg-accent text-white rounded hover:bg-blue-600 text-xs"
                  onClick={() => onLoad(brief)}
                >
                  Load
                </button>
                <button
                  className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-xs"
                  onClick={() => handleDuplicate(brief)}
                >
                  Duplicate
                </button>
                <button
                  className="px-3 py-1 bg-red-700 text-white rounded hover:bg-red-600 text-xs"
                  onClick={() => handleDelete(brief.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}