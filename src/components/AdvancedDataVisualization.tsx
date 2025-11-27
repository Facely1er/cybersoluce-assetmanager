import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Activity,
  Target,
  Zap,
  Download,
  Maximize2,
  Minimize2,
  Settings
} from 'lucide-react';
import { logger } from '../utils/logger';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Legend
} from 'recharts';
import { Asset } from '../types/asset';
import { EnrichmentData } from '../services/dataEnrichmentService';
import { AnalyticsInsights } from '../services/analyticsService';

interface AdvancedDataVisualizationProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  className?: string;
}

export const AdvancedDataVisualization: React.FC<AdvancedDataVisualizationProps> = ({
  isOpen,
  onClose,
  assets,
  className = ''
}) => {
  const [enrichmentData, setEnrichmentData] = useState<Map<string, EnrichmentData>>(new Map());
  const [analyticsInsights, setAnalyticsInsights] = useState<AnalyticsInsights | null>(null);
  const [selectedChart, setSelectedChart] = useState<string>('overview');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [chartSettings, setChartSettings] = useState({
    showGrid: true,
    showLegend: true,
    showTooltip: true,
    animation: true,
    theme: 'light'
  });
  // Removed unused state variables

  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', 
    '#FFC658', '#FF7C7C', '#8DD1E1', '#D084D0', '#87CEEB', '#DDA0DD'
  ];

  useEffect(() => {
    if (isOpen && assets.length > 0) {
      loadData();
    }
  }, [isOpen, assets, loadData]);

  const loadData = useCallback(async () => {
    try {
      // Import services dynamically to avoid circular dependencies
      const { dataEnrichmentService } = await import('../services/dataEnrichmentService');
      const { analyticsService } = await import('../services/analyticsService');
      
      // Enrich asset data
      const enriched = await dataEnrichmentService.enrichAssets(assets);
      setEnrichmentData(enriched);
      
      // Generate analytics
      const insights = await analyticsService.generateAnalytics(assets, enriched);
      setAnalyticsInsights(insights);
    } catch (error) {
      logger.error('Error loading visualization data', error instanceof Error ? error : undefined);
    }
  }, [assets]);

  const chartTypes = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'trends', name: 'Trends', icon: TrendingUp },
    { id: 'distribution', name: 'Distribution', icon: PieChart },
    { id: 'correlation', name: 'Correlation', icon: Activity },
    { id: 'forecast', name: 'Forecast', icon: Target },
    { id: 'radar', name: 'Radar', icon: Zap }
  ];

  const processedData = useMemo(() => {
    if (!analyticsInsights) return null;

    const riskData = assets.map(asset => ({
      name: asset.name,
      riskScore: asset.riskScore,
      type: asset.type,
      criticality: asset.criticality,
      complianceScore: enrichmentData.get(asset.id)?.complianceScore.overallScore || 0,
      cost: enrichmentData.get(asset.id)?.costAnalysis.totalCost || 0,
      vulnerabilities: asset.vulnerabilities.length,
      lastAssessed: asset.lastAssessed
    }));

    const typeDistribution = Object.entries(analyticsInsights.summary.riskDistribution).map(([level, count]) => ({
      level,
      count,
      percentage: Math.round((count / analyticsInsights.summary.totalAssets) * 100)
    }));

    const complianceData = Object.entries(analyticsInsights.summary.complianceStatus).map(([status, count]) => ({
      status,
      count,
      percentage: Math.round((count / analyticsInsights.summary.totalAssets) * 100)
    }));

    const trendData = analyticsInsights.trends.assetGrowth.dataPoints.slice(-30).map(point => ({
      date: point.date.toLocaleDateString(),
      value: point.value,
      risk: analyticsInsights.trends.riskTrends.dataPoints.find(p => 
        Math.abs(p.date.getTime() - point.date.getTime()) < 24 * 60 * 60 * 1000
      )?.value || 0,
      compliance: analyticsInsights.trends.complianceTrends.dataPoints.find(p => 
        Math.abs(p.date.getTime() - point.date.getTime()) < 24 * 60 * 60 * 1000
      )?.value || 0
    }));

    const forecastData = analyticsInsights.forecasts.assetInventory.predictions.slice(0, 30).map(point => ({
      date: point.date.toLocaleDateString(),
      predicted: point.value,
      lowerBound: point.lowerBound,
      upperBound: point.upperBound,
      confidence: point.probability
    }));

    const correlationData = riskData.map(asset => ({
      risk: asset.riskScore,
      compliance: asset.complianceScore,
      cost: asset.cost,
      vulnerabilities: asset.vulnerabilities,
      name: asset.name
    }));

    const radarData = [
      {
        metric: 'Risk Management',
        value: 100 - (analyticsInsights.summary.performanceMetrics.averageRiskScore || 0),
        fullMark: 100
      },
      {
        metric: 'Compliance',
        value: analyticsInsights.summary.performanceMetrics.averageComplianceScore || 0,
        fullMark: 100
      },
      {
        metric: 'Cost Efficiency',
        value: Math.max(0, 100 - (analyticsInsights.summary.costAnalysis.costPerAsset / 1000)),
        fullMark: 100
      },
      {
        metric: 'Security',
        value: Math.max(0, 100 - (analyticsInsights.summary.performanceMetrics.vulnerabilityCount * 10)),
        fullMark: 100
      },
      {
        metric: 'Performance',
        value: 85, // Mock performance score
        fullMark: 100
      }
    ];

    return {
      riskData,
      typeDistribution,
      complianceData,
      trendData,
      forecastData,
      correlationData,
      radarData
    };
  }, [assets, enrichmentData, analyticsInsights]);

  const renderOverviewChart = () => {
    if (!processedData) return null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={processedData.typeDistribution}
                dataKey="count"
                nameKey="level"
                cx="50%"
                cy="50%"
                outerRadius={100}
              >
                {processedData.typeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} assets`, name]} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        {/* Compliance Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Compliance Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={processedData.complianceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis dataKey="status" stroke="#6b7280" className="dark:stroke-gray-400" />
              <YAxis stroke="#6b7280" className="dark:stroke-gray-400" />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderTrendsChart = () => {
    if (!processedData) return null;

    return (
      <div className="space-y-6">
        {/* Multi-metric Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Multi-Metric Trends</h3>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={processedData.trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis dataKey="date" stroke="#6b7280" className="dark:stroke-gray-400" />
              <YAxis yAxisId="left" stroke="#6b7280" className="dark:stroke-gray-400" />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" className="dark:stroke-gray-400" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="value" fill="#8884d8" name="Asset Count" />
              <Line yAxisId="right" type="monotone" dataKey="risk" stroke="#ff7300" name="Risk Score" />
              <Line yAxisId="right" type="monotone" dataKey="compliance" stroke="#82ca9d" name="Compliance Score" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Individual Trend Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Asset Growth Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={processedData.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                <XAxis dataKey="date" stroke="#6b7280" className="dark:stroke-gray-400" />
                <YAxis stroke="#6b7280" className="dark:stroke-gray-400" />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Risk Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={processedData.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                <XAxis dataKey="date" stroke="#6b7280" className="dark:stroke-gray-400" />
                <YAxis stroke="#6b7280" className="dark:stroke-gray-400" />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="risk" 
                  stroke="#ff7300" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderDistributionChart = () => {
    if (!processedData) return null;

    return (
      <div className="space-y-6">
        {/* Asset Type Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Asset Type Distribution</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={processedData.riskData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis type="number" stroke="#6b7280" className="dark:stroke-gray-400" />
              <YAxis dataKey="type" type="category" width={100} stroke="#6b7280" className="dark:stroke-gray-400" />
              <Tooltip />
              <Bar dataKey="riskScore" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk vs Criticality Scatter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Risk vs Criticality Analysis</h3>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={processedData.riskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis dataKey="riskScore" name="Risk Score" stroke="#6b7280" className="dark:stroke-gray-400" />
              <YAxis dataKey="vulnerabilities" name="Vulnerabilities" stroke="#6b7280" className="dark:stroke-gray-400" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter dataKey="complianceScore" fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderCorrelationChart = () => {
    if (!processedData) return null;

    return (
      <div className="space-y-6">
        {/* Risk vs Compliance Correlation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Risk vs Compliance Correlation</h3>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={processedData.correlationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis dataKey="risk" name="Risk Score" stroke="#6b7280" className="dark:stroke-gray-400" />
              <YAxis dataKey="compliance" name="Compliance Score" stroke="#6b7280" className="dark:stroke-gray-400" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter dataKey="cost" fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Cost vs Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Cost vs Performance Analysis</h3>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={processedData.correlationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis dataKey="cost" name="Cost" stroke="#6b7280" className="dark:stroke-gray-400" />
              <YAxis dataKey="compliance" name="Compliance Score" stroke="#6b7280" className="dark:stroke-gray-400" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter dataKey="vulnerabilities" fill="#ff7300" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderForecastChart = () => {
    if (!processedData) return null;

    return (
      <div className="space-y-6">
        {/* Asset Inventory Forecast */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Asset Inventory Forecast (90 days)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={processedData.forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis dataKey="date" stroke="#6b7280" className="dark:stroke-gray-400" />
              <YAxis stroke="#6b7280" className="dark:stroke-gray-400" />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Predicted"
              />
              <Line 
                type="monotone" 
                dataKey="lowerBound" 
                stroke="#8884d8" 
                strokeDasharray="5 5"
                strokeOpacity={0.5}
                name="Lower Bound"
              />
              <Line 
                type="monotone" 
                dataKey="upperBound" 
                stroke="#8884d8" 
                strokeDasharray="5 5"
                strokeOpacity={0.5}
                name="Upper Bound"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Confidence Intervals */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Forecast Confidence</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={processedData.forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis dataKey="date" stroke="#6b7280" className="dark:stroke-gray-400" />
              <YAxis stroke="#6b7280" className="dark:stroke-gray-400" />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="confidence" 
                stroke="#82ca9d" 
                fill="#82ca9d" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderRadarChart = () => {
    if (!processedData) return null;

    return (
      <div className="space-y-6">
        {/* Performance Radar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Performance Radar</h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={processedData.radarData}>
              <PolarGrid stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <PolarAngleAxis dataKey="metric" stroke="#6b7280" className="dark:stroke-gray-400" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#6b7280" className="dark:stroke-gray-400" />
              <Radar 
                name="Performance" 
                dataKey="value" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Multi-Asset Comparison */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Asset Performance Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processedData.riskData.slice(0, 6).map((asset, index) => (
              <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">{asset.name}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Risk:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{asset.riskScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Compliance:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{Math.round(asset.complianceScore)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Cost:</span>
                    <span className="font-medium text-gray-900 dark:text-white">${asset.cost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderChart = () => {
    switch (selectedChart) {
      case 'overview':
        return renderOverviewChart();
      case 'trends':
        return renderTrendsChart();
      case 'distribution':
        return renderDistributionChart();
      case 'correlation':
        return renderCorrelationChart();
      case 'forecast':
        return renderForecastChart();
      case 'radar':
        return renderRadarChart();
      default:
        return renderOverviewChart();
    }
  };

  if (!processedData) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="text-center">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-gray-600 dark:text-gray-400">No data available for visualization</p>
        </div>
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Data Visualization</h2>
          <button
            onClick={onClose}
            aria-label="Close visualization"
            title="Close visualization"
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-800 p-6 overflow-auto' : ''} ${className}`}>
            {/* Chart Controls Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Interactive charts and analytics for your asset inventory</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Settings"
                    aria-label="Settings"
                  >
                    <Settings className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                    aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                  >
                    {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Print"
                    aria-label="Print"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Chart Type Selector */}
              <div className="flex flex-wrap gap-2">
                {chartTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedChart(type.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        selectedChart === type.id
                          ? 'bg-command-blue-600 dark:bg-command-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{type.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Settings Panel */}
              {showSettings && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">Chart Settings</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={chartSettings.showGrid}
                        onChange={(e) => setChartSettings(prev => ({ ...prev, showGrid: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Show Grid</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={chartSettings.showLegend}
                        onChange={(e) => setChartSettings(prev => ({ ...prev, showLegend: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Show Legend</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={chartSettings.showTooltip}
                        onChange={(e) => setChartSettings(prev => ({ ...prev, showTooltip: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Show Tooltip</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={chartSettings.animation}
                        onChange={(e) => setChartSettings(prev => ({ ...prev, animation: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Animation</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Chart Content */}
            <div className="min-h-96">
              {renderChart()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};