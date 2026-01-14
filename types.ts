
export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description: string;
  timestamp: number;
}

export interface LightboxState {
  isOpen: boolean;
  currentIndex: number;
}

export enum LoadingState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  ERROR = 'ERROR'
}
