import { useState, useMemo } from 'react';
import { useERMITSAdvisoryExport } from './useERMITSAdvisoryExport';
import { generateSteelVisibilityAnnexMarkdown } from '@/ermitsAdvisory/steelVisibilityAnnex';

export function SteelVisibilityAnnexPreview() {
  const { exportPayload, loading, error } = useERMITSAdvisoryExport();
  const [copied, setCopied] = useState(false);

  const markdown = useMemo(() => {
    if (!exportPayload?.steelVisibilitySnapshot) return '';
    return generateSteelVisibilityAnnexMarkdown(exportPayload.steelVisibilitySnapshot, {
      orgName: exportPayload.manifest?.organisationName,
    });
  }, [exportPayload]);

  const handleCopy = async () => {
    if (!markdown) return;
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy annex markdown:', e);
    }
  };

  if (loading) {
    return <p className="text-xs text-muted-foreground">Generating visibility annex…</p>;
  }

  if (error) {
    return <p className="text-xs text-red-600">Unable to load STEEL visibility snapshot.</p>;
  }

  if (!markdown) {
    return <p className="text-xs text-muted-foreground">No visibility snapshot is available yet.</p>;
  }

  return (
    <section className="space-y-3">
      <header className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold">STEEL Visibility Annex</h2>
          <p className="text-xs text-muted-foreground">
            Markdown annex generated from the current visibility snapshot. Copy into your report or export pipeline.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs border rounded px-2 py-1 hover:bg-accent"
        >
          {copied ? 'Copied' : 'Copy Markdown'}
        </button>
      </header>

      <pre className="text-[11px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 max-h-80 overflow-auto font-mono whitespace-pre-wrap">
        {markdown}
      </pre>
    </section>
  );
}

