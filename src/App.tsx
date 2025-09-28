import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { LoadingSpinner } from './components/LoadingSpinner';
import { OptimizationResults } from './components/OptimizationResults';
import { OptimizationService } from './services/OptimizationService';
import { OptimizationResult } from './types/OptimizationTypes';
import { Truck, Ship, Plane, Package, TrendingUp, Clock } from 'lucide-react';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setResult(null);

    try {
      // Parse the uploaded file
      const { orders, routes } = await OptimizationService.processFile(file);
      
      // Run optimization
      const optimizationResult = await OptimizationService.optimizeTransportation(
        orders,
        routes,
        setProgress
      );
      
      setResult(optimizationResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setIsProcessing(false);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Multi-Modal Transportation Optimizer
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Optimize your supply chain with mathematical programming. Upload your transportation data 
            and get cost-minimized routes across multiple transport modes.
          </p>
        </div>

        {/* Features Overview */}
        {!result && !isProcessing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Cost Optimization</h3>
              <p className="text-gray-600 text-sm">
                Minimize total transportation, warehouse, and tax costs using advanced algorithms
              </p>
            </div>

            <div className="card text-center">
              <div className="flex justify-center mb-4 space-x-1">
                <Truck className="w-5 h-5 text-green-600" />
                <Ship className="w-5 h-5 text-blue-600" />
                <Plane className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Multi-Modal Routes</h3>
              <p className="text-gray-600 text-sm">
                Optimize across trucks, ships, planes, and warehouses for maximum efficiency
              </p>
            </div>

            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Time Constraints</h3>
              <p className="text-gray-600 text-sm">
                Meet delivery deadlines while optimizing costs and route efficiency
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="card bg-red-50 border-red-200 mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <Package className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-800">Processing Error</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
              <button onClick={handleReset} className="mt-4 btn-secondary">
                Try Again
              </button>
            </div>
          )}

          {result ? (
            <OptimizationResults result={result} onReset={handleReset} />
          ) : isProcessing ? (
            <div className="card">
              <LoadingSpinner progress={progress} />
            </div>
          ) : (
            <div className="space-y-8">
              <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
              
              {/* Instructions */}
              <div className="card bg-gradient-to-r from-gray-50 to-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">How to Use</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <p className="font-medium text-gray-800">Upload Excel File</p>
                      <p className="text-gray-600">Upload your transportation data with order and route information</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <p className="font-medium text-gray-800">Process & Optimize</p>
                      <p className="text-gray-600">Our algorithm finds the most cost-effective routes</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <p className="font-medium text-gray-800">Get Results</p>
                      <p className="text-gray-600">View optimized routes and download the solution</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;