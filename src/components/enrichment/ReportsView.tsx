import React, { useState, useMemo } from 'react';
import { FileText, Download, FileDown, FileCheck, AlertTriangle, Shield, ClipboardList, Calendar, Search, X, Info, AlertCircle } from 'lucide-react';
import { ReportGenerationService, ReportFormat, ReportType } from '../../services/reportGenerationService';
import { StorageService } from '../../services/storageServiceLite';
import { DataInventoryItem } from '../../types/dataInventory';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { toast } from 'react-hot-toast';

interface ValidationErrors {
  title?: string;
  organization?: string;
  author?: string;
  dataItem?: string;
  dateRange?: string;
}

export const ReportsView: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>('pdf');
  const [generating, setGenerating] = useState(false);
  const [isDPIADialogOpen, setIsDPIADialogOpen] = useState(false);
  const [selectedDataItem, setSelectedDataItem] = useState<DataInventoryItem | null>(null);
  const [dpiaSearchQuery, setDpiaSearchQuery] = useState('');
  const [dpiaFilterType, setDpiaFilterType] = useState<string>('all');
  const [auditStartDate, setAuditStartDate] = useState<string>('');
  const [auditEndDate, setAuditEndDate] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [reportOptions, setReportOptions] = useState({
    title: '',
    organization: '',
    author: '',
    maxRows: undefined as number | undefined,
    includeAllData: false,
  });

  const dataItems = StorageService.getDataInventory();
  const assets = StorageService.getAssets();

  // Filtered data items for DPIA selection
  const filteredDataItems = useMemo(() => {
    let filtered = dataItems;

    // Search filter
    if (dpiaSearchQuery) {
      const query = dpiaSearchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.dataType.toLowerCase().includes(query) ||
        item.classification.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (dpiaFilterType !== 'all') {
      filtered = filtered.filter(item => item.dataType === dpiaFilterType);
    }

    return filtered;
  }, [dataItems, dpiaSearchQuery, dpiaFilterType]);

  // Validation functions
  const validateReportOptions = (): boolean => {
    const errors: ValidationErrors = {};

    // Title validation (max 100 characters)
    if (reportOptions.title && reportOptions.title.length > 100) {
      errors.title = 'Title must be 100 characters or less';
    }

    // Organization validation (max 100 characters)
    if (reportOptions.organization && reportOptions.organization.length > 100) {
      errors.organization = 'Organization name must be 100 characters or less';
    }

    // Author validation (max 100 characters)
    if (reportOptions.author && reportOptions.author.length > 100) {
      errors.author = 'Author name must be 100 characters or less';
    }

    // Date range validation for audit trail
    if (selectedReport === 'audit-trail') {
      if (auditStartDate && auditEndDate) {
        const start = new Date(auditStartDate);
        const end = new Date(auditEndDate);
        if (start > end) {
          errors.dateRange = 'Start date must be before end date';
        }
        if (end > new Date()) {
          errors.dateRange = 'End date cannot be in the future';
        }
      }
    }

    // DPIA data item validation
    if (selectedReport === 'dpia' && !selectedDataItem) {
      errors.dataItem = 'Please select a data item for DPIA report';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateDataAvailability = (): boolean => {
    if (selectedReport === 'compliance' || selectedReport === 'risk-assessment') {
      if (dataItems.length === 0 && assets.length === 0) {
        toast.error('No data available. Please add data items or assets first.');
        return false;
      }
    }

    if (selectedReport === 'audit-trail') {
      if (dataItems.length === 0 && assets.length === 0) {
        toast.error('No data available for audit trail. Please add data items or assets first.');
        return false;
      }
    }

    if (selectedReport === 'dpia') {
      if (dataItems.length === 0) {
        toast.error('No data items available. Please add data items first.');
        return false;
      }
    }

    return true;
  };

  const handleGenerateReport = async () => {
    // Clear previous validation errors
    setValidationErrors({});

    // Validate report selection
    if (!selectedReport) {
      toast.error('Please select a report type');
      return;
    }

    // Validate data availability
    if (!validateDataAvailability()) {
      return;
    }

    // Validate form inputs
    if (!validateReportOptions()) {
      toast.error('Please fix validation errors before generating the report');
      return;
    }

    setGenerating(true);
    try {
      let startDate: Date | undefined;
      let endDate: Date | undefined;

      if (selectedReport === 'audit-trail') {
        startDate = auditStartDate ? new Date(auditStartDate) : undefined;
        endDate = auditEndDate ? new Date(auditEndDate) : undefined;
      }

      switch (selectedReport) {
        case 'compliance':
          await ReportGenerationService.generateComplianceReport(selectedFormat, reportOptions);
          toast.success('Compliance report generated successfully');
          break;
        case 'risk-assessment':
          await ReportGenerationService.generateRiskAssessmentReport(selectedFormat, reportOptions);
          toast.success('Risk assessment report generated successfully');
          break;
        case 'audit-trail':
          await ReportGenerationService.generateAuditTrailReport(selectedFormat, startDate, endDate, reportOptions);
          toast.success('Audit trail report generated successfully');
          break;
        case 'dpia':
          if (!selectedDataItem) {
            setValidationErrors({ dataItem: 'Please select a data item for DPIA' });
            setIsDPIADialogOpen(true);
            return;
          }
          await ReportGenerationService.generateDPIAReport(selectedDataItem, selectedFormat, reportOptions);
          toast.success('DPIA report generated successfully');
          break;
      }
    } catch (error) {
      console.error('Report generation failed:', error);
      toast.error(`Failed to generate report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleDPIASelection = (item: DataInventoryItem) => {
    setSelectedDataItem(item);
    setIsDPIADialogOpen(false);
    setSelectedReport('dpia');
    setValidationErrors({ ...validationErrors, dataItem: undefined });
  };

  const handleReportTypeChange = (type: ReportType) => {
    setSelectedReport(type);
    setValidationErrors({});
    if (type !== 'dpia') {
      setSelectedDataItem(null);
    }
    if (type !== 'audit-trail') {
      setAuditStartDate('');
      setAuditEndDate('');
    }
  };

  const handleClearSelection = () => {
    setSelectedReport(null);
    setSelectedDataItem(null);
    setAuditStartDate('');
    setAuditEndDate('');
    setValidationErrors({});
    setReportOptions({ title: '', organization: '', author: '', maxRows: undefined, includeAllData: false });
  };

  const reportTypes: Array<{
    type: ReportType;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  }> = [
    {
      type: 'compliance',
      title: 'Compliance Report',
      description: 'Comprehensive compliance status across ISO 27001, ISO 27002, NIST CSF, NIST SP 800-53, GDPR, and CCPA',
      icon: <Shield className="w-6 h-6" />,
      color: 'text-blue-600',
    },
    {
      type: 'dpia',
      title: 'Data Protection Impact Assessment (DPIA)',
      description: 'GDPR Article 35 compliant DPIA for high-risk data processing activities',
      icon: <FileCheck className="w-6 h-6" />,
      color: 'text-green-600',
    },
    {
      type: 'risk-assessment',
      title: 'Risk Assessment Report',
      description: 'Comprehensive risk assessment for assets and data items with threat and vulnerability analysis',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'text-red-600',
    },
    {
      type: 'audit-trail',
      title: 'Audit Trail Report',
      description: 'Complete audit trail of all changes to data inventory and assets with timestamps',
      icon: <ClipboardList className="w-6 h-6" />,
      color: 'text-purple-600',
    },
    {
      type: 'enhancement-gap',
      title: 'Enhancement Gap Report',
      description: 'Comprehensive gap analysis showing compliance gaps, enabler deliverables, and enhancement recommendations',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Report Generation
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Generate compliance, DPIA, risk assessment, audit trail, and enhancement gap reports
            </p>
          </div>
        </div>

        {/* Report Options */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Report Options</CardTitle>
            <CardDescription>Configure report metadata and format</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Report Title
                  <span className="text-gray-500 text-xs ml-1">(optional, max 100 chars)</span>
                </label>
                <Input
                  value={reportOptions.title}
                  onChange={(e) => {
                    setReportOptions({ ...reportOptions, title: e.target.value });
                    if (validationErrors.title) {
                      setValidationErrors({ ...validationErrors, title: undefined });
                    }
                  }}
                  placeholder="Enter report title"
                  maxLength={100}
                  className={validationErrors.title ? 'border-red-500' : ''}
                />
                {validationErrors.title && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.title}
                  </p>
                )}
                {reportOptions.title && (
                  <p className="text-xs text-gray-500 mt-1">
                    {reportOptions.title.length}/100 characters
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Organization
                  <span className="text-gray-500 text-xs ml-1">(optional, max 100 chars)</span>
                </label>
                <Input
                  value={reportOptions.organization}
                  onChange={(e) => {
                    setReportOptions({ ...reportOptions, organization: e.target.value });
                    if (validationErrors.organization) {
                      setValidationErrors({ ...validationErrors, organization: undefined });
                    }
                  }}
                  placeholder="Enter organization name"
                  maxLength={100}
                  className={validationErrors.organization ? 'border-red-500' : ''}
                />
                {validationErrors.organization && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.organization}
                  </p>
                )}
                {reportOptions.organization && (
                  <p className="text-xs text-gray-500 mt-1">
                    {reportOptions.organization.length}/100 characters
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Author
                <span className="text-gray-500 text-xs ml-1">(optional, max 100 chars)</span>
              </label>
              <Input
                value={reportOptions.author}
                onChange={(e) => {
                  setReportOptions({ ...reportOptions, author: e.target.value });
                  if (validationErrors.author) {
                    setValidationErrors({ ...validationErrors, author: undefined });
                  }
                }}
                placeholder="Enter author name"
                maxLength={100}
                className={validationErrors.author ? 'border-red-500' : ''}
              />
              {validationErrors.author && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.author}
                </p>
              )}
              {reportOptions.author && (
                <p className="text-xs text-gray-500 mt-1">
                  {reportOptions.author.length}/100 characters
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Report Format *</label>
              <Select value={selectedFormat} onValueChange={(value) => setSelectedFormat(value as ReportFormat)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="docx">DOCX (Microsoft Word)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Choose PDF for universal compatibility or DOCX for editing
              </p>
            </div>

            {/* Customizable Limits */}
            {(selectedReport === 'risk-assessment' || selectedReport === 'audit-trail') && (
              <div className="border-t pt-4 mt-4">
                <label className="block text-sm font-medium mb-2">Report Limits (Optional)</label>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Max Items/Rows (0 = unlimited)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={reportOptions.maxRows || ''}
                        onChange={(e) => setReportOptions({ 
                          ...reportOptions, 
                          maxRows: e.target.value ? parseInt(e.target.value) : undefined 
                        })}
                        placeholder="Leave empty for default"
                        className="w-full"
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={reportOptions.includeAllData || false}
                          onChange={(e) => setReportOptions({ 
                            ...reportOptions, 
                            includeAllData: e.target.checked 
                          })}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Include All Data
                        </span>
                      </label>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Default: 10 items for risk assessment, 20 for audit trail. Check "Include All Data" to override.
                  </p>
                </div>
              </div>
            )}

            {/* Audit Trail Date Range */}
            {selectedReport === 'audit-trail' && (
              <div className="border-t pt-4 mt-4">
                <label className="block text-sm font-medium mb-2">Date Range (Optional)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Start Date</label>
                    <Input
                      type="date"
                      value={auditStartDate}
                      onChange={(e) => {
                        setAuditStartDate(e.target.value);
                        if (validationErrors.dateRange) {
                          setValidationErrors({ ...validationErrors, dateRange: undefined });
                        }
                      }}
                      className={validationErrors.dateRange ? 'border-red-500' : ''}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">End Date</label>
                    <Input
                      type="date"
                      value={auditEndDate}
                      onChange={(e) => {
                        setAuditEndDate(e.target.value);
                        if (validationErrors.dateRange) {
                          setValidationErrors({ ...validationErrors, dateRange: undefined });
                        }
                      }}
                      className={validationErrors.dateRange ? 'border-red-500' : ''}
                    />
                  </div>
                </div>
                {validationErrors.dateRange && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.dateRange}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to include all changes. Select dates to filter audit trail.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Report Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {reportTypes.map((report) => (
            <Card
              key={report.type}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedReport === report.type ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => {
                if (report.type === 'dpia') {
                  if (dataItems.length === 0) {
                    toast.error('No data items available. Please add data items first.');
                    return;
                  }
                  if (!selectedDataItem) {
                    setIsDPIADialogOpen(true);
                    return;
                  }
                }
                handleReportTypeChange(report.type);
              }}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={report.color}>{report.icon}</div>
                  <CardTitle>{report.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">{report.description}</p>
                {selectedReport === report.type && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
                    <FileCheck className="w-4 h-4" />
                    <span>Selected</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Generate Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {selectedReport && (
              <>
                <Info className="w-4 h-4" />
                <span>
                  {selectedReport === 'dpia' && !selectedDataItem
                    ? 'Please select a data item to continue'
                    : 'Ready to generate report'}
                </span>
              </>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleClearSelection}
              disabled={generating}
              className="w-full sm:w-auto"
            >
              Clear All
            </Button>
            <Button
              onClick={handleGenerateReport}
              disabled={!selectedReport || generating || (selectedReport === 'dpia' && !selectedDataItem)}
              className="w-full sm:w-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              {generating ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>
        </div>

        {/* DPIA Data Item Selection Dialog */}
        <Dialog open={isDPIADialogOpen} onOpenChange={setIsDPIADialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
            <DialogHeader>
              <DialogTitle>Select Data Item for DPIA</DialogTitle>
              <DialogDescription>
                Select a data inventory item to generate a Data Protection Impact Assessment (DPIA) report.
                {validationErrors.dataItem && (
                  <span className="text-red-600 block mt-1">
                    {validationErrors.dataItem}
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            
            {/* Search and Filter */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search data items..."
                    value={dpiaSearchQuery}
                    onChange={(e) => setDpiaSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={dpiaFilterType} onValueChange={setDpiaFilterType}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="PII">PII</SelectItem>
                    <SelectItem value="PHI">PHI</SelectItem>
                    <SelectItem value="Financial">Financial</SelectItem>
                    <SelectItem value="Intellectual Property">Intellectual Property</SelectItem>
                    <SelectItem value="Business Data">Business Data</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Results Count */}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {filteredDataItems.length === 0 ? (
                  <span className="text-red-600">No data items found</span>
                ) : (
                  <span>
                    {filteredDataItems.length} data item{filteredDataItems.length !== 1 ? 's' : ''} found
                    {dpiaSearchQuery || dpiaFilterType !== 'all' ? ' (filtered)' : ''}
                  </span>
                )}
              </div>

              {/* Data Items List */}
              <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                {dataItems.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No data items found. Please add data items first.
                    </p>
                  </div>
                ) : filteredDataItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No data items match your search criteria.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        setDpiaSearchQuery('');
                        setDpiaFilterType('all');
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  filteredDataItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedDataItem?.id === item.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => handleDPIASelection(item)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                            {selectedDataItem?.id === item.id && (
                              <FileCheck className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {item.description || 'No description'}
                          </p>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {item.dataType}
                            </span>
                            <span className="px-2 py-1 text-xs rounded bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                              {item.classification}
                            </span>
                            {item.location && (
                              <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                {item.location}
                              </span>
                            )}
                            {item.owner && (
                              <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                Owner: {item.owner}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDPIADialogOpen(false)}>
                Cancel
              </Button>
              {selectedDataItem && (
                <Button onClick={() => setIsDPIADialogOpen(false)}>
                  Confirm Selection
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Selected Data Item Display (for DPIA) */}
        {selectedReport === 'dpia' && selectedDataItem && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Selected Data Item for DPIA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{selectedDataItem.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {selectedDataItem.description || 'No description'}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {selectedDataItem.dataType}
                    </span>
                    <span className="px-2 py-1 text-xs rounded bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                      {selectedDataItem.classification}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedDataItem(null);
                    setSelectedReport(null);
                  }}
                >
                  Change Selection
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Report Generation Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Compliance Report</h4>
              <p>
                Generates a comprehensive compliance status report covering ISO 27001, ISO 27002, NIST CSF, NIST SP 800-53,
                GDPR, and CCPA frameworks. Includes summary statistics, compliance coverage percentages, and data
                classification breakdowns.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">DPIA Report</h4>
              <p>
                Generates a Data Protection Impact Assessment (DPIA) report compliant with GDPR Article 35. Includes
                processing activity details, risk assessment, identified risks, and measures to address risks. Select a
                data inventory item to generate the DPIA.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Risk Assessment Report</h4>
              <p>
                Generates a comprehensive risk assessment report for all assets and data items. Includes risk scores,
                threat analysis, vulnerability assessment, and control recommendations. Provides overall risk level and
                detailed risk breakdown by asset and data item.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Audit Trail Report</h4>
              <p>
                Generates a complete audit trail report of all changes to data inventory and assets. Includes summary
                statistics, changes by type and action, and detailed chronological list of all changes with timestamps.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

