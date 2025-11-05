# File Structure - Ahmed Clinic SaaS

Complete overview of the project file organization.

```
clinic-saas/
│
├── public/                          # Static assets
│   └── clinic-icon.svg             # Favicon (create your own)
│
├── src/                            # Source code
│   ├── components/                 # React components
│   │   ├── auth/
│   │   │   └── ProtectedRoute.jsx # Route protection
│   │   ├── layout/
│   │   │   ├── Layout.jsx         # Main layout wrapper
│   │   │   ├── Header.jsx         # Navigation header
│   │   │   └── Footer.jsx         # Footer component
│   │   └── ui/                    # Reusable UI components
│   │       ├── Button.jsx         # Button component
│   │       ├── Input.jsx          # Input component
│   │       ├── Card.jsx           # Card component
│   │       ├── Badge.jsx          # Badge component
│   │       ├── Modal.jsx          # Modal component
│   │       ├── Loading.jsx        # Loading spinner
│   │       └── Notifications.jsx  # Toast notifications
│   │
│   ├── pages/                     # Page components
│   │   ├── auth/
│   │   │   ├── Login.jsx         # Login page
│   │   │   └── Register.jsx      # Registration page
│   │   ├── Home.jsx              # Landing page
│   │   ├── Dashboard.jsx         # User dashboard
│   │   ├── Appointments.jsx      # Appointments management
│   │   └── Payments.jsx          # Payment history
│   │
│   ├── services/                  # API services
│   │   ├── api.js                # Apps Script API client
│   │   ├── auth.js               # Authentication service
│   │   └── payment.js            # Payment service
│   │
│   ├── store/                     # State management
│   │   └── index.js              # Zustand stores
│   │
│   ├── config/                    # Configuration
│   │   └── supabase.js           # Supabase client config
│   │
│   ├── App.jsx                    # Main app component
│   ├── main.jsx                   # App entry point
│   └── index.css                  # Global styles
│
├── apps-script-backend.gs         # Google Apps Script backend
│
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind CSS config
├── postcss.config.js             # PostCSS config
│
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
│
├── README.md                     # Main documentation
├── DEPLOYMENT.md                 # Deployment guide
└── FILE_STRUCTURE.md            # This file

```

## Component Breakdown

### UI Components (`src/components/ui/`)

**Button.jsx**
- Variants: primary, secondary, danger, success, ghost
- Sizes: sm, md, lg
- Loading state support
- Icon support

**Input.jsx**
- Label support
- Error message display
- Icon integration
- Full accessibility

**Card.jsx**
- Title and action slot
- Flexible content area
- Hover effects

**Badge.jsx**
- Status indicators
- Color variants

**Modal.jsx**
- Backdrop overlay
- Multiple sizes
- Close button
- Scroll handling

**Loading.jsx**
- Spinner component
- Full-screen option
- Custom text

**Notifications.jsx**
- Toast notifications
- Auto-dismiss
- Multiple types

### Layout Components (`src/components/layout/`)

**Layout.jsx**
- Wraps all pages
- Header + Content + Footer

**Header.jsx**
- Navigation bar
- User menu
- Mobile responsive
- Auth state aware

**Footer.jsx**
- Site links
- Contact info
- Copyright

### Page Components (`src/pages/`)

**Home.jsx**
- Landing page
- Features showcase
- Call-to-action

**Dashboard.jsx**
- Stats cards
- Recent appointments
- Quick actions

**Appointments.jsx**
- Appointment list
- Booking modal
- Status management

**Payments.jsx**
- Payment history
- Gateway selection
- Transaction details

**Login.jsx**
- Email/password login
- Form validation
- Redirect after login

**Register.jsx**
- User registration
- Multi-field form
- Email verification

### Services (`src/services/`)

**api.js**
- Axios client setup
- Request interceptors
- Error handling
- All API endpoints

**auth.js**
- Supabase Auth integration
- Sign in/up/out
- Session management
- Password reset

**payment.js**
- Payment initialization
- Status checking
- Gateway helpers
- Amount formatting

### State Management (`src/store/`)

**index.js**
- Zustand stores
- Auth state
- App state
- Notifications

### Configuration (`src/config/`)

**supabase.js**
- Supabase client
- Constants
- Table names
- Status enums

## Backend Structure

### Google Apps Script (apps-script-backend.gs)

**Main Functions:**
- `doPost()` - API endpoint handler
- `doGet()` - Webhook handler
- `createResponse()` - Response formatter

**API Handlers:**
- Appointment CRUD
- Payment processing
- Doctor management
- Dashboard stats

**Payment Integration:**
- Paymob authentication
- Order creation
- Payment key generation
- Webhook processing

**Database Operations:**
- `querySupabase()` - Universal DB query
- CRUD operations for all tables
- Filter support

**Utilities:**
- Email notifications
- Error handling
- Response formatting

## Configuration Files

**package.json**
- Dependencies list
- Scripts (dev, build, preview)
- Project metadata

**vite.config.js**
- Build configuration
- Dev server settings
- Plugin setup

**tailwind.config.js**
- Color palette
- Custom utilities
- Theme extensions

**postcss.config.js**
- Tailwind processing
- Autoprefixer

**.env**
- Environment variables
- API keys
- URLs

## Build Output

```
dist/                    # Production build
├── index.html          # Optimized HTML
├── assets/             # Bundled assets
│   ├── index-[hash].js    # JavaScript bundle
│   └── index-[hash].css   # CSS bundle
└── [other static files]
```

## Key Features by File

### Authentication Flow
- `Login.jsx` → `auth.js` → Supabase Auth
- `Register.jsx` → `auth.js` → Supabase Auth
- `ProtectedRoute.jsx` → Guards routes

### Appointment Booking
- `Appointments.jsx` → `api.js` → Apps Script → Supabase

### Payment Processing
- `Payments.jsx` → `payment.js` → `api.js` → Apps Script → Paymob

### State Flow
- User actions → Pages → Services → API → Zustand Store → UI Update

## Adding New Features

### To add a new page:
1. Create component in `src/pages/`
2. Add route in `App.jsx`
3. Add navigation link in `Header.jsx`

### To add new API endpoint:
1. Add handler in `apps-script-backend.gs`
2. Add function in `src/services/api.js`
3. Call from component

### To add new UI component:
1. Create in `src/components/ui/`
2. Follow existing patterns
3. Export and use in pages

## Best Practices

- Keep components small and focused
- Use PropTypes or TypeScript for type safety
- Follow naming conventions
- Keep business logic in services
- Use environment variables for secrets
- Comment complex logic
- Write meaningful commit messages

## File Naming Conventions

- **Components:** PascalCase (e.g., `UserProfile.jsx`)
- **Services:** camelCase (e.g., `authService.js`)
- **Utilities:** camelCase (e.g., `formatDate.js`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`)
- **Config files:** kebab-case (e.g., `vite.config.js`)

## Import Order

```javascript
// 1. External libraries
import React from 'react';
import { Link } from 'react-router-dom';

// 2. Internal services
import { api } from '../services/api';

// 3. Components
import Button from '../components/ui/Button';

// 4. Utilities
import { formatDate } from '../utils/date';

// 5. Styles
import './styles.css';
```

---

This structure follows modern React best practices and is designed for scalability and maintainability.