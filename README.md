# CatFacts Express + React Application

A full-stack application with Express.js backend and React frontend, featuring cat facts API and memory game functionality.

## Project Structure

```
CatFacts-Express/
├── backend/          # Express.js API server
├── frontend/         # React application
└── README.md         # This file
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## Setup Instructions

### 1. Backend Setup (Express.js)

```bash
# Navigate to backend directory
cd backend

# Install dependencies (already done)
npm install

# Start development server
npm run dev:ts

# Or build and start production server
npm run build
npm start
```

The backend server will run on `http://localhost:3001`

**Available API Endpoints:**
- `GET /api/cat-facts/random` - Get a random cat fact
- `GET /api/cat-facts/random-multiple?count=5` - Get multiple random facts
- `GET /api/cat-facts/search?query=cats` - Search cat facts
- `GET /api/cat-facts/statistics` - Get cat facts statistics
- `GET /api/cat-facts/` - Get all facts with pagination
- `POST /api/cat-facts/populate` - Populate database from external API (protected)

### 2. Frontend Setup (React)

```bash
# Navigate to frontend directory
cd frontend

# Install additional dependencies (already done)
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## Features

### Backend (Express.js + TypeScript)
- ✅ RESTful API with proper error handling
- ✅ SQLite database with migrations
- ✅ Cat Facts service with external API integration
- ✅ Intelligent caching system (NodeCache)
- ✅ Rate limiting and security middleware
- ✅ TypeScript for type safety
- ✅ Input validation with express-validator
- ✅ Duplicate prevention for cat facts
- ✅ Comprehensive statistics tracking

### Frontend (React + TypeScript)
- ✅ React Router for navigation
- ✅ Axios for API communication
- ✅ Tailwind CSS for styling
- ✅ Cat Facts explorer page
- ✅ Statistics dashboard
- ✅ Responsive design
- 🚧 Memory card game (to be implemented)

## API Integration

The system integrates with the external Cat Facts API (`https://catfact.ninja/fact`):

1. **Primary Data Source**: Local SQLite database
2. **Fallback Strategy**: External API when local database is empty
3. **Population Feature**: Admin can populate database with new facts
4. **Caching**: 5-minute cache for frequently accessed data
5. **Rate Limiting**: Respectful API calls with delays

## Database Schema

### Cat Facts Table
- `id` - Primary key
- `fact` - Cat fact text
- `length` - Character count
- `is_active` - Boolean status
- `created_at`, `updated_at` - Timestamps

### Games Table (Ready for implementation)
- `id` - Primary key
- `user_id` - Optional user reference
- `session_id` - Anonymous session tracking
- `difficulty` - Game difficulty level
- `score` - Player score
- `moves` - Number of moves
- `time_elapsed` - Game duration
- `status` - Game status
- `collected_facts` - JSON array of fact IDs

## Development

### Backend Development
```bash
# Watch mode with TypeScript compilation
npm run dev:ts

# Manual build
npm run build

# Linting
npm run lint
```

### Frontend Development
```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=3001
DATABASE_PATH=./database/database.sqlite
JWT_SECRET=your-jwt-secret-here
CAT_FACTS_API_URL=https://catfact.ninja/fact
CACHE_TTL=300
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
CORS_ORIGIN=http://localhost:5173
```

## Next Steps / TODOs

1. **Complete Game Implementation**
   - Memory card matching game
   - Score tracking and leaderboards
   - User authentication system

2. **Enhanced Features**
   - User registration/login
   - Personal game history
   - Social features and sharing
   - Mobile-responsive game interface

3. **Production Deployment**
   - Docker containerization
   - Environment-specific configurations
   - Database migrations system
   - CI/CD pipeline

## Architecture Highlights

### Backend Architecture
- **Service Layer Pattern**: Clean separation of business logic
- **Database Abstraction**: Custom SQLite wrapper with connection pooling
- **Error Handling**: Centralized error middleware with proper HTTP codes
- **Caching Strategy**: Multi-level caching for optimal performance
- **Type Safety**: Full TypeScript implementation with custom types

### Frontend Architecture
- **Component-Based**: Modular React components
- **API Integration**: Centralized API service with error handling
- **State Management**: React hooks for local state
- **Routing**: Client-side routing with React Router
- **Styling**: Utility-first CSS with Tailwind

This setup provides the same functionality as your original Laravel + Inertia.js application but with Express.js backend and standalone React frontend!