
export interface Word {
  id: string;
  word: string;
  definition: string;
  example?: string;
}

export interface WordList {
  id: string;
  title: string;
  description?: string;
  words: Word[];
  createdAt: number;
}

export enum TaskStatus {
  PENDING = 'pending',
  COMPLETED = 'completed'
}

export enum TaskType {
  STUDY = 'study',
  REVIEW = 'review'
}

export interface ReviewTask {
  id: string;
  listId: string;
  scheduledDate: string; // YYYY-MM-DD
  status: TaskStatus;
  type: TaskType;
  stage: number; // 0 to 6
}

export type View = 'home' | 'library' | 'list-detail' | 'study' | 'add-list' | 'calendar';

export interface AppState {
  wordLists: WordList[];
  reviewTasks: ReviewTask[];
}
