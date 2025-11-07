import React, { useState, useEffect } from 'react';

interface DimensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (height: number, width: number) => void;
  initialHeight?: number;
  initialWidth?: number;
}

export const DimensionModal: React.FC<DimensionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialHeight = 0,
  initialWidth = 0,
}) => {
  const [height, setHeight] = useState(initialHeight);
  const [width, setWidth] = useState(initialWidth);

  useEffect(() => {
    setHeight(initialHeight);
    setWidth(initialWidth);
  }, [initialHeight, initialWidth, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (height > 0 && width > 0) {
      onSave(height, width);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-96 transform transition-all scale-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Set Polygon Dimensions</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Height (px)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Width (px)</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              required
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all font-medium"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-all font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
