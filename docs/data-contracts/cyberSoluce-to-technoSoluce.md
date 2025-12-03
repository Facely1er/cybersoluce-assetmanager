# CyberSoluce to TechnoSoluce Data Contract

## Overview
This document defines the data contract for signals passed from CyberSoluce to TechnoSoluce.

## Signal Type
**Software Dependency Signals**

## What is Passed

### Signal Data Structure
```typescript
{
  signal_type: 'software_concentration',
  signal_domain: 'software',
  affected_asset_ids: string[],
  description: string, // Qualitative description
  concentration_description: string, // Concentration pattern description
  detected_at: Date
}
```

### Signal Content
- **Affected Asset IDs**: List of asset identifiers where signals were detected
- **Qualitative Description**: Descriptive text about concentration patterns
- **Concentration Description**: Explanation of where attention may be warranted
- **Detection Timestamp**: When the signal was detected

## What is NOT Passed

- ❌ Risk scores or numeric assessments
- ❌ Compliance status or posture claims
- ❌ Remediation recommendations
- ❌ Authoritative conclusions
- ❌ Software component details or SBOM data
- ❌ Vulnerability information
- ❌ Dependency tree specifics
- ❌ Version information

## Explicit Disclaimer

**Signals are indicative, not authoritative.**

CyberSoluce signals indicate where concentration patterns exist. They do not:
- Assert software risk posture
- Claim component compliance status
- Provide remediation guidance
- Replace expert software analysis

TechnoSoluce should treat these signals as:
- Contextual input for software evaluation
- Starting points for investigation
- Indicators of where to focus attention

TechnoSoluce must NOT:
- Quote CyberSoluce signals as findings
- Treat signals as authoritative assessments
- Import software component or SBOM data
- Present signals as CyberSoluce conclusions

## Integration Guidelines

1. **Signal Consumption**: Use signals to identify focus areas for software evaluation
2. **Independent Analysis**: Perform independent software assessment in TechnoSoluce
3. **No Attribution**: Do not attribute assessment outcomes to CyberSoluce
4. **Contextual Only**: Treat signals as contextual input, not evidence

## Example Usage

```typescript
// ✅ CORRECT: Use signal as contextual input
const focusArea = cyberSoluceSignal.concentration_description;
// Perform independent software assessment in TechnoSoluce
const assessment = await performSoftwareAssessment(focusArea);

// ❌ INCORRECT: Treat signal as finding
// "CyberSoluce found that these assets have software risk"
```

