# Firebase Functions

## Features

- 📆 Handle database schedule jobs
  - 🌞 Update Crawled data (discounts and special days)
  - 📘 Book reservations at exactly midnight
- ⚙️ Retry Mechanism

---

## Setup Secret

### Setup in development

```bash
cp .secret.example .secret.local
```

### Setup in production

Using Firebase CLI

```bash
firebase functions:secrets:set SECRET_NAME
```

[reference](https://firebase.google.com/docs/functions/config-env#create-secret)

---

## Develop

```bash
pnpm serve
```

---

## Deploy

Using [deploy.sh](./deploy.sh) script to handle deploy flow, because `firebase function` doesn't not support monorepo

---

## Database Connection

### Two different database urls

1. `DATABASE_URL` should include `pgbouncer=true` to handle connection pooling during booking tickets
2. `DATABASE_DIRECT_URL` should be url without pgbouncer for update large data (ex:train information)

### Using pgBouncer for serverless functions

Using pgBouncer for serverless functions to avoid `connection timeout`

- [Prisma Connection Management](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#the-serverless-challenge)
- [Supabase](https://supabase.com/blog/supabase-pgbouncer)
- [Supabase with Prisma](https://supabase.com/docs/guides/integrations/prisma)

---

## Emulator

Run script to enable firestore emulator

[reference](https://stackoverflow.com/questions/56158010/firestore-firebase-emulator-not-running)

```
firebase setup:emulators:firestore
```

Note: Emulator doesn't support retry policy

[reference](https://github.com/firebase/firebase-tools/issues/3738)
