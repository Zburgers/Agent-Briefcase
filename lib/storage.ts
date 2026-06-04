import { SavedBrief } from './types';

const STORAGE_KEY = 'agent-briefcase-saved';

function safeParse(data: string | null): SavedBrief[] {
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getSavedBriefs(): SavedBrief[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return safeParse(raw).sort((a, b) => b.createdAt - a.createdAt);
}

export function saveBrief(brief: SavedBrief): void {
  if (typeof window === 'undefined') return;
  try {
    const briefs = getSavedBriefs();
    const existingIndex = briefs.findIndex((b) => b.id === brief.id);
    if (existingIndex > -1) {
      briefs[existingIndex] = brief;
    } else {
      briefs.push(brief);
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(briefs));
  } catch (e) {
    console.error('Failed to save brief', e);
  }
}

export function deleteBrief(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const briefs = getSavedBriefs().filter((b) => b.id !== id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(briefs));
  } catch (e) {
    console.error('Failed to delete brief', e);
  }
}