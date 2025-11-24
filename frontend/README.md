# Next.js Frontend for Ecommerce

A full-featured Next.js 14 ecommerce frontend with Bootstrap 5, featuring customer shopping and admin management pages.

## Features

- **Customer Shop Page** (`/`): Browse active products, view details, adjust quantities, and purchase items
- **Admin Panel** (`/admin`): Full CRUD operations for products (Create, Read, Update, Delete)
- **Bootstrap 5**: Responsive, professional UI
- **Isolated API Config**: Centralized API configuration via `.env.local`
- **TypeScript**: Full type safety with product interfaces
- **Axios**: Robust HTTP client for API communication

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure API URL** in `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```
   Update this if your backend API runs on a different URL.

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Pages

### Shop Page (`/`)
- Displays all active products in a grid layout
- Shows product details: name, description, category, price, stock
- Allows customers to select quantity and purchase
- Updates inventory in real-time
- Shows out-of-stock indicator for depleted items

### Admin Page (`/admin`)
- Full product management table
- **Create**: Add new products with category, price, stock, description
- **Update**: Edit existing product details
- **Delete**: Remove products with confirmation
- Toggle product active/inactive status
- Responsive table view with action buttons

## API Configuration

All API calls are centralized in `lib/productService.ts` and use configuration from `lib/apiConfig.ts`.

**API Endpoints used**:
- `GET /products` - List all products
- `POST /products` - Create new product
- `GET /products/:id` - Get single product
- `PATCH /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `POST /products/:id/buy` - Purchase product with stock deduction

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000` | Backend API URL |

## Build & Production

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## Technology Stack

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Bootstrap 5** - CSS framework
- **react-bootstrap** - Bootstrap React components
- **TypeScript** - Type-safe JavaScript
- **Axios** - HTTP client

## Folder Structure

```
frontend/
├── app/
│   ├── page.tsx          # Shop page (customer)
│   ├── admin/
│   │   └── page.tsx      # Admin management page
│   ├── layout.tsx        # Root layout with Navbar
│   └── globals.css       # Global styles
├── components/
│   └── Navbar.tsx        # Navigation component
├── lib/
│   ├── apiConfig.ts      # API endpoint configuration
│   └── productService.ts # API client & service
├── .env.local            # Environment variables (API URL)
└── package.json          # Dependencies
```

## Notes

- The shop page auto-hides out-of-stock products
- Admin can toggle product status without deletion
- All product updates require valid name, category, and price
- API errors are displayed as alerts to the user

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
