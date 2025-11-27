# Data Inventory Tool - Quick Reference Guide

## 🚀 5-Minute Quick Start

### First Time Setup
```
1. Open DataInventoryTool.html in browser
2. Click "Add Data" button
3. Fill required fields: Name, Type, Owner, Location
4. Check applicable boxes (PII, Sensitive, etc.)
5. Click "Add to Inventory"
6. Done! Data is now tracked
```

### Import Existing Inventory
```
1. Click "Import Inventory"
2. Upload your CSV file
3. Map columns to fields
4. Preview data
5. Click "Import Data"
6. All items loaded!
```

---

## 📊 Dashboard Overview

### Inventory Tab (Main View)
- **Left Panel**: List of all data items
- **Right Panel**: Selected item details
- **Click Item**: View full details and characteristics

### Data Categories Tab
- **Distribution Cards**: Items by category
- **Detailed Views**: Assets grouped by category
- **Click Item**: Jump to inventory view

### Locations Tab
- **Location Cards**: Data by storage location
- **Summary Stats**: Sensitive/PII counts per location
- **Quick Navigation**: Click to view items

### Data Owners Tab
- **Owner Cards**: Data by custodian
- **Responsibility View**: Items per owner
- **Quick Access**: Click to view details

### Reports Tab
- **6 Export Options**: Complete, Sensitive, PII, Location, Ownership, JSON

---

## 🎯 Data Types Quick Guide

| Type | Use For | Examples |
|------|---------|----------|
| **Database** | SQL/NoSQL databases, data warehouses | MySQL, PostgreSQL, MongoDB, Snowflake |
| **File** | Documents, spreadsheets, archives | Excel files, PDFs, Word docs, archives |
| **System** | Applications, platforms, services | CRM, ERP, SharePoint, email systems |
| **API** | Web services, integrations | REST APIs, SOAP services, webhooks |
| **Cloud** | Cloud storage, SaaS data | S3, Azure Blob, Google Drive, Dropbox |
| **Other** | Everything else | IoT data, logs, temporary files |

---

## ✅ Data Characteristics Checklist

### Contains PII (Personal Identifiable Information)
**Check if data includes:**
- Names
- Email addresses
- Phone numbers
- Social Security Numbers
- Driver's license numbers
- IP addresses
- Biometric data
- Medical records
- Financial account numbers
- Government ID numbers

**Examples**: Customer database, employee records, patient files

---

### Sensitive Data
**Check if data includes:**
- Trade secrets
- Financial information
- Strategic plans
- Competitive intelligence
- Proprietary algorithms
- Unannounced products
- Contract terms
- Salary information

**Examples**: Financial reports, R&D data, contracts

---

### Regulated Data
**Check if subject to:**
- HIPAA (healthcare)
- PCI-DSS (payment cards)
- GLBA (financial services)
- FERPA (education records)
- SOX (financial reporting)
- Export controls (ITAR/EAR)
- Industry-specific regulations

**Examples**: Patient records, credit card data, student records

---

### Has Backup
**Check if:**
- Regular backups exist
- Backup tested recently
- Recovery procedure documented
- Backup stored offsite
- Retention policy defined

**Examples**: Production databases, critical files, customer data

---

## 📥 CSV Import Format

### Minimum Required Fields
```csv
name,type,owner,location
"Customer DB","Database","Sales","Salesforce"
```

### Recommended Full Format
```csv
name,type,description,owner,location,category,volume,dataSubjects,retention,containsPII,isSensitive,isRegulated,hasBackup
"Customer DB","Database","CRM system","Sales","Salesforce","Customer Data","2M records","Customers","7 years",true,true,false,true
```

### Boolean Values (All Accepted)
- `true`, `yes`, `1`, `TRUE`, `YES` = ✅ Checked
- `false`, `no`, `0`, `FALSE`, `NO` = ❌ Unchecked

---

## 📤 Export Scenarios

### Scenario 1: Executive Dashboard
**Export**: Complete Inventory (JSON)  
**Use**: Feed into BI tools, dashboards  
**Frequency**: Weekly

### Scenario 2: Privacy Compliance
**Export**: PII Inventory Report  
**Use**: GDPR/CCPA compliance documentation  
**Frequency**: Quarterly

### Scenario 3: Risk Assessment
**Export**: Sensitive Data Report  
**Use**: Identify high-risk data for protection  
**Frequency**: Monthly

### Scenario 4: Cloud Migration
**Export**: Data Location Report  
**Use**: Plan on-premise to cloud migration  
**Frequency**: Project-based

### Scenario 5: Accountability
**Export**: Ownership Report  
**Use**: Assign responsibilities, track ownership  
**Frequency**: Quarterly

### Scenario 6: Daily Backup
**Export**: Complete Inventory (CSV)  
**Use**: Save work before closing browser  
**Frequency**: End of each session

---

## 🔍 Search & Filter Tips

### Quick Searches
- Type data name: `Customer`
- Type owner: `IT Department`
- Type location: `AWS`
- Type category: `financial`

### Useful Filter Combinations

**Find All PII Data**
```
Sensitivity: Contains PII
→ Shows all personal data
```

**Find Sensitive Cloud Data**
```
Type: Cloud Storage
Sensitivity: Contains Sensitive Data
→ Shows cloud-based sensitive data
```

**Find Databases Without Backups**
```
Type: Database
Search: (manually review "Has Backup" field)
→ Identify backup gaps
```

**Find All Regulated Data**
```
Sensitivity: (manually review for regulated flag)
→ Compliance scope
```

---

## 📈 Documentation Score Guide

### Score Calculation
- Each of 8 fields = 12.5% (100% total)
- Name (required) = 12.5%
- Description = 12.5%
- Owner (required) = 12.5%
- Location (required) = 12.5%
- Category = 12.5%
- Volume = 12.5%
- Data Subjects = 12.5%
- Retention Period = 12.5%

### Score Interpretation

| Score | Status | Priority | Action Needed |
|-------|--------|----------|---------------|
| **88-100%** | ✅ Excellent | Low | Maintain quality |
| **75-87%** | 🟢 Good | Low | Fill 1-2 gaps |
| **50-74%** | 🟡 Fair | Medium | Add 2-4 details |
| **< 50%** | 🔴 Poor | High | Urgent - document fully |

### Target Scores by Data Type

| Type | Minimum Target | Ideal Target |
|------|----------------|--------------|
| **Database** | 75% (6/8) | 100% (8/8) |
| **System** | 75% (6/8) | 88% (7/8) |
| **File** | 63% (5/8) | 75% (6/8) |
| **API** | 63% (5/8) | 75% (6/8) |
| **Cloud** | 75% (6/8) | 88% (7/8) |

---

## 🚨 Common Patterns & Solutions

### Pattern: Low Documentation Scores (avg <60%)
**Impact**: Incomplete data inventory, compliance gaps  
**Solution**: Set documentation sprint, assign owners  
**Priority**: High  
**Time**: 1 week team effort

### Pattern: No PII Flagging (all unchecked)
**Impact**: Cannot demonstrate GDPR/CCPA compliance  
**Solution**: Review each item, flag PII systematically  
**Priority**: Critical  
**Time**: 2-4 hours

### Pattern: Missing Volume Information (70% blank)
**Impact**: Cannot assess storage costs or risks  
**Solution**: Query system administrators, document sizes  
**Priority**: Medium  
**Time**: 1-2 days

### Pattern: Undefined Retention Periods (80% blank)
**Impact**: Excessive data retention, compliance risk  
**Solution**: Define retention policy, apply to inventory  
**Priority**: High  
**Time**: 1 week (policy + implementation)

### Pattern: No Backup Flags (all unchecked)
**Impact**: Business continuity risk unknown  
**Solution**: Verify backup status, update inventory  
**Priority**: High  
**Time**: 2-3 days

---

## 🔄 Daily Workflow

### Morning (5 minutes)
```
1. Import yesterday's export
2. Review statistics dashboard
3. Check for new data discoveries
4. Plan documentation tasks
```

### Throughout Day (as needed)
```
- Add newly discovered data
- Update characteristics as learned
- Document volumes/sizes
- Flag PII/sensitive items
```

### End of Day (3 minutes)
```
1. Review today's additions
2. Export complete inventory
3. Save file: data-inventory-YYYY-MM-DD.csv
4. Close browser
```

---

## 📅 Periodic Reviews

### Weekly (30 minutes)
- Review new items added
- Check documentation scores
- Update missing information
- Export inventory snapshot

### Monthly (1 hour)
- Review data categories
- Update volume information
- Verify ownership assignments
- Generate all reports
- Share with stakeholders

### Quarterly (2 hours)
- Comprehensive inventory audit
- Update retention periods
- Review location distribution
- Validate PII flags
- Export full package (all 6 reports)

### Annually (4 hours)
- Complete data inventory review
- Update all characteristics
- Validate backup status
- Compliance check
- Archive annual snapshot

---

## 🎯 Regulatory Compliance Quick Checks

### GDPR Article 30 (Records of Processing)
✅ Data inventory complete?  
✅ Data subjects documented?  
✅ Retention periods defined?  
✅ Export: Complete Inventory

### CCPA Compliance
✅ Consumer data cataloged?  
✅ PII flagged?  
✅ Categories documented?  
✅ Export: PII Inventory Report

### Data Protection Impact Assessment (DPIA) Trigger
✅ High-risk data identified?  
✅ Sensitive/PII data flagged?  
✅ Volume documented?  
✅ Export: Sensitive Data Report

### SOC 2 / ISO 27001 Asset Management
✅ All data assets cataloged?  
✅ Ownership assigned?  
✅ Locations documented?  
✅ Export: Complete Inventory

---

## ⚡ Keyboard Shortcuts & Tips

### Navigation
- **Tab**: Move between form fields
- **Enter**: Submit forms
- **Esc**: Close dialogs
- **Ctrl+F**: Browser find (search data)

### Efficiency Tips
1. **Use filters first** before searching for speed
2. **Batch similar items** for consistent categorization
3. **Export frequently** to never lose work
4. **Set naming conventions** early for consistency
5. **Document as you discover** rather than in batches

---

## 🔧 Quick Troubleshooting

| Problem | Quick Fix |
|---------|-----------|
| **Data disappeared** | Import yesterday's export (always export before closing!) |
| **Import fails** | Check CSV format, UTF-8 encoding, required fields (name, type, owner, location) |
| **Export not working** | Allow popups, check browser permissions, try Chrome |
| **Scores wrong** | Verify all 8 fields populated, check for empty strings |
| **Slow performance** | Close other tabs, clear browser cache, reduce data volume |

---

## 📞 Quick Reference

### File Locations
- **Production File**: DataInventoryTool.html
- **Daily Exports**: Save to: data-inventory-YYYY-MM-DD.csv
- **Documentation**: DataInventoryTool_README.md
- **Sample Data**: Data_Inventory_Template.csv

### Statistics Tracked (7 Key Metrics)
1. Total Items
2. Databases
3. Files
4. Systems
5. Contains PII
6. Sensitive
7. % Documented (average)

---

## ✅ Quick Checklist Templates

### New Data Item Checklist
- [ ] Name documented
- [ ] Type selected
- [ ] Owner identified
- [ ] Location documented
- [ ] Description added
- [ ] Category assigned
- [ ] Volume/size noted
- [ ] Data subjects listed
- [ ] Retention period defined
- [ ] PII flag checked (if applicable)
- [ ] Sensitive flag checked (if applicable)
- [ ] Regulated flag checked (if applicable)
- [ ] Backup status verified

### PII Identification Checklist
Does this data include:
- [ ] Names?
- [ ] Contact information?
- [ ] Government IDs?
- [ ] Financial account numbers?
- [ ] Health information?
- [ ] Biometric data?
- [ ] Location data?
- [ ] Online identifiers?

If **any** answer is "Yes" → Check "Contains PII"!

### Sensitivity Checklist
Does this data include:
- [ ] Trade secrets?
- [ ] Financial information?
- [ ] Strategic plans?
- [ ] Proprietary information?
- [ ] Competitive intelligence?
- [ ] Confidential agreements?
- [ ] Salary/compensation?
- [ ] Security details?

If **any** answer is "Yes" → Check "Sensitive Data"!

### Monthly Review Checklist
- [ ] Import current inventory
- [ ] Review new items (past 30 days)
- [ ] Check documentation scores
- [ ] Update missing information
- [ ] Verify ownership assignments
- [ ] Review location distribution
- [ ] Export all reports
- [ ] Save monthly snapshot
- [ ] Share updates with stakeholders

---

## 💡 Pro Tips

### Discovery Phase
1. ✅ Start with known systems, expand outward
2. ✅ Interview department heads
3. ✅ Check IT asset inventory
4. ✅ Review cloud subscriptions
5. ✅ Audit file shares and drives

### Documentation Quality
1. ✅ Use consistent naming: "System Name - Component"
2. ✅ Be specific in descriptions (what, why, who uses)
3. ✅ Document actual volumes, not estimates
4. ✅ List all data subjects (customers, employees, partners)
5. ✅ Define retention in business terms (7 years, permanent, etc.)

### Organization
1. ✅ Use standard categories (Customer Data, Financial, Personnel, etc.)
2. ✅ Standardize location names (AWS US-East-1, On-Premise DC1)
3. ✅ Assign primary owners (one person/dept per item)
4. ✅ Group related data logically
5. ✅ Review and consolidate quarterly

### Compliance
1. ✅ Flag all PII immediately upon discovery
2. ✅ Document regulated data clearly
3. ✅ Verify backup status for critical data
4. ✅ Define retention for all items
5. ✅ Export reports quarterly for audits

---

## 📚 Field-by-Field Guide

### Name (Required)
**What**: Clear, descriptive name for the data  
**Examples**: "Customer CRM Database", "Employee Payroll Files"  
**Tips**: Include system name if part of larger platform

### Type (Required)
**What**: Technical category of the data  
**Options**: Database, File, System, API, Cloud, Other  
**Tips**: Choose most specific type available

### Description
**What**: What the data contains and why it exists  
**Examples**: "Customer contact info and purchase history for marketing"  
**Tips**: Include business purpose, 1-2 sentences

### Owner/Custodian (Required)
**What**: Department or person responsible  
**Examples**: "IT Department", "Jane Smith - Finance"  
**Tips**: Use consistent naming, assign one primary owner

### Location (Required)
**What**: Physical or logical storage location  
**Examples**: "AWS S3", "On-Premise Data Center", "SharePoint Online"  
**Tips**: Be specific, include region if cloud

### Category
**What**: Business category of data  
**Examples**: "Customer Data", "Financial", "Personnel", "Marketing"  
**Tips**: Use standardized categories across organization

### Volume
**What**: Size or quantity of data  
**Examples**: "500GB", "2M records", "15K files"  
**Tips**: Update annually, use consistent units

### Data Subjects
**What**: People or entities the data is about  
**Examples**: "Customers", "Employees", "Vendors", "Partners"  
**Tips**: List all applicable, comma-separated

### Retention Period
**What**: How long data is kept  
**Examples**: "7 years", "Life of relationship + 3 years", "Permanent"  
**Tips**: Align with legal/regulatory requirements

---

## 🎯 Goal Setting

### Short-Term Goals (1-2 weeks)
- [ ] Catalog top 20 most critical data sources
- [ ] Flag all PII-containing systems
- [ ] Assign owners to all items
- [ ] Achieve 70% average documentation score

### Medium-Term Goals (1-3 months)
- [ ] Complete inventory of all major systems
- [ ] Document all retention periods
- [ ] Achieve 80% average documentation score
- [ ] Generate monthly compliance reports

### Long-Term Goals (6-12 months)
- [ ] Comprehensive inventory (100+ items)
- [ ] 90%+ average documentation score
- [ ] Quarterly audit-ready reports
- [ ] Integration with CMDB/asset management

---

## 📖 Usage Examples

### Example 1: Quick Add
```
Name: Customer Database
Type: Database
Owner: Sales Department
Location: Salesforce Cloud
[Check] Contains PII
[Check] Has Backup

Result: 63% documented (5/8 fields)
```

### Example 2: Complete Documentation
```
Name: Customer Database
Type: Database
Description: CRM with contact info and purchase history
Owner: Sales Department
Location: Salesforce Cloud
Category: Customer Data
Volume: 2.5M records
Data Subjects: Customers, Prospects
Retention: 7 years after last contact
[Check] Contains PII
[Check] Sensitive Data
[Check] Has Backup

Result: 100% documented (8/8 fields)
```

### Example 3: Batch Import
```
1. Prepare CSV with 50 data items
2. Import via "Import Inventory"
3. Map all 13 fields
4. Review preview
5. Import complete in <5 seconds
6. Review inventory tab
7. Export for backup
```

---

## 🚀 Quick Start Paths

### Path 1: Single Item Test (2 minutes)
```
1. Open tool
2. Click "Add Data"
3. Fill 4 required fields
4. Click "Add to Inventory"
5. View in list
6. Click to see details
```

### Path 2: Sample Data Test (3 minutes)
```
1. Open tool
2. Click "Import Inventory"
3. Upload Data_Inventory_Template.csv
4. Map fields (auto-detected)
5. Click through preview
6. Import 20 items
7. Explore all dashboards
```

### Path 3: Production Use (30 minutes)
```
1. Review documentation
2. Prepare initial inventory list (10-20 items)
3. Create CSV or add manually
4. Import/add all items
5. Review completeness scores
6. Fill missing details
7. Export and save
8. Set recurring reminder to export
```

---

**Version**: 1.0.0  
**Last Updated**: November 2024  
**Next Review**: Quarterly

---

**Quick Start**: Open DataInventoryTool.html → Add Data → Export before closing!

**Critical Reminder**: Data stored in browser memory only - ALWAYS export before closing!
