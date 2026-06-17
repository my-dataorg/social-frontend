# Architecture — social-frontend (planned)

## Will own

- Feed and post UI
- Profile and relationship views
- Follow graph UI

## Will not own

- Auth (Keycloak via platform-frontend pattern)
- API logic (calls social-backend)

## Stack

Next.js 15, TypeScript, Tailwind — match platform-frontend design tokens.

## Launch

Product card in platform dashboard → `http://localhost:3020` when implemented.
