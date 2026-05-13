# CausalFunnel

A comprehensive user analytics platform that tracks events, sessions, and user journeys in real-time. Built with modern web technologies for scalability and performance.

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
cp .env.example .env

# Configure .env.local with:
# DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/causalfunnel
# PORT=3001

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
<script src="path/to/script.js"></script>
<script>
  AnalyticsTracker.init({
    apiUrl: 'https://causalfunnel-latest.onrender.com/api/v1/analytics/event' // Update with your backend URL
  });
</script>
```

---

## 🔗 API Endpoints

### Analytics Routes

- `POST /analytics/event` - Track a single event
- `GET /analytics/sessions` - List all sessions with event counts
- `GET /analytics/session/:id` - Get events for a specific session

---
