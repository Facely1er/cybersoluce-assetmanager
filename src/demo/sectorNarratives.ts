// src/demo/sectorNarratives.ts

import type { SectorKey } from './sampleAssetInventoryGenerator';

export type FocusSignalType =
  | 'privacyExposure'
  | 'ransomwareExposure'
  | 'vendorDependence'
  | 'softwareConcentration'
  | 'governanceAmbiguity';

export interface SectorSignalNarrative {
  title: string;
  summary: string;
  whyItMatters: string;
  typicalConsequences: string[];
}

export const SECTOR_SIGNAL_NARRATIVES: Record<
  SectorKey,
  Partial<Record<FocusSignalType, SectorSignalNarrative>>
> = {
  healthcare: {
    privacyExposure: {
      title: 'Exposure Around Patient and Clinical Data',
      summary:
        'Signals suggest that systems handling PHI and clinical workflows may not be consistently mapped or governed.',
      whyItMatters:
        'Gaps in understanding where PHI actually resides and flows can increase the likelihood of reportable incidents and regulator scrutiny.',
      typicalConsequences: [
        'Unclear ownership during a privacy incident',
        'Difficulty scoping which EHR, imaging, and portal systems are affected',
        'Longer time to notify patients and regulators',
      ],
    },
    ransomwareExposure: {
      title: 'Ransomware Impact on Clinical Operations',
      summary:
        'Indicators point to a reliance on a small number of critical systems (EHR, PACS, portals) without clearly rehearsed response paths.',
      whyItMatters:
        'When clinical systems go down, patient care disruption happens fast. Ransomware scenarios need to be rehearsed, not just documented.',
      typicalConsequences: [
        'Delayed or manual clinical workflows',
        'Increased clinical risk and clinician frustration',
        'Greater pressure from media and regulators',
      ],
    },
    vendorDependence: {
      title: 'Reliance on a Small Set of Clinical Vendors',
      summary:
        'Your dependency map suggests heavy concentration on a few platform vendors for core clinical and imaging services.',
      whyItMatters:
        'Vendor outages, security incidents, or contract disputes can translate directly into clinical downtime if alternatives are not prepared.',
      typicalConsequences: [
        'Limited room to negotiate with strategic vendors',
        'Operational disruption during vendor-side incidents',
        'More complex joint incident handling',
      ],
    },
  },

  financial: {
    privacyExposure: {
      title: 'Exposure Around Customer and Transaction Data',
      summary:
        'Signals indicate that customer, KYC, and transactional data may be spread across multiple platforms without fully aligned visibility.',
      whyItMatters:
        'Fragmented visibility over regulated financial data increases the risk of incomplete incident scoping and weak audit trails.',
      typicalConsequences: [
        'Difficulties answering regulator questions quickly',
        'Uncertainty over which books or systems are affected during events',
        'Higher effort to produce defensible incident reports',
      ],
    },
    ransomwareExposure: {
      title: 'Ransomware Against Payments and Core Banking',
      summary:
        'High dependency on a few payment and core banking systems, with limited evidence of stress-tested scenarios, may increase impact if they fail.',
      whyItMatters:
        'Payment outages and core banking disruptions become reputational events in hours, not days. Response rehearsal matters as much as tooling.',
      typicalConsequences: [
        'Customer-facing outages and call centre overload',
        'Liquidity and reconciliation stress',
        'Intensified regulator and media scrutiny',
      ],
    },
    vendorDependence: {
      title: 'Concentration in Critical Financial Platforms',
      summary:
        'Your environment appears to lean heavily on a small number of card, core, and trading platforms for day-to-day operations.',
      whyItMatters:
        'If one vendor experiences a significant incident, your downstream exposure can be both operational and regulatory.',
      typicalConsequences: [
        'Vendor-side incidents rapidly becoming your incidents',
        'Increased complexity in joint communications to regulators',
        'Constraints on exit or diversification strategies',
      ],
    },
  },

  saas: {
    softwareConcentration: {
      title: 'Concentration Around Core Multi-tenant Services',
      summary:
        'Signals show a strong dependency on a small set of multi-tenant APIs and databases to serve most customers.',
      whyItMatters:
        'Defects, misconfigurations, or incidents in shared components can propagate across many tenants at once.',
      typicalConsequences: [
        'Broad, simultaneous customer impact from a single issue',
        'Complex rollout of mitigations or hotfixes',
        'Increased risk of cross-tenant exposure if isolation is weak',
      ],
    },
    ransomwareExposure: {
      title: 'Platform-Level Ransomware and Availability Risk',
      summary:
        'Your operational model suggests that downtime in a few core services can render the product unavailable for most users.',
      whyItMatters:
        'Availability loss in SaaS quickly becomes a trust issue; customers may treat extended outages similarly to security incidents.',
      typicalConsequences: [
        'Escalation of SLAs and credits discussions',
        'Pressure to provide architectural transparency',
        'Churn risk if outage memory persists',
      ],
    },
  },

  manufacturing: {
    ransomwareExposure: {
      title: 'Ransomware Against OT and Production Systems',
      summary:
        'Signals point to critical dependencies between MES, SCADA, and PLC environments that may not be regularly exercised under stress.',
      whyItMatters:
        'When OT is impacted, losses are measured in halted production, safety concerns, and supply chain disruption.',
      typicalConsequences: [
        'Line stoppages and missed customer orders',
        'Increased safety concerns around manual overrides',
        'Strain on supplier and customer relationships',
      ],
    },
    governanceAmbiguity: {
      title: 'Split Governance Between IT and OT',
      summary:
        'Indicators suggest a split or unclear ownership line between IT and OT environments.',
      whyItMatters:
        'Without clear governance, decisions during an incident can stall between teams and functions, prolonging impact.',
      typicalConsequences: [
        'Conflicting priorities between plants and central IT',
        'Slow approval cycles for containment actions',
        'Inconsistent lessons learned across sites',
      ],
    },
  },

  education: {
    privacyExposure: {
      title: 'Exposure Around Student and Staff Data',
      summary:
        'Signals hint at multiple systems holding student and staff data with varying levels of visibility and control.',
      whyItMatters:
        'Breaches involving students or minors can quickly become sensitive reputational matters for educational institutions.',
      typicalConsequences: [
        'Parental concerns and complaints',
        'Media attention around student data handling',
        'Pressure from boards and oversight bodies',
      ],
    },
    ransomwareExposure: {
      title: 'Ransomware Targeting Teaching and Research Services',
      summary:
        'Reliance on a few critical teaching and learning platforms can amplify the impact of availability or integrity loss.',
      whyItMatters:
        'Extended outages in LMS or SIS can disrupt teaching schedules, grading, and student progression.',
      typicalConsequences: [
        'Interrupted teaching and examination cycles',
        'Manual workarounds and extended working hours',
        'Strain on staff–student trust',
      ],
    },
  },

  publicSector: {
    privacyExposure: {
      title: 'Exposure Around Citizen Records and Services',
      summary:
        'Signals suggest multiple citizen-facing systems with overlapping or unclear data boundaries.',
      whyItMatters:
        'Public sector breaches carry both individual impact and broader trust implications for the institution.',
      typicalConsequences: [
        'Public concern and media attention',
        'Formal inquiries or investigations',
        'Stronger demands for transparency and accountability',
      ],
    },
    governanceAmbiguity: {
      title: 'Decision Ambiguity in Multi-stakeholder Environments',
      summary:
        'There may be several departments involved in citizen services without a single, rehearsed incident decision path.',
      whyItMatters:
        'During incidents, complex governance can slow containment and communication, even when technical teams move quickly.',
      typicalConsequences: [
        'Delays in public communication',
        'Fragmented messaging across departments',
        'Difficulty presenting a coherent response narrative',
      ],
    },
  },
};

