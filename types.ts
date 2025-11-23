export interface Photo {
  id: number;
  url: string;
  thumbnail: string;
  title: string;
  location: string;
  width: number;
  height: number;
}

export interface AnalysisResult {
  title: string;
  technicalSpecs: string;
  artisticDescription: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  coverImage: string;
  gallery?: string[]; // Array of image URLs for the post gallery
  tags: string[];
}

export enum ModalState {
  CLOSED,
  OPEN,
}