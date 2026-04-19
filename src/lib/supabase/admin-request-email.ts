/**
 * Set by middleware after verifying admin role so the dashboard layout can show
 * the signed-in email without a second `auth.getUser()` round trip.
 */
export const ADMIN_USER_EMAIL_HEADER = "x-gb-admin-user-email";
