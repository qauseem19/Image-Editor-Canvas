import React from 'react';
import { DrawMode } from '../types/canvas';

interface ToolbarProps {
  mode: DrawMode;
  onModeChange: (mode: DrawMode) => void;
  onSave: () => void;
  onClear: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ mode, onModeChange, onSave, onClear }) => {
  return (
    <div className="bg-slate-700 text-white p-4 flex items-center gap-4 shadow-lg">
      <h1 className="text-xl font-bold mr-8">Canvas Annotator</h1>
      
      <div className="flex gap-2 border-r border-slate-500 pr-4">
        <button
          onClick={() => onModeChange('select')}
          className={`px-4 py-2 rounded transition-all ${
            mode === 'select' ? 'bg-blue-500' : 'bg-slate-600 hover:bg-slate-500'
          }`}
          title="Select Mode"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        </button>
        <button
          onClick={() => onModeChange('draw')}
          className={`px-4 py-2 rounded transition-all ${
            mode === 'draw' ? 'bg-blue-500' : 'bg-slate-600 hover:bg-slate-500'
          }`}
          title="Draw Polygon"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </button>
      </div>

      <button
        onClick={onSave}
        className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded transition-all font-medium"
      >
        Save Canvas
      </button>
      
      <button
        onClick={onClear}
        className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded transition-all font-medium"
      >
        Clear Polygons
      </button>
    </div>
  );
};
