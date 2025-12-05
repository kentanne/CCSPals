/**
 * Helper functions for form inputs
 */

/**
 * Handle password visibility toggle on keyboard event
 */
export function handlePasswordToggleKeyDown(
  e: React.KeyboardEvent,
  toggleFn: () => void
): void {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleFn();
  }
}
