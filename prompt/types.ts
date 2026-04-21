export type GitState = 'rebase' | 'merge' | 'bisect';

export interface BranchStatus {
  empty: boolean;
  upstream?: boolean;
  hash?: string;
  name?: string | null;
  detached?: boolean;
  ahead?: number;
  behind?: number;
}

export interface Change {
  x: string | null;
  y: string | null;
}

export interface TagInfo {
  description: string;
  isTagged: boolean;
}

export interface GitStatus {
  branch: BranchStatus;
  changes: Change[];
  tag: TagInfo;
  notes: string | null;
  state: GitState | undefined;
}
