# duelsplus-api
Simple but blazing fast backend for **Duels+** by [Venxm*](https://github.com/venxmised) made with [Next.js](https://nextjs.org). The API is still a work in progress, just the bare bones for now.
###### *the API was developed by me, for Venxm's project

> [!NOTE]  
> If you were to create an API like this one, **please** avoid using Next.js -- there's alternatives such as Express.js that fit this use case better

## Setting up

1. Copy `.env.example` and fill in the values
```env
DATABASE_URL=postgres://...
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_REDIRECT_URI=http://localhost:3000/auth/callback
JWT_SECRET=
```

The database URL must point to a **PostgreSQL** database, unless you modify the Prisma schema to work with whatever database you prefer.

2. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser and you should get a response.

## Deploy on Vercel

I highly recommend deploying this on the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.
