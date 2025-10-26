# Ideator App - Complete Architecture Documentation

## Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Core Features](#core-features)
5. [Database Schema](#database-schema)
6. [API Architecture](#api-architecture)
7. [Authentication Flow](#authentication-flow)
8. [Internationalization (i18n)](#internationalization-i18n)
9. [State Management](#state-management)
10. [Environment Variables](#environment-variables)
11. [Key Dependencies](#key-dependencies)
12. [AI Integration](#ai-integration)
13. [Component Architecture](#component-architecture)
14. [Styling System](#styling-system)
15. [Deployment](#deployment)

---

## Overview

**Ideator** is a bilingual (English/Turkish) AI-powered app idea generator built with Next.js 15, Supabase, and Google Gemini AI. Users can generate app ideas through free-text search or category-based filtering, swipe through ideas Tinder-style, save favorites, and get detailed implementation guidance.

### Key Capabilities
- AI-powered idea generation using Google Gemini 2.5 Flash
- Tinder-style swipeable card interface
- Bilingual support (English/Turkish) with complete i18n
- User authentication and data persistence
- Categorized search with filters
- Detailed implementation steps, tech stack recommendations
- PDF export and sharing functionality
- Search history tracking

---

## Tech Stack

### Frontend
- **Framework**: Next.js 15.5.6 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **PDF Generation**: jsPDF

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: Next.js API Routes (Route Handlers)
- **AI**: Google Generative AI (Gemini 2.5 Flash)

### Development
- **Package Manager**: npm
- **Node Version**: 18+ (20+ recommended)
- **TypeScript**: Strict mode enabled

---

## Project Structure

```
ideator/
├── app/                          # Next.js 15 App Router
│   ├── layout.tsx               # Root layout with LanguageProvider
│   ├── page.tsx                 # Landing page (redirects to dashboard)
│   ├── globals.css              # Global styles and Tailwind config
│   │
│   ├── auth/                    # Authentication pages
│   │   ├── login/page.tsx      # Login page with language toggle
│   │   ├── signup/page.tsx     # Signup page with language toggle
│   │   ├── callback/route.ts   # OAuth callback handler
│   │   └── confirmed/page.tsx  # Email confirmation page
│   │
│   ├── dashboard/               # Main dashboard
│   │   └── page.tsx            # Search + swipe interface
│   │
│   ├── category-search/         # Category-based search
│   │   └── page.tsx            # Filter selection interface
│   │
│   ├── saved/                   # Saved ideas management
│   │   └── page.tsx            # Saved ideas with folders/tags
│   │
│   ├── history/                 # Search history
│   │   └── page.tsx            # Past searches list
│   │
│   ├── idea/[id]/              # Idea details
│   │   └── page.tsx            # Implementation steps, tech stack
│   │
│   ├── about/                   # About page
│   │   └── page.tsx            # FAQ and app info
│   │
│   └── api/                     # API routes
│       ├── generate-ideas/      # Main idea generation
│       │   └── route.ts
│       ├── idea-details/        # Detailed implementation info
│       │   └── route.ts
│       ├── health/              # Health check
│       │   └── route.ts
│       └── test-gemini/         # Gemini API test
│           └── route.ts
│
├── components/                  # Reusable components
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   │
│   ├── HamburgerMenu.tsx       # Navigation menu with language toggle
│   ├── SwipeableCards.tsx      # Tinder-style card swiper
│   ├── SearchBar.tsx           # Search input component
│   ├── SearchConfirmationModal.tsx  # Search preview modal
│   ├── IdeatorLogo.tsx         # App logo component
│   └── PageLoadingIndicator.tsx     # Page transition loader
│
├── contexts/                    # React contexts
│   └── LanguageContext.tsx     # i18n context and translations
│
├── lib/                        # Utility libraries
│   ├── supabase/
│   │   ├── client.ts          # Client-side Supabase instance
│   │   ├── server.ts          # Server-side Supabase instance
│   │   └── middleware.ts      # Auth middleware
│   │
│   ├── categories-i18n.ts     # Category translations
│   ├── pdf-export.ts          # PDF generation logic
│   └── utils.ts               # General utilities (cn, etc.)
│
├── types/                      # TypeScript type definitions
│   └── index.ts               # Shared types (Idea, Filters, etc.)
│
├── middleware.ts              # Next.js middleware for auth
├── .env.local                 # Environment variables (not in git)
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.ts         # Tailwind configuration
└── next.config.ts             # Next.js configuration
```

---

## Core Features

### 1. AI-Powered Idea Generation
- **Free-Text Search**: Users describe their idea in natural language
- **Category-Based Search**: Filter by Technology, Context, Monetization, Target Audience
- **Bilingual Generation**: Ideas generated in English or Turkish based on user's language selection
- **Gemini 2.5 Flash**: Latest model for fast, high-quality responses

### 2. Swipeable Interface
- **Tinder-Style Cards**: Swipe right to save, left to skip, up for "maybe later"
- **Button Controls**: Alternative to swiping for accessibility
- **Undo Functionality**: Revert last action
- **Session Persistence**: "Maybe later" ideas kept for current session only

### 3. User Management
- **Authentication**: Email/password via Supabase Auth
- **Email Verification**: Required for account activation
- **Protected Routes**: Middleware ensures authenticated access
- **User Data Isolation**: All queries filtered by user_id

### 4. Idea Organization
- **Saved Ideas**: Persistent storage of liked ideas
- **Folders**: Organize ideas into custom folders with colors
- **Tags**: Add multiple tags to ideas for filtering
- **Search & Filter**: Find saved ideas by text, folder, or tag

### 5. Search History
- **Automatic Tracking**: Every search saved with filters and results
- **Result Preview**: See which ideas were generated
- **Re-run Searches**: Quickly access past searches

### 6. Detailed Implementation
- **Implementation Steps**: 5-8 step-by-step guide
- **Tech Stack**: Recommended technologies and frameworks
- **Suggestions**: Additional considerations and tips
- **Generated on Demand**: Details fetched when user views idea
- **Cached in DB**: Avoid regenerating same details

### 7. Export & Sharing
- **PDF Export**: Generate PDF of idea with all details
- **Copy to Clipboard**: Share idea text
- **Social Sharing**: Ready-to-share formatted text

### 8. Internationalization
- **Full Bilingual Support**: Every UI element translated
- **Language Toggle**: Available on all pages (login, signup, menu)
- **Persistent Selection**: Language saved in localStorage
- **AI Content**: Gemini generates content in selected language
- **Category Translation**: Categories mapped between languages

---

## Database Schema

### Tables

#### `ideas`
Primary table storing all generated ideas.

```sql
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  technology TEXT,           -- Technology/Platform
  complexity TEXT,           -- Complexity level
  time_to_build TEXT,        -- Estimated build time
  monetization TEXT,         -- Monetization model
  target_audience TEXT,      -- Target user group
  search_query TEXT,         -- Original search query (free-text)
  search_mode TEXT,          -- 'free_text' or 'category_select'
  implementation_steps JSONB, -- Array of implementation steps
  tech_stack JSONB,          -- Array of recommended technologies
  suggestions JSONB,         -- Array of additional suggestions
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_ideas_user_id ON ideas(user_id);
CREATE INDEX idx_ideas_created_at ON ideas(created_at DESC);
```

#### `saved_ideas`
Junction table for saved/favorited ideas.

```sql
CREATE TABLE saved_ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, idea_id)
);

-- Indexes
CREATE INDEX idx_saved_ideas_user_id ON saved_ideas(user_id);
CREATE INDEX idx_saved_ideas_idea_id ON saved_ideas(idea_id);
CREATE INDEX idx_saved_ideas_folder_id ON saved_ideas(folder_id);
```

#### `folders`
User-created folders for organizing ideas.

```sql
CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#000000',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_folders_user_id ON folders(user_id);
```

#### `tags`
Tags for categorizing ideas.

```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Indexes
CREATE INDEX idx_tags_user_id ON tags(user_id);
```

#### `idea_tags`
Junction table for many-to-many idea-tag relationship.

```sql
CREATE TABLE idea_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(idea_id, tag_id)
);

-- Indexes
CREATE INDEX idx_idea_tags_idea_id ON idea_tags(idea_id);
CREATE INDEX idx_idea_tags_tag_id ON idea_tags(tag_id);
```

#### `search_history`
Tracking all user searches.

```sql
CREATE TABLE search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  search_query TEXT,         -- Free-text query (if applicable)
  search_mode TEXT NOT NULL, -- 'free_text' or 'category_select'
  filters JSONB,             -- Category filters used
  idea_ids UUID[],           -- Array of generated idea IDs
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_search_history_created_at ON search_history(created_at DESC);
```

### Row Level Security (RLS)

All tables have RLS enabled with policies:
- Users can only read/write their own data
- `user_id` column always filtered by `auth.uid()`
- Foreign key cascades ensure data integrity

---

## API Architecture

### `/api/generate-ideas`
**Method**: POST
**Purpose**: Generate 10 app ideas using Gemini AI

**Request Body**:
```typescript
{
  query?: string,              // Free-text search query
  filters?: {                  // Category filters
    technology?: string,
    context?: string,
    monetization?: string,
    targetAudience?: string
  },
  mode: 'free_text' | 'category_select',
  additionalComments?: string, // Extra user requirements
  language: 'en' | 'tr'       // Language for generation
}
```

**Response**:
```typescript
{
  ideas: Array<{
    id: string,
    title: string,
    description: string,
    technology: string,
    monetization: string,
    target_audience: string,
    // ... other fields
  }>
}
```

**Logic**:
1. Authenticate user via Supabase
2. Build language-specific prompt for Gemini
3. Call Gemini 2.5 Flash model
4. Parse JSON response
5. Store ideas in `ideas` table
6. Return stored ideas with IDs

**Prompt Engineering**:
- English: "You are an expert product manager..."
- Turkish: "Sen bir uzman ürün yöneticisi..."
- Structured JSON output with title/description
- 10 unique, innovative, practical ideas

---

### `/api/idea-details`
**Method**: POST
**Purpose**: Generate detailed implementation info for a specific idea

**Request Body**:
```typescript
{
  ideaId: string,             // UUID of the idea
  language: 'en' | 'tr'      // Language for details
}
```

**Response**:
```typescript
{
  implementation_steps: string[], // 5-8 steps
  tech_stack: string[],          // 5-10 technologies
  suggestions: string[]          // 3-5 suggestions
}
```

**Logic**:
1. Authenticate user
2. Fetch idea from database
3. Check if details already exist (cached)
4. If not, generate with Gemini using language-specific prompt
5. Update idea record with details
6. Return details

**Caching Strategy**:
- Details generated once per idea
- Stored in `implementation_steps`, `tech_stack`, `suggestions` columns
- Subsequent requests return cached data

---

### `/api/health`
**Method**: GET
**Purpose**: Health check endpoint

**Response**:
```typescript
{
  status: 'healthy',
  timestamp: string,
  database: 'connected'
}
```

---

### `/api/test-gemini`
**Method**: GET
**Purpose**: Test Gemini API connectivity

**Response**:
```typescript
{
  status: 'success',
  message: string
}
```

---

## Authentication Flow

### 1. Signup Process
```
User enters email/password
  ↓
Supabase Auth creates account
  ↓
Verification email sent
  ↓
User clicks email link
  ↓
Redirected to /auth/callback
  ↓
Token exchanged, session created
  ↓
Redirected to /dashboard
```

**Implementation**:
- `app/auth/signup/page.tsx`: Signup form
- `app/auth/callback/route.ts`: Token exchange
- `app/auth/confirmed/page.tsx`: Success message

### 2. Login Process
```
User enters email/password
  ↓
Supabase Auth validates
  ↓
Session created in cookies
  ↓
Redirected to /dashboard
```

**Implementation**:
- `app/auth/login/page.tsx`: Login form
- Uses Supabase client-side auth

### 3. Session Management
```
Every request
  ↓
Middleware checks auth
  ↓
If authenticated: Continue
  ↓
If not: Redirect to /auth/login
```

**Implementation**:
- `middleware.ts`: Route protection
- `lib/supabase/middleware.ts`: Supabase middleware helper
- Protected routes: /dashboard, /saved, /history, /idea/*

### 4. Logout Process
```
User clicks logout
  ↓
Supabase Auth signOut()
  ↓
Session cleared
  ↓
Redirected to /auth/login
```

**Implementation**:
- `components/HamburgerMenu.tsx`: Logout button

---

## Internationalization (i18n)

### Architecture

**Context-Based System**:
- `contexts/LanguageContext.tsx`: Central translation store
- React Context API for global state
- localStorage for persistence
- Custom `useLanguage()` hook

### Translation Structure

```typescript
const translations = {
  en: {
    common: { back: 'Back', save: 'Save', ... },
    auth: { login: 'Login', signup: 'Sign up', ... },
    menu: { savedIdeas: 'Saved Ideas', ... },
    dashboard: { title: 'What kind of app...', ... },
    categories: { technology: 'Technology/Platform', ... },
    ideaDetail: { description: 'Description', ... },
    toast: { ideaSaved: 'Idea saved!', ... },
    confirmModal: { title: 'Confirm Your Search', ... }
  },
  tr: {
    // Turkish translations...
  }
}
```

### Usage Pattern

```typescript
const { t, language, setLanguage } = useLanguage();

// In JSX
<button>{t('common.save')}</button>
<h1>{t('dashboard.title')}</h1>

// Dynamic text
t('dashboard.savedCount').replace('{count}', '5')

// Change language
setLanguage('tr')
```

### Category Translation

**Special Handling**:
- `lib/categories-i18n.ts`: Separate category translations
- Maps display names (localized) to API values (English)
- Example: "Sağlık ve Fitness" → "Health & Fitness" for API

```typescript
const localizedCategories = getCategoriesInLanguage(language);
// Display: localizedCategories.context
// API: CATEGORIES.context (English)
```

### Language Toggle

**Locations**:
1. **Auth Pages**: Top-right corner (login/signup)
2. **Hamburger Menu**: Top of menu with EN/TR toggle
3. **Persistent**: Saved in `localStorage` as `'ideator-language'`

**Toggle Component**:
```typescript
<button onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}>
  {/* EN/TR visual toggle */}
</button>
```

---

## State Management

### React Context
- **LanguageContext**: Global i18n state
  - Current language
  - Translation function
  - Language setter

### Local State (useState)
- Component-specific UI state
- Form inputs
- Loading states
- Modal visibility

### Server State
- Supabase client queries
- Real-time data fetching
- Optimistic updates (save/unsave)

### Session Storage
- Temporary data between pages
- `generatedIdeas`: Pass ideas from category-search to dashboard
- Cleared after navigation

### Local Storage
- `ideator-language`: Persisted language preference
- Survives page reloads and sessions

---

## Environment Variables

Create a `.env.local` file in the project root:

```bash
# Supabase Configuration
# Required for database and authentication
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google Gemini AI
# Required for idea generation and details
GEMINI_API_KEY=your-gemini-api-key

# Optional: Node Environment
NODE_ENV=development
```

### Variable Details

#### `NEXT_PUBLIC_SUPABASE_URL`
- **Purpose**: Supabase project URL
- **Required**: Yes
- **Usage**: Client and server-side Supabase connections
- **Format**: `https://[project-id].supabase.co`
- **How to Get**:
  1. Go to Supabase Dashboard
  2. Select your project
  3. Go to Settings → API
  4. Copy "Project URL"

#### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Purpose**: Public anonymous key for Supabase
- **Required**: Yes
- **Usage**: Client-side Supabase auth and queries
- **Security**: Safe to expose (RLS protects data)
- **How to Get**:
  1. Supabase Dashboard → Settings → API
  2. Copy "anon" / "public" key

#### `GEMINI_API_KEY`
- **Purpose**: Google Generative AI API access
- **Required**: Yes
- **Usage**: Server-side only (idea generation, details)
- **Security**: Never exposed to client
- **Model Used**: `gemini-2.5-flash`
- **How to Get**:
  1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
  2. Create API key
  3. Copy and paste into `.env.local`

---

## Key Dependencies

### Production Dependencies

```json
{
  "@google/generative-ai": "^0.21.0",    // Gemini AI SDK
  "@radix-ui/react-*": "^1.x",           // Headless UI primitives
  "@supabase/ssr": "^0.5.2",             // Supabase SSR helpers
  "@supabase/supabase-js": "^2.48.1",    // Supabase client
  "@tailwindcss/postcss": "^4.0.0",      // Tailwind CSS v4
  "jspdf": "^2.5.2",                     // PDF generation
  "lucide-react": "^0.468.0",            // Icon library
  "next": "15.5.6",                      // React framework
  "react": "^19.0.0",                    // UI library
  "react-hot-toast": "^2.4.1",           // Toast notifications
  "tailwindcss": "^4.0.0"                // Utility-first CSS
}
```

### Development Dependencies

```json
{
  "@types/node": "^20",                  // Node.js types
  "@types/react": "^19",                 // React types
  "eslint": "^9",                        // Linting
  "eslint-config-next": "15.5.6",        // Next.js ESLint config
  "typescript": "^5"                     // TypeScript compiler
}
```

### Dependency Purposes

**@google/generative-ai**:
- Communicate with Gemini 2.5 Flash
- Generate app ideas and implementation details
- Handles streaming and non-streaming responses

**@supabase/supabase-js**:
- Database queries and mutations
- User authentication
- Real-time subscriptions (if needed)

**@supabase/ssr**:
- Server-side rendering with Supabase
- Cookie-based auth in App Router
- Middleware authentication

**@radix-ui/react-***:
- Accessible UI primitives
- Unstyled components (Button, Dialog, etc.)
- Foundation for shadcn/ui

**tailwindcss v4**:
- Utility-first CSS framework
- PostCSS plugin architecture
- Lightning CSS for fast builds

**jspdf**:
- Generate PDF documents client-side
- Export idea details with formatting
- No server needed for PDF generation

**lucide-react**:
- Modern icon library
- Tree-shakeable
- Consistent design system

**react-hot-toast**:
- Toast notifications
- Customizable styling
- Promise-based API

---

## AI Integration

### Gemini 2.5 Flash Model

**Why Gemini 2.5 Flash?**
- Fast response times (optimized for speed)
- High-quality outputs
- Large context window
- Cost-effective
- Latest features (1.5 models retired)

### Prompt Engineering Strategy

#### 1. Idea Generation Prompts

**Structure**:
```
You are an expert product manager and startup advisor.
Generate 10 unique and innovative app ideas based on:
[User criteria]

Return JSON format:
[
  { "title": "...", "description": "..." }
]
```

**English Example**:
```
User's description: A fitness app for beginners
Filters:
- Technology/Platform: iOS
- Context/Category: Health & Fitness
- Monetization: Freemium
- Target Audience: Beginners

Generate 10 ideas...
```

**Turkish Example**:
```
Kullanıcının açıklaması: Yeni başlayanlar için fitness uygulaması
Filtreler:
- Teknoloji/Platform: iOS
- Bağlam/Kategori: Sağlık ve Fitness
...
```

#### 2. Detail Generation Prompts

**Structure**:
```
You are an expert software architect.
For this app idea: [title + description]

Provide:
1. implementation_steps: 5-8 steps
2. tech_stack: 5-10 technologies
3. suggestions: 3-5 considerations
```

**Output Format**:
- Always JSON
- Structured arrays
- Concise but detailed
- Actionable recommendations

### Error Handling

```typescript
try {
  const result = await model.generateContent(prompt);
  const text = response.text();

  // Clean markdown code blocks
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');

  // Parse JSON
  const data = JSON.parse(cleaned);

} catch (error) {
  // Handle API errors, parsing errors, etc.
}
```

### Rate Limiting & Caching

- **Caching**: Store generated details in database
- **Reuse**: Don't regenerate if details exist
- **Rate Limits**: Respect Gemini API quotas (handled by Google)

---

## Component Architecture

### Atomic Design Pattern

**Atoms** (ui/ components):
- `Button`, `Input`, `Card`, `Badge`
- Reusable, single-purpose
- No business logic

**Molecules** (composed UI):
- `SearchBar` (Input + Button)
- `IdeatorLogo` (SVG + styling)
- `PageLoadingIndicator` (animated bar)

**Organisms** (complex components):
- `SwipeableCards` (gesture handling, state)
- `HamburgerMenu` (navigation, auth)
- `SearchConfirmationModal` (preview, validation)

**Templates** (page layouts):
- `layout.tsx` files
- Consistent structure
- LanguageProvider wrapper

**Pages** (routes):
- `app/**/ page.tsx`
- Data fetching
- Business logic

### Component Patterns

**Client Components** (`'use client'`):
- Interactive UI
- State management
- Event handlers
- Hooks usage

**Server Components** (default):
- Data fetching
- Static content
- SEO-friendly
- Faster initial loads

**Shared Props Pattern**:
```typescript
interface IdeaProps {
  idea: Idea;
  onSave?: () => void;
  onDelete?: () => void;
}
```

---

## Styling System

### Tailwind CSS v4

**Configuration** (`globals.css`):
```css
@import "tailwindcss";

:root {
  --background: #FFFFFF;
  --foreground: #000000;
}

html {
  font-size: 16px;
  /* Responsive base */
}

body {
  font-family: -apple-system, BlinkMacSystemFont, ...;
}
```

**Custom Utilities**:
- `.rounded-uber`: `16px` border radius (Uber-style)
- `.rounded-uber-lg`: `24px` border radius
- `.shadow-uber`: Custom shadow for cards
- `.animate-loading-bar`: Page transition animation

### Design System

**Colors**:
- Primary: Black (`#000000`)
- Background: White (`#FFFFFF`)
- Gray scale: `gray-50` to `gray-900`
- Semantic colors via Tailwind

**Typography**:
- Font: System fonts (-apple-system, etc.)
- Sizes: Tailwind scale (`text-sm`, `text-base`, etc.)
- Weights: `font-medium`, `font-semibold`, `font-bold`

**Spacing**:
- Consistent padding: `p-4`, `p-6`, `p-8`
- Margins: `mb-4`, `mt-6`, etc.
- Gaps: `gap-2`, `gap-4`, `gap-6`

**Responsive**:
- Mobile-first approach
- Breakpoints: `md:`, `lg:`, `xl:`
- `min-h-screen` for full-height pages
- `max-w-*` for content width constraints

---

## Deployment

### Vercel (Recommended)

**Steps**:
1. Push code to GitHub
2. Connect Vercel to repository
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

**Configuration** (`next.config.ts`):
```typescript
const nextConfig = {
  // No special config needed for Vercel
};
```

### Environment Variables (Production)
Set in Vercel Dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`

### Database Setup

1. Create Supabase project
2. Run migrations (create tables)
3. Enable Row Level Security
4. Set up authentication policies

### Domain Configuration
- Add custom domain in Vercel
- Update Supabase redirect URLs
- Configure DNS records

---

## Adapting for New Apps

### Use This Architecture For:

1. **Product Search App**
   - Replace idea generation with product search
   - Use same swipeable interface
   - Adapt categories to product filters
   - Keep user auth and saving functionality

2. **Recipe Generator**
   - Generate recipes instead of ideas
   - Filter by cuisine, diet, ingredients
   - Same swipe/save/organize pattern
   - Adapt detail view to recipe steps

3. **Travel Planner**
   - Generate itineraries
   - Filter by destination, duration, budget
   - Save favorite trips
   - Detailed day-by-day plans

### Key Patterns to Reuse:

✅ **Authentication**: Supabase auth flow
✅ **Database**: PostgreSQL with RLS
✅ **AI Integration**: Gemini prompt engineering
✅ **i18n**: LanguageContext pattern
✅ **UI Components**: shadcn/ui library
✅ **State Management**: Context + local state
✅ **Swipeable Interface**: Card swiper pattern
✅ **Search & Filter**: Category-based system
✅ **History Tracking**: Search history table
✅ **Organization**: Folders and tags

### What to Change:

🔄 **Prompts**: Adapt for your domain
🔄 **Categories**: Define relevant filters
🔄 **Schema**: Adjust table columns
🔄 **Translations**: Add domain-specific terms
🔄 **Detail View**: Customize info display

---

## Development Workflow

### Setup
```bash
# Clone repository
git clone <repo-url>
cd ideator

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your keys

# Run development server
npm run dev
```

### Available Scripts
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Quality
- TypeScript strict mode
- ESLint with Next.js config
- Prettier (optional)
- Git hooks (optional)

---

## Performance Optimizations

### Frontend
- Server Components by default
- Client Components only when needed
- Image optimization (Next.js Image)
- Code splitting (automatic)
- Font optimization (system fonts)

### API
- Caching (idea details in DB)
- Efficient queries (indexed columns)
- Pagination (if needed)
- Error boundaries

### Database
- Indexes on frequently queried columns
- RLS policies for security
- Foreign key constraints
- Cascade deletes for cleanup

---

## Security Best Practices

### Environment Variables
- Never commit `.env.local`
- Use `NEXT_PUBLIC_` prefix only for public data
- Keep API keys server-side

### Authentication
- Supabase Auth handles security
- Session cookies (httpOnly, secure)
- CSRF protection (built-in)
- Email verification required

### Database
- Row Level Security enabled
- User-scoped queries (auth.uid())
- Input validation
- SQL injection prevention (Supabase client)

### API Routes
- Authentication checks
- Input validation
- Error handling (no sensitive info in errors)
- Rate limiting (consider for production)

---

## Troubleshooting

### Common Issues

**"Unauthorized" errors**:
- Check if user is logged in
- Verify Supabase keys in `.env.local`
- Check RLS policies in Supabase

**AI generation fails**:
- Verify `GEMINI_API_KEY` is set
- Check Gemini API quotas
- Inspect error logs for API messages

**Language not persisting**:
- Check localStorage in browser
- Verify LanguageProvider wraps app
- Clear cache and reload

**Build errors**:
- Run `npm install` to sync dependencies
- Check TypeScript errors
- Verify all environment variables exist

---

## Future Enhancements

### Potential Features
- [ ] Real-time collaboration
- [ ] AI chat for idea refinement
- [ ] Voting/rating system
- [ ] Public idea sharing
- [ ] Team workspaces
- [ ] API for third-party integrations
- [ ] Mobile app (React Native)
- [ ] Voice input for search
- [ ] Image generation for ideas
- [ ] Analytics dashboard

### Scalability
- Add Redis for caching
- Implement queue system for AI requests
- CDN for static assets
- Database read replicas
- Horizontal scaling (Vercel handles this)

---

## License & Credits

**Built With**:
- Next.js by Vercel
- Supabase for backend
- Google Gemini AI
- shadcn/ui components
- Tailwind CSS
- React ecosystem

**Maintained By**: Your Team
**Created**: 2025
**Version**: 1.0.0

---

## Support & Contact

For questions or issues:
- GitHub Issues: `[repository-url]/issues`
- Email: `your-email@example.com`
- Documentation: `[docs-url]`

---

**End of Documentation** 🎉

This architecture is production-ready and can be adapted for various AI-powered idea/search applications. The bilingual support, swipeable interface, and comprehensive organization features make it a strong foundation for similar projects.
