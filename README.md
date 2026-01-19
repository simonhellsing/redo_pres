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

- `DATABASE_URL` - PostgreSQL database connection string (from Supabase)
- `BRANDFETCH_CLIENT_ID` - Brandfetch API client ID for fetching company logos and branding information (optional)

Create a `.env` file in the root directory for local development:

```bash
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
BRANDFETCH_CLIENT_ID="your-brandfetch-client-id"
```

## Database Setup with Supabase

This application uses Supabase (PostgreSQL) for the database.

### Setting up Supabase

1. **Create a Supabase project**:
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up or log in
   - Click "New Project"
   - Choose a name, database password, and region
   - Wait for the project to be created (takes ~2 minutes)

2. **Get your database connection string**:
   - In your Supabase project dashboard, go to **Settings** → **Database**
   - Scroll down to **Connection string** section
   - Copy the **URI** connection string (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`)
   - Replace `[YOUR-PASSWORD]` with your actual database password
   - This is your `DATABASE_URL`

3. **Run migrations**:
   ```bash
   # Set your DATABASE_URL in .env first, then:
   npx prisma migrate deploy
   ```

4. **Generate Prisma Client** (if needed):
   ```bash
   npx prisma generate
   ```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Prerequisites for Vercel Deployment

1. **Set up Supabase** (see above)

2. **Set Environment Variables in Vercel**:
   - Go to your Vercel project → **Settings** → **Environment Variables**
   - Add the following:
     - `DATABASE_URL` - Your Supabase PostgreSQL connection string (from step 2 above)
     - `BRANDFETCH_CLIENT_ID` - Your Brandfetch API client ID (optional)

3. **Deploy**: 
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect Next.js and deploy your app
   - The `postinstall` script will automatically generate Prisma Client during build

4. **Run migrations on Vercel** (one-time setup):
   - After first deployment, you may need to run migrations
   - You can do this via Vercel's CLI or by adding a build script that runs `prisma migrate deploy`

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
