/** Session cookie name — kept in a separate file so middleware
 *  can import it without pulling in pg (Node.js only). */
export const COOKIE_NAME = 'liminal_session';
export const SESSION_DURATION_DAYS = 30;
