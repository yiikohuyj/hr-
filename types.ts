
export interface Participant {
  id: string;
  name: string;
}

export interface Group {
  id: number;
  name: string;
  members: Participant[];
}

export type ViewMode = 'list' | 'lucky-draw' | 'grouping';
