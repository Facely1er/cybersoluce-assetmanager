/**
 * Scenario Brief Generator
 * 
 * Generates structured tabletop scenario briefs for ransomware exercises
 * based on STEEL v3 exposure bands and asset visibility readiness.
 * 
 * RULES:
 * - NO risk scoring or posture language
 * - NO assessment, audit, certification language
 * - Only scenario planning aid language
 * - Focus on visibility, stability, uncertainty, decision-making
 */

import { AssetScenarioReadiness } from '@/cybercaution/readiness/readinessMapper';

export type ExposureBand = 'low' | 'medium' | 'elevated' | 'high';

export interface ScenarioBriefInput {
  orgName?: string;
  sector?: string;
  exposureBand: ExposureBand;
  readiness: AssetScenarioReadiness[];
}

export function generateRansomwareScenarioBriefMarkdown(
  input: ScenarioBriefInput
): string {
  const { orgName, sector, exposureBand, readiness } = input;

  const lines: string[] = [];
  const name = orgName ?? 'The organisation';

  const ready = readiness.filter(r => r.readiness === 'ready');
  const needsClarification = readiness.filter(r => r.readiness === 'needs-clarification');
  const unstable = readiness.filter(r => r.readiness === 'unstable');
  const noHistory = readiness.filter(r => r.readiness === 'no-history');

  // Header
  lines.push(`# Ransomware Tabletop Scenario Brief`);
  lines.push('');
  lines.push(`**Organisation:** ${name}`);
  if (sector) {
    lines.push(`**Sector:** ${sector}`);
  }
  lines.push(`**Exposure band (STEEL v3):** ${exposureBand.toUpperCase()}`);
  lines.push('');
  lines.push(
    `This brief outlines a ransomware tabletop scenario anchored in current asset visibility ` +
    `and the selected STEEL v3 exposure band. It is intended as a planning aid, not a security assessment or risk rating.`
  );
  lines.push('');

  // Section: Scenario framing
  lines.push(`## Scenario Framing`);
  lines.push('');
  lines.push(`- Scenario type: Ransomware campaign with operational disruption focus`);
  lines.push(`- Primary objective: Test decision-making, coordination, and information flow under a realistic ransomware event.`);
  lines.push(
    `- Scenario calibration: Exposure band **${exposureBand.toUpperCase()}** informs the intensity and uncertainty of the scenario, ` +
    `but does not represent a formal risk score or security posture.`
  );
  lines.push('');

  // Section: Anchor assets
  lines.push(`## Anchor Assets for the Scenario`);
  lines.push('');
  if (ready.length) {
    lines.push(`The following assets have **stable visibility** and are good candidates to anchor the scenario narrative:`);
    lines.push('');
    lines.push(`| Asset | Notes |`);
    lines.push(`|-------|-------|`);
    ready.slice(0, 10).forEach(a => {
      lines.push(`| ${a.name ?? a.assetId} | Stable visibility across observations |`);
    });
    lines.push('');
  } else {
    lines.push(`No assets currently meet the "stable visibility" criteria. Scenario anchor selection may require additional clarification.`);
    lines.push('');
  }

  // Section: Clarification targets
  lines.push(`## Assets Requiring Clarification Before the Exercise`);
  lines.push('');
  if (needsClarification.length || unstable.length) {
    lines.push(
      `The following assets show changing or uncertain visibility. Consider clarifying their role, ownership, and dependencies before or during the exercise:`
    );
    lines.push('');
    lines.push(`| Asset | Visibility Note |`);
    lines.push(`|-------|-----------------|`);
    needsClarification.slice(0, 10).forEach(a => {
      lines.push(`| ${a.name ?? a.assetId} | Visibility has recently changed; confirm role and dependencies. |`);
    });
    unstable.slice(0, 10).forEach(a => {
      lines.push(`| ${a.name ?? a.assetId} | Visibility is highly variable or uncertain over time. |`);
    });
    lines.push('');
  } else {
    lines.push(`No assets are currently flagged as changing or uncertain in this snapshot.`);
    lines.push('');
  }

  // Section: Unknowns
  lines.push(`## Areas with Limited Historical Visibility`);
  lines.push('');
  if (noHistory.length) {
    lines.push(
      `The following assets have little or no historical visibility data. They may be included in the scenario, but assumptions should be made explicit:`
    );
    lines.push('');
    lines.push(`- ` + noHistory.slice(0, 10).map(a => a.name ?? a.assetId).join('\n- '));
    lines.push('');
  } else {
    lines.push(`No assets are currently flagged as "no history" in this snapshot.`);
    lines.push('');
  }

  // Section: Discussion prompts, calibrated by band
  lines.push(`## Discussion Prompts for the Exercise`);
  lines.push('');
  lines.push(
    `Use the following prompts to guide facilitator questions and decision-making discussion during the tabletop exercise:`
  );
  lines.push('');
  getBandSpecificPrompts(exposureBand, ready, needsClarification, unstable).forEach(p => {
    lines.push(`- ${p}`);
  });
  lines.push('');

  // Closing disclaimer
  lines.push(`---`);
  lines.push(
    `_This scenario brief is based on current asset visibility and exposure band selection. ` +
    `It is designed to support planning and facilitation of a ransomware tabletop exercise. ` +
    `It does not constitute a security assessment, audit, or certification of security posture._`
  );

  return lines.join('\n');
}

function getBandSpecificPrompts(
  band: ExposureBand,
  ready: AssetScenarioReadiness[],
  needsClarification: AssetScenarioReadiness[],
  unstable: AssetScenarioReadiness[],
): string[] {
  const prompts: string[] = [];

  // Generic prompts
  prompts.push(
    `Which assets would you select as the primary operational "storyline" for this exercise, and why?`
  );
  prompts.push(
    `Where do information gaps in asset visibility create friction for incident command, communications, or business decision-making?`
  );

  // Band-specific nuance
  switch (band) {
    case 'low':
      prompts.push(
        `How would you prevent overconfidence during a low-intensity scenario, and still surface meaningful gaps or blind spots?`
      );
      break;
    case 'medium':
      prompts.push(
        `How do moderate levels of exposure change the prioritisation of which systems to stabilise first during the scenario?`
      );
      break;
    case 'elevated':
      prompts.push(
        `With an elevated exposure band, which trade-offs between speed, precision, and business impact should be surfaced explicitly during the exercise?`
      );
      break;
    case 'high':
      prompts.push(
        `In a high exposure band, how will leadership handle incomplete or conflicting information about impacted assets while making time-sensitive decisions?`
      );
      prompts.push(
        `What explicit decision points should be tested around paying/not paying, isolation scope, and communications under high uncertainty?`
      );
      break;
  }

  if (needsClarification.length || unstable.length) {
    prompts.push(
      `Which of the "needs clarification" or "unstable visibility" assets will you deliberately include in the scenario to highlight uncertainty?`
    );
  }

  return prompts;
}

