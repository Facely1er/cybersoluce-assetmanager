# Vendor Register Manager - Quick Reference Guide

## 🚀 Quick Start (5 Minutes)

### Option 1: Import Existing Register
```
1. Click "Import Register"
2. Choose your CSV/Excel file
3. Map your columns → our fields
4. Preview and confirm
5. Done! Your vendors are loaded with gap analysis
```

### Option 2: Start Fresh
```
1. Click "Add Vendor"
2. Fill in vendor details
3. Check compliance boxes
4. Save
5. Review gap analysis automatically generated
```

## 📋 Common Workflows

### Weekly: Review High-Risk Vendors
```
1. Go to "Risk Dashboard" tab
2. Focus on "High Risk Vendors" section
3. Click vendor → Review gaps
4. Update compliance status
5. Export for team review
```

### Monthly: Gap Remediation
```
1. Navigate to "Gap Analysis" tab
2. Filter by "Critical" severity
3. Document remediation actions
4. Update vendor profiles
5. Export gap report for tracking
```

### Quarterly: Full Register Review
```
1. Export "With Gap Analysis"
2. Review with procurement team
3. Schedule vendor meetings
4. Update certifications
5. Re-import updated register
```

## 💡 Pro Tips

### Import Preparation
- **Clean your data first**: Remove duplicate vendors
- **Standardize names**: "ABC Corp" not "ABC, Corp."
- **Use ISO dates**: YYYY-MM-DD format (2024-01-15)
- **Boolean values**: true/false, yes/no, or 1/0
- **Arrays as CSV**: "GDPR, HIPAA, SOX" for compliance

### Risk Score Optimization
Reduce risk scores by:
- ✅ Adding SOC 2 certification (-10 points)
- ✅ Adding ISO 27001 certification (-10 points)
- ✅ Implementing DPA for data access (-10 points)
- ✅ Completing security assessment (-10 points)
- ✅ Adding contract and SLA (-10 points)

### Gap Prioritization
**Critical Severity** - Address immediately:
- Data processing without DPA
- PHI access without BAA
- Critical vendor missing SOC 2
- Expired contracts

**High Severity** - Address within 30 days:
- Missing security assessments
- No SLA for critical vendors
- Data access without ISO 27001
- Missing audit history

**Medium Severity** - Address within 90 days:
- Missing contact details
- No contract end dates
- No review scheduled

## 📊 Field Mapping Cheatsheet

| Your Field Name | Maps To | Example |
|-----------------|---------|---------|
| Vendor, Company, Name | name | "Acme Software" |
| Type, Category, Service Type | type | "Software" |
| Importance, Priority, Business Critical | criticality | "High" |
| Contact, Rep, Account Manager | primaryContact | "John Doe" |
| Email, Contact Email | email | "john@acme.com" |
| Phone, Tel, Contact Number | phone | "+1-555-0123" |
| Website, URL, Web | website | "www.acme.com" |
| Contract Amount, Value, $$ | contractValue | "$50,000" |
| Start, Begin Date, Effective | contractStart | "2024-01-01" |
| End, Expiry, Renewal Date | contractEnd | "2024-12-31" |
| Services, Description, What They Do | services | "Cloud hosting" |
| Data Access, Access Level | dataAccess | "Moderate" |
| SOC2, SOC 2 Cert, Has SOC2 | hasSOC2 | true |
| ISO27001, ISO Cert | hasISO27001 | false |

## 🎯 Completeness Score Breakdown

Your vendor profile completeness is calculated as:

**Basic Info (20%)**: 4 fields required
- Vendor name ✓
- Type ✓
- Primary contact ✓
- Email ✓

**Contractual (25%)**: 4 items required
- Has contract ✓
- Has SLA ✓
- Contract start date ✓
- Contract end date ✓

**Compliance (25%)**: 4 certifications
- SOC 2 ✓
- ISO 27001 ✓
- GDPR compliance ✓
- Security assessment ✓

**Privacy (20%)**: 3 controls
- DPA in place ✓
- BAA if PHI ✓
- Data access documented ✓

**Monitoring (10%)**: 3 tracking items
- Last audit date ✓
- Next review date ✓
- Insurance verified ✓

### Example Calculations

**Basic Vendor** (40% complete):
- Name, type, contact, email ✓ (20%)
- Has contract ✓ (6.25%)
- Some dates ✓ (12.5%)
- No certifications (0%)
- No privacy controls (0%)
- No monitoring (0%)
= 38.75% ≈ 40%

**Well-Managed Vendor** (85% complete):
- Basic info complete ✓ (20%)
- Full contract info ✓ (25%)
- SOC 2, ISO 27001, GDPR ✓ (18.75%)
- DPA and access controls ✓ (13.33%)
- Audit dates, insurance ✓ (6.67%)
= 83.75% ≈ 85%

## 🔴 Critical Gaps - Immediate Action Required

### Gap: "Data processing without DPA"
**Action Plan**:
1. Contact vendor legal team
2. Request standard DPA template
3. Review with your legal counsel
4. Execute DPA
5. Update vendor record: `hasDPA = true`

### Gap: "PHI access without BAA"
**Action Plan**:
1. Verify vendor actually accesses PHI
2. If yes, immediately restrict access
3. Obtain HIPAA BAA from vendor
4. Legal review and execution
5. Update: `hasBAA = true`, `dataTypes = ['PHI']`

### Gap: "Critical vendor missing SOC 2"
**Action Plan**:
1. Request current SOC 2 Type II report
2. Review report with security team
3. If no SOC 2, assess alternative controls
4. Document findings
5. Update risk assessment

## 📤 Export Scenarios

### For Procurement Team
```
Export: Basic Register (CSV)
Use: Vendor list with contract dates
Share: procurement@company.com
```

### For Legal Review
```
Export: With Gap Analysis (CSV)
Use: Contract and DPA status review
Focus: hasContract, hasDPA, hasBAA fields
```

### For Executive Dashboard
```
Export: Gap Analysis Report
Use: Board presentation
Highlight: Critical and High severity gaps
```

### For Audit Preparation
```
Export: With Gap Analysis (JSON)
Use: Detailed audit trail
Include: All fields, dates, notes
```

## 🔍 Search & Filter Examples

**Find all critical vendors without SOC 2**:
- Filter: Criticality = "Critical"
- Review each vendor's `hasSOC2` status
- Export list for follow-up

**Identify contracts expiring soon**:
- Sort by contract end date
- Review "Contract expires in X days" gaps
- Schedule renewal discussions

**High-risk vendors with data access**:
- Filter: Risk Level = "High" or "Critical"
- Filter: Data Access ≠ "None"
- Review privacy controls (DPA, BAA)

## 🎨 Customization Examples

### Industry-Specific Fields

**Healthcare**:
```typescript
// Add to dataTypes array
dataTypes: ['PHI', 'PII', 'Billing Data', 'Clinical Data']

// Additional compliance
hasHIPAACompliance: boolean
hasHITRUSTCertification: boolean
```

**Financial Services**:
```typescript
// Add to complianceFrameworks
complianceFrameworks: ['SOX', 'PCI-DSS', 'GLBA', 'FFIEC']

// Additional checks
hasPCIDSS: boolean
hasSOXControls: boolean
```

**Education**:
```typescript
// Add to dataTypes
dataTypes: ['Student Records', 'FERPA Data', 'Financial Aid']

// Additional compliance
hasFERPACompliance: boolean
hasCOPPACompliance: boolean
```

## 🔄 Integration Patterns

### With VendorSoluce
```typescript
// Export to VendorSoluce for detailed risk assessment
const riskProfiles = vendors.map(v => ({
  vendorId: v.id,
  riskScore: v.riskScore,
  gaps: v.gapAnalysis,
  dueForReview: v.nextReviewDate
}));
```

### With CyberCaution
```typescript
// Push gaps as remediation tasks
vendors.forEach(vendor => {
  vendor.gapAnalysis
    .filter(gap => gap.severity === 'Critical')
    .forEach(gap => {
      createCyberCautionTask({
        title: `${vendor.name}: ${gap.item}`,
        priority: 'High',
        category: gap.category
      });
    });
});
```

### With ERMITS Advisory
```typescript
// Aggregate for executive reporting
const portfolioRisk = {
  totalVendors: vendors.length,
  avgRiskScore: calculateAverage(vendors.map(v => v.riskScore)),
  criticalVendors: vendors.filter(v => v.criticality === 'Critical').length,
  openGaps: vendors.reduce((sum, v) => sum + v.gapAnalysis.length, 0)
};
```

## 🐛 Troubleshooting

### Import Issues

**Error: "Missing required field 'name'"**
```
Solution: Ensure every row has a vendor name
Check: Column mapped correctly to 'name' field
```

**Error: "Invalid date format"**
```
Solution: Use YYYY-MM-DD format (2024-01-15)
Avoid: MM/DD/YYYY, DD/MM/YYYY formats
```

**Error: "Boolean parse error"**
```
Solution: Use true/false, yes/no, or 1/0
Avoid: Y/N, TRUE/FALSE (all caps), x marks
```

### Performance Issues

**Slow filtering with 1000+ vendors**
```
Solution: Use specific search terms
Tip: Filter by criticality first, then search
```

**Export taking too long**
```
Solution: Export in batches
Tip: Filter before export to reduce size
```

### Data Quality Issues

**Duplicate vendors appearing**
```
Solution: Standardize naming before import
Tool: Use Excel TRIM() and PROPER() functions
```

**Inconsistent risk scores**
```
Solution: Verify all compliance fields updated
Action: Recalculate by editing and saving vendor
```

## 📚 Additional Resources

- **Full Documentation**: VendorRegisterManager_Documentation.md
- **CSV Template**: Download from "Import Register" dialog
- **Integration Guide**: ERMITS_Ecosystem_Integration.md
- **Support**: support@ermits.com

## ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + K`: Focus search
- `Ctrl/Cmd + I`: Open import dialog
- `Ctrl/Cmd + E`: Export vendors
- `Ctrl/Cmd + N`: Add new vendor
- `Esc`: Close dialogs

---

**Remember**: This tool follows the same approach as your Information Asset Manager - if you know one, you know both!

**Version**: 1.0.0  
**Last Updated**: November 2024
