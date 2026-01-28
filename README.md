# 🚀 Pastebin-Lite

A modern, feature-rich pastebin service built with Next.js 15 and Neon Postgres. Share code and text snippets with optional expiry constraints and view limits.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)

## ✨ Features

- 📝 **Create & Share** - Paste text/code and get a shareable URL
- ⏱️ **Time-based Expiry** - Set TTL (time-to-live) in seconds
- 👁️ **View Limits** - Control how many times a paste can be viewed
- 🎨 **Modern UI** - Cyberpunk/terminal-inspired design with smooth animations
- 🔒 **XSS Protection** - Safe HTML rendering
- ⚡ **Fast & Scalable** - Serverless architecture on Vercel
- 🧪 **Test Mode Support** - Deterministic time for automated testing
- 📱 **Fully Responsive** - Works perfectly on all devices

## 🏗️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS with custom terminal theme
- **Database**: Neon Postgres (serverless PostgreSQL)
- **Deployment**: Vercel
- **Validation**: Zod
- **ID Generation**: nanoid

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Vercel account (for deployment)

## 🚀 Running Locally

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd pastebin-lite
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Neon Postgres Connection (get from Vercel Storage integration)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Optional: Set base URL (auto-detected if not provided)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# For testing with deterministic time
TEST_MODE=0
```

**Note**: You'll get the `DATABASE_URL` from Vercel after deploying and adding a Neon database (see Deployment section).

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Click **"Deploy"** (no configuration needed)

### Step 3: Add Neon Postgres Database

1. After deployment, go to your project dashboard
2. Click **"Storage"** tab
3. Click **"Create Database"**
4. Select **"Neon Postgres"**
5. Choose a name and region, then click **"Create"**
6. Vercel will automatically add the `DATABASE_URL` environment variable

### Step 4: Redeploy

The database schema will be automatically created on the first request to `/api/healthz`.

**That's it! Your app is live! 🎉**

## 🗄️ Persistence Layer

### Database Choice: Neon Postgres

**Why Neon Postgres?**
- ✅ **Serverless**: Autoscales to zero when not in use
- ✅ **PostgreSQL Compatible**: Full PostgreSQL features
- ✅ **Fast**: Separation of storage and compute
- ✅ **Cost-Effective**: Pay only for what you use
- ✅ **Vercel Integration**: Native integration with Vercel
- ✅ **Branching**: Database branching for development

**Note**: We switched from the deprecated `@vercel/postgres` to Neon, which is Vercel's recommended database solution.

### Database Schema

```sql
CREATE TABLE pastes (
  id VARCHAR(12) PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  max_views INTEGER,
  remaining_views INTEGER,
  CHECK (max_views IS NULL OR max_views >= 1),
  CHECK (remaining_views IS NULL OR remaining_views >= 0)
);

CREATE INDEX idx_expires_at ON pastes(expires_at)
WHERE expires_at IS NOT NULL;
```

### Key Design Decisions

1. **Atomic View Decrementing**: Uses `UPDATE ... WHERE remaining_views > 0` to prevent race conditions
2. **Indexed Expiry**: Fast lookups for expiry checks
3. **Nullable Constraints**: `NULL` means unlimited (no TTL or view limit)
4. **Constraint Checks**: Database-level validation for data integrity

## 📡 API Endpoints

### Health Check

```http
GET /api/healthz
```

**Response:**
```json
{
  "ok": true
}
```

### Create Paste

```http
POST /api/pastes
Content-Type: application/json

{
  "content": "Hello, World!",
  "ttl_seconds": 3600,
  "max_views": 5
}
```

**Response:**
```json
{
  "id": "abc123xyz",
  "url": "https://your-app.vercel.app/p/abc123xyz"
}
```

### Fetch Paste (API)

```http
GET /api/pastes/:id
```

**Response:**
```json
{
  "content": "Hello, World!",
  "remaining_views": 4,
  "expires_at": "2026-01-29T12:00:00.000Z"
}
```

**Note**: Each API fetch counts as a view!

### View Paste (HTML)

```http
GET /p/:id
```

Returns HTML page with paste content.

## 🧪 Testing Features

### TEST_MODE Support

For automated testing, set `TEST_MODE=1` and send the `x-test-now-ms` header:

```bash
curl -H "x-test-now-ms: 1706544000000" \
  https://your-app.vercel.app/api/pastes/abc123
```

This allows deterministic testing of expiry logic.

## 🎨 Design Decisions

### Architecture

- **Clean Separation**: API routes, business logic, and UI are separate
- **Type Safety**: Full TypeScript with strict mode
- **Error Handling**: Consistent 4xx/5xx responses with JSON errors
- **Validation**: Zod schemas for input validation

### Frontend

- **Terminal Aesthetic**: Cyberpunk theme with monospace fonts and neon accents
- **Animations**: Smooth fade-ins and slide-ups for better UX
- **Real-time Updates**: Countdown timers for expiring pastes
- **Copy to Clipboard**: One-click URL copying
- **Responsive Design**: Mobile-first approach

### Security

- **XSS Prevention**: Content is rendered as plain text (no HTML injection)
- **SQL Injection Protection**: Parameterized queries
- **No Secrets in Code**: All credentials in environment variables
- **Input Validation**: Server-side validation with Zod

### Performance

- **Connection Pooling**: Efficient database connections with Neon
- **Indexed Queries**: Fast lookups for expired pastes
- **Serverless Functions**: Scale automatically
- **Minimal Dependencies**: Only essential packages

## 📝 Project Structure

```
pastebin-lite/
├── app/
│   ├── api/
│   │   ├── healthz/
│   │   │   └── route.ts          # Health check endpoint
│   │   └── pastes/
│   │       ├── route.ts           # POST create paste
│   │       └── [id]/
│   │           └── route.ts       # GET fetch paste
│   ├── p/
│   │   └── [id]/
│   │       ├── page.tsx           # View paste page
│   │       └── PasteView.tsx      # Client component
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Homepage
│   ├── not-found.tsx              # 404 page
│   └── globals.css                # Global styles
├── lib/
│   ├── db.ts                      # Database operations (Neon)
│   ├── paste.ts                   # Paste business logic
│   ├── time.ts                    # Time utilities (TEST_MODE)
│   ├── validation.ts              # Input validation
│   └── url.ts                     # URL helpers
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🐛 Troubleshooting

### Database Connection Issues

**Error**: `Connection refused` or `DATABASE_URL not set`
- Ensure `DATABASE_URL` is set correctly in `.env.local` or Vercel environment variables
- Check if you've created a Neon database in Vercel Storage

### Deployment Fails

**Error**: `Module not found`
- Run `npm install` locally first
- Ensure `package.json` has all dependencies
- Check Vercel build logs for specific errors

### TEST_MODE Not Working

- Ensure `TEST_MODE=1` is set in environment variables
- Send `x-test-now-ms` header with timestamp in milliseconds
- Example: `x-test-now-ms: 1706544000000` (Unix timestamp)

## 📄 License

MIT License - feel free to use this project for any purpose!

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit PRs.

## 📧 Support

If you have questions or need help, please open an issue on GitHub.

---

Built with ❤️ using Next.js and Neon Postgres
