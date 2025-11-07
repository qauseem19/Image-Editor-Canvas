import React, { useRef, useEffect, useState } from 'react';
import { Point, Polygon, DrawMode } from '../types/canvas';
import { generateRandomColor, isPointInPolygon, getPolygonCentroid } from '../utils/canvasHelpers';

interface DrawingCanvasProps {
  imageUrl: string | null;
  polygons: Polygon[];
  mode: DrawMode;
  onPolygonsChange: (polygons: Polygon[]) => void;
  onPolygonClick: (polygon: Polygon) => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  imageUrl,
  polygons,
  mode,
  onPolygonsChange,
  onPolygonClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [hoveredPolygon, setHoveredPolygon] = useState<string | null>(null);

  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.onload = () => setImage(img);
      img.src = imageUrl;
    }
  }, [imageUrl]);

  useEffect(() => {
    drawCanvas();
  }, [image, polygons, currentPoints, hoveredPolygon]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (image) {
      const scale = Math.min(canvas.width / image.width, canvas.height / image.height);
      const x = (canvas.width - image.width * scale) / 2;
      const y = (canvas.height - image.height * scale) / 2;
      ctx.drawImage(image, x, y, image.width * scale, image.height * scale);
    }

    polygons.forEach((polygon) => {
      ctx.beginPath();
      ctx.strokeStyle = polygon.color;
      ctx.fillStyle = polygon.color + (hoveredPolygon === polygon.id ? '40' : '20');
      ctx.lineWidth = 2;
      polygon.points.forEach((point, i) => {
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      if (polygon.dimensions) {
        const centroid = getPolygonCentroid(polygon.points);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(centroid.x - 40, centroid.y - 15, 80, 30);
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${polygon.dimensions.height}x${polygon.dimensions.width}`, centroid.x, centroid.y + 5);
      }
    });

    if (mode === 'draw' && currentPoints.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = '#3498DB';
      ctx.lineWidth = 2;
      currentPoints.forEach((point, i) => {
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
      currentPoints.forEach((point) => {
        ctx.fillStyle = '#3498DB';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const point: Point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    if (mode === 'draw') {
      if (currentPoints.length > 2) {
        const firstPoint = currentPoints[0];
        const distance = Math.sqrt(Math.pow(point.x - firstPoint.x, 2) + Math.pow(point.y - firstPoint.y, 2));
        if (distance < 10) {
          const newPolygon: Polygon = {
            id: Date.now().toString(),
            points: currentPoints,
            color: generateRandomColor(),
          };
          onPolygonsChange([...polygons, newPolygon]);
          setCurrentPoints([]);
          return;
        }
      }
      setCurrentPoints([...currentPoints, point]);
    } else if (mode === 'select') {
      const clickedPolygon = polygons.find((p) => isPointInPolygon(point, p.points));
      if (clickedPolygon) {
        onPolygonClick(clickedPolygon);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'select') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const point: Point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    const hovered = polygons.find((p) => isPointInPolygon(point, p.points));
    setHoveredPolygon(hovered?.id || null);
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
      <canvas
        ref={canvasRef}
        width={1000}
        height={700}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        className="border-2 border-gray-300 shadow-xl bg-white cursor-crosshair"
      />
    </div>
  );
};
