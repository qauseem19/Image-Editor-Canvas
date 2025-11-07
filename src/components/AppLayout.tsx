import React, { useState } from 'react';
import { CanvasImage, DrawMode, Polygon } from '../types/canvas';
import { generateThumbnail } from '../utils/canvasHelpers';
import { UploadZone } from './UploadZone';
import { Toolbar } from './Toolbar';
import { DrawingCanvas } from './DrawingCanvas';
import { ThumbnailGallery } from './ThumbnailGallery';
import { DimensionModal } from './DimensionModal';

export default function AppLayout() {
  const [images, setImages] = useState<CanvasImage[]>([]);
  const [currentImageId, setCurrentImageId] = useState<string | null>(null);
  const [mode, setMode] = useState<DrawMode>('select');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPolygon, setSelectedPolygon] = useState<Polygon | null>(null);

  const handleUpload = async (files: File[]) => {
    const newImages: CanvasImage[] = [];
    for (const file of files) {
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
      const thumbnail = await generateThumbnail(file);
      const newImage: CanvasImage = {
        id: Date.now().toString() + Math.random(),
        file,
        dataUrl,
        thumbnail,
        polygons: [],
      };
      newImages.push(newImage);
    }
    setImages([...images, ...newImages]);
    if (!currentImageId && newImages.length > 0) {
      setCurrentImageId(newImages[0].id);
    }
  };

  const currentImage = images.find((img) => img.id === currentImageId);

  const handlePolygonsChange = (polygons: Polygon[]) => {
    setImages(images.map((img) =>
      img.id === currentImageId ? { ...img, polygons } : img
    ));
  };

  const handlePolygonClick = (polygon: Polygon) => {
    setSelectedPolygon(polygon);
    setModalOpen(true);
  };

  const handleSaveDimensions = (height: number, width: number) => {
    if (!selectedPolygon || !currentImageId) return;
    const updatedPolygons = currentImage!.polygons.map((p) =>
      p.id === selectedPolygon.id ? { ...p, dimensions: { height, width } } : p
    );
    handlePolygonsChange(updatedPolygons);
  };

  const handleSave = () => {
    const data = JSON.stringify(images, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `canvas-data-${Date.now()}.json`;
    a.click();
    alert('Canvas saved successfully!');
  };

  const handleClear = () => {
    if (currentImageId && confirm('Clear all polygons on this image?')) {
      handlePolygonsChange([]);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Toolbar mode={mode} onModeChange={setMode} onSave={handleSave} onClear={handleClear} />
      
      {images.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-2xl w-full">
            <UploadZone onUpload={handleUpload} />
          </div>
        </div>
      ) : (
        <>
          <DrawingCanvas
            imageUrl={currentImage?.dataUrl || null}
            polygons={currentImage?.polygons || []}
            mode={mode}
            onPolygonsChange={handlePolygonsChange}
            onPolygonClick={handlePolygonClick}
          />
          <ThumbnailGallery
            images={images}
            currentImageId={currentImageId}
            onSelectImage={setCurrentImageId}
          />
        </>
      )}

      <DimensionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveDimensions}
        initialHeight={selectedPolygon?.dimensions?.height || 0}
        initialWidth={selectedPolygon?.dimensions?.width || 0}
      />
    </div>
  );
}
