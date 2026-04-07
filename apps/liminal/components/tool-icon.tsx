/**
 * ToolIcon — single source of truth for tool iconography.
 *
 * Works in both Server Components and Client Components.
 * Import this; do not import Lucide icons directly in feature files.
 *
 * Icon rationale (matches TOOL_ICON_NAMES in lib/tools/constants.ts):
 *   Landmark      — Small Council: classical deliberative assembly
 *   ScrollText    — Genealogist: archival document, lineage trace
 *   Scale         — Interlocutor: weighing arguments, Socratic balance
 *   NotebookPen   — Stoic's Ledger: active moral accounting
 *   TriangleAlert — Fool: the warning, the voice no one else will raise
 *   Eye           — Interpreter: the act of seeing, five perceptual lenses
 */

import {
  Landmark,
  ScrollText,
  Scale,
  NotebookPen,
  TriangleAlert,
  Eye,
  type LucideProps,
} from 'lucide-react';
import type { ComponentType } from 'react';

const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  'small-council': Landmark,
  'genealogist':   ScrollText,
  'interlocutor':  Scale,
  'stoics-ledger': NotebookPen,
  'fool':          TriangleAlert,
  'interpreter':   Eye,
};

interface ToolIconProps extends Omit<LucideProps, 'size'> {
  slug: string;
  size?: number;
}

export function ToolIcon({ slug, size = 16, strokeWidth = 1.5, ...props }: ToolIconProps) {
  const Icon = ICON_MAP[slug];
  if (!Icon) return null;
  return <Icon size={size} strokeWidth={strokeWidth} {...props} />;
}
