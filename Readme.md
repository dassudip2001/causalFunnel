# CausalFunnel

A comprehensive user analytics platform that tracks events, sessions, and user journeys in real-time. Built with modern web technologies for scalability and performance.

## 📋 Table of Contents

- [Setup Steps](#setup-steps)
- [Tech Stack](#tech-stack)
- [Assumptions & Trade-offs](#assumptions--trade-offs)
- [Project Structure](#project-structure)

---

## 🚀 Setup Steps

### Prerequisites

- **Node.js**: v18+ (or Bun v1.0+)
- **MongoDB**: Local or cloud instance (MongoDB Atlas recommended)
- **Git**: For version control

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/dassudip2001/causalFunnel.git
cd CausalFunnel
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
bun install
# or
npm install

# Set up environment variables
cp .env.example .env.local

# Configure .env.local with:
# DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/causalfunnel
# PORT=3001
# NODE_ENV=development

# Generate Prisma client
bunx prisma generate

# Push schema to database
bunx prisma db push

# Start development server
bun run dev
# Server runs on http://localhost:3001
```

#### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
bun install
# or
npm install

# Configure environment variables
cp .example.env .env.local

# Configure .env.local with:
# NEXT_PUBLIC_API_URL=http://localhost:3001

# Start development server
bun run dev
# Frontend runs on http://localhost:3000
```

#### 4. Tracking Script Setup (Optional)

```bash
cd ../tracking-script

# To use the tracker on your website:
# 1. Copy tracker.js to your web server
# 2. Add to your HTML:
<script src="path/to/tracker.js"></script>
<script>
  CausalFunnel.init({
    apiUrl: 'url-to-your-backend/api/v1/analytics/event'
  });
</script>
```

---

## 🛠️ Tech Stack

### Backend

| Technology     | Version | Purpose               |
| -------------- | ------- | --------------------- |
| **Express.js** | v5.2.1  | REST API framework    |
| **Node.js**    | v18+    | Runtime environment   |
| **Prisma**     | v6.19   | ORM & database client |
| **MongoDB**    | Latest  | NoSQL database        |
| **Zod**        | v4.4.3  | Schema validation     |
| **CORS**       | v2.8.6  | Cross-origin requests |
| **Helmet**     | v8.1.0  | Security headers      |
| **Morgan**     | v1.10.1 | HTTP request logging  |

### Frontend

| Technology       | Version | Purpose                 |
| ---------------- | ------- | ----------------------- |
| **Next.js**      | Latest  | React framework & SSR   |
| **TypeScript**   | v6.0.3  | Type safety             |
| **React Query**  | v5+     | Server state management |
| **Axios**        | Latest  | HTTP client             |
| **Tailwind CSS** | Latest  | Styling                 |
| **Shadcn/ui**    | Latest  | UI components           |
| **Lucide Icons** | v1.14.0 | Icon library            |

### Database

| Service           | Version | Purpose                         |
| ----------------- | ------- | ------------------------------- |
| **MongoDB**       | 6.0+    | Primary data store              |
| **Prisma Studio** | v6.19   | Data visualization & management |

---

## 📝 Assumptions & Trade-offs

### Assumptions

1. **Session Management**
   - Sessions are identified by `sessionId` (string-based UUID/custom ID)
   - No server-side session storage; sessions tracked via database records
   - Client sends `sessionId` with each event

2. **Event Tracking**
   - Click events automatically capture `clickX` and `clickY` coordinates
   - Page URL is captured for each pageview event
   - Timestamps are server-generated for consistency

3. **User Identification**
   - Anonymous tracking (no user authentication required)
   - All tracking is session-based, not user-based
   - Privacy-first: minimal PII collected

4. **Database Schema**
   - MongoDB ObjectId used as primary key (mapped to `_id`)
   - Enums for EventType stored as strings (`CLICK`, `PAGEVIEW`)
   - No soft deletes; events are immutable once created

---

## 📁 Project Structure

```
CausalFunnel/
├── backend/                    # Express API server
│   ├── src/
│   │   ├── app.ts             # Express app setup
│   │   ├── server.ts          # Server entry point
│   │   ├── controllers/       # Route handlers
│   │   ├── services/          # Business logic
│   │   ├── routers/           # API routes
│   │   ├── schema/            # Zod validation schemas
│   │   ├── lib/               # Utilities (Prisma client)
│   │   └── config/            # Environment config
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # Next.js dashboard
│   ├── app/                   # App router (Next.js 13+)
│   │   ├── (main)/
│   │   │   ├── dashboard/     # Dashboard page
│   │   │   └── sessions/      # Sessions & events page
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                # Shadcn/ui components
│   │   ├── app-sidebar.tsx
│   │   ├── nav-main.tsx       # Navigation with active state
│   │   ├── nav-documents.tsx  # Document nav
│   │   └── ...
│   ├── lib/                   # Utilities & API client
│   ├── schema/                # Zod schemas (shared with backend)
│   ├── hooks/                 # Custom React hooks
│   ├── context/               # React context (TanStack Query)
│   ├── package.json
│   └── tsconfig.json
│
├── tracking-script/           # JavaScript event tracker
│   ├── tracker.js             # Main tracking library
│   ├── script.js              # Event listeners
│   └── index.html             # Example integration
│
└── Readme.md                   # This file
```

---

## 🔗 API Endpoints

### Analytics Routes

- `POST /analytics/event` - Track a single event
- `GET /analytics/sessions` - List all sessions with event counts
- `GET /analytics/session/:id` - Get events for a specific session

---

## 🧪 Testing

```bash
# Backend
cd backend
bun test

# Frontend
cd frontend
bun test
```

---

## 📦 Deployment

### Backend (Render/Railway/Heroku)

```bash
# Set environment variables in hosting platform
# DATABASE_URL, NODE_ENV=production, PORT

# Build & start
bun run build
bun start
```

### Frontend (Vercel)

```bash
# Connect GitHub repo to Vercel
# Set NEXT_PUBLIC_API_URL to production backend URL
# Auto-deploys on push to main
```

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "feat: your feature"`
3. Push branch: `git push origin feature/your-feature`
4. Open a pull request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 📞 Support

For issues or questions, open a GitHub issue or contact the maintainer.
