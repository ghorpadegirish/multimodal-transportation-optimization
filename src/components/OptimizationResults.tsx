import React from 'react';
import { 
  DollarSign, 
  Truck, 
  Warehouse, 
  Receipt, 
  Package, 
  MapPin, 
  Calendar,
  Download,
  Ship,
  Plane
} from 'lucide-react';
import { OptimizationResult } from '../types/OptimizationTypes';
import { OptimizationService } from '../services/OptimizationService';

interface OptimizationResultsProps {
  result: OptimizationResult;
  onReset: () => void;
}

export const OptimizationResults: React.FC<OptimizationResultsProps> = ({ result, onReset }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTransportIcon = (mode: string) => {
    const lowerMode = mode.toLowerCase();
    if (lowerMode.includes('truck')) return <Truck className="w-4 h-4" />;
    if (lowerMode.includes('ship') || lowerMode.includes('sea')) return <Ship className="w-4 h-4" />;
    if (lowerMode.includes('plane') || lowerMode.includes('air')) return <Plane className="w-4 h-4" />;
    return <Truck className="w-4 h-4" />;
  };

  const handleDownload = () => {
    OptimizationService.downloadSolution(result);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-800">Optimization Results</h2>
        <p className="text-gray-600">Optimal transportation routes and cost breakdown</p>
        <div className="flex justify-center space-x-4">
          <button onClick={handleDownload} className="btn-primary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Download Solution</span>
          </button>
          <button onClick={onReset} className="btn-secondary">
            Upload New File
          </button>
        </div>
      </div>

      {/* Cost Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Cost</p>
              <p className="text-2xl font-bold">{formatCurrency(result.totalCost)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Transportation</p>
              <p className="text-2xl font-bold">{formatCurrency(result.transportationCost)}</p>
            </div>
            <Truck className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Warehouse</p>
              <p className="text-2xl font-bold">{formatCurrency(result.warehouseCost)}</p>
            </div>
            <Warehouse className="w-8 h-8 text-orange-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Tax & Duties</p>
              <p className="text-2xl font-bold">{formatCurrency(result.taxCost)}</p>
            </div>
            <Receipt className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Goods Routes */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
          <Package className="w-6 h-6" />
          <span>Optimized Routes ({result.goods.length} items)</span>
        </h3>

        <div className="grid gap-6">
          {result.goods.map((goods) => (
            <div key={goods.id} className="card">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      Goods #{goods.id} - {goods.category}
                    </h4>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Start: {goods.startDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Arrival: {goods.arrivalDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-medium text-gray-700 flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Route Steps:</span>
                </h5>
                
                <div className="space-y-3">
                  {goods.routes.map((route, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Date:</span>
                          <p className="font-medium">{route.date}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">From:</span>
                          <p className="font-medium">{route.from}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">To:</span>
                          <p className="font-medium">{route.to}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Transport:</span>
                          <div className="flex items-center space-x-2">
                            {getTransportIcon(route.mode)}
                            <span className="font-medium">{route.mode}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};