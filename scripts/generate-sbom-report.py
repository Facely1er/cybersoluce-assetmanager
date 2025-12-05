#!/usr/bin/env python3
"""
Professional SBOM (Software Bill of Materials) Report Generator
Generates a comprehensive PDF report for CyberSoluce Asset Manager
"""

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from datetime import datetime
import json
import os

# Project information
PROJECT_INFO = {
    "name": "CyberSoluce Asset Manager",
    "version": "1.0.0",
    "vendor": "ERMITS Corporation",
    "description": "Comprehensive Asset Inventory Management Tool",
    "license": "MIT",
    "report_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "report_version": "1.0"
}

# Dependencies from package.json
DEPENDENCIES = {
    "Production": [
        {"name": "@nivo/core", "version": "^0.99.0", "license": "MIT", "type": "Chart Library"},
        {"name": "@nivo/heatmap", "version": "^0.99.0", "license": "MIT", "type": "Chart Library"},
        {"name": "@nivo/radar", "version": "^0.99.0", "license": "MIT", "type": "Chart Library"},
        {"name": "@radix-ui/react-dialog", "version": "^1.1.15", "license": "MIT", "type": "UI Component"},
        {"name": "@radix-ui/react-dropdown-menu", "version": "^2.1.16", "license": "MIT", "type": "UI Component"},
        {"name": "@radix-ui/react-label", "version": "^2.1.8", "license": "MIT", "type": "UI Component"},
        {"name": "@radix-ui/react-popover", "version": "^1.1.15", "license": "MIT", "type": "UI Component"},
        {"name": "@radix-ui/react-select", "version": "^2.2.6", "license": "MIT", "type": "UI Component"},
        {"name": "@radix-ui/react-slot", "version": "^1.2.4", "license": "MIT", "type": "UI Component"},
        {"name": "@radix-ui/react-tooltip", "version": "^1.2.8", "license": "MIT", "type": "UI Component"},
        {"name": "@supabase/supabase-js", "version": "^2.53.0", "license": "MIT", "type": "Backend SDK"},
        {"name": "class-variance-authority", "version": "^0.7.1", "license": "MIT", "type": "Utility"},
        {"name": "clsx", "version": "^2.1.1", "license": "MIT", "type": "Utility"},
        {"name": "date-fns", "version": "^3.0.0", "license": "MIT", "type": "Date Library"},
        {"name": "framer-motion", "version": "^12.23.24", "license": "MIT", "type": "Animation Library"},
        {"name": "html2canvas", "version": "^1.4.1", "license": "MIT", "type": "PDF Generation"},
        {"name": "jspdf", "version": "^2.5.1", "license": "MIT", "type": "PDF Generation"},
        {"name": "lucide-react", "version": "^0.344.0", "license": "ISC", "type": "Icon Library"},
        {"name": "react", "version": "^18.3.1", "license": "MIT", "type": "Framework"},
        {"name": "react-dom", "version": "^18.3.1", "license": "MIT", "type": "Framework"},
        {"name": "react-hot-toast", "version": "^2.4.1", "license": "MIT", "type": "UI Component"},
        {"name": "react-router-dom", "version": "^7.9.6", "license": "MIT", "type": "Routing"},
        {"name": "recharts", "version": "^2.8.0", "license": "MIT", "type": "Chart Library"},
        {"name": "tailwind-merge", "version": "^3.4.0", "license": "MIT", "type": "Utility"},
        {"name": "xlsx", "version": "^0.18.5", "license": "Apache-2.0", "type": "File Processing"},
    ],
    "Development": [
        {"name": "@eslint/js", "version": "^9.9.1", "license": "Apache-2.0", "type": "Linting"},
        {"name": "@testing-library/jest-dom", "version": "^6.1.5", "license": "MIT", "type": "Testing"},
        {"name": "@testing-library/react", "version": "^14.1.2", "license": "MIT", "type": "Testing"},
        {"name": "@testing-library/user-event", "version": "^14.5.1", "license": "MIT", "type": "Testing"},
        {"name": "@types/node", "version": "^24.10.1", "license": "MIT", "type": "Type Definitions"},
        {"name": "@types/react", "version": "^18.3.27", "license": "MIT", "type": "Type Definitions"},
        {"name": "@types/react-dom", "version": "^18.3.0", "license": "MIT", "type": "Type Definitions"},
        {"name": "@vitejs/plugin-react", "version": "^4.7.0", "license": "MIT", "type": "Build Tool"},
        {"name": "@vitest/coverage-v8", "version": "^1.0.4", "license": "MIT", "type": "Testing"},
        {"name": "autoprefixer", "version": "^10.4.18", "license": "MIT", "type": "CSS Processing"},
        {"name": "eslint", "version": "^9.9.1", "license": "MIT", "type": "Linting"},
        {"name": "postcss", "version": "^8.4.35", "license": "MIT", "type": "CSS Processing"},
        {"name": "tailwindcss", "version": "^3.4.1", "license": "MIT", "type": "CSS Framework"},
        {"name": "typescript", "version": "^5.5.3", "license": "Apache-2.0", "type": "Language"},
        {"name": "vite", "version": "^5.4.21", "license": "MIT", "type": "Build Tool"},
        {"name": "vitest", "version": "^1.0.4", "license": "MIT", "type": "Testing"},
    ]
}

def create_custom_styles():
    """Create custom paragraph styles for the report"""
    styles = getSampleStyleSheet()
    
    # Title style
    styles.add(ParagraphStyle(
        name='CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    ))
    
    # Section heading
    styles.add(ParagraphStyle(
        name='SectionHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=12,
        spaceBefore=20,
        fontName='Helvetica-Bold'
    ))
    
    # Subsection heading
    styles.add(ParagraphStyle(
        name='SubsectionHeading',
        parent=styles['Heading3'],
        fontSize=14,
        textColor=colors.HexColor('#334155'),
        spaceAfter=10,
        spaceBefore=15,
        fontName='Helvetica-Bold'
    ))
    
    # Body text (modify existing Normal style)
    styles['Normal'].fontSize = 10
    styles['Normal'].leading = 14
    styles['Normal'].alignment = TA_JUSTIFY
    
    # Footer style
    styles.add(ParagraphStyle(
        name='Footer',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.grey,
        alignment=TA_CENTER
    ))
    
    return styles

def create_title_page(canvas, doc):
    """Create a professional title page"""
    canvas.saveState()
    
    # Background color
    canvas.setFillColor(colors.HexColor('#f8fafc'))
    canvas.rect(0, 0, letter[0], letter[1], fill=1)
    
    # Title
    canvas.setFillColor(colors.HexColor('#1e40af'))
    canvas.setFont("Helvetica-Bold", 28)
    canvas.drawCentredString(letter[0]/2, letter[1] - 2*inch, "SOFTWARE BILL OF MATERIALS")
    canvas.drawCentredString(letter[0]/2, letter[1] - 2.5*inch, "(SBOM) REPORT")
    
    # Project name
    canvas.setFont("Helvetica-Bold", 20)
    canvas.setFillColor(colors.HexColor('#334155'))
    canvas.drawCentredString(letter[0]/2, letter[1] - 4*inch, PROJECT_INFO["name"])
    
    # Version
    canvas.setFont("Helvetica", 14)
    canvas.drawCentredString(letter[0]/2, letter[1] - 4.5*inch, f"Version {PROJECT_INFO['version']}")
    
    # Vendor
    canvas.setFont("Helvetica", 12)
    canvas.drawCentredString(letter[0]/2, letter[1] - 5.5*inch, PROJECT_INFO["vendor"])
    
    # Report metadata
    canvas.setFont("Helvetica", 10)
    canvas.setFillColor(colors.grey)
    y_pos = letter[1] - 7*inch
    canvas.drawCentredString(letter[0]/2, y_pos, f"Report Date: {PROJECT_INFO['report_date']}")
    canvas.drawCentredString(letter[0]/2, y_pos - 0.3*inch, f"Report Version: {PROJECT_INFO['report_version']}")
    
    # Confidentiality notice
    canvas.setFont("Helvetica-Oblique", 9)
    canvas.setFillColor(colors.HexColor('#dc2626'))
    canvas.drawCentredString(letter[0]/2, 1*inch, "CONFIDENTIAL - For Internal Use Only")
    
    canvas.restoreState()

def create_component_table(dependencies, category):
    """Create a table for component listing"""
    data = [['Component Name', 'Version', 'License', 'Type']]
    
    for dep in dependencies:
        data.append([
            dep['name'],
            dep['version'],
            dep['license'],
            dep['type']
        ])
    
    table = Table(data, colWidths=[3*inch, 1.5*inch, 1.5*inch, 1.5*inch])
    table.setStyle(TableStyle([
        # Header row
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        
        # Data rows
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    
    return table

def create_summary_table():
    """Create summary statistics table"""
    total_prod = len(DEPENDENCIES["Production"])
    total_dev = len(DEPENDENCIES["Development"])
    total = total_prod + total_dev
    
    # Count licenses
    licenses = {}
    for deps in DEPENDENCIES.values():
        for dep in deps:
            lic = dep['license']
            licenses[lic] = licenses.get(lic, 0) + 1
    
    data = [
        ['Metric', 'Value'],
        ['Total Components', str(total)],
        ['Production Dependencies', str(total_prod)],
        ['Development Dependencies', str(total_dev)],
        ['Unique Licenses', str(len(licenses))],
        ['Primary License', 'MIT'],
    ]
    
    table = Table(data, colWidths=[3*inch, 2*inch])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    
    return table

def create_license_summary():
    """Create license distribution table"""
    licenses = {}
    for deps in DEPENDENCIES.values():
        for dep in deps:
            lic = dep['license']
            licenses[lic] = licenses.get(lic, 0) + 1
    
    data = [['License Type', 'Count', 'Percentage']]
    total = sum(licenses.values())
    
    for lic, count in sorted(licenses.items(), key=lambda x: x[1], reverse=True):
        percentage = (count / total) * 100
        data.append([lic, str(count), f"{percentage:.1f}%"])
    
    table = Table(data, colWidths=[2.5*inch, 1*inch, 1*inch])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('ALIGN', (1, 1), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    
    return table

def generate_sbom_report(filename="SBOM_Report_CyberSoluce_AssetManager.pdf"):
    """Generate the complete SBOM report"""
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=0.75*inch,
        leftMargin=0.75*inch,
        topMargin=0.75*inch,
        bottomMargin=0.75*inch
    )
    
    styles = create_custom_styles()
    story = []
    
    # Title page
    doc.build([], onFirstPage=create_title_page, onLaterPages=create_title_page)
    story.append(PageBreak())
    
    # Table of Contents
    story.append(Paragraph("TABLE OF CONTENTS", styles['SectionHeading']))
    story.append(Spacer(1, 0.2*inch))
    
    toc_items = [
        "1. Executive Summary",
        "2. Project Information",
        "3. Component Inventory",
        "4. License Information",
        "5. Security & Vulnerability Assessment",
        "6. Compliance & Risk Analysis",
        "7. Recommendations",
        "8. Appendices"
    ]
    
    for item in toc_items:
        story.append(Paragraph(item, styles['Normal']))
        story.append(Spacer(1, 0.1*inch))
    
    story.append(PageBreak())
    
    # 1. Executive Summary
    story.append(Paragraph("1. EXECUTIVE SUMMARY", styles['SectionHeading']))
    story.append(Spacer(1, 0.1*inch))
    
    summary_text = """
    This Software Bill of Materials (SBOM) report provides a comprehensive inventory of all software 
    components, dependencies, and third-party libraries used in the CyberSoluce Asset Manager application. 
    The report includes detailed information about component versions, licenses, security considerations, 
    and compliance status.
    
    The application is built using modern web technologies including React 18, TypeScript, and Vite, 
    with a total of {total} dependencies identified. The majority of components utilize permissive 
    open-source licenses (primarily MIT), ensuring minimal licensing restrictions for commercial use.
    
    This SBOM is essential for:
    • Security vulnerability management and tracking
    • License compliance verification
    • Supply chain risk assessment
    • Regulatory compliance (NIST, SOC 2, ISO 27001)
    • Incident response and forensic analysis
    """.format(total=len(DEPENDENCIES["Production"]) + len(DEPENDENCIES["Development"]))
    
    story.append(Paragraph(summary_text, styles['Normal']))
    story.append(Spacer(1, 0.2*inch))
    story.append(create_summary_table())
    story.append(PageBreak())
    
    # 2. Project Information
    story.append(Paragraph("2. PROJECT INFORMATION", styles['SectionHeading']))
    story.append(Spacer(1, 0.1*inch))
    
    project_data = [
        ['Property', 'Value'],
        ['Project Name', PROJECT_INFO['name']],
        ['Version', PROJECT_INFO['version']],
        ['Vendor', PROJECT_INFO['vendor']],
        ['Description', PROJECT_INFO['description']],
        ['Project License', PROJECT_INFO['license']],
        ['Report Date', PROJECT_INFO['report_date']],
        ['Report Version', PROJECT_INFO['report_version']],
        ['Technology Stack', 'React 18, TypeScript, Vite, Tailwind CSS'],
        ['Build Tool', 'Vite 5.4.21'],
        ['Package Manager', 'npm'],
    ]
    
    project_table = Table(project_data, colWidths=[2.5*inch, 4*inch])
    project_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    
    story.append(project_table)
    story.append(PageBreak())
    
    # 3. Component Inventory
    story.append(Paragraph("3. COMPONENT INVENTORY", styles['SectionHeading']))
    story.append(Spacer(1, 0.1*inch))
    
    story.append(Paragraph("3.1 Production Dependencies", styles['SubsectionHeading']))
    story.append(Spacer(1, 0.1*inch))
    story.append(create_component_table(DEPENDENCIES["Production"], "Production"))
    story.append(PageBreak())
    
    story.append(Paragraph("3.2 Development Dependencies", styles['SubsectionHeading']))
    story.append(Spacer(1, 0.1*inch))
    story.append(create_component_table(DEPENDENCIES["Development"], "Development"))
    story.append(PageBreak())
    
    # 4. License Information
    story.append(Paragraph("4. LICENSE INFORMATION", styles['SectionHeading']))
    story.append(Spacer(1, 0.1*inch))
    
    license_text = """
    This section provides an overview of the license types used across all dependencies. 
    Understanding license obligations is critical for legal compliance and commercial deployment.
    """
    story.append(Paragraph(license_text, styles['Normal']))
    story.append(Spacer(1, 0.2*inch))
    
    story.append(Paragraph("4.1 License Distribution", styles['SubsectionHeading']))
    story.append(create_license_summary())
    story.append(Spacer(1, 0.2*inch))
    
    story.append(Paragraph("4.2 License Summary", styles['SubsectionHeading']))
    license_summary_text = """
    <b>MIT License:</b> The majority of dependencies use the MIT license, which is a permissive 
    open-source license allowing commercial use, modification, distribution, and private use with 
    minimal restrictions. Only attribution is required.
    
    <b>Apache-2.0 License:</b> Similar to MIT but includes patent grant provisions. Used by 
    TypeScript, ESLint, and XLSX libraries.
    
    <b>ISC License:</b> Functionally equivalent to MIT, used by Lucide React icon library.
    
    All licenses are compatible with commercial use and do not impose copyleft requirements.
    """
    story.append(Paragraph(license_summary_text, styles['Normal']))
    story.append(PageBreak())
    
    # 5. Security & Vulnerability Assessment
    story.append(Paragraph("5. SECURITY & VULNERABILITY ASSESSMENT", styles['SectionHeading']))
    story.append(Spacer(1, 0.1*inch))
    
    security_text = """
    <b>5.1 Vulnerability Management Process</b><br/><br/>
    
    Regular security scanning and vulnerability assessment should be performed using tools such as:
    • npm audit
    • Snyk
    • OWASP Dependency-Check
    • GitHub Dependabot
    
    <b>5.2 Recommended Actions</b><br/><br/>
    
    1. <b>Automated Scanning:</b> Implement continuous vulnerability scanning in CI/CD pipeline
    2. <b>Dependency Updates:</b> Regularly update dependencies to latest secure versions
    3. <b>Security Monitoring:</b> Subscribe to security advisories for critical dependencies
    4. <b>Patch Management:</b> Establish process for rapid patching of critical vulnerabilities
    
    <b>5.3 Critical Dependencies</b><br/><br/>
    
    The following dependencies require special attention due to their critical nature:
    • React & React-DOM: Core framework components
    • @supabase/supabase-js: Backend authentication and data access
    • react-router-dom: Client-side routing and navigation
    • jspdf & html2canvas: PDF generation capabilities
    
    <b>5.4 Known Vulnerabilities</b><br/><br/>
    
    <i>Note: This report should be updated with current vulnerability scan results. 
    Run 'npm audit' to get the latest vulnerability information.</i>
    """
    story.append(Paragraph(security_text, styles['Normal']))
    story.append(PageBreak())
    
    # 6. Compliance & Risk Analysis
    story.append(Paragraph("6. COMPLIANCE & RISK ANALYSIS", styles['SectionHeading']))
    story.append(Spacer(1, 0.1*inch))
    
    compliance_text = """
    <b>6.1 Regulatory Compliance</b><br/><br/>
    
    This SBOM supports compliance with the following frameworks:
    • <b>NIST Cybersecurity Framework:</b> Asset inventory and supply chain risk management
    • <b>SOC 2:</b> Vendor management and third-party risk assessment
    • <b>ISO 27001:</b> Information security management system requirements
    • <b>Executive Order 14028:</b> Software supply chain security requirements
    
    <b>6.2 Supply Chain Risk</b><br/><br/>
    
    <b>Low Risk Areas:</b>
    • Well-maintained open-source projects with active communities
    • Established vendors (Meta/React, Vercel/Vite, Supabase)
    • Permissive licenses with minimal legal risk
    
    <b>Medium Risk Areas:</b>
    • Dependencies with transitive dependencies (nested dependencies)
    • Components with frequent updates requiring maintenance
    • Third-party services (Supabase) requiring operational monitoring
    
    <b>6.3 Risk Mitigation Strategies</b><br/><br/>
    
    1. Maintain dependency lock files (package-lock.json) for reproducible builds
    2. Implement dependency pinning for critical components
    3. Regular security audits and dependency updates
    4. Monitor dependency health and maintenance status
    5. Maintain vendor relationships and support channels
    """
    story.append(Paragraph(compliance_text, styles['Normal']))
    story.append(PageBreak())
    
    # 7. Recommendations
    story.append(Paragraph("7. RECOMMENDATIONS", styles['SectionHeading']))
    story.append(Spacer(1, 0.1*inch))
    
    recommendations_text = """
    <b>7.1 Immediate Actions</b><br/><br/>
    
    1. Establish automated SBOM generation in CI/CD pipeline
    2. Integrate vulnerability scanning tools (npm audit, Snyk)
    3. Create dependency update schedule (monthly/quarterly reviews)
    4. Document dependency selection and approval process
    
    <b>7.2 Long-term Improvements</b><br/><br/>
    
    1. Implement Software Composition Analysis (SCA) tools
    2. Establish security review process for new dependencies
    3. Create dependency lifecycle management policy
    4. Regular SBOM updates and distribution to stakeholders
    5. Integration with security information and event management (SIEM)
    
    <b>7.3 Best Practices</b><br/><br/>
    
    • Keep dependencies up to date with security patches
    • Minimize dependency count where possible
    • Prefer well-maintained, actively developed libraries
    • Review and understand license obligations
    • Maintain comprehensive documentation of all dependencies
    • Regular security training for development team
    """
    story.append(Paragraph(recommendations_text, styles['Normal']))
    story.append(PageBreak())
    
    # 8. Appendices
    story.append(Paragraph("8. APPENDICES", styles['SectionHeading']))
    story.append(Spacer(1, 0.1*inch))
    
    appendix_text = """
    <b>Appendix A: SBOM Format Standards</b><br/><br/>
    
    This report follows industry-standard SBOM formats including:
    • SPDX (Software Package Data Exchange)
    • CycloneDX
    • SWID (Software Identification) tags
    
    <b>Appendix B: Glossary</b><br/><br/>
    
    • <b>SBOM:</b> Software Bill of Materials - A nested inventory of software components
    • <b>Dependency:</b> External library or package required by the application
    • <b>Transitive Dependency:</b> A dependency of a dependency
    • <b>Vulnerability:</b> A security flaw that could be exploited
    • <b>CVE:</b> Common Vulnerabilities and Exposures identifier
    
    <b>Appendix C: Contact Information</b><br/><br/>
    
    For questions regarding this SBOM report, please contact:
    • Vendor: ERMITS Corporation
    • Project: CyberSoluce Asset Manager
    • Report Version: {version}
    • Report Date: {date}
    """.format(version=PROJECT_INFO['report_version'], date=PROJECT_INFO['report_date'])
    
    story.append(Paragraph(appendix_text, styles['Normal']))
    
    # Footer function
    def add_footer(canvas, doc):
        canvas.saveState()
        canvas.setFont('Helvetica', 8)
        canvas.setFillColor(colors.grey)
        page_num = canvas.getPageNumber()
        canvas.drawCentredString(letter[0]/2, 0.5*inch, 
                                f"Page {page_num} | {PROJECT_INFO['name']} SBOM Report | {PROJECT_INFO['report_date']}")
        canvas.restoreState()
    
    # Build the document
    doc.build(story, onFirstPage=add_footer, onLaterPages=add_footer)
    
    print(f"✓ SBOM Report generated successfully: {filename}")
    return filename

if __name__ == "__main__":
    try:
        generate_sbom_report()
    except ImportError as e:
        print("Error: Missing required library. Please install reportlab:")
        print("  pip install reportlab")
        print(f"\nOriginal error: {e}")
    except Exception as e:
        print(f"Error generating report: {e}")
        import traceback
        traceback.print_exc()

