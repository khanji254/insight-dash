# InsightDash Frontend

React + TypeScript + Vite frontend for the InsightDash political finance transparency platform.

---

## 📋 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 5.4
- **Language**: TypeScript 5.9
- **Routing**: React Router 7
- **State Management**: TanStack Query 5
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

---

## 🚀 Quick Start

### Prerequisites

- Node.js 22.x or higher
- npm 10.x or higher
- Backend server running (default: `http://localhost:3001`)

### Installation

```sh
# Install dependencies
npm install

# Set up environment variables (optional)
# Create .env.local if you need to override API URL
echo "VITE_API_URL=http://localhost:3001/api/v1" > .env.local

# Start development server
npm run dev
```

The app will start on `http://localhost:8080`.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

---

## 🎨 UI Components

Built with [shadcn/ui](https://ui.shadcn.com/) - re-usable components with Radix UI and Tailwind CSS.

### Adding Components

```sh
npx shadcn@latest add button
npx shadcn@latest add dialog
```

---

## 🔐 Authentication Flow

1. **Public Routes**: `/login`, `/signup`, `/verify-otp`
2. **Protected Routes**: `/`, `/leaderboard`, `/entity/:id`, etc.
3. **Admin Routes**: `/admin` (ADMIN role only)

### Auth Context

```tsx
import { useAuth } from "@/lib/auth-context";

const { user, login, logout } = useAuth();
```

---

## 🚀 Deployment

### Vercel (Recommended)

```sh
npm i -g vercel
vercel login
vercel
```

Set `VITE_API_URL` environment variable in Vercel dashboard.

---

## 🛠️ Scripts

```sh
npm run dev         # Start dev server
npm run build       # Build for production
npm run preview     # Preview build
npm run lint        # Run linter
npm test            # Run tests
```

---

## 📚 Related Documentation

- [Backend README](../backend/README.md)
- [Security Documentation](../SECURITY.md)
- [Main README](../README.md)

---

## 📄 License

MIT
Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
