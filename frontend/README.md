# KDS Storefront

The customer-facing sneaker marketplace for Kicks Don't Stink, built with Next.js and Tailwind CSS.

## 🛠️ Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Authentication**: Clerk / Custom JWT (Integrated with Backend)
- **State Management**: React Context
- **Deployment**: Vercel (recommended)

## ⚙️ Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run in development mode:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## 📂 Key Directories
- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components.
- `context/`: Shared state for Cart, Auth, and Theme.
- `lib/`: API clients and helper functions.
- `public/`: Static assets.
