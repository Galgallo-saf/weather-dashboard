import { AlertCircle, X } from 'lucide-react';

export const ErrorMessage = ({ message, onClose }) => (
  <div className="bg-red-500/20 backdrop-blur-md border border-red-500/50 rounded-2xl p-4 mb-6 text-white animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-red-300" />
        <span>{message}</span>
      </div>
      <button 
        onClick={onClose} 
        className="p-1 hover:bg-white/10 rounded-full transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  </div>
);