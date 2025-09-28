export interface OrderData {
  'Order Number': number;
  'Commodity': string;
  'Order Date': string;
  'Required Delivery Date': string;
  'Ship From': string;
  'Ship To': string;
  'Volume': number;
  'Order Value': number;
  'Tax Percentage': number;
  'Journey Type': string;
}

export interface RouteData {
  'Source': string;
  'Destination': string;
  'Travel Mode': string;
  'Container Size': number;
  'Fixed Freight Cost': number;
  'Cost': number;
  'Time': number;
  'Warehouse Cost': number;
  'Transit Duty': number;
  'Feasibility': number;
  'Weekday': number;
}

export interface OptimizationResult {
  totalCost: number;
  transportationCost: number;
  warehouseCost: number;
  taxCost: number;
  goods: GoodsResult[];
}

export interface GoodsResult {
  id: number;
  category: string;
  startDate: string;
  arrivalDate: string;
  routes: RouteStep[];
}

export interface RouteStep {
  date: string;
  from: string;
  to: string;
  mode: string;
}

export interface FileUploadState {
  file: File | null;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
}

export interface OptimizationState {
  isProcessing: boolean;
  progress: number;
  result: OptimizationResult | null;
  error: string | null;
}