# UX Verification Checklist

## Purpose
This document provides a manual verification checklist to ensure the CyberSoluce user experience meets design principles.

## Verification Steps

### 1. User Flow Verification

#### Import Assets
- [ ] Navigate to Asset Intelligence dashboard
- [ ] Click "Import Assets" button
- [ ] Upload CSV file with asset data
- [ ] Verify assets appear in inventory
- [ ] Confirm no overwhelming configuration required

#### View Asset Intelligence
- [ ] Assets are visible in main dashboard
- [ ] Asset details are accessible
- [ ] No posture or scoring claims visible
- [ ] Language uses "may warrant", "suggests", "indicates"

#### Focus Funnel Appearance
- [ ] Focus Funnel appears only when signals exist
- [ ] Focus blocks are clear and non-overwhelming
- [ ] Each block explains WHY attention may be warranted
- [ ] Links to ERMITS services are present
- [ ] No imperative language ("You need", "Fix now")

### 2. User Experience Validation

#### No Overwhelm
- [ ] Dashboard is clean and focused
- [ ] Information density is appropriate
- [ ] No information overload
- [ ] Clear visual hierarchy

#### No Admin-Heavy Configuration
- [ ] Import process is straightforward
- [ ] Minimal configuration required
- [ ] Default settings work out of the box
- [ ] No complex setup wizard

#### Clear Sense of "Where to Look"
- [ ] Focus areas are clearly highlighted
- [ ] Signal descriptions are understandable
- [ ] Service routing is clear
- [ ] User knows where to go next

### 3. Language Validation

#### Allowed Language Patterns
- [ ] "may warrant" - Used appropriately
- [ ] "suggests" - Used appropriately
- [ ] "indicates" - Used appropriately
- [ ] "These signals may warrant deeper evaluation" - Present

#### Prohibited Language Patterns
- [ ] No "You need" - Verified absent
- [ ] No "Fix now" - Verified absent
- [ ] No "Recommended action" - Verified absent
- [ ] No imperative commands - Verified absent
- [ ] No evaluative judgments - Verified absent

### 4. Stop Condition Validation

**Question**: Does the UX feel investigative, not judgemental?

- [ ] User feels in control
- [ ] User does not feel evaluated
- [ ] User understands they are being guided, not told
- [ ] Language is supportive, not prescriptive

## Expected Results

### ✅ Pass Criteria
- User can clearly say: "This shows me where risk concentrates — not what to do"
- User feels "in control" rather than "evaluated"
- Language is investigative and supportive
- Focus funnel guides without prescribing

### ❌ Fail Criteria
- User feels judged or evaluated
- Language is imperative or prescriptive
- Overwhelming information or configuration
- Focus funnel feels like a sales pitch

## Notes

- Perform this verification in a real browser environment
- Test with actual asset data
- Verify with multiple user personas if possible
- Document any issues found

