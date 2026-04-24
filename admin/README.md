# KDS Admin Dashboard

The administrative control panel for managing products, orders, customers, and site settings.

## 🛠️ Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Components**: Custom UI Library
- **Authentication**: Admin JWT + Secret Code

## ⚙️ Environment Variables

Create a `.env.local` file in the `admin` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
ADMIN_SECRET_CODE=your_secret_code
```

## 🚀 Key Features
- **Order Management**: Track order status, handle refunds, and view history.
- **Product Catalog**: Add/edit products, manage variants and stock levels.
- **Analytics**: Overview of sales, trending products, and user growth.
- **Settings**: Manage hero banners, ticker text, and site-wide configurations.

## 🏃 Getting Started

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
