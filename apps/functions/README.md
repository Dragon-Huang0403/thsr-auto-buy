# Firebase Functions

## Features

- 📆 Handle database schedule jobs
  - 🌞 Update Crawled data (discounts and special days)
  - 📘 Book reservations at exactly midnight
- ⚙️ Retry Mechanism

## Setup Secret

Using Firebase CLI

```bash
firebase functions:secrets:set SECRET_NAME
```

[reference](https://firebase.google.com/docs/functions/config-env#create-secret)

## Develop

```bash
pnpm serve
```

## Deploy

Using [deploy.sh](./deploy.sh) script to handle deploy flow.

Because firebase functions not support monorepo

# Emulator

Run script to enable firestore emulator

[reference](https://stackoverflow.com/questions/56158010/firestore-firebase-emulator-not-running)

```
firebase setup:emulators:firestore
```

Note: Emulator doesn't support retry policy

[reference](https://github.com/firebase/firebase-tools/issues/3738)
