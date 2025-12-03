✅ CURSOR TODO — CyberSoluce Enrichment & Focus Funnel (Final)

PROJECT: CyberSoluce
SCOPE: Asset enrichment, internal intelligence, service funneling
MODE: COMPLETE & LOCK (no new SKUs, no renaming)

🎯 GOAL (PIN THIS)

CyberSoluce must:

Accept existing asset registers

Enrich them internally

Detect where exposure concentrates

Funnel attention to focused ERMITS services
without exposing an “asset manager” or “enhanced manager.”

1️⃣ Asset Intake & Normalization (Infrastructure Only)
// TODO[CS-ASSET-INTAKE]:

1. Support importing asset data from:
   - CSV / Excel
   - Existing CMDB exports
   - Cloud inventories (manual import is acceptable v1)

2. Normalize fields internally:
   - asset_type
   - owner
   - business_function
   - vendor
   - data_sensitivity
   - relationship_direction

3. Track confidence internally:
   - source_type (imported / manual / inferred)
   - last_updated
   - confidence_level (low / medium / high)

RULE:
- Do NOT expose confidence or completeness claims in UI.

2️⃣ Internal Enrichment Layer (Hidden From Users)
// TODO[CS-ENRICHMENT-LAYER]:

1. Implement enrichment overlays (internal only):
   - privacy_relevance (true/false)
   - ransomware_relevance (true/false)
   - vendor_dependency (none / partial / heavy)
   - software_dependency (low / medium / high)

2. Populate overlays using:
   - Relationships
   - Data classifications
   - Vendor presence
   - Dependency depth

RULE:
- Enrichment must NOT modify source asset data.
- Enrichment must NOT be labeled as decisions, scores, or posture.

3️⃣ Signal Detection (Non-Numeric, Focus-Only)
// TODO[CS-SIGNAL-DETECTION]:

1. Detect focus signals such as:
   - Sensitive data + unclear lineage
   - High dependency + weak execution indicators
   - Vendor concentration paths
   - Software component concentration

2. Signals MUST:
   - Be qualitative
   - Describe concentration, not severity
   - Avoid numeric scoring

3. Store internally as:
   - signal_type
   - affected_asset_ids
   - signal_domain (privacy / ransomware / vendor / software)

4️⃣ Focus Funnel UI (Customer-Visible Value)
// TODO[CS-FOCUS-FUNNEL]:

1. Present focus blocks in UI:
   - "Review Privacy Exposure"
   - "Assess Ransomware Readiness"
   - "Evaluate Vendor Dependence"
   - "Analyze Software Risk"

2. Each block:
   - Explains WHY attention is needed
   - Links to the relevant ERMITS service
   - Avoids telling the user what to fix

RULE:
- Funnel must suggest focus, not solutions.

5️⃣ Service Routing (Clean, Non-Salesy)
// TODO[CS-SERVICE-ROUTING]:

Map signals to services:

- privacy signals → CyberCorrect
- ransomware / execution signals → CyberCaution
- vendor dependency → VendorSoluce
- software concentration → TechnoSoluce
- governance ambiguity → ERMITS Advisory

COPY REQUIREMENT:
- Use language:
  "These signals may warrant deeper evaluation"
- Do NOT use:
  "You need", "Fix now", "Recommended action"

6️⃣ Naming & Guardrails (Hard Lock)
// TODO[CS-NAMING-GUARDRAILS]:

1. NEVER expose:
   - "Asset Manager"
   - "Enhanced Manager"
   - "Intelligence Engine"

2. Allowed UI language:
   - "Asset Intelligence"
   - "Dependency-aware visibility"
   - "Focus areas"

3. Add guardrail comment at top of enrichment logic:

"NOTE:
 Asset enrichment produces indicative focus signals.
 It must not:
 - Assert completeness
 - Present risk posture
 - Replace expert analysis"

7️⃣ Final Verification Checklist (Cursor MUST Confirm)
// TODO[CS-FINAL-VERIFY]:

Confirm ALL are true:

☐ No product named "Asset Manager"
☐ Assets owned and visible only through CyberSoluce
☐ Enrichment logic hidden from UI
☐ Outputs are qualitative only
☐ Funnel links to services without recommendations
☐ No posture, compliance, or scoring claims present

If any check fails → STOP and FLAG.

✅ STOP CONDITION (IMPORTANT)

Stop implementation when:

A user can clearly say:

“This shows me where risk concentrates — not what to do.”

If they feel “in control” rather than “evaluated”, you’re done.