/**
 * STEEL Visibility Annex Generator
 * 
 * Converts SteelOrgVisibilitySnapshot into a report-ready markdown annex.
 * Focuses on visibility and stability language only - no risk/posture/compliance judgments.
 */

import { SteelOrgVisibilitySnapshot } from '@/contracts/ermitsAdvisory.steelVisibility.contract';

export function generateSteelVisibilityAnnexMarkdown(
  snapshot: SteelOrgVisibilitySnapshot,
  options?: { orgName?: string }
): string {
  const { capturedAt, assets, domains, narrative } = snapshot;
  const orgName = options?.orgName ?? 'The organisation';

  const lines: string[] = [];

  // Title & intro
  lines.push(`# Visibility Snapshot Annex`);
  lines.push('');
  lines.push(`**Organisation:** ${orgName}`);
  lines.push(`**Snapshot captured:** ${capturedAt}`);
  lines.push('');
  lines.push(
    `This annex summarises how well key assets, suppliers, and software composition are currently understood, ` +
      `based on observed signals and visibility changes over time. It focuses on visibility and stability, not risk or compliance judgments.`
  );
  lines.push('');

  // Narrative section
  if (narrative && narrative.length) {
    lines.push(`## Narrative Summary`);
    lines.push('');
    narrative.forEach(line => {
      lines.push(`- ${line}`);
    });
    lines.push('');
  }

  // Domain-level section
  if (domains && domains.length) {
    lines.push(`## Domain Visibility Highlights`);
    lines.push('');
    for (const d of domains) {
      const label = domainLabel(d.domain);
      lines.push(`### ${label}`);
      lines.push('');
      if (d.keyMessages.length) {
        d.keyMessages.forEach(msg => {
          lines.push(`- ${msg}`);
        });
      } else {
        lines.push(`- No specific visibility observations recorded in this snapshot.`);
      }
      lines.push('');
    }
  }

  // Asset table
  if (assets && assets.length) {
    lines.push(`## Asset-Level Visibility Overview`);
    lines.push('');
    lines.push(`| Asset ID | Key Role | Drift Status | SBOM Documented | Vendor Linked |`);
    lines.push(`|----------|----------|--------------|-----------------|---------------|`);

    for (const a of assets) {
      lines.push(
        `| ${safe(a.assetId)} | ${safe(a.keyRole) || '-'} | ${a.driftStatus} | ${a.hasSBOM ? 'Yes' : 'No'} | ${
          a.hasVendorLinks ? 'Yes' : 'No'
        } |`
      );
    }
    lines.push('');
  } else {
    lines.push(`## Asset-Level Visibility Overview`);
    lines.push('');
    lines.push(`No asset visibility summaries are available in this snapshot.`);
    lines.push('');
  }

  // Closing note
  lines.push(`---`);
  lines.push(
    `_This annex describes the current state of asset and supplier visibility, including where understanding is stable versus changing or uncertain. ` +
      `It does not represent security posture, risk ratings, or compliance status._`
  );

  return lines.join('\n');
}

function domainLabel(domain: string): string {
  switch (domain) {
    case 'privacy':
      return 'Privacy-Relevant Assets';
    case 'ransomware':
      return 'Ransomware-Relevant Assets & Paths';
    case 'vendor':
      return 'Supplier & Third-Party Touchpoints';
    case 'software-supply-chain':
      return 'Software Composition & Supply Chain';
    default:
      return 'Visibility Domain';
  }
}

function safe(value?: string): string {
  if (!value) return '';
  return value.replace(/\|/g, '\\|'); // basic markdown table safety
}

