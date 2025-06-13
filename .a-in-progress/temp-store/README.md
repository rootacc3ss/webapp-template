# Webapp Scaffold - Full Stack Application

A modern, full-stack web application built with React, TypeScript, Supabase, and a comprehensive UI component library. This project serves as a complete template for building scalable web applications with authentication, data visualization, and modern design patterns.

## 🚀 Tech Stack

### Frontend
- **React** ^18.3.1 - Modern React with hooks and functional components
- **TypeScript** ^5.5.3 - Type-safe development
- **Vite** ^5.4.1 - Lightning-fast build tool
- **React Router DOM** ^6.26.2 - Client-side routing

### Backend & Database
- **Supabase** ^2.49.4 - Backend-as-a-Service (Auth, Database, Storage)
- **Supabase Edge Functions** - Serverless functions with Deno runtime

### Styling & UI
- **Tailwind CSS** ^3.4.11 - Utility-first CSS framework
- **shadcn/ui** - High-quality component library built on Radix UI
- **Radix UI** - Unstyled, accessible UI primitives
- **Material UI (MUI)** ^6.1.1 - Additional robust components
- **Lucide React** ^0.462.0 - Beautiful icon set
- **Framer Motion** ^11.5.4 - Smooth animations

### State Management & Data
- **TanStack React Query** ^5.56.2 - Server state management
- **React Hook Form** ^7.53.0 - Form handling
- **Zod** ^3.23.8 - Schema validation

### Data Visualization
- **Recharts** ^2.12.7 - Composable charting library
- **React Resizable Panels** ^2.1.3 - Resizable layouts
- **React Masonry CSS** ^1.0.16 - Masonry layouts

### Additional Features
- **Stripe Integration** - Payment processing
- **Embla Carousel** ^8.3.0 - Touch-friendly carousels
- **Sonner** ^1.5.0 - Toast notifications
- **React Day Picker** ^8.10.1 - Date selection
- **Vaul** ^0.9.3 - Drawer components

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd webapp-scaffold
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Header, Sidebar, etc.)
│   └── ui/             # Base UI components (Button, Card, etc.)
├── lib/                # Utility libraries and configurations
│   ├── supabase.ts     # Supabase client setup
│   └── utils.ts        # Common utility functions
├── pages/              # Page components
├── styles/             # Global styles and CSS
├── types/              # TypeScript type definitions
└── hooks/              # Custom React hooks (to be added)
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run supabase:start` - Start local Supabase
- `npm run supabase:stop` - Stop local Supabase
- `npm run supabase:reset` - Reset local database
- `npm run supabase:gen-types` - Generate TypeScript types from database

## 🗄️ Database Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

3. **Initialize Supabase locally**
   ```bash
   supabase init
   supabase start
   ```

4. **Link to your project**
   ```bash
   supabase link --project-ref your-project-ref
   ```

5. **Generate types**
   ```bash
   npm run supabase:gen-types
   ```

## 🎨 Design System

The application uses a comprehensive design system with:

- **Dark/Light mode** support
- **Responsive design** for all screen sizes
- **Consistent spacing** and typography
- **Accessible components** built on Radix UI
- **Smooth animations** with Framer Motion
- **Custom CSS utilities** for common patterns

### Color Scheme
- Primary colors with HSL CSS variables
- Semantic color tokens (success, warning, error)
- Automatic dark mode adaptation

### Typography
- Inter font family for UI text
- JetBrains Mono for code/monospace text
- Consistent font weights and sizes

## 🔐 Authentication

Authentication is handled by Supabase Auth with support for:

- Email/password authentication
- OAuth providers (GitHub, Google)
- Session management
- Protected routes
- User profile management

## 💳 Payments (Stripe Integration)

The application includes Stripe integration for:

- Subscription management
- One-time payments
- Webhook handling
- Customer portal

## 📊 Data Visualization

Built-in components for:

- Bar charts, line charts, pie charts
- Real-time data updates
- Interactive dashboards
- Responsive chart layouts

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🧪 Testing

Testing setup (to be implemented):
- **Vitest** for unit testing
- **Testing Library** for component testing
- **Playwright** for E2E testing

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Join our community discussions

## 🔮 Roadmap

- [ ] Add comprehensive testing suite
- [ ] Implement real-time features with Supabase Realtime
- [ ] Add more data visualization components
- [ ] Implement advanced authentication features
- [ ] Add internationalization (i18n)
- [ ] Performance optimizations
- [ ] Mobile app with React Native

---

Built with ❤️ using modern web technologies 