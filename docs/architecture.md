# Architecture — social-frontend (planned)

## Will own

- Feed and post UI
- Profile and relationship views
- Follow graph UI

## Will not own

- Auth (central Keycloak SSO and the platform JWT bridge)
- API logic (calls social-backend)

## Stack

Next.js 15, TypeScript, Tailwind — match platform-frontend design tokens.

## Launch

The platform dashboard launches Social at `/auth/bridge?code=<one-time-code>&next=<path>&embed=1`.
The bridge exchanges the short-lived code with platform-backend, creates the product session from
the returned token, and redirects only to a local path. The platform JWT never appears in a URL.
Direct visits use the same Keycloak SSO flow; Social never stores passwords. Embedded visits preserve
`embed=1` in the URL and an httpOnly cookie, while standalone visits retain the product navigation
and chrome.
