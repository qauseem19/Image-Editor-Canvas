export interface Point {
  x: number;
  y: number;
}

export interface Polygon {
  id: string;
  points: Point[];
  color: string;
  dimensions?: {
    height: number;
    width: number;
  };
}

export interface CanvasImage {
  id: string;
  file: File;
  dataUrl: string;
  thumbnail: string;
  polygons: Polygon[];
}

export type DrawMode = 'select' | 'draw' | 'pan';
