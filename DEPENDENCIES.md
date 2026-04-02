# Required Dependencies for Database Setup

Add these packages to your project:

```bash
npm install mongoose bcryptjs
npm install --save-dev @types/node
```

## Updated package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "seed": "ts-node src/lib/db/seed.ts",
    "db": "mongosh $MONGODB_URI"
  }
}
```

## What Each Package Does

| Package       | Purpose                            | Size   |
| ------------- | ---------------------------------- | ------ |
| `mongoose`    | MongoDB ODM (Object Data Modeling) | ~4MB   |
| `bcryptjs`    | Password hashing & verification    | ~500KB |
| `@types/node` | TypeScript types for Node.js       | -      |

## Current Dependencies in Your Project

Your Next.js project already has:

- ✅ react, react-dom
- ✅ next
- ✅ tailwindcss
- ✅ typescript

## Installation Steps

```bash
# 1. Install dependencies
npm install mongoose bcryptjs

# 2. Install dev dependencies
npm install --save-dev @types/node

# 3. Create .env.local file
cp .env.local.example .env.local

# 4. Edit .env.local with your MongoDB credentials
# (See DATABASE_SETUP_GUIDE.md for instructions)

# 5. Seed initial data (optional)
npm run seed

# 6. Start development server
npm run dev
```

## Verify Installation

Run this to check all dependencies are installed:

```bash
npm list mongoose bcryptjs
```

You should see output like:

```
├── bcryptjs@2.4.3
├── mongoose@7.x.x
```

## TypeScript Configuration

Make sure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true,
    "resolveJsonModule": true,
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

The `@/*` path alias allows imports like:

```typescript
import dbConnect from "@/lib/db/connect";
import User from "@/models/User";
```

## Optional Additions

For production, consider adding:

```bash
# Environment variable validation
npm install zod

# Better error handling
npm install next-connect

# Request logging
npm install morgan

# Rate limiting
npm install express-rate-limit
```
