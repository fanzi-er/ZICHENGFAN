export interface StoryEvent {
  id: number;
  date: string;
  title: string;
  description: string;
  image: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

export interface WallMessage {
  id: string;
  text: string;
  date: string;
  style: {
    rotation: number;
    color: string;
  };
}

export enum GameType {
  QUIZ = 'QUIZ',
  CATCH = 'CATCH',
  PUZZLE = 'PUZZLE',
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export type ViewState = 'WELCOME' | 'TIMELINE' | 'GALLERY' | 'VIDEO' | 'GAMES' | 'ANNIVERSARY' | 'MESSAGES';

// 新增媒体类型
export interface GalleryItem {
  id: string;
  url: string;
  category: string;
  isUserUploaded?: boolean;
}

export interface VideoItem {
  id: string;
  url: string;
  title: string;
  isUserUploaded?: boolean;
  thumbnail?: string;
}
