# Web (Frontend and API Server)

[Website](https://thsr-auto-buy.vercel.app/)

## Features

- Implement reserving booking ticket flow and validation
- Search trains with discounts

## Tools

- 🧙‍♂️ E2E typesafety with [tRPC](https://trpc.io)
- ⚡ Full-stack React with Next.js
- ⚡ Database with Prisma
- 🎨 ESLint + Prettier
- 🔐 Validates your env vars on build and start
- 🦺 Form validate with [Zod](https://zod.dev/) and [React Hook Form](https://react-hook-form.com/)

## Setup

### Requirements

- Postgres
- TDX API key

### Environment Variables

- Create .env file

```bash
cp .env.example .env
```

## Development

- Fill postgres database url and TDX api key from [TDX](https://tdx.transportdata.tw/)

### Start project

```
pnpm dev
```

## Deployment

### Using Vercel

[Reference](https://vercel.com/blog/monorepos#get-started-with-monorepos)
