# Web App Template

## Overview

This repository is a frontend-first scaffold for starting a modern React + Vite application. It ships with a minimal starter screen, a working Tailwind pipeline, and optional helper modules for Supabase and Stripe so you can layer in routes, data, and payments as your product takes shape.

**Built for extensibility** - easily add new packages, integrations, features, and more.

> **Note:** Previous work-in-progress tools and features have been archived and are preserved in the `pre-reno` branch for reference.

## 🚀 Complete Technology Stack

### **Frontend Core**
- **React ^19.2.4** with **TypeScript ^5.9.3** for robust type-safe development
- **Vite ^8.0.0** as the lightning-fast build tool and development server
- **React Router DOM ^7.13.1** for seamless client-side navigation

### **Backend & Database**
- **Supabase ^2.99.2** (Authentication, PostgreSQL Database, Real-time subscriptions, Storage)
- **Supabase Edge Functions** (Deno runtime for serverless functions)
- **Supabase Auth UI React ^0.4.7** for pre-built authentication components

### **Styling & UI Framework**
- **Tailwind CSS ^4.2.1** for utility-first styling
- **Tailwind Merge ^3.5.0** for conditional class merging
- **Tailwind Animate ^1.0.7** for smooth CSS animations
- **@tailwindcss/typography ^0.5.19** for rich text styling
- **PostCSS ^8.5.8** and **Autoprefixer ^10.4.27** for CSS processing

### **Component Libraries & UI**
- **shadcn/ui** components built on **Radix UI** for accessible, customizable components:
  - Dialog, Dropdown Menu, Avatar, Checkbox, Label, Progress, Select, Separator, Slot, Switch, Tabs, Toast, Tooltip
- **Material UI (MUI) ^7.3.9** with **MUI Icons ^7.3.9** for additional robust components
- **Lucide React ^0.577.0** for beautiful, consistent icons
- **Embla Carousel ^8.3.0** for touch-friendly carousels and sliders
- **Sonner ^2.0.7** for elegant toast notifications
- **React Day Picker ^9.14.0** for date selection interfaces
- **Vaul ^1.1.2** for drawer components

### **State Management & Data Fetching**
- **TanStack React Query ^5.90.21** for server state management and caching
- **React Hook Form ^7.71.2** for performant form handling
- **Zod ^4.3.6** for schema validation and type safety
- **@hookform/resolvers ^5.2.2** for form validation integration

### **Styling Utilities**
- **clsx ^2.1.1** for conditional className joining
- **class-variance-authority ^0.7.1** for component variant management
- **Framer Motion ^12.38.0** for sophisticated animations and interactions

### **Data Visualization**
- **Recharts ^3.8.0** for React-based charts and graphs
- **React Resizable Panels ^4.7.3** for flexible layout panels
- **React Masonry CSS ^1.0.16** for masonry-style layouts
- **Nivo** (Core, Bar, Line, Pie charts) for advanced data visualization
- **D3.js ^7.9.0** for custom data visualizations

### **Theming & Visual Effects**
- **next-themes ^0.4.6** for dark/light theme switching with system preference detection
- **date-fns ^4.1.0** for date manipulation and formatting
- **Custom CSS variables** for consistent theming across components

### **Payment Processing**
- **Stripe Integration** with **@stripe/stripe-js ^8.10.0** and **@stripe/react-stripe-js ^5.6.1**
- **Secure payment processing** ready for production deployment

### **Development Tools & Quality**
- **ESLint ^9.39.4** with **TypeScript ESLint** for code quality
- **@vitejs/plugin-react-swc ^4.3.0** for fast React refresh
- **Comprehensive TypeScript configuration** with strict type checking

## ✨ Key Features

- 🎯 **Minimal Starter Screen** - A clean entry point in `src/main.tsx` that is easy to replace as your app grows
- 🎨 **Tailwind Ready** - Tailwind CSS is wired into the app with a base stylesheet and starter theme tokens
- 🔐 **Optional Supabase Helpers** - Supabase utilities stay dormant until you add environment variables
- 💳 **Optional Stripe Helpers** - Stripe session helpers use explicit endpoint env vars instead of assuming a local `/api` server
- 🧱 **Type-Safe Foundation** - Strict TypeScript, ESLint, and Vite are set up for day-one development
- 🧰 **Large Package Head Start** - UI, forms, animation, charts, theming, and utility libraries are already installed

## 📁 Project Structure

```
/public
  favicon.svg          # Default favicon used by the starter
/src
  main.tsx             # Minimal starter screen and React entry point
  /lib
    supabase.ts       # Optional Supabase client and auth helpers
    stripe.ts         # Optional Stripe session helpers
    utils.ts          # Shared utility functions
  /styles
    globals.css       # Tailwind import and base app styling
  /types
    supabase.ts       # Placeholder for generated Supabase types
  vite-env.d.ts       # Vite environment typings
```

Create feature folders such as `components`, `pages`, `hooks`, or `providers` as your application architecture grows.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project (only if you plan to use Supabase)
- Stripe account (only if you plan to use payments)

### Installation

1. **Clone this repository**
   ```bash
   git clone <repository-url>
   cd webapp-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy `env.example` to `.env` and fill in only the credentials you need. The starter screen works without these values, but the optional Supabase and Stripe helpers require them.
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   VITE_STRIPE_CHECKOUT_ENDPOINT=https://your-app.example/api/create-checkout-session
   VITE_STRIPE_PORTAL_ENDPOINT=https://your-app.example/api/create-portal-session
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Supabase Setup** (optional, after `supabase init`)
   ```bash
   npm run supabase:start
   npm run supabase:gen-types
   ```

## 🛠️ Development Commands

### **Core Development**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### **Supabase Operations**
```bash
npm run supabase:start     # Start local Supabase
npm run supabase:stop      # Stop local Supabase
npm run supabase:reset     # Reset database
npm run supabase:migrate   # Run migrations
npm run supabase:gen-types # Generate TypeScript types
```

These commands require a local Supabase project to be initialized first.

## 🔧 Adding New Features

### **Installing New Packages**
```bash
npm install <package-name>
```

### **Common Extension Points**
- **App Structure**: Create `/src/components/`, `/src/pages/`, `/src/hooks/`, or `/src/providers/` as needed
- **Entry Flow**: Expand `/src/main.tsx` with routing, providers, and layout composition
- **Utilities**: Extend `/src/lib/utils.ts`
- **Types**: Add app-specific types to `/src/types/`

### **Supabase Integration Patterns**
- Use the optional client in `/src/lib/supabase.ts`
- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` before calling the helpers
- Leverage React Query for data fetching and caching
- Generate `src/types/supabase.ts` from your schema when ready
- Run `supabase init` before local CLI commands
- Implement Row Level Security (RLS) for data protection

### **Stripe Integration Best Practices**
- Use the configured client in `/src/lib/stripe.ts`
- Set `VITE_STRIPE_CHECKOUT_ENDPOINT` and `VITE_STRIPE_PORTAL_ENDPOINT` to your own API routes or Edge Functions
- Implement server-side webhooks for secure payment processing
- Connect Stripe customers with Supabase user authentication
- Keep `STRIPE_SECRET_KEY` on the server only
- Test with Stripe's test mode before going live

## 🔒 Security & Production Readiness

- **Environment Variables**: All sensitive data uses environment variables
- **TypeScript**: Full type safety throughout the application
- **ESLint**: Code quality and consistency enforcement
- **Supabase RLS**: Available once you adopt Supabase-backed data
- **Stripe Webhooks**: Required once you adopt Stripe-backed billing
- **HTTPS Ready**: Configured for secure deployment

## 📚 Documentation & Resources

### **Learn More About Key Technologies**
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Framer Motion](https://www.framer.com/motion/)
- [React Query](https://tanstack.com/query/latest)

### **Component Libraries**
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Material UI Documentation](https://mui.com/)
- [Lucide Icons](https://lucide.dev/)

## ⚠️ Important Notes

- **Production Requirements**: Configure only the environment variables for the integrations you actually use
- **Supabase CLI**: Run `supabase init` before using the local Supabase scripts
- **Database Migrations**: Apply Supabase migrations before deploying database changes
- **Stripe Endpoints**: Configure checkout and portal endpoints before calling the Stripe helpers
- **Security**: Review and implement proper Row Level Security policies
- **Performance**: Consider implementing code splitting for larger applications

## 🚀 Deployment

This application is optimized for deployment on:
- **Vercel** (recommended for frontend)
- **Netlify** (alternative frontend hosting)
- **Supabase** (backend services)
- **Custom VPS** (full control deployment)

---

## 📋 Git Configuration & Setup Requirements

### **What's Included in .gitignore**

The following files and directories are automatically excluded from version control:

#### **🔐 Sensitive & Environment Files**
```
.env                      # Main environment variables file
.env.local               # Local environment overrides
.env.development.local   # Development-specific variables
.env.test.local         # Test environment variables
.env.production.local   # Production environment overrides
```

#### **📦 Dependencies & Build Files**
```
node_modules/           # NPM packages (auto-installed)
dist/                   # Production build output
dist-ssr/              # Server-side rendering build
build/                  # Alternative build directory
out/                    # Next.js build output
```

#### **🔧 Development & Tool Files**
```
.supabase/             # Local Supabase configuration
.vscode/*              # VS Code settings (except extensions.json)
.idea/                 # JetBrains IDE settings
.DS_Store              # macOS system files
Thumbs.db              # Windows system files
*.log                  # Log files
.eslintcache           # ESLint cache
.npm/                  # NPM cache
```

#### **🧪 Testing & Coverage**
```
coverage/              # Test coverage reports
.nyc_output            # Coverage tool output
*.tmp, *.temp          # Temporary files
```

### **🛠️ Manual Setup Required After Cloning**

When someone clones this repository, they will need to manually set up:

#### **1. Environment Variables** ⚠️ **CRITICAL**
```bash
# Copy the example file and configure
cp env.example .env

# Then edit .env with your actual values:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGc...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_CHECKOUT_ENDPOINT=https://your-app.example/api/create-checkout-session
VITE_STRIPE_PORTAL_ENDPOINT=https://your-app.example/api/create-portal-session
# Server-only secret. Do not expose this in the browser.
STRIPE_SECRET_KEY=sk_test_...
VITE_ANALYTICS_ID=your_analytics_id
```

#### **2. Dependencies Installation**
```bash
npm install              # Install all NPM packages
```

#### **3. Supabase Configuration**
```bash
# For local development (optional, after `supabase init`)
npm run supabase:start
npm run supabase:gen-types

# Or configure to use your remote Supabase project
# (Set up tables, RLS policies, Edge Functions)
```

#### **4. Third-Party Service Setup**

**Supabase Requirements:**
- Create a new Supabase project
- Set up authentication providers (Google, GitHub, etc.)
- Configure database tables and Row Level Security
- Deploy Edge Functions (if using server-side logic)

**Stripe Requirements:**
- Create Stripe account and get API keys
- Create checkout and billing portal endpoints in your backend or Edge Functions
- Set up webhook endpoints for your domain
- Configure product/pricing information
- Test with Stripe's test mode first

#### **5. Optional IDE Configuration**
```bash
# VS Code extensions (recommended)
# Extensions listed in .vscode/extensions.json will be suggested
```

### **🚨 Security Reminders**

- **Never commit `.env` files** to version control
- **Rotate API keys regularly** in production
- **Use different keys** for development/staging/production
- **Enable webhook signature verification** for Stripe
- **Configure CORS properly** in Supabase
- **Review RLS policies** before going live

### **✅ Quick Setup Checklist**

```bash
□ Clone repository
□ Run `npm install`
□ Copy `env.example` to `.env`
□ Configure only the environment variables you need
□ Set up Supabase project (if using Supabase)
□ Configure Stripe account and endpoints (if using Stripe)
□ Test local development server
□ Verify authentication works (if enabled)
□ Test payment flow in test mode (if enabled)
□ Deploy to staging environment
□ Configure production environment variables
□ Set up webhook endpoints
□ Go live! 🚀
```

**Ready to build?** This template gives you a clean React/Vite starting point plus a large library set you can opt into as the product evolves.
