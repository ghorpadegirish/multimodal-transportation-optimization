import React from 'react';
import { Loader as Loader2, Package, Route, Calculator } from 'lucide-react';

interface LoadingSpinnerProps {
  progress: number;
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ progress, message }) => {
  const getIcon = () => {
    if (progress < 30) return <Package className="w-8 h-8" />;
    if (progress < 70) return <Route className="w-8 h-8" />;
    return <Calculator className="w-8 h-8" />;
  };

  const getMessage = () => {
    if (message) return message;
    if (progress < 30) return 'Processing data...';
    if (progress < 70) return 'Optimizing routes...';
    return 'Calculating costs...';
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-6">
      <div className="relative">
        <div className="animate-spin-slow text-blue-600">
          <Loader2 className="w-16 h-16" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-blue-600 animate-pulse-slow">
          {getIcon()}
        </div>
      </div>
      
      <div className="text-center space-y-3">
        <h3 className="text-xl font-semibold text-gray-800">
          Optimizing Transportation Routes
        </h3>
        <p className="text-gray-600">{getMessage()}</p>
        
        <div className="w-64 bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-sm text-gray-500">{Math.round(progress)}% complete</p>
      </div>
    </div>
  );
};