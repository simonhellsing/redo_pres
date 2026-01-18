This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Environment Variables

This application requires the following environment variables:

- `DATABASE_URL` - Database connection string. Currently uses SQLite for local development (e.g., `file:./prisma/dev.db`). For Vercel deployment, you'll need a PostgreSQL connection string.
- `BRANDFETCH_CLIENT_ID` - Brandfetch API client ID for fetching company logos and branding information.

Create a `.env` file in the root directory for local development:

```bash
DATABASE_URL="file:./prisma/dev.db"
BRANDFETCH_CLIENT_ID="your-brandfetch-client-id"
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Prerequisites for Vercel Deployment

1. **Database Migration Required**: This app currently uses SQLite, which requires a writable filesystem. Vercel uses serverless functions with a read-only filesystem, so you'll need to migrate to a hosted database before deployment:
   - **Recommended**: Use [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) or another PostgreSQL provider
   - Update `DATABASE_URL` in your Vercel project settings with the PostgreSQL connection string
   - Run Prisma migrations: `npx prisma migrate deploy`

2. **Set Environment Variables**: In your Vercel project settings, add:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `BRANDFETCH_CLIENT_ID` - Your Brandfetch API client ID

3. **Deploy**: Connect your GitHub repository to Vercel, and Vercel will automatically detect Next.js and deploy your app.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
