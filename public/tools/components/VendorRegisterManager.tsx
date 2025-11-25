import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, Upload, Download, Search, Filter, ArrowRight, FileText, 
  Shield, AlertTriangle, CheckCircle, XCircle, TrendingUp, BarChart3,
  GitCompare, Layers, Eye, Edit, Trash2, Plus, RefreshCw, File,
  Users, Lock, Globe, FileCheck, Calendar, DollarSign, Activity,
  Target, Zap, AlertCircle, Database, Settings, Share2
} from 'lucide-react';

const VendorRegisterManager = () => {
  // State Management
  const [activeTab, setActiveTab] = useState("vendors");
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCriticality, setFilterCriticality] = useState("all");
  const [filterRiskLevel, setFilterRiskLevel] = useState("all");
  
  // Import Dialog State
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importStep, setImportStep] = useState(1);
  const [importFile, setImportFile] = useState(null);
  const [importData, setImportData] = useState([]);
  const [fieldMapping, setFieldMapping] = useState({});
  const [importProgress, setImportProgress] = useState(0);
  const [importErrors, setImportErrors] = useState([]);
  const [importResults, setImportResults] = useState({ success: 0, errors: 0, total: 0 });
  const [previewData, setPreviewData] = useState([]);
  const fileInputRef = useRef(null);

  // Add/Edit Dialog State
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Software',
    criticality: 'Medium',
    description: '',
    website: '',
    primaryContact: '',
    email: '',
    phone: '',
    address: '',
    contractValue: '',
    contractStart: '',
    contractEnd: '',
    services: '',
    dataAccess: 'None',
    dataTypes: [],
    complianceFrameworks: [],
    hasContract: false,
    hasSLA: false,
    hasInsurance: false,
    hasDPA: false,
    hasBAA: false,
    hasSOC2: false,
    hasISO27001: false,
    hasGDPRCompliance: false,
    hasSecurityAssessment: false,
    lastAuditDate: '',
    nextReviewDate: '',
    riskLevel: 'Medium',
    status: 'Active',
    notes: ''
  });

  // Available fields for import mapping
  const availableFields = [
    { value: 'name', label: 'Vendor Name', required: true },
    { value: 'type', label: 'Vendor Type', required: true },
    { value: 'criticality', label: 'Business Criticality', required: true },
    { value: 'description', label: 'Description', required: false },
    { value: 'website', label: 'Website', required: false },
    { value: 'primaryContact', label: 'Primary Contact', required: false },
    { value: 'email', label: 'Email', required: false },
    { value: 'phone', label: 'Phone', required: false },
    { value: 'address', label: 'Address', required: false },
    { value: 'contractValue', label: 'Contract Value', required: false },
    { value: 'contractStart', label: 'Contract Start Date', required: false },
    { value: 'contractEnd', label: 'Contract End Date', required: false },
    { value: 'services', label: 'Services Provided', required: false },
    { value: 'dataAccess', label: 'Data Access Level', required: false },
    { value: 'dataTypes', label: 'Data Types (comma-separated)', required: false },
    { value: 'complianceFrameworks', label: 'Compliance Frameworks (comma-separated)', required: false },
    { value: 'hasContract', label: 'Has Contract', required: false },
    { value: 'hasSLA', label: 'Has SLA', required: false },
    { value: 'hasInsurance', label: 'Has Insurance', required: false },
    { value: 'hasDPA', label: 'Has DPA', required: false },
    { value: 'hasBAA', label: 'Has BAA', required: false },
    { value: 'hasSOC2', label: 'Has SOC 2', required: false },
    { value: 'hasISO27001', label: 'Has ISO 27001', required: false },
    { value: 'hasGDPRCompliance', label: 'GDPR Compliant', required: false },
    { value: 'hasSecurityAssessment', label: 'Has Security Assessment', required: false },
    { value: 'lastAuditDate', label: 'Last Audit Date', required: false },
    { value: 'nextReviewDate', label: 'Next Review Date', required: false },
    { value: 'riskLevel', label: 'Risk Level', required: false },
    { value: 'status', label: 'Status', required: false },
    { value: 'notes', label: 'Notes', required: false }
  ];

  // Calculate completeness score
  const calculateCompletenessScore = (vendor) => {
    const checks = {
      basicInfo: [vendor.name, vendor.type, vendor.primaryContact, vendor.email].filter(Boolean).length / 4,
      contractual: [vendor.hasContract, vendor.hasSLA, vendor.contractStart, vendor.contractEnd].filter(Boolean).length / 4,
      compliance: [vendor.hasSOC2, vendor.hasISO27001, vendor.hasGDPRCompliance, vendor.hasSecurityAssessment].filter(Boolean).length / 4,
      privacy: [vendor.hasDPA, vendor.hasBAA, vendor.dataAccess !== 'None'].filter(Boolean).length / 3,
      monitoring: [vendor.lastAuditDate, vendor.nextReviewDate, vendor.hasInsurance].filter(Boolean).length / 3
    };

    const totalScore = (
      checks.basicInfo * 20 +
      checks.contractual * 25 +
      checks.compliance * 25 +
      checks.privacy * 20 +
      checks.monitoring * 10
    );

    return Math.round(totalScore);
  };

  // Identify gaps in vendor management
  const identifyGaps = (vendor) => {
    const gaps = [];

    // Basic Information Gaps
    if (!vendor.primaryContact) gaps.push({ category: 'Basic Info', item: 'Missing primary contact', severity: 'Medium' });
    if (!vendor.email) gaps.push({ category: 'Basic Info', item: 'Missing contact email', severity: 'Medium' });
    if (!vendor.description) gaps.push({ category: 'Basic Info', item: 'Missing vendor description', severity: 'Low' });

    // Contractual Gaps
    if (!vendor.hasContract) gaps.push({ category: 'Contractual', item: 'No contract on file', severity: 'High' });
    if (!vendor.hasSLA) gaps.push({ category: 'Contractual', item: 'No SLA defined', severity: 'High' });
    if (!vendor.contractEnd) gaps.push({ category: 'Contractual', item: 'No contract end date', severity: 'Medium' });
    if (!vendor.hasInsurance) gaps.push({ category: 'Contractual', item: 'No insurance verification', severity: 'Medium' });

    // Compliance Gaps
    if (!vendor.hasSecurityAssessment) gaps.push({ category: 'Compliance', item: 'No security assessment completed', severity: 'High' });
    if (vendor.criticality === 'Critical' && !vendor.hasSOC2) gaps.push({ category: 'Compliance', item: 'Critical vendor missing SOC 2', severity: 'Critical' });
    if (!vendor.hasISO27001 && vendor.dataAccess !== 'None') gaps.push({ category: 'Compliance', item: 'Data access without ISO 27001', severity: 'High' });

    // Privacy Gaps
    if (vendor.dataAccess !== 'None' && !vendor.hasDPA) gaps.push({ category: 'Privacy', item: 'Data processing without DPA', severity: 'Critical' });
    if (vendor.dataTypes.includes('PHI') && !vendor.hasBAA) gaps.push({ category: 'Privacy', item: 'PHI access without BAA', severity: 'Critical' });
    if (vendor.dataAccess === 'Full' && !vendor.hasGDPRCompliance) gaps.push({ category: 'Privacy', item: 'Full data access without GDPR compliance', severity: 'High' });

    // Monitoring Gaps
    if (!vendor.lastAuditDate) gaps.push({ category: 'Monitoring', item: 'No audit history', severity: 'High' });
    if (!vendor.nextReviewDate) gaps.push({ category: 'Monitoring', item: 'No review scheduled', severity: 'Medium' });
    
    // Risk-based gaps
    if (vendor.contractEnd) {
      const daysUntilExpiry = Math.floor((new Date(vendor.contractEnd) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysUntilExpiry < 90 && daysUntilExpiry > 0) {
        gaps.push({ category: 'Monitoring', item: `Contract expires in ${daysUntilExpiry} days`, severity: 'High' });
      } else if (daysUntilExpiry < 0) {
        gaps.push({ category: 'Monitoring', item: 'Contract expired', severity: 'Critical' });
      }
    }

    return gaps;
  };

  // Calculate risk score based on multiple factors
  const calculateRiskScore = (vendor) => {
    let score = 0;
    
    // Criticality factor
    const criticalityScores = { 'Low': 10, 'Medium': 30, 'High': 50, 'Critical': 70 };
    score += criticalityScores[vendor.criticality] || 30;

    // Data access factor
    const dataAccessScores = { 'None': 0, 'Limited': 10, 'Moderate': 20, 'Full': 40 };
    score += dataAccessScores[vendor.dataAccess] || 0;

    // Compliance deductions
    if (vendor.hasSOC2) score -= 10;
    if (vendor.hasISO27001) score -= 10;
    if (vendor.hasGDPRCompliance) score -= 5;
    if (vendor.hasSecurityAssessment) score -= 10;

    // Contract deductions
    if (vendor.hasContract) score -= 5;
    if (vendor.hasSLA) score -= 5;
    if (vendor.hasInsurance) score -= 5;

    // Privacy deductions
    if (vendor.hasDPA && vendor.dataAccess !== 'None') score -= 10;
    if (vendor.hasBAA && vendor.dataTypes.includes('PHI')) score -= 10;

    // Gap penalty
    const gaps = identifyGaps(vendor);
    score += gaps.filter(g => g.severity === 'Critical').length * 15;
    score += gaps.filter(g => g.severity === 'High').length * 10;
    score += gaps.filter(g => g.severity === 'Medium').length * 5;

    return Math.max(0, Math.min(100, score));
  };

  // Filtered vendors
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCriticality = filterCriticality === 'all' || vendor.criticality === filterCriticality;
    const matchesRisk = filterRiskLevel === 'all' || vendor.riskLevel === filterRiskLevel;
    
    return matchesSearch && matchesCriticality && matchesRisk;
  });

  // File upload handler
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!['csv', 'json', 'xlsx'].includes(fileExtension)) {
      setImportErrors(['Unsupported file format. Please use CSV, JSON, or Excel files.']);
      return;
    }

    try {
      if (fileExtension === 'json') {
        const text = await file.text();
        const data = JSON.parse(text);
        setImportData(Array.isArray(data) ? data : [data]);
      } else if (fileExtension === 'csv') {
        const text = await file.text();
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const data = lines.slice(1).filter(line => line.trim()).map(line => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          return row;
        });
        setImportData(data);
      }

      setImportStep(2);
      setImportErrors([]);
    } catch (error) {
      setImportErrors([`Error parsing file: ${error.message}`]);
    }
  };

  // Field mapping handler
  const handleFieldMapping = (sourceField, targetField) => {
    setFieldMapping({ ...fieldMapping, [sourceField]: targetField });
  };

  // Validate import data
  const validateImportData = () => {
    const errors = [];
    const validatedData = [];

    importData.forEach((row, index) => {
      const mappedRow = {};
      let hasErrors = false;

      Object.keys(fieldMapping).forEach(sourceField => {
        const targetField = fieldMapping[sourceField];
        if (targetField && targetField !== 'ignore') {
          let value = row[sourceField];

          // Handle boolean fields
          const booleanFields = ['hasContract', 'hasSLA', 'hasInsurance', 'hasDPA', 'hasBAA', 
                                 'hasSOC2', 'hasISO27001', 'hasGDPRCompliance', 'hasSecurityAssessment'];
          if (booleanFields.includes(targetField)) {
            value = value === 'true' || value === 'yes' || value === '1' || 
                   value === 'TRUE' || value === 'YES' || value === true;
          }

          // Handle array fields
          if (targetField === 'dataTypes' || targetField === 'complianceFrameworks') {
            value = value ? value.split(',').map(item => item.trim()) : [];
          }

          mappedRow[targetField] = value;
        }
      });

      // Validate required fields
      const requiredFields = availableFields.filter(f => f.required);
      requiredFields.forEach(field => {
        if (!mappedRow[field.value] || mappedRow[field.value] === '') {
          errors.push(`Row ${index + 1}: Missing required field '${field.label}'`);
          hasErrors = true;
        }
      });

      if (!hasErrors) {
        const completeRow = {
          ...mappedRow,
          criticality: mappedRow.criticality || 'Medium',
          dataAccess: mappedRow.dataAccess || 'None',
          riskLevel: mappedRow.riskLevel || 'Medium',
          status: mappedRow.status || 'Active',
          dataTypes: mappedRow.dataTypes || [],
          complianceFrameworks: mappedRow.complianceFrameworks || [],
          hasContract: mappedRow.hasContract || false,
          hasSLA: mappedRow.hasSLA || false,
          hasInsurance: mappedRow.hasInsurance || false,
          hasDPA: mappedRow.hasDPA || false,
          hasBAA: mappedRow.hasBAA || false,
          hasSOC2: mappedRow.hasSOC2 || false,
          hasISO27001: mappedRow.hasISO27001 || false,
          hasGDPRCompliance: mappedRow.hasGDPRCompliance || false,
          hasSecurityAssessment: mappedRow.hasSecurityAssessment || false
        };

        // Calculate scores and gaps
        completeRow.completenessScore = calculateCompletenessScore(completeRow);
        completeRow.riskScore = calculateRiskScore(completeRow);
        completeRow.gapAnalysis = identifyGaps(completeRow);

        validatedData.push(completeRow);
      }
    });

    setImportErrors(errors);
    setPreviewData(validatedData);

    if (errors.length === 0) {
      setImportStep(3);
    }
  };

  // Execute import
  const executeImport = async () => {
    setImportStep(4);
    setImportProgress(0);

    let successCount = 0;

    for (let i = 0; i < previewData.length; i++) {
      const newVendor = {
        ...previewData[i],
        id: vendors.length > 0 ? Math.max(...vendors.map(v => v.id)) + i + 1 : i + 1,
        createdDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      setVendors(prev => [...prev, newVendor]);
      successCount++;
      await new Promise(resolve => setTimeout(resolve, 100));
      setImportProgress(((i + 1) / previewData.length) * 100);
    }

    setImportResults({ success: successCount, errors: 0, total: previewData.length });
  };

  // Reset import
  const resetImport = () => {
    setImportFile(null);
    setImportData([]);
    setImportStep(1);
    setFieldMapping({});
    setImportProgress(0);
    setImportErrors([]);
    setImportResults({ success: 0, errors: 0, total: 0 });
    setPreviewData([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Export vendors
  const exportVendors = (format = 'csv', includeGaps = true) => {
    const exportData = vendors.map(vendor => {
      const baseData = {
        name: vendor.name,
        type: vendor.type,
        criticality: vendor.criticality,
        description: vendor.description,
        website: vendor.website,
        primaryContact: vendor.primaryContact,
        email: vendor.email,
        phone: vendor.phone,
        contractValue: vendor.contractValue,
        contractStart: vendor.contractStart,
        contractEnd: vendor.contractEnd,
        services: vendor.services,
        dataAccess: vendor.dataAccess,
        dataTypes: vendor.dataTypes.join(', '),
        complianceFrameworks: vendor.complianceFrameworks.join(', '),
        riskLevel: vendor.riskLevel,
        status: vendor.status,
        completenessScore: vendor.completenessScore,
        riskScore: vendor.riskScore
      };

      if (includeGaps) {
        return {
          ...baseData,
          hasContract: vendor.hasContract,
          hasSLA: vendor.hasSLA,
          hasInsurance: vendor.hasInsurance,
          hasDPA: vendor.hasDPA,
          hasBAA: vendor.hasBAA,
          hasSOC2: vendor.hasSOC2,
          hasISO27001: vendor.hasISO27001,
          hasGDPRCompliance: vendor.hasGDPRCompliance,
          hasSecurityAssessment: vendor.hasSecurityAssessment,
          lastAuditDate: vendor.lastAuditDate,
          nextReviewDate: vendor.nextReviewDate,
          totalGaps: vendor.gapAnalysis.length,
          criticalGaps: vendor.gapAnalysis.filter(g => g.severity === 'Critical').length,
          highGaps: vendor.gapAnalysis.filter(g => g.severity === 'High').length
        };
      }

      return baseData;
    });

    if (format === 'csv') {
      const headers = Object.keys(exportData[0] || {});
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vendor-register-${includeGaps ? 'with-gaps-' : ''}${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } else if (format === 'json') {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vendor-register-${includeGaps ? 'with-gaps-' : ''}${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    }
  };

  // Export gap analysis report
  const exportGapAnalysisReport = () => {
    const reportData = vendors.map(vendor => ({
      vendorName: vendor.name,
      criticality: vendor.criticality,
      riskScore: vendor.riskScore,
      completenessScore: vendor.completenessScore,
      totalGaps: vendor.gapAnalysis.length,
      criticalGaps: vendor.gapAnalysis.filter(g => g.severity === 'Critical').length,
      highGaps: vendor.gapAnalysis.filter(g => g.severity === 'High').length,
      mediumGaps: vendor.gapAnalysis.filter(g => g.severity === 'Medium').length,
      lowGaps: vendor.gapAnalysis.filter(g => g.severity === 'Low').length,
      gaps: vendor.gapAnalysis.map(g => `${g.category}: ${g.item} (${g.severity})`).join('; ')
    }));

    const headers = Object.keys(reportData[0] || {});
    const csvContent = [
      headers.join(','),
      ...reportData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendor-gap-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Add vendor
  const handleAddVendor = () => {
    const newVendor = {
      ...formData,
      id: vendors.length > 0 ? Math.max(...vendors.map(v => v.id)) + 1 : 1,
      createdDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    newVendor.completenessScore = calculateCompletenessScore(newVendor);
    newVendor.riskScore = calculateRiskScore(newVendor);
    newVendor.gapAnalysis = identifyGaps(newVendor);

    setVendors([...vendors, newVendor]);
    setShowAddDialog(false);
    resetFormData();
  };

  // Reset form data
  const resetFormData = () => {
    setFormData({
      name: '',
      type: 'Software',
      criticality: 'Medium',
      description: '',
      website: '',
      primaryContact: '',
      email: '',
      phone: '',
      address: '',
      contractValue: '',
      contractStart: '',
      contractEnd: '',
      services: '',
      dataAccess: 'None',
      dataTypes: [],
      complianceFrameworks: [],
      hasContract: false,
      hasSLA: false,
      hasInsurance: false,
      hasDPA: false,
      hasBAA: false,
      hasSOC2: false,
      hasISO27001: false,
      hasGDPRCompliance: false,
      hasSecurityAssessment: false,
      lastAuditDate: '',
      nextReviewDate: '',
      riskLevel: 'Medium',
      status: 'Active',
      notes: ''
    });
  };

  // Get risk level badge color
  const getRiskBadgeColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get criticality badge color
  const getCriticalityBadgeColor = (criticality) => {
    switch (criticality) {
      case 'Low': return 'bg-blue-100 text-blue-800';
      case 'Medium': return 'bg-indigo-100 text-indigo-800';
      case 'High': return 'bg-purple-100 text-purple-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Statistics
  const stats = {
    total: vendors.length,
    critical: vendors.filter(v => v.criticality === 'Critical').length,
    highRisk: vendors.filter(v => v.riskLevel === 'High' || v.riskLevel === 'Critical').length,
    withGaps: vendors.filter(v => v.gapAnalysis && v.gapAnalysis.length > 0).length,
    avgCompleteness: vendors.length > 0 
      ? Math.round(vendors.reduce((sum, v) => sum + v.completenessScore, 0) / vendors.length) 
      : 0,
    avgRiskScore: vendors.length > 0
      ? Math.round(vendors.reduce((sum, v) => sum + v.riskScore, 0) / vendors.length)
      : 0
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="w-8 h-8 text-blue-600" />
            Vendor Register Manager
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive vendor risk management with gap analysis
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowImportDialog(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Import Register
          </Button>
          <Button variant="outline" onClick={() => exportVendors('csv', true)}>
            <Download className="w-4 h-4 mr-2" />
            Export with Gaps
          </Button>
          <Button variant="outline" onClick={exportGapAnalysisReport}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Gap Report
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Vendor
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Vendors</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
            <div className="text-sm text-gray-600">Critical</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">{stats.highRisk}</div>
            <div className="text-sm text-gray-600">High Risk</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.withGaps}</div>
            <div className="text-sm text-gray-600">With Gaps</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.avgCompleteness}%</div>
            <div className="text-sm text-gray-600">Avg Completeness</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">{stats.avgRiskScore}</div>
            <div className="text-sm text-gray-600">Avg Risk Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterCriticality} onValueChange={setFilterCriticality}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Criticality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Criticality</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRiskLevel} onValueChange={setFilterRiskLevel}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="vendors">
            <Building2 className="w-4 h-4 mr-2" />
            Vendors
          </TabsTrigger>
          <TabsTrigger value="gaps">
            <GitCompare className="w-4 h-4 mr-2" />
            Gap Analysis
          </TabsTrigger>
          <TabsTrigger value="risk">
            <Shield className="w-4 h-4 mr-2" />
            Risk Dashboard
          </TabsTrigger>
          <TabsTrigger value="reports">
            <BarChart3 className="w-4 h-4 mr-2" />
            Reports
          </TabsTrigger>
        </TabsList>

        {/* Vendors Tab */}
        <TabsContent value="vendors">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Vendor List</CardTitle>
                  <CardDescription>{filteredVendors.length} vendors</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                  {filteredVendors.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No vendors found</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={() => setShowAddDialog(true)}
                      >
                        Add Your First Vendor
                      </Button>
                    </div>
                  ) : (
                    filteredVendors.map(vendor => (
                      <Card
                        key={vendor.id}
                        className={`cursor-pointer hover:bg-gray-50 ${
                          selectedVendor?.id === vendor.id ? 'border-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedVendor(vendor)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-semibold">{vendor.name}</div>
                            <Badge className={getCriticalityBadgeColor(vendor.criticality)}>
                              {vendor.criticality}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">{vendor.type}</div>
                          <div className="flex justify-between items-center">
                            <Badge className={getRiskBadgeColor(vendor.riskLevel)}>
                              {vendor.riskLevel} Risk
                            </Badge>
                            <div className="text-xs text-gray-500">
                              {vendor.completenessScore}% complete
                            </div>
                          </div>
                          {vendor.gapAnalysis && vendor.gapAnalysis.length > 0 && (
                            <div className="mt-2 flex gap-1">
                              {vendor.gapAnalysis.filter(g => g.severity === 'Critical').length > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {vendor.gapAnalysis.filter(g => g.severity === 'Critical').length} Critical
                                </Badge>
                              )}
                              {vendor.gapAnalysis.filter(g => g.severity === 'High').length > 0 && (
                                <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700">
                                  {vendor.gapAnalysis.filter(g => g.severity === 'High').length} High
                                </Badge>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="col-span-2">
              {selectedVendor ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {selectedVendor.name}
                          <Badge className={getCriticalityBadgeColor(selectedVendor.criticality)}>
                            {selectedVendor.criticality}
                          </Badge>
                          <Badge className={getRiskBadgeColor(selectedVendor.riskLevel)}>
                            {selectedVendor.riskLevel} Risk
                          </Badge>
                        </CardTitle>
                        <CardDescription>{selectedVendor.type}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Completeness Progress */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Vendor Profile Completeness</span>
                        <span className="text-sm text-gray-600">{selectedVendor.completenessScore}%</span>
                      </div>
                      <Progress value={selectedVendor.completenessScore} className="h-2" />
                    </div>

                    {/* Risk Score */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Risk Score</span>
                        <span className="text-sm text-gray-600">{selectedVendor.riskScore}/100</span>
                      </div>
                      <Progress 
                        value={selectedVendor.riskScore} 
                        className="h-2"
                        indicatorClassName={
                          selectedVendor.riskScore > 70 ? 'bg-red-500' :
                          selectedVendor.riskScore > 50 ? 'bg-orange-500' :
                          selectedVendor.riskScore > 30 ? 'bg-yellow-500' : 'bg-green-500'
                        }
                      />
                    </div>

                    {/* Basic Information */}
                    <div>
                      <h3 className="font-semibold mb-3">Basic Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Website</div>
                          <div>{selectedVendor.website || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Primary Contact</div>
                          <div>{selectedVendor.primaryContact || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Email</div>
                          <div>{selectedVendor.email || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Phone</div>
                          <div>{selectedVendor.phone || 'N/A'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Contract Information */}
                    <div>
                      <h3 className="font-semibold mb-3">Contract Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Contract Value</div>
                          <div>{selectedVendor.contractValue || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Data Access Level</div>
                          <div>{selectedVendor.dataAccess}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Start Date</div>
                          <div>{selectedVendor.contractStart || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">End Date</div>
                          <div>{selectedVendor.contractEnd || 'N/A'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Compliance Status */}
                    <div>
                      <h3 className="font-semibold mb-3">Compliance Status</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { key: 'hasContract', label: 'Contract on File' },
                          { key: 'hasSLA', label: 'SLA Defined' },
                          { key: 'hasInsurance', label: 'Insurance Verified' },
                          { key: 'hasDPA', label: 'DPA in Place' },
                          { key: 'hasBAA', label: 'BAA Signed' },
                          { key: 'hasSOC2', label: 'SOC 2 Certified' },
                          { key: 'hasISO27001', label: 'ISO 27001' },
                          { key: 'hasGDPRCompliance', label: 'GDPR Compliant' },
                          { key: 'hasSecurityAssessment', label: 'Security Assessment' }
                        ].map(item => (
                          <div key={item.key} className="flex items-center gap-2">
                            {selectedVendor[item.key] ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span className="text-sm">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Gap Analysis */}
                    {selectedVendor.gapAnalysis && selectedVendor.gapAnalysis.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3">
                          Identified Gaps ({selectedVendor.gapAnalysis.length})
                        </h3>
                        <div className="space-y-2">
                          {selectedVendor.gapAnalysis.map((gap, index) => (
                            <Alert key={index} variant={gap.severity === 'Critical' ? 'destructive' : 'default'}>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-medium">{gap.category}</div>
                                    <div className="text-sm">{gap.item}</div>
                                  </div>
                                  <Badge 
                                    className={
                                      gap.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                                      gap.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                                      gap.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-blue-100 text-blue-800'
                                    }
                                  >
                                    {gap.severity}
                                  </Badge>
                                </div>
                              </AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-[600px]">
                    <div className="text-center text-gray-500">
                      <Building2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Select a vendor to view details</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Gap Analysis Tab */}
        <TabsContent value="gaps">
          <Card>
            <CardHeader>
              <CardTitle>Gap Analysis Overview</CardTitle>
              <CardDescription>Vendor management gaps across your register</CardDescription>
            </CardHeader>
            <CardContent>
              {vendors.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <GitCompare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No vendors to analyze</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Gap Distribution */}
                  <div className="grid grid-cols-4 gap-4">
                    {['Critical', 'High', 'Medium', 'Low'].map(severity => {
                      const count = vendors.reduce((sum, v) => 
                        sum + (v.gapAnalysis?.filter(g => g.severity === severity).length || 0), 0
                      );
                      return (
                        <Card key={severity}>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{count}</div>
                            <div className="text-sm text-gray-600">{severity} Gaps</div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Gap Categories */}
                  <div>
                    <h3 className="font-semibold mb-4">Gaps by Category</h3>
                    <div className="space-y-4">
                      {['Basic Info', 'Contractual', 'Compliance', 'Privacy', 'Monitoring'].map(category => {
                        const categoryGaps = vendors.reduce((gaps, vendor) => {
                          const vendorCategoryGaps = vendor.gapAnalysis?.filter(g => g.category === category) || [];
                          return [...gaps, ...vendorCategoryGaps.map(g => ({ ...g, vendorName: vendor.name }))];
                        }, []);

                        if (categoryGaps.length === 0) return null;

                        return (
                          <Card key={category}>
                            <CardHeader>
                              <CardTitle className="text-lg">{category}</CardTitle>
                              <CardDescription>{categoryGaps.length} gaps identified</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                {categoryGaps.slice(0, 5).map((gap, index) => (
                                  <div key={index} className="flex justify-between items-center p-2 border rounded">
                                    <div>
                                      <div className="font-medium text-sm">{gap.vendorName}</div>
                                      <div className="text-sm text-gray-600">{gap.item}</div>
                                    </div>
                                    <Badge 
                                      className={
                                        gap.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                                        gap.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                                        gap.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-blue-100 text-blue-800'
                                      }
                                    >
                                      {gap.severity}
                                    </Badge>
                                  </div>
                                ))}
                                {categoryGaps.length > 5 && (
                                  <div className="text-sm text-gray-500 text-center pt-2">
                                    +{categoryGaps.length - 5} more gaps
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Dashboard Tab */}
        <TabsContent value="risk">
          <Card>
            <CardHeader>
              <CardTitle>Risk Dashboard</CardTitle>
              <CardDescription>Vendor risk analysis and prioritization</CardDescription>
            </CardHeader>
            <CardContent>
              {vendors.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No vendors to analyze</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Risk Distribution */}
                  <div className="grid grid-cols-4 gap-4">
                    {['Critical', 'High', 'Medium', 'Low'].map(level => {
                      const count = vendors.filter(v => v.riskLevel === level).length;
                      return (
                        <Card key={level}>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{count}</div>
                            <div className="text-sm text-gray-600">{level} Risk</div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* High Risk Vendors */}
                  <div>
                    <h3 className="font-semibold mb-4">High Risk Vendors</h3>
                    <div className="space-y-2">
                      {vendors
                        .filter(v => v.riskLevel === 'High' || v.riskLevel === 'Critical')
                        .sort((a, b) => b.riskScore - a.riskScore)
                        .map(vendor => (
                          <Card key={vendor.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="font-semibold flex items-center gap-2">
                                    {vendor.name}
                                    <Badge className={getCriticalityBadgeColor(vendor.criticality)}>
                                      {vendor.criticality}
                                    </Badge>
                                    <Badge className={getRiskBadgeColor(vendor.riskLevel)}>
                                      {vendor.riskLevel} Risk
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-gray-600 mt-1">{vendor.type}</div>
                                  <div className="mt-2">
                                    <div className="flex justify-between text-xs mb-1">
                                      <span>Risk Score</span>
                                      <span>{vendor.riskScore}/100</span>
                                    </div>
                                    <Progress 
                                      value={vendor.riskScore} 
                                      className="h-1"
                                      indicatorClassName="bg-red-500"
                                    />
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports & Analytics</CardTitle>
              <CardDescription>Generate comprehensive vendor management reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => exportVendors('csv', false)}>
                  <FileText className="w-4 h-4 mr-2" />
                  Export Basic Register (CSV)
                </Button>
                <Button variant="outline" onClick={() => exportVendors('csv', true)}>
                  <FileCheck className="w-4 h-4 mr-2" />
                  Export with Gap Analysis (CSV)
                </Button>
                <Button variant="outline" onClick={() => exportVendors('json', false)}>
                  <Database className="w-4 h-4 mr-2" />
                  Export Basic Register (JSON)
                </Button>
                <Button variant="outline" onClick={exportGapAnalysisReport}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Export Gap Analysis Report
                </Button>
              </div>

              {vendors.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h3 className="font-semibold">Summary Statistics</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <div className="text-sm text-gray-600">Total Vendors</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-blue-600">{stats.avgCompleteness}%</div>
                        <div className="text-sm text-gray-600">Avg Profile Completeness</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-purple-600">{stats.avgRiskScore}</div>
                        <div className="text-sm text-gray-600">Avg Risk Score</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onChangeOpen={(open) => {
        setShowImportDialog(open);
        if (!open) resetImport();
      }}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Vendor Register with Gap Assessment</DialogTitle>
            <DialogDescription>
              Upload your existing vendor register - supports CSV, JSON, and Excel
            </DialogDescription>
          </DialogHeader>

          {/* Import Steps Progress */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <React.Fragment key={step}>
                  <div className={`flex items-center space-x-2 ${importStep >= step ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${importStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                      {step}
                    </div>
                    <span className="text-sm">
                      {step === 1 && 'Upload'}
                      {step === 2 && 'Map'}
                      {step === 3 && 'Preview'}
                      {step === 4 && 'Import'}
                    </span>
                  </div>
                  {step < 4 && <ArrowRight className="w-4 h-4 text-gray-400" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step 1: Upload */}
          {importStep === 1 && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  onChange={handleFileUpload} 
                  accept=".csv,.json,.xlsx" 
                  className="hidden" 
                />
                <File className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">Upload your vendor register</p>
                <p className="text-gray-500 mb-4">Supports CSV, JSON, Excel with gap assessment data</p>
                <Button onClick={() => fileInputRef.current?.click()}>Choose File</Button>
              </div>

              {importFile && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    File uploaded: {importFile.name} ({(importFile.size / 1024).toFixed(2)} KB)
                  </AlertDescription>
                </Alert>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Supported Fields</h4>
                <div className="text-sm grid grid-cols-2 gap-2">
                  <div>
                    <strong>Core Fields:</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• Vendor Name, Type, Criticality</li>
                      <li>• Contact Information</li>
                      <li>• Contract Details</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Compliance Fields:</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• SOC 2, ISO 27001, GDPR</li>
                      <li>• DPA, BAA, SLA Status</li>
                      <li>• Security Assessments</li>
                    </ul>
                  </div>
                </div>
              </div>

              {importErrors.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium mb-1">Import Errors:</div>
                    <ul className="list-disc list-inside">
                      {importErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Step 2: Field Mapping */}
          {importStep === 2 && (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Map your file columns to vendor register fields. Fields marked with * are required.
                </AlertDescription>
              </Alert>

              <div className="max-h-96 overflow-y-auto space-y-3">
                {importData.length > 0 && Object.keys(importData[0]).map(sourceField => (
                  <div key={sourceField} className="flex items-center gap-4">
                    <div className="w-1/3 font-medium text-sm">{sourceField}</div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <Select
                      value={fieldMapping[sourceField] || ''}
                      onValueChange={(value) => handleFieldMapping(sourceField, value)}
                    >
                      <SelectTrigger className="w-2/3">
                        <SelectValue placeholder="Select target field..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ignore">Ignore this field</SelectItem>
                        {availableFields.map(field => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label} {field.required && '*'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setImportStep(1)}>
                  Back
                </Button>
                <Button onClick={validateImportData}>
                  Continue to Preview
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Preview */}
          {importStep === 3 && (
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Ready to import {previewData.length} vendors. Review the preview below.
                </AlertDescription>
              </Alert>

              <div className="max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {previewData.slice(0, 5).map((vendor, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold">{vendor.name}</div>
                            <div className="text-sm text-gray-600">{vendor.type} • {vendor.criticality}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              Completeness: {vendor.completenessScore}% • Risk Score: {vendor.riskScore}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Badge className={getCriticalityBadgeColor(vendor.criticality)}>
                              {vendor.criticality}
                            </Badge>
                            {vendor.gapAnalysis.length > 0 && (
                              <Badge variant="outline">{vendor.gapAnalysis.length} gaps</Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {previewData.length > 5 && (
                    <div className="text-center text-sm text-gray-500 py-2">
                      +{previewData.length - 5} more vendors
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setImportStep(2)}>
                  Back
                </Button>
                <Button onClick={executeImport}>
                  Import Vendors
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Import Progress */}
          {importStep === 4 && (
            <div className="space-y-4">
              {importProgress < 100 ? (
                <>
                  <div className="text-center py-8">
                    <RefreshCw className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-600" />
                    <p className="text-lg font-medium mb-2">Importing Vendors...</p>
                    <p className="text-gray-600">Please wait while we process your data</p>
                  </div>
                  <Progress value={importProgress} className="h-2" />
                  <div className="text-center text-sm text-gray-600">
                    {Math.round(importProgress)}% complete
                  </div>
                </>
              ) : (
                <>
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-medium mb-1">Import Complete!</div>
                      <div className="text-sm">
                        Successfully imported {importResults.success} of {importResults.total} vendors
                      </div>
                    </AlertDescription>
                  </Alert>
                  <div className="flex justify-end pt-4">
                    <Button onClick={() => {
                      setShowImportDialog(false);
                      resetImport();
                    }}>
                      Close
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Vendor Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Vendor</DialogTitle>
            <DialogDescription>
              Enter vendor information for risk assessment
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Vendor Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Vendor name"
                />
              </div>
              <div>
                <Label htmlFor="type">Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Software">Software</SelectItem>
                    <SelectItem value="Hardware">Hardware</SelectItem>
                    <SelectItem value="Cloud">Cloud Services</SelectItem>
                    <SelectItem value="Consulting">Consulting</SelectItem>
                    <SelectItem value="Professional Services">Professional Services</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="criticality">Business Criticality *</Label>
                <Select value={formData.criticality} onValueChange={(value) => setFormData({ ...formData, criticality: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dataAccess">Data Access Level</Label>
                <Select value={formData.dataAccess} onValueChange={(value) => setFormData({ ...formData, dataAccess: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Limited">Limited</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Full">Full</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of services provided"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryContact">Primary Contact</Label>
                <Input
                  id="primaryContact"
                  value={formData.primaryContact}
                  onChange={(e) => setFormData({ ...formData, primaryContact: e.target.value })}
                  placeholder="Contact name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@vendor.com"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Compliance Status</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'hasContract', label: 'Contract on File' },
                  { key: 'hasSLA', label: 'SLA Defined' },
                  { key: 'hasInsurance', label: 'Insurance Verified' },
                  { key: 'hasDPA', label: 'DPA in Place' },
                  { key: 'hasSOC2', label: 'SOC 2 Certified' },
                  { key: 'hasISO27001', label: 'ISO 27001' },
                  { key: 'hasGDPRCompliance', label: 'GDPR Compliant' },
                  { key: 'hasSecurityAssessment', label: 'Security Assessment' }
                ].map(item => (
                  <div key={item.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={item.key}
                      checked={formData[item.key]}
                      onCheckedChange={(checked) => setFormData({ ...formData, [item.key]: checked })}
                    />
                    <Label htmlFor={item.key} className="text-sm font-normal">
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => {
                setShowAddDialog(false);
                resetFormData();
              }}>
                Cancel
              </Button>
              <Button onClick={handleAddVendor} disabled={!formData.name || !formData.type}>
                Add Vendor
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorRegisterManager;
