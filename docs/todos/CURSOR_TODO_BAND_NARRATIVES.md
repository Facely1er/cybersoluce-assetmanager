# TODO[CYBERCAUTION-BAND-NARRATIVES]

GOAL  
Add **executive-safe ransomware readiness narratives** for each exposure band  
(Low / Medium / Elevated / High) to the CyberCaution STEEL v3 results flow.

Narratives must:
- Stay diagnostic (signals + uncertainty)
- Be ransomware-focused
- Provide clarity, not recommendations
- Be usable in UI and PDF export

---

## 1. Define Narrative Content (Single Source of Truth)

- [ ] Create a static config file:

  `src/features/steel/bandNarratives.ts`

- [ ] Add the following content EXACTLY (wording may only be minimally reformatted, not rewritten):

```ts
export type ExposureBand = 'low' | 'medium' | 'elevated' | 'high';

export const BAND_NARRATIVES: Record<ExposureBand, {
  title: string;
  meaning: string;
  typicalFailures: string[];
  ransomwarePattern: string;
  uncertainty: string;
}> = {
  low: {
    title: 'Low Exposure Signals',
    meaning:
      'Your answers suggest relatively strong decision clarity and preparedness for ransomware scenarios compared to common patterns. This does not imply immunity, only fewer immediate signal weaknesses.',
    typicalFailures: [
      'Overconfidence driven by past success',
      'Assumptions that plans execute as expected',
      'Blind spots introduced by change (vendors, systems, data)'
    ],
    ransomwarePattern:
      'At this level, ransomware impact typically escalates through edge cases, rare decision paths, or unexpected vendor behavior.',
    uncertainty:
      'CyberCaution cannot validate execution consistency, dependency completeness, or preparedness across the entire organization.'
  },

  medium: {
    title: 'Medium Exposure Signals',
    meaning:
      'Your responses show mixed readiness signals. Some foundations exist, while others rely on informal processes or assumed knowledge. This is the most common exposure band.',
    typicalFailures: [
      'Delays while clarifying ownership',
      'Uncertainty about what is actually impacted',
      'Late discovery of data or vendor dependencies'
    ],
    ransomwarePattern:
      'Ransomware incidents often escalate faster than expected and trigger conflicting priorities between containment and continuity.',
    uncertainty:
      'CyberCaution cannot determine whether asset understanding is complete or whether plans execute consistently under pressure.'
  },

  elevated: {
    title: 'Elevated Exposure Signals',
    meaning:
      'Your responses indicate multiple, reinforcing readiness gaps that commonly amplify ransomware impact. This reflects systemic uncertainty rather than isolated issues.',
    typicalFailures: [
      'Competing authority during incidents',
      'Incomplete or unreliable impact visibility',
      'Heavy reliance on individual responders',
      'Weak leverage over vendors under stress'
    ],
    ransomwarePattern:
      'Incidents at this level frequently spread wider, trigger regulatory or reputational impact, and result in reactive, costly decisions.',
    uncertainty:
      'CyberCaution cannot determine cascading dependency effects or validate whether learning from past incidents will hold.'
  },

  high: {
    title: 'High Exposure Signals',
    meaning:
      'Your answers show concentrated readiness weaknesses across governance, visibility, execution, and learning. Ransomware incidents are unlikely to remain contained or predictable.',
    typicalFailures: [
      'Executive paralysis or conflict',
      'Inability to confirm what systems or data are affected',
      'Escalation driven by uncertainty rather than intent',
      'Poorly coordinated external communication'
    ],
    ransomwarePattern:
      'Ransomware events tend to escalate rapidly, expose long-standing structural weaknesses, and produce compounding business and regulatory impact.',
    uncertainty:
      'Even with strong warning signals, CyberCaution cannot determine the true blast radius or which decision paths will fail first.'
  }
};
 Do NOT add:

Remediation steps

Recommendations

Control language

Compliance phrasing

2. Wire Narratives Into Results UI
 In SteelV3ResultsCyberCaution.tsx (or equivalent results component):

Import narratives:

ts
Copy code
import { BAND_NARRATIVES } from './bandNarratives';
Map exposure band (already computed) to narrative block.

 Render a new section directly under the band label:

Section title:
What this exposure band typically means

 Display:

meaning

Bullet list from typicalFailures

ransomwarePattern

uncertainty

 Keep this section:

Collapsible by default (recommended)

Visible above the tabletop CTA

3. Add Mandatory Diagnostic Disclaimer
 Immediately below the narrative section, render:

md
Copy code
These narratives are based on qualitative readiness signals.
They highlight likely pressure points and uncertainty areas,
not an authoritative enterprise assessment, audit, or formal risk posture.
 Confirm disclaimer text is visible without excessive scrolling.

4. Validate Language & Scope
 Search rendered UI for forbidden terms:

“assessment”

“audit”

“posture”

“compliance”

“recommend”

 If any appear in the narrative section → FAIL and revise.

5. PDF / Export Readiness (Non-Blocking)
 Ensure narrative content is:

Accessible as a single object per band

Reusable in a future PDF export

Not tightly coupled to UI-only logic

6. Final Verification
A user reading the band narrative should conclude:

“This explains how ransomware pressure tends to behave at our level,
what usually goes wrong, and why uncertainty remains —
but it does not tell us what to implement.”

If the narrative:

Feels prescriptive ❌

Reads like advice ❌

Implies safety or compliance ❌

→ STOP and weaken language.

Mark task complete only when:

 All 4 bands display correctly

 Narrative text matches source file

 Disclaimers are present

 No advisory drift exists

yaml
Copy code

---

### What to do after this (do **not** mix now)
✅ PDF briefing  
✅ Threat Weather Lite  
✅ Pro tier packaging  

But **only after this is merged cleanly**.

If you want, next I can give you:
- the **PDF layout spec** (1 page, exec-safe), or  
- the **band → tabletop emphasis map** (which phase to stress per band).





