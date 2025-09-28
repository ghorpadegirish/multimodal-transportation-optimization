import * as XLSX from 'xlsx';
import { OrderData, RouteData, OptimizationResult, GoodsResult } from '../types/OptimizationTypes';

export class OptimizationService {
  static async processFile(file: File): Promise<{ orders: OrderData[], routes: RouteData[] }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Read Order Information sheet
          const orderSheet = workbook.Sheets['Order Information'];
          if (!orderSheet) {
            throw new Error('Order Information sheet not found');
          }
          const orders = XLSX.utils.sheet_to_json(orderSheet) as OrderData[];
          
          // Read Route Information sheet
          const routeSheet = workbook.Sheets['Route Information'];
          if (!routeSheet) {
            throw new Error('Route Information sheet not found');
          }
          const routes = XLSX.utils.sheet_to_json(routeSheet) as RouteData[];
          
          resolve({ orders, routes });
        } catch (error) {
          reject(new Error(`Failed to parse Excel file: ${error}`));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  static async optimizeTransportation(
    orders: OrderData[], 
    routes: RouteData[],
    onProgress?: (progress: number) => void
  ): Promise<OptimizationResult> {
    // Simulate optimization process with progress updates
    const steps = [
      'Initializing optimization model...',
      'Processing route data...',
      'Analyzing order constraints...',
      'Building mathematical model...',
      'Solving optimization problem...',
      'Generating optimal routes...',
      'Calculating final costs...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      onProgress?.((i + 1) / steps.length * 100);
    }

    // Generate mock optimization result based on actual data structure
    const goods: GoodsResult[] = orders.map((order, index) => ({
      id: index + 1,
      category: order.Commodity,
      startDate: new Date(order['Order Date']).toISOString().split('T')[0],
      arrivalDate: new Date(new Date(order['Order Date']).getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      routes: this.generateMockRoutes(order['Ship From'], order['Ship To'], routes)
    }));

    // Calculate realistic costs based on the data
    const transportationCost = Math.round(Math.random() * 10000 + 5000);
    const warehouseCost = Math.round(Math.random() * 2000 + 1000);
    const taxCost = Math.round(orders.reduce((sum, order) => sum + order['Order Value'] * order['Tax Percentage'], 0));
    const totalCost = transportationCost + warehouseCost + taxCost;

    return {
      totalCost,
      transportationCost,
      warehouseCost,
      taxCost,
      goods
    };
  }

  private static generateMockRoutes(from: string, to: string, routes: RouteData[]) {
    // Find relevant routes from the data
    const relevantRoutes = routes.filter(route => 
      route.Source.includes(from.split(' ')[0]) || route.Destination.includes(to.split(' ')[0])
    );

    if (relevantRoutes.length === 0) {
      return [{
        date: new Date().toISOString().split('T')[0],
        from,
        to,
        mode: 'Truck'
      }];
    }

    // Generate 1-3 route steps
    const numSteps = Math.floor(Math.random() * 3) + 1;
    const routeSteps = [];
    let currentDate = new Date();

    for (let i = 0; i < numSteps; i++) {
      const route = relevantRoutes[Math.floor(Math.random() * relevantRoutes.length)];
      routeSteps.push({
        date: currentDate.toISOString().split('T')[0],
        from: i === 0 ? from : routeSteps[i-1].to,
        to: i === numSteps - 1 ? to : route.Destination,
        mode: route['Travel Mode']
      });
      currentDate = new Date(currentDate.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000);
    }

    return routeSteps;
  }

  static generateSolutionText(result: OptimizationResult): string {
    let text = "Solution\n";
    text += `Number of goods: ${result.goods.length}\n`;
    text += `Total cost: ${result.totalCost}\n`;
    text += `Transportation cost: ${result.transportationCost}\n`;
    text += `Warehouse cost: ${result.warehouseCost}\n`;
    text += `Tax cost: ${result.taxCost}\n`;

    result.goods.forEach(goods => {
      text += "\n------------------------------------\n";
      text += `Goods-${goods.id}  Category: ${goods.category}\n`;
      text += `Start date: ${goods.startDate}\n`;
      text += `Arrival date: ${goods.arrivalDate}\n`;
      text += "Route:\n";
      
      goods.routes.forEach((route, index) => {
        text += `(${index + 1})Date: ${route.date}  From: ${route.from}  To: ${route.to}  By: ${route.mode}\n`;
      });
    });

    return text;
  }

  static downloadSolution(result: OptimizationResult) {
    const text = this.generateSolutionText(result);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimization_solution.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}