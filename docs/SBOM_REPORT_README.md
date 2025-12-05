# SBOM Report Generator

This directory contains a professional Software Bill of Materials (SBOM) report generator for the CyberSoluce Asset Manager project.

## Generated Report

**File:** `SBOM_Report_CyberSoluce_AssetManager.pdf`

This comprehensive PDF report includes:
- Executive Summary
- Project Information
- Complete Component Inventory (Production & Development dependencies)
- License Information and Distribution
- Security & Vulnerability Assessment
- Compliance & Risk Analysis
- Recommendations
- Appendices

## Regenerating the Report

To regenerate the SBOM report with updated information:

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements-sbom.txt
   ```

2. **Run the generator:**
   ```bash
   python generate-sbom-report.py
   ```

The report will be generated as `SBOM_Report_CyberSoluce_AssetManager.pdf` in the project root.

## Customization

You can customize the report by editing `generate-sbom-report.py`:
- Update `PROJECT_INFO` dictionary for project metadata
- Modify `DEPENDENCIES` dictionary to reflect current dependencies
- Adjust styling and formatting in the `create_custom_styles()` function
- Add additional sections as needed

## Report Contents

### 1. Executive Summary
High-level overview of the SBOM, component counts, and key metrics.

### 2. Project Information
Detailed project metadata including version, vendor, technology stack, and build information.

### 3. Component Inventory
Complete listing of all dependencies organized by:
- Production Dependencies (24 components)
- Development Dependencies (16 components)

Each entry includes:
- Component Name
- Version
- License Type
- Component Type/Category

### 4. License Information
- License distribution statistics
- License type summaries
- Compliance considerations

### 5. Security & Vulnerability Assessment
- Vulnerability management recommendations
- Critical dependency identification
- Security best practices

### 6. Compliance & Risk Analysis
- Regulatory compliance support (NIST, SOC 2, ISO 27001)
- Supply chain risk assessment
- Risk mitigation strategies

### 7. Recommendations
- Immediate actions
- Long-term improvements
- Best practices

### 8. Appendices
- SBOM format standards
- Glossary of terms
- Contact information

## Use Cases

This SBOM report is essential for:
- **Security Audits:** Identify and track vulnerabilities in dependencies
- **License Compliance:** Ensure legal compliance with open-source licenses
- **Supply Chain Security:** Assess and manage third-party risks
- **Regulatory Compliance:** Support NIST, SOC 2, ISO 27001 requirements
- **Incident Response:** Quick reference for forensic analysis
- **Vendor Management:** Document third-party dependencies for procurement

## Notes

- The report is based on dependencies listed in `package.json`
- For current vulnerability information, run `npm audit` and update the report
- The report should be regenerated when dependencies are added, removed, or updated
- Consider automating SBOM generation in your CI/CD pipeline

## Standards Compliance

This SBOM report follows industry standards:
- **SPDX** (Software Package Data Exchange)
- **CycloneDX**
- **SWID** (Software Identification) tags

---

**Generated:** 2024
**Report Version:** 1.0
**Project:** CyberSoluce Asset Manager v1.0.0

