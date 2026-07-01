// TypeScript Definitions for AI Retrieval Box

export type CardType = 'green' | 'yellow' | 'red';

export interface ReviewAttempt {
  date: string;
  grade: string;
  timeTaken: number;
  penalty: boolean;
}

export interface Card {
  id: string;
  subjectId: string;
  chapterId: string;
  type: CardType;
  question: string;
  options: string[] | null;
  correctOption: number | null;
  modelAnswer: string;
  reference: string;
  box: number;
  lastReviewed: string | null;
  nextReviewDate: string | null;
  history: ReviewAttempt[];
}

export interface Chapter {
  id: string;
  name: string;
  description: string;
  prerequisites: string[];
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  chapters: Chapter[];
}

export type Mood = 'excited' | 'focused' | 'normal' | 'tired' | 'stressed';

export interface AppSettings {
  examMode: boolean;
  antiBurnout: boolean;
  popupCheckpoint: boolean;
  adaptivePenalty: boolean;
}

export interface CheckpointQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  cards: Card[];
  status: 'locked' | 'active' | 'completed';
}

export interface LearningRoadmap {
  id: string;
  topicName: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  milestones: RoadmapMilestone[];
}

