# CyberSoluce to CyberCaution Data Contract

## Overview
This document defines the data contract for signals passed from CyberSoluce to CyberCaution.

## Signal Type
**Ransomware Readiness Signals**

## What is Passed

### Signal Data Structure
```typescript
{
  signal_type: 'high_dependency_weak_execution' | 'ransomware_relevance',
  signal_domain: 'ransomware',
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
- ❌ Asset ownership or business context beyond IDs
- ❌ Vulnerability details or CVE information
- ❌ Access control specifics

## Explicit Disclaimer

**Signals are indicative, not authoritative.**

CyberSoluce signals indicate where concentration patterns exist. They do not:
- Assert security posture
- Claim compliance status
- Provide remediation guidance
- Replace expert analysis

CyberCaution should treat these signals as:
- Contextual input for assessment
- Starting points for investigation
- Indicators of where to focus attention

CyberCaution must NOT:
- Quote CyberSoluce signals as findings
- Treat signals as authoritative assessments
- Import asset ownership or business context
- Present signals as CyberSoluce conclusions

## Integration Guidelines

1. **Signal Consumption**: Use signals to identify focus areas for assessment
2. **Independent Analysis**: Perform independent assessment in CyberCaution
3. **No Attribution**: Do not attribute assessment outcomes to CyberSoluce
4. **Contextual Only**: Treat signals as contextual input, not evidence

## Example Usage

```typescript
// ✅ CORRECT: Use signal as contextual input
const focusArea = cyberSoluceSignal.concentration_description;
// Perform independent assessment in CyberCaution
const assessment = await performRansomwareAssessment(focusArea);

// ❌ INCORRECT: Treat signal as finding
// "CyberSoluce found that these assets have ransomware risk"
```

