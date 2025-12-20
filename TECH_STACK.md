# Talent & Casting Directory - Tech Stack Documentation

> **Project Name:** Talent Marketplace (Concierge Marketplace)  
> **Version:** 0.1.0  
> **Type:** Talent & Casting Directory Platform  
> **Last Updated:** December 20, 2025

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack (MERN + Next Variant)](#technology-stack-mern--next-variant)
3. [Authentication & Authorization](#authentication--authorization)
4. [Media & Storage Solutions](#media--storage-solutions)
5. [Design System & UI/UX](#design-system--uiux)
6. [Typography System](#typography-system)
7. [Key Functional Modules](#key-functional-modules)
8. [Database Architecture](#database-architecture)
9. [Current Implementation Status](#current-implementation-status)
10. [Dependencies & Packages](#dependencies--packages)
11. [Project Structure](#project-structure)
12. [Getting Started](#getting-started)

---

## 🎯 Project Overview

### Core Concept
A **"Concierge Marketplace"** where creative professionals (Actors, Singers, Writers, Directors, Producers, Cinematographers, and more) upload professional portfolios, and Industry Professionals (Casting Directors, Production Managers, etc.) browse talent and request contact information through an Admin intermediary.

### Target Users
**Creative Talent:**
- Actors, Singers, Voice Artists, Models
- Writers, Directors, Producers
- Cinematographers, Editors, Composers
- Choreographers, Stunt Performers

**Industry Professionals:**
- Casting Directors, Production Managers
- Art Directors, Costume Designers
- Makeup Artists, Sound Engineers

**Platform Administrators:**
- Admin, Moderators

### Key Differentiators
- 🎬 **Protected Media Streaming** - Videos cannot be easily downloaded
- 🔍 **Advanced Tag Filtering** - Complex search by Age + Category + Skill + Role
- 🛡️ **Privacy-First** - Contact information shared only through Admin approval
- 📱 **SEO-Optimized** - Public profiles indexed for discoverability
- 🎨 **Professional Design** - Dark mode, modern UI, media industry aesthetic
- 🌐 **Comprehensive Roles** - Covers entire media production ecosystem

---

## 🚀 Technology Stack (MERN + Next Variant)

### Frontend Framework
**Next.js 16.1.0** (React-based)
- **Why:** Fast performance, SEO-friendly for public talent profiles
- **Architecture:** App Router with Server Components
- **Features:**
  - Server-Side Rendering (SSR) for public profiles
  - Static Site Generation (SSG) for catalog pages
  - API Routes for serverless backend
  - Image & Font optimization
  - File-based routing

**Current Status:** ✅ Installed & Configured

---

### Backend Environment
**Node.js** (v20+)

**Approach Options:**
1. **Next.js API Routes** (Serverless) - *Recommended for MVP*
   - Built-in with Next.js
   - Easy deployment on Vercel
   - Automatic scaling
   
2. **Standalone Express Server** - *For complex backend needs*
   - More control over middleware
   - Better for real-time features
   - Separate deployment

**Current Status:** ⏳ To Be Implemented (Next.js API Routes recommended)

---

### Database
**MongoDB**

**Why MongoDB:**
- ✅ Flexible schema for different user types (20+ role types from Actors to Sound Engineers)
- ✅ Array-based tag filtering (categories, skills, age ranges, specializations)
- ✅ Easy to handle dynamic `profileData` fields (each role has unique attributes)
- ✅ Compound indexing for fast search queries across multiple criteria
- ✅ Scalable for media-heavy applications with large user base
- ✅ Supports geospatial queries for location-based search

**Planned Schema Strategy:**
- Single `users` collection for all user types (talent, industry professionals, admins)
- Dynamic `profileData` object (changes based on role: actor vs director vs cinematographer)
- `roleCategory` field for grouping (talent, industry_professional, admin)
- Compound indexes on: `role`, `roleCategory`, `tags`, `category`, `age`, `status`, `location`

**Current Status:** ⏳ To Be Implemented

**Recommended Tools:**
- **Mongoose** - ODM for MongoDB
- **MongoDB Atlas** - Cloud database hosting

---

## � Authentication & Authorization

### Authentication Provider: Auth0 (Recommended) or NextAuth.js

#### **Option 1: Auth0** ⭐ **Recommended**

**Why Auth0:**
- ✅ **Managed Authentication Service** - No need to build auth from scratch
- ✅ **Enterprise-Grade Security** - SOC2, GDPR, HIPAA compliant
- ✅ **Universal Login** - Beautiful, customizable hosted login pages
- ✅ **Social Connections** - Google, Facebook, LinkedIn pre-configured
- ✅ **User Management Dashboard** - Visual interface for managing users, roles, permissions
- ✅ **Advanced Features** - Multi-Factor Authentication (MFA), passwordless login, anomaly detection
- ✅ **Role-Based Access Control** - Built-in RBAC with custom roles and permissions
- ✅ **Email Verification** - Built-in email verification and password reset flows
- ✅ **Analytics & Logs** - User login analytics, security logs, real-time monitoring
- ✅ **Free Tier** - 7,000 active users/month, unlimited logins
- ✅ **Production-Ready** - Less maintenance, automatic security updates
- ✅ **Better for Scaling** - Handles millions of users

**Perfect for:**
- Production applications
- Applications requiring enterprise security
- Teams wanting to focus on features, not auth infrastructure
- Applications needing advanced features (MFA, SSO, etc.)

**Packages:**
```bash
npm install @auth0/nextjs-auth0
```

**Setup Complexity:** Medium (requires Auth0 account setup)

---

#### **Option 2: NextAuth.js** (Alternative)

**Why NextAuth.js:**
- ✅ **Open Source** - Free forever, no user limits
- ✅ **Self-Hosted** - Full control over authentication data
- ✅ **Built for Next.js** - Seamless integration with Next.js
- ✅ **Supports Multiple Providers** - Google, GitHub, Email/Password, etc.
- ✅ **JWT & Database Sessions** - Flexible session management
- ✅ **Built-in CSRF Protection** - Security out of the box
- ✅ **TypeScript Support** - Full type safety
- ✅ **Easy to Customize** - Full control over auth flow

**Perfect for:**
- Learning projects
- Applications with simple auth needs
- Self-hosted requirements
- Budget-conscious projects

**Packages:**
```bash
npm install next-auth
```

**Setup Complexity:** Low (no external service needed)

---

### **Recommendation: Use Auth0**

For the Talent Marketplace project, **Auth0 is recommended** because:

1. **User Management** - Built-in dashboard to manage 20+ user roles (actors, directors, etc.)
2. **Role-Based Access** - Easy to implement complex permissions (talent, industry professionals, admin)
3. **Security** - Enterprise-grade security without extra work
4. **Scalability** - Handles growth from 100 to 100,000 users seamlessly
5. **Time Savings** - Focus on building features, not authentication infrastructure
6. **Professional** - Better for a production marketplace platform

**Current Status:** ⏳ To Be Implemented (Auth0 recommended)

---

### Authentication Methods

#### 1. Email & Password Authentication
**Features:**
- User registration with email verification
- Secure password hashing (bcrypt, 10 rounds)
- Password strength validation
- Password reset via email token
- "Remember Me" functionality (extended session)
- Account lockout after failed attempts

**Implementation Flow:**
```
1. User enters email + password
2. Server validates credentials
3. Password hashed and compared with DB
4. JWT token generated
5. Session stored (HTTP-only cookie)
6. User redirected to dashboard
```

**Required:**
- `bcryptjs` for password hashing
- Email service (SMTP) for verification emails
- Token generation for password reset

---

#### 2. Google OAuth 2.0 Authentication
**Features:**
- One-click sign-in with Google account
- No password management required
- Automatic profile data sync (name, email, profile picture)
- Secure OAuth 2.0 flow
- Fallback to email/password if needed

**Implementation Flow:**
```
1. User clicks "Sign in with Google"
2. Redirect to Google OAuth consent screen
3. User approves access
4. Google returns authorization code
5. Exchange code for access token
6. Fetch user profile from Google
7. Create/update user in MongoDB
8. Generate JWT session token
9. Redirect to dashboard
```

**Required:**
- Google Cloud Console project
- OAuth 2.0 Client ID & Secret
- Authorized redirect URIs configured
- NextAuth Google provider

**Setup Steps:**
1. Create project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID & Secret to `.env.local`

---

### Session Management
**Strategy:** JWT (JSON Web Tokens)

**Configuration:**
- **Token Expiry:** 30 days (default)
- **Refresh Token:** Automatic refresh on activity
- **Storage:** HTTP-only cookies (secure, not accessible via JavaScript)
- **CSRF Protection:** Built-in with NextAuth.js

**Session Data:**
```javascript
{
  user: {
    id: string,
    email: string,
    name: string,
    role: 'actor' | 'singer' | 'writer' | 'director' | 'producer' | 
          'cinematographer' | 'editor' | 'composer' | 'choreographer' | 
          'voice_artist' | 'model' | 'stunt_performer' | 
          'casting_director' | 'production_manager' | 'art_director' | 
          'costume_designer' | 'makeup_artist' | 'sound_engineer' | 
          'admin' | 'moderator',
    roleCategory: 'talent' | 'industry_professional' | 'admin',
    status: 'pending' | 'approved' | 'rejected' | 'banned',
    image: string
  },
  expires: Date
}
```

---

### Role-Based Access Control (RBAC)

**User Roles & Categories:**

#### Talent Roles (Creative Professionals)
- **Actor** - On-screen performers
- **Singer** - Vocalists and musicians
- **Writer** - Screenwriters, script writers, content creators
- **Director** - Film/TV directors, creative directors
- **Producer** - Film producers, executive producers, line producers
- **Cinematographer** - Directors of photography, camera operators
- **Editor** - Video editors, post-production specialists
- **Composer** - Music composers, sound designers
- **Choreographer** - Dance choreographers, movement directors
- **Voice Artist** - Voice-over artists, dubbing artists
- **Model** - Fashion models, commercial models
- **Stunt Performer** - Stunt coordinators, action specialists

#### Industry Professional Roles
- **Casting Director** - Can browse talent, submit interest requests
- **Production Manager** - Production coordinators, unit managers
- **Art Director** - Set designers, production designers
- **Costume Designer** - Wardrobe stylists, costume coordinators
- **Makeup Artist** - Hair and makeup professionals
- **Sound Engineer** - Audio technicians, sound mixers

#### Administrative Roles
- **Admin** - Full access to user management, leads, announcements
- **Moderator** - Content moderation, profile approval assistance

**Permissions by Category:**
- **Talent (All Creative Roles)** - Can create/edit profile, upload media, view notifications, receive casting requests
- **Industry Professionals** - Can browse talent, submit interest requests, manage projects
- **Casting Directors** - Advanced search, bulk contact requests, save favorites
- **Admin/Moderator** - User management, content moderation, analytics access

**Route Protection:**
```typescript
// Middleware example
export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/talent/:path*",     // Talent portal (all creative roles)
    "/industry/:path*",   // Industry professionals portal
    "/admin/:path*",      // Admin panel
    "/api/users/:path*",  // Protected API routes
  ]
}
```

**Authorization Checks:**
- Talent can only edit their own profile
- Admins can edit any profile
- Casting directors can view contact info after admin approval
- Industry professionals have read-only access to public profiles
- Pending users have limited access until approved
- Banned users cannot access the platform

---

## �📦 Media & Storage Solutions

### Video Hosting: Mux
**Purpose:** Professional video uploading, encoding, and streaming

**Key Features:**
- ✅ **HLS Streaming** - Adaptive bitrate streaming
- ✅ **Download Prevention** - No "Save Video As" option
- ✅ **Smooth Playback** - Buffer-free viewing experience
- ✅ **Analytics** - Track video views and engagement
- ✅ **Automatic Encoding** - Multiple quality levels

**Implementation:**
- Upload videos via Mux API
- Store Mux Playback ID in MongoDB
- Stream using `@mux/mux-player-react`

**Current Status:** ⏳ To Be Implemented

**Required Package:** `@mux/mux-node`, `@mux/mux-player-react`

---

### Image Hosting: Cloudinary
**Purpose:** Headshots, profile pictures, and portfolio images

**Key Features:**
- ✅ **Auto-Cropping** - Intelligent face detection
- ✅ **Image Optimization** - WebP, AVIF format conversion
- ✅ **Responsive Images** - Multiple sizes for different devices
- ✅ **Fast CDN** - Global content delivery
- ✅ **Transformations** - On-the-fly image editing

**Implementation:**
- Upload images via Cloudinary API
- Store Cloudinary URL in MongoDB
- Display using Next.js `<Image>` component with Cloudinary loader

**Current Status:** ⏳ To Be Implemented

**Required Package:** `cloudinary`, `next-cloudinary`

---

## 🎨 Design System & UI/UX

### Component Library: shadcn/ui
**Style:** Professional, minimalist, accessible

**Why shadcn/ui:**
- ✅ Built on **Radix UI** (accessible primitives)
- ✅ Styled with **Tailwind CSS**
- ✅ Copy-paste components (no package dependency)
- ✅ Fully customizable
- ✅ TypeScript support
- ✅ Dark mode ready

**Key Components Needed:**
- `Button`, `Input`, `Select`, `Checkbox`
- `Dialog`, `Dropdown Menu`, `Popover`
- `Card`, `Avatar`, `Badge`
- `Table`, `Tabs`, `Accordion`
- `Form`, `Label`, `Textarea`
- `Toast` (via Sonner)

**Current Status:** ⏳ To Be Implemented

**Installation:** `npx shadcn@latest init`

---

### Styling Framework
**Tailwind CSS v4** ✅ Already Installed

**Configuration:**
- Dark mode: `class` strategy (via `next-themes`)
- Custom color palette for media industry
- Responsive breakpoints
- Custom animations

---

### Icons
**Lucide React**

**Why:**
- Clean, rounded SVG icons
- Tree-shakeable (only import what you use)
- Consistent design language
- 1000+ icons

**Current Status:** ⏳ To Be Implemented

**Package:** `lucide-react`

---

### Notifications
**Sonner**

**Why:**
- Beautiful, stackable toast notifications
- Works seamlessly with shadcn/ui
- Customizable positioning
- Promise-based API

**Use Cases:**
- Success messages (profile updated)
- Error alerts (upload failed)
- Info notifications (new casting request)

**Current Status:** ⏳ To Be Implemented

**Package:** `sonner`

---

### Theme System
**Dark Mode (Default) + Light Mode**

**Implementation:** `next-themes` package

**Theme Options:**
- 🌙 **Dark Mode** (Default) - Professional, media industry aesthetic
- ☀️ **Light Mode** - Clean, bright alternative
- ❌ **No System Preference** - User must manually choose

**Features:**
- No FOUC (Flash of Unstyled Content)
- Manual theme toggle only (no auto-switching based on system)
- Persistent user preference (stored in localStorage)
- Theme toggle button in header/navbar
- Smooth transition animations between themes

**Configuration:**
```typescript
// app/providers.tsx
<ThemeProvider
  attribute="class"
  defaultTheme="dark"
  enableSystem={false}  // Disable system preference
  themes={['light', 'dark']}
  storageKey="talent-marketplace-theme"
>
  {children}
</ThemeProvider>
```

**Current Status:** ⏳ To Be Implemented

**Package:** `next-themes`

---

## 🔤 Typography System

### Primary/Body Font: **Inter**
**Usage:** Paragraphs, inputs, small text, UI elements

**Why:**
- Clean and highly legible
- Optimized for screens
- Variable font support
- Professional appearance

**Implementation:** `next/font/google`

---

### Heading Font: **Plus Jakarta Sans**
**Usage:** H1, H2, H3, Titles, Hero sections

**Why:**
- Geometric and modern
- "Startup/Media" industry feel
- Excellent for branding
- Great contrast with Inter

**Implementation:** `next/font/google`

---

### Current Fonts (To Be Replaced)
- ❌ Geist Sans (temporary)
- ❌ Geist Mono (temporary)

**Action Required:** Replace with Inter + Plus Jakarta Sans

---

## 🎯 Key Functional Modules

### 1. Talent Portal (Authenticated Area)

#### Features:
- ✅ **Secure Authentication System**
  - **Email/Password Login**
    - Traditional registration with email verification
    - Password hashing with bcrypt
    - Password reset via email
    - Remember me functionality
  - **Google OAuth Login**
    - One-click Google Sign-In
    - Automatic profile creation
    - Secure token exchange
    - No password management needed
  - **Session Management**
    - JWT-based authentication
    - Secure HTTP-only cookies
    - Token refresh mechanism
    - Auto-logout on inactivity
  
- ✅ **Profile Builder**
  - Multi-step form (Personal Info → Media → Tags → Review)
  - Media upload (Mux for videos, Cloudinary for images)
  - Tag selection system (Category → Subcategory → Skills)
  - Dynamic fields based on talent type (Actor/Singer/Writer)
  - Real-time validation
  - Auto-save drafts
  
- ✅ **Notification Center**
  - Real-time updates from Admin
  - Casting interest notifications
  - Profile approval/rejection status
  - Email notifications for important updates
  - In-app notification badges

**Pages:**
- `/talent/login`
- `/talent/register`
- `/talent/dashboard`
- `/talent/profile/edit`
- `/talent/notifications`

**Current Status:** ⏳ To Be Implemented

---

### 2. Public Catalog (Browse Talent)

#### Features:
- ✅ **Smart Filter System**
  - Multi-level tag filtering
  - Age range slider
  - Category + Subcategory + Skill combination
  - Real-time search results
  
- ✅ **Protected Video View**
  - HLS streaming via Mux
  - No download option
  - Watermarked playback (optional)
  
- ✅ **Lead Capture**
  - "I'm Interested" button
  - Popup form to collect:
    - Name
    - Phone Number
    - Company/Production
    - Message
  - Sends notification to Admin

**Pages:**
- `/browse` (main catalog)
- `/talent/[id]` (individual profile)
- `/search` (advanced search)

**Current Status:** ⏳ To Be Implemented

---

### 3. Admin Panel (Management Dashboard)

#### Features:
- ✅ **User Management**
  - Approve/Reject new profiles
  - Ban/Suspend users
  - Edit user information
  - View activity logs
  
- ✅ **Lead Dashboard**
  - View all casting interest requests
  - Filter by talent, date, status
  - Contact information management
  - Export leads to CSV
  
- ✅ **Announcement System**
  - Post updates to all talent
  - Targeted announcements (by category)
  - Email notifications
  - In-app notification center

**Pages:**
- `/admin/login`
- `/admin/dashboard`
- `/admin/users`
- `/admin/leads`
- `/admin/announcements`

**Current Status:** ⏳ To Be Implemented

---

## 🗄️ Database Architecture

### Database: MongoDB

### Schema Strategy

#### Single Collection: `users`
Stores all users: Talent (Actors, Singers, Writers, Directors, etc.), Industry Professionals, and Admins

```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  password: String (hashed, null for OAuth users),
  
  // Role & Status
  role: String (enum: [
    // Talent Roles
    'actor', 'singer', 'writer', 'director', 'producer',
    'cinematographer', 'editor', 'composer', 'choreographer',
    'voice_artist', 'model', 'stunt_performer',
    // Industry Professional Roles
    'casting_director', 'production_manager', 'art_director',
    'costume_designer', 'makeup_artist', 'sound_engineer',
    // Admin Roles
    'admin', 'moderator'
  ]),
  roleCategory: String (enum: ['talent', 'industry_professional', 'admin']),
  status: String (enum: ['pending', 'approved', 'rejected', 'banned']),
  
  // Basic Info
  firstName: String,
  lastName: String,
  phone: String,
  profileImage: String (Cloudinary URL),
  
  // OAuth Info
  googleId: String (for Google OAuth users),
  
  // Flexible Profile Data (changes based on role)
  profileData: {
    // For Actors:
    height: Number,
    weight: Number,
    eyeColor: String,
    hairColor: String,
    bodyType: String,
    ethnicity: String,
    
    // For Singers:
    vocalRange: String,
    genre: [String],
    instruments: [String],
    
    // For Writers:
    specialization: [String],
    portfolio: String (URL),
    writingGenres: [String],
    
    // For Directors:
    directorType: String (film, tv, commercial, music_video),
    yearsExperience: Number,
    notableWorks: [String],
    
    // For Producers:
    producerType: String (executive, line, creative),
    budgetRange: String,
    
    // For Cinematographers:
    cameraExpertise: [String],
    shootingStyle: String,
    
    // For Models:
    measurements: Object,
    runway: Boolean,
    print: Boolean,
    
    // Common fields (all roles):
    bio: String,
    experience: String,
    education: String,
    awards: [String],
    languages: [String],
    availability: String,
    hourlyRate: Number,
    videos: [{
      muxPlaybackId: String,
      title: String,
      description: String,
      thumbnail: String,
      duration: Number,
      uploadedAt: Date
    }],
    images: [String] (Cloudinary URLs),
    resume: String (PDF URL),
    website: String,
    socialMedia: {
      instagram: String,
      twitter: String,
      linkedin: String,
      imdb: String,
      youtube: String
    }
  },
  
  // Tag System (for searchability)
  category: String (indexed),
  subcategories: [String],
  skills: [String],
  tags: [String] (indexed),
  
  // Metadata
  age: Number (indexed),
  dateOfBirth: Date,
  gender: String,
  location: {
    city: String,
    state: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  // Engagement Metrics
  profileViews: Number,
  contactRequests: Number,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  emailVerified: Boolean,
  emailVerifiedAt: Date
}
```

---

#### Collection: `leads`
Stores casting interest requests

```javascript
{
  _id: ObjectId,
  talentId: ObjectId (ref: users),
  castingDirector: {
    name: String,
    phone: String,
    email: String,
    company: String,
    message: String
  },
  status: String (enum: ['new', 'contacted', 'closed']),
  createdAt: Date,
  updatedAt: Date
}
```

---

#### Collection: `announcements`
Admin announcements to talent

```javascript
{
  _id: ObjectId,
  title: String,
  message: String,
  targetRole: [String] (null = all),
  createdBy: ObjectId (ref: users),
  createdAt: Date
}
```

---

### Indexing Strategy (Performance Optimization)

```javascript
// Compound index for fast filtering
db.users.createIndex({ 
  category: 1, 
  tags: 1, 
  age: 1, 
  status: 1 
});

// Text search index
db.users.createIndex({ 
  firstName: "text", 
  lastName: "text", 
  "profileData.bio": "text" 
});

// Email lookup
db.users.createIndex({ email: 1 }, { unique: true });

// Lead management
db.leads.createIndex({ talentId: 1, createdAt: -1 });
```

---

## ✅ Current Implementation Status

### Installed & Configured ✅
- [x] Next.js 16.1.0
- [x] React 19.2.3
- [x] TypeScript 5.x
- [x] Tailwind CSS v4
- [x] ESLint 9
- [x] PostCSS

### To Be Implemented ⏳

#### Phase 1: Design System
- [ ] Install shadcn/ui
- [ ] Configure next-themes (dark mode)
- [ ] Replace fonts (Inter + Plus Jakarta Sans)
- [ ] Install Lucide React icons
- [ ] Install Sonner notifications

#### Phase 2: Backend & Database
- [ ] Set up MongoDB Atlas
- [ ] Install Mongoose
- [ ] Create database schemas
- [ ] Set up Next.js API routes
- [ ] Implement authentication (NextAuth.js or Clerk)

#### Phase 3: Media Integration
- [ ] Set up Mux account
- [ ] Install Mux packages
- [ ] Implement video upload flow
- [ ] Set up Cloudinary account
- [ ] Install Cloudinary packages
- [ ] Implement image upload flow

#### Phase 4: Core Features
- [ ] Build Talent Portal (login, register, profile builder)
- [ ] Build Public Catalog (browse, search, filter)
- [ ] Build Admin Panel (user management, leads, announcements)
- [ ] Implement notification system
- [ ] Build lead capture flow

#### Phase 5: Polish & Deploy
- [ ] SEO optimization
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Testing (unit, integration, e2e)
- [ ] Deploy to Vercel/AWS

---

## 📦 Dependencies & Packages

### Currently Installed (3 Production + 7 Dev)

#### Production Dependencies
```json
{
  "next": "16.1.0",
  "react": "19.2.3",
  "react-dom": "19.2.3"
}
```

#### Development Dependencies
```json
{
  "@tailwindcss/postcss": "^4",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "eslint": "^9",
  "eslint-config-next": "16.1.0",
  "tailwindcss": "^4",
  "typescript": "^5"
}
```

---

### Required Packages (To Install)

#### UI & Design
```bash
npm install lucide-react sonner next-themes
npx shadcn@latest init
```

#### Database & Backend
```bash
npm install mongoose
npm install bcryptjs jsonwebtoken
npm install next-auth # or @clerk/nextjs
```

#### Media Handling
```bash
npm install @mux/mux-node @mux/mux-player-react
npm install cloudinary next-cloudinary
```

#### Forms & Validation
```bash
npm install react-hook-form zod @hookform/resolvers
```

#### Utilities
```bash
npm install date-fns
npm install clsx tailwind-merge
```

#### Type Definitions
```bash
npm install -D @types/bcryptjs
```

---

## 📁 Project Structure

### Current Structure
```
talent-marketplace/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── .next/
├── node_modules/
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

### Planned Structure
```
talent-marketplace/
├── app/
│   ├── (auth)/                    # Auth routes
│   │   ├── login/
│   │   └── register/
│   ├── (public)/                  # Public routes
│   │   ├── browse/
│   │   ├── talent/[id]/
│   │   └── search/
│   ├── (talent)/                  # Talent portal
│   │   ├── dashboard/
│   │   ├── profile/
│   │   └── notifications/
│   ├── (admin)/                   # Admin panel
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── leads/
│   │   └── announcements/
│   ├── api/                       # API routes
│   │   ├── auth/
│   │   ├── users/
│   │   ├── media/
│   │   ├── leads/
│   │   └── announcements/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── forms/
│   ├── layouts/
│   ├── talent/
│   └── admin/
├── lib/
│   ├── db/                        # Database utilities
│   ├── auth/                      # Auth helpers
│   ├── mux/                       # Mux integration
│   ├── cloudinary/                # Cloudinary integration
│   └── utils.ts
├── models/                        # Mongoose schemas
│   ├── User.ts
│   ├── Lead.ts
│   └── Announcement.ts
├── types/                         # TypeScript types
├── public/
│   ├── images/
│   └── icons/
├── .env.local                     # Environment variables
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20 or higher
- MongoDB Atlas account (or local MongoDB)
- Mux account (for video streaming)
- Cloudinary account (for image hosting)

### Installation
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Initialize shadcn/ui
npx shadcn@latest init

# Run development server
npm run dev
```

### Environment Variables (`.env.local`)
```env
# Database
MONGODB_URI=mongodb+srv://...

# Authentication (NextAuth.js)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Mux
MUX_TOKEN_ID=your-mux-token-id
MUX_TOKEN_SECRET=your-mux-token-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (for verification & notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
```

---

## 🎨 Design Tokens

### Color Palette

**Theme Strategy:** Manual toggle between Light and Dark modes (Dark is default)

#### Light Mode Colors
```css
:root {
  /* Primary - Media Industry Blue */
  --primary: 220 90% 56%;
  --primary-foreground: 0 0% 100%;
  
  /* Background - Light Mode */
  --background: 0 0% 100%;
  --foreground: 0 0% 9%;
  
  /* Accent - Casting Gold */
  --accent: 43 96% 56%;
  --accent-foreground: 222 47% 11%;
  
  /* Muted - Subtle UI Elements */
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;
  
  /* Borders */
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  
  /* Cards */
  --card: 0 0% 100%;
  --card-foreground: 0 0% 9%;
  
  /* Destructive - Errors */
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
}
```

#### Dark Mode Colors
```css
.dark {
  /* Primary - Media Industry Blue */
  --primary: 220 90% 56%;
  --primary-foreground: 0 0% 100%;
  
  /* Background - Dark Mode (Default) */
  --background: 222 47% 11%;
  --foreground: 213 31% 91%;
  
  /* Accent - Casting Gold */
  --accent: 43 96% 56%;
  --accent-foreground: 222 47% 11%;
  
  /* Muted - Subtle UI Elements */
  --muted: 223 47% 16%;
  --muted-foreground: 215 20% 65%;
  
  /* Borders */
  --border: 216 34% 17%;
  --input: 216 34% 17%;
  
  /* Cards */
  --card: 222 47% 11%;
  --card-foreground: 213 31% 91%;
  
  /* Destructive - Errors */
  --destructive: 0 63% 31%;
  --destructive-foreground: 0 0% 100%;
}
```

**Theme Toggle Implementation:**
- Toggle button in header/navbar
- Smooth transitions (0.3s ease)
- Persisted in localStorage
- No automatic switching based on system preference

---

## 📊 Performance Targets

- **Lighthouse Score:** 90+ (all categories)
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.5s
- **Video Start Time:** < 2s (via Mux HLS)
- **Image Load Time:** < 1s (via Cloudinary CDN)

---

## 🔐 Security Considerations

- ✅ JWT-based authentication
- ✅ Password hashing (bcrypt)
- ✅ CSRF protection
- ✅ Rate limiting on API routes
- ✅ Input validation (Zod)
- ✅ Secure video streaming (Mux signed URLs)
- ✅ Image upload validation (file type, size)
- ✅ MongoDB injection prevention (Mongoose)

---

## 📈 Scalability Plan

- **Database:** MongoDB Atlas auto-scaling
- **Media:** Mux & Cloudinary CDN (globally distributed)
- **Hosting:** Vercel Edge Network (serverless)
- **Caching:** Redis for session management (future)
- **Search:** Algolia or Elasticsearch (if needed)

---

**Generated:** December 20, 2025  
**Project Status:** Planning & Architecture Phase  
**Next Steps:** Install shadcn/ui, set up MongoDB, integrate Mux & Cloudinary
