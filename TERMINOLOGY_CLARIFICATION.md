# Terminology Clarification: CyberSoluce Asset Manager

## Purpose
This document clarifies terminology used in CyberSoluce Asset Manager to avoid confusion with other ERMITS products, particularly security assessment platforms.

---

## Key Terminology

### ✅ **Asset Inventory Management**
**What it means:** Tracking and managing digital assets (servers, databases, applications, data, etc.)

**What it stores:**
- Asset metadata (name, type, owner, location, IP address)
- Asset relationships and dependencies
- Vulnerabilities associated with assets
- Compliance framework mappings
- Risk scores (calculated automatically)

**What it does NOT store:**
- Security assessment questionnaire answers
- Assessment progress or completion status
- User responses to security questions

---

### ✅ **Risk Assessment / Risk Analysis**
**What it means:** Automated calculation of risk scores for assets based on:
- Asset criticality level
- Associated vulnerabilities
- Compliance status
- Data classification
- Other risk factors

**How it works:**
- Automated calculation (no user input required)
- Risk scores range from 0-100
- Displayed in dashboards and reports

**What it is NOT:**
- A security questionnaire or assessment form
- A tool for conducting security assessments
- A platform for storing assessment answers

**Example:** "Asset Risk Analysis" shows breakdown of assets by criticality level (Critical, High, Medium, Low)

---

### ✅ **Compliance Evaluation / Compliance Check**
**What it means:** Automated checking of whether assets meet compliance framework requirements (SOC 2, ISO 27001, GDPR, HIPAA, PCI-DSS, etc.)

**How it works:**
- Automated gap analysis
- Compliance status tracking
- Framework requirement mapping

**What it is NOT:**
- A compliance assessment questionnaire
- A tool for conducting compliance assessments
- A platform for storing compliance assessment answers

**Example:** "SOC 2 compliance evaluation completed" means automated check was performed

---

### ✅ **Free Tools / Asset Evaluation Tools**
**What it means:** Standalone browser-based tools for:
- Data inventory management
- Information asset register
- Vendor risk management

**What they are:**
- Browser-based HTML tools (no installation)
- Privacy-first (client-side processing)
- Export/import capabilities

**What they are NOT:**
- Security assessment questionnaires
- Part of the main Asset Manager platform
- Stored in the database

**Location:** `/tools/` directory (standalone HTML files)

---

## ❌ What This Platform Does NOT Do

### Security Assessments
CyberSoluce Asset Manager does **NOT**:
- Conduct security assessments
- Store security assessment questionnaire answers
- Track assessment progress or completion
- Provide security assessment forms

**For security assessments, see:** CyberCaution™ platform

### Assessment Questionnaires
This platform does **NOT**:
- Ask users security questions
- Store user responses to security questions
- Calculate scores based on user answers
- Generate recommendations based on questionnaire responses

---

## Comparison with Other ERMITS Products

### CyberSoluce Asset Manager (This Platform)
- **Purpose:** Asset inventory management
- **Data:** Assets, vulnerabilities, relationships, compliance status
- **Assessments:** Automated risk scoring and compliance evaluation
- **Storage:** Supabase (PostgreSQL database)

### CyberCaution Platform
- **Purpose:** Security assessments and ransomware defense
- **Data:** Assessment questionnaire answers, assessment progress, scores
- **Assessments:** Security assessment questionnaires (Zero Trust, Incident Response, etc.)
- **Storage:** localStorage (no database required)

---

## Code References

### Where "Assessment" Appears (Clarified)

1. **DashboardHome.tsx**
   - "Asset Risk Analysis" - Automated risk scoring display
   - "Compliance evaluation" - Automated compliance checking

2. **HomePage.tsx**
   - "Risk Analysis & Analytics" - Automated risk analysis features
   - "Asset evaluation tools" - Browser-based tools for asset management

3. **NavigationSidebar.tsx**
   - "Browser-based asset evaluation tools" - Free tools section

4. **AssetInventoryContext.tsx**
   - Manages asset inventory data
   - Calculates automated risk scores
   - Tracks compliance status

---

## Summary

| Term | Meaning in Asset Manager | What It's NOT |
|------|-------------------------|---------------|
| **Risk Assessment** | Automated risk scoring of assets | Security questionnaire |
| **Compliance Assessment** | Automated compliance checking | Compliance questionnaire |
| **Assessment Tools** | Browser-based asset evaluation tools | Security assessment forms |
| **Asset Assessment** | Evaluating assets in inventory | Conducting security assessments |

---

## Questions?

If you're looking for:
- **Security assessment questionnaires** → See CyberCaution platform
- **Asset inventory management** → You're in the right place (this platform)
- **Automated risk scoring** → This platform provides this
- **Compliance evaluation** → This platform provides this

---

**Last Updated:** 2025-01-27  
**Platform:** CyberSoluce™ Asset Manager by ERMITS LLC

