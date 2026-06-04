export type OutputType =
  | 'Code change'
  | 'Documentation update'
  | 'Bug investigation'
  | 'Repo cleanup'
  | 'PR review'
  | 'Research report'
  | 'General task';

export type StrictnessLevel =
  | 'Fast pass'
  | 'Careful pass'
  | 'Production pass'
  | 'Ruthless QA pass';

export interface BriefInput {
  title: string;
  instruction: string;
  context?: string;
  folderTree?: string;
  avoid?: string;
  outputType: OutputType;
  strictness: StrictnessLevel;
  inspectRepo: boolean;
  requireAcceptanceCriteria: boolean;
  requireSummary: boolean;
  requireTests: boolean;
  requireDocs: boolean;
  preventUnrelated: boolean;
  requireCommit: boolean;
}

export interface GeneratedBrief {
  content: string;
  promptScore?: number;
  missingPieces?: string[];
}

export interface SavedBrief extends GeneratedBrief {
  id: string;
  /**
   * Human friendly title provided by the user
   */
  title: string;
  /**
   * Unix timestamp (ms) when the brief was saved
   */
  createdAt: number;
  outputType: OutputType;
  strictness: StrictnessLevel;
  /**
   * Original input used to generate this brief. Including it allows reloading
   * the form with the same parameters. This property is optional for backwards
   * compatibility but should be set when saving.
   */
  input?: BriefInput;
}