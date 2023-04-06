# THSR Auto Buy

<p align="middle">
  <img src="https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" width="100" style="margin-right: 10px;"/>
  <img src="https://camo.githubusercontent.com/e1e113df83e7731fdb90f6f0ab2eeb155fd1b48c27d99814dcf1c23c0acdc6a2/68747470733a2f2f6173736574732e76657263656c2e636f6d2f696d6167652f75706c6f61642f76313636323133303535392f6e6578746a732f49636f6e5f6461726b5f6261636b67726f756e642e706e67" width="100" style="margin-right: 10px;"/>
  <img src="https://cdn.cdnlogo.com/logos/r/85/react.svg" width="100" style="margin-right: 10px;"/>
  <img src="https://trpc.io/img/logo.svg" width="100" style="margin-right: 10px;" />
  <img src="https://cdn.cdnlogo.com/logos/f/67/firebase.svg" width="100" />
</p>

<p align="center"><a href="https://thsr-auto-buy.vercel.app/">✨ https://thsr-auto-buy.vercel.app/ ✨ </a></p>

## Features

- Implement both [frontend](./apps/web/README.md) and [serverless backend](./apps/functions/README.md) for reserving auto booking ticket
- Managing discounts and train searching
- Auto calculate ticket start booking date
- Update train discounts and special days every 2 AM with [cron-job](https://cron-job.org/en/)
- Booking Ticket at every exactly midnight and retry until 2 AM

## Apps and Packages

### Apps

- `web`: Full-stack app for reserving ticket and searching trains with discounts
- `functions`: Serverless backend for crawling and booking tickets with

### Packages

- `crawler`: crawling discounts and special days from thsr website
- `database`: database models
- `taiwan-id`: taiwanese id validator and generator
- `tdx-api`: tdx api
- `ticket-flow`: booking thsr ticket flow
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## Setup

### Build

To build all apps and packages, run the following command:

```
pnpm run build
```

### Develop

To develop frontend, run the following command:

```
pnpm run dev
```

## Difficulties and Experience

- Handled deploy firebase functions
  - Firebase not support monorepo
  - Prisma needed to set `binaryTargets` for running on Firebase functions
- Handled booking ticket flow with cookies validation
- Handled cleaning crawled data
- Handled retry mechanism
- Handled locale timezone (firebase cloud functions is run at utc+0 and frontend is utc+8)
- Tried many **_free_** databases, finally choose PostgreSQL with [Supabase](https://supabase.com/) due to:
  - Firebase firestore: it's not type safe enough and it is annoying to handle `TimeStamp` in firestore and convert it to `Date`
  - MySQL with [PlanetScale](https://planetscale.com/): [Planet doesn't support foreign keys](https://www.prisma.io/docs/guides/database/planetscale#differences-to-consider)
  - PostgreSQL with [fly.io](https://fly.io/): it is a mistake..., it is not supported outside applications to connect
