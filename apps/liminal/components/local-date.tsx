'use client';

/**
 * Renders a date in the user's local timezone.
 * The server passes an ISO string; this client component formats it using
 * the browser's locale so the displayed date/time always matches the user's clock.
 */

interface LocalDateProps {
  isoString: string;
  /** Full date format: "Monday, April 6, 2026" */
  format?: 'long' | 'short' | 'time' | 'datetime';
  style?: React.CSSProperties;
  className?: string;
}

export function LocalDate({ isoString, format = 'long', style, className }: LocalDateProps) {
  const d = new Date(isoString);

  let text: string;
  switch (format) {
    case 'short':
      text = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      break;
    case 'time':
      text = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      break;
    case 'datetime':
      text = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        + ' · '
        + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      break;
    case 'long':
    default:
      text = d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      break;
  }

  return (
    <time dateTime={isoString} style={style} className={className}>
      {text}
    </time>
  );
}
