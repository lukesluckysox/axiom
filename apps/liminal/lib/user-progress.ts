/**
 * Server-side helpers for computing user progress data.
 * Used by homepage and archive page.
 */

/** Compute consecutive-day streak ending at (or containing) today.  */
export function computeStreak(activityDates: Date[]): number {
  if (!activityDates.length) return 0;

  const MS_DAY = 86_400_000;

  // Normalise every date to midnight local time, then dedup
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const unique = Array.from(
    new Set(
      activityDates.map((d) => {
        const dt = new Date(d);
        dt.setHours(0, 0, 0, 0);
        return dt.getTime();
      })
    )
  ).sort((a, b) => b - a); // newest first

  let streak = 0;
  let check = today.getTime();

  for (const ts of unique) {
    if (ts === check) {
      streak++;
      check -= MS_DAY;
    } else if (ts < check) {
      // Gap — stop
      break;
    }
    // ts > check would be a future date; skip
  }

  return streak;
}

/**
 * Returns an array of `n` booleans where index 0 = (n-1) days ago
 * and index n-1 = today. True means the user had at least one session
 * on that calendar day.
 */
export function getRecentDays(activityDates: Date[], n = 7): boolean[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayStrings = new Set(
    activityDates.map((d) => {
      const dt = new Date(d);
      dt.setHours(0, 0, 0, 0);
      return dt.toDateString();
    })
  );

  return Array.from({ length: n }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (n - 1 - i));
    return dayStrings.has(d.toDateString());
  });
}
