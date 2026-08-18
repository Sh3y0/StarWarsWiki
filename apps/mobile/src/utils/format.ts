import type { DatabankItem } from '../types/databank';

const UNKNOWN = new Set(['unknown', 'n/a', 'none', 'null']);

export function displayValue(value?: string | null): string | undefined {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  if (!trimmed || UNKNOWN.has(trimmed.toLowerCase())) {
    return undefined;
  }
  return trimmed;
}

export function formatWithUnit(value: string | undefined, unit: string): string | undefined {
  const displayed = displayValue(value);
  if (!displayed) {
    return undefined;
  }
  if (!/^-?\d[\d,]*\.?\d*$/.test(displayed.replace(/,/g, ''))) {
    return displayed;
  }
  return `${displayed}${unit}`;
}

export function formatHeight(value: string | undefined): string | undefined {
  const displayed = displayValue(value);
  if (!displayed) {
    return undefined;
  }
  const cm = Number(displayed);
  if (!Number.isFinite(cm)) {
    return displayed;
  }
  return `${(cm / 100).toFixed(2).replace(/\.?0+$/, '')}m`;
}

export function formatMass(value: string | undefined): string | undefined {
  return formatWithUnit(value, 'kg');
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'] as const;

export function episodeLabel(episodeId: number): string {
  return `EPISODE ${ROMAN[episodeId - 1] ?? String(episodeId)}`;
}

export function yearFromDate(value: string | undefined): string | undefined {
  const displayed = displayValue(value);
  if (!displayed) {
    return undefined;
  }
  return displayed.slice(0, 4);
}

export function databankImageUrl(
  item: { images?: DatabankItem['images'] } | null | undefined,
  preferred: 'desktop_1x1' | 'desktop_16x9' | 'desktop_2x1' | 'desktop_4x3' = 'desktop_16x9',
): string | undefined {
  const desktop = item?.images?.desktop;
  if (!desktop) {
    return undefined;
  }
  return (
    desktop[preferred] ??
    desktop.desktop_16x9 ??
    desktop.desktop_2x1 ??
    desktop.desktop_4x3 ??
    desktop.desktop_1x1
  );
}

export function relatedIds(ids: string[], limit = 8): string[] {
  return ids.filter(Boolean).slice(0, limit);
}
