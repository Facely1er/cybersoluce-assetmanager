# CyberSoluce to CyberCorrect Data Contract

## Overview
This document defines the data contract for signals passed from CyberSoluce to CyberCorrect.

## Signal Type
**Privacy Exposure Signals**

## What is Passed

### Signal Data Structure
```typescript
{
  signal_type: 'sensitive_data_unclear_lineage',
  signal_domain: 'privacy',
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
- ❌ Data classification details beyond IDs
- ❌ PII/PHI specifics
- ❌ Legal basis or retention information
- ❌ Cross-border transfer details

## Explicit Disclaimer

**Signals are indicative, not authoritative.**

CyberSoluce signals indicate where concentration patterns exist. They do not:
- Assert privacy compliance posture
- Claim GDPR/CCPA compliance status
- Provide remediation guidance
- Replace expert privacy analysis

CyberCorrect should treat these signals as:
- Contextual input for privacy evaluation
- Starting points for investigation
- Indicators of where to focus attention

CyberCorrect must NOT:
- Quote CyberSoluce signals as findings
- Treat signals as authoritative assessments
- Import data classification or privacy details
- Present signals as CyberSoluce conclusions

## Integration Guidelines

1. **Signal Consumption**: Use signals to identify focus areas for privacy evaluation
2. **Independent Analysis**: Perform independent privacy assessment in CyberCorrect
3. **No Attribution**: Do not attribute assessment outcomes to CyberSoluce
4. **Contextual Only**: Treat signals as contextual input, not evidence

## Example Usage

```typescript
// ✅ CORRECT: Use signal as contextual input
const focusArea = cyberSoluceSignal.concentration_description;
// Perform independent privacy evaluation in CyberCorrect
const evaluation = await performPrivacyEvaluation(focusArea);

// ❌ INCORRECT: Treat signal as finding
// "CyberSoluce found that these assets violate GDPR"
```

