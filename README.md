# Ahmed Clinic - Medical Appointment & Billing SaaS Platform

A complete, production-ready medical clinic management system built with React, Google Apps Script, and Supabase.

## 🎯 Features

- **User Authentication**: Secure login/registration with Supabase Auth
- **Appointment Booking**: Easy appointment scheduling with available slots
- **Multiple Payment Gateways**: EasyPaisa, JazzCash, and Credit/Debit Cards via Paymob
- **Real-time Updates**: Automatic status updates via webhooks
- **Role-based Access**: Patient, Doctor, and Admin roles
- **Responsive Design**: Works on all devices
- **Secure**: Bank-level security with encrypted data

## 🏗️ Architecture

```
Frontend (React)
    ↓
Backend API (Google Apps Script)
    ↓
Database (Supabase PostgreSQL)
    ↓
Payment Gateway (Paymob)
```

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Google Account (for Apps Script)
- Supabase Account
- Paymob Account (for payments in Pakistan)
- Custom domain (optional but recommended)

## 🚀 Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd clinic-saas
npm install
```

### 2. Supabase Setup

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key

#### Create Database Tables

Run these SQL commands in Supabase SQL Editor:

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'patient',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doctors table
CREATE TABLE doctors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  fee DECIMAL(10,2),
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments table
CREATE TABLE appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  doctor_id UUID REFERENCES doctors(id) NOT NULL,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  appointment_id UUID REFERENCES appointments(id),
  transaction_id TEXT UNIQUE NOT NULL,
  order_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  gateway TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add sample doctors
INSERT INTO doctors (name, specialization, fee, email, phone) VALUES
  ('Dr. Ahmed Khan', 'General Physician', 2000, 'ahmed@clinic.com', '+92 300 1234567'),
  ('Dr. Sara Ali', 'Cardiologist', 3500, 'sara@clinic.com', '+92 301 2345678'),
  ('Dr. Hassan Raza', 'Pediatrician', 2500, 'hassan@clinic.com', '+92 302 3456789');

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own appointments" ON appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create appointments" ON appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
```

### 3. Google Apps Script Backend

1. Go to [script.google.com](https://script.google.com)
2. Create a new project named "Clinic Backend"
3. Copy contents from `apps-script-backend.gs`
4. Update the CONFIG object with your credentials:
   ```javascript
   const CONFIG = {
     SUPABASE_URL: 'your-project-url.supabase.co',
     SUPABASE_KEY: 'your-anon-key',
     PAYMOB_API_KEY: 'your-paymob-api-key',
     PAYMOB_IFRAME_ID: 'your-iframe-id'
   };
   ```
5. Deploy as Web App:
   - Click Deploy → New Deployment
   - Select type: Web App
   - Execute as: Me
   - Who has access: Anyone
   - Copy the Web App URL

### 4. Paymob Payment Gateway Setup

1. Sign up at [paymob.com](https://www.paymob.com)
2. Complete business verification
3. Get API credentials from dashboard
4. Enable payment methods: EasyPaisa, JazzCash, Cards
5. Set webhook URL to your Apps Script URL + `?webhook=payment`

### 5. Configure Environment Variables

Create `.env` file in project root:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Google Apps Script Backend
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# Paymob
VITE_PAYMOB_API_KEY=your-api-key
VITE_PAYMENT_SUCCESS_URL=https://yourdomain.com/payment-success
VITE_PAYMENT_CANCEL_URL=https://yourdomain.com/payment-cancel

# App Config
VITE_APP_NAME=Ahmed Clinic
VITE_APP_URL=https://yourdomain.com
```

### 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## 📦 Production Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: Netlify

```bash
# Build
npm run build

# Deploy dist folder to Netlify
```

### Option 3: Traditional Hosting

```bash
# Build production bundle
npm run build

# Upload 'dist' folder to your web server
```

## 🌐 Custom Domain Setup

### Connect Domain to Hosting
1. Add A and CNAME records:
   ```
   A     @     your-hosting-ip
   CNAME www   your-hosting-domain
   ```
2. Update environment variables with new domain
3. Update Paymob webhook URLs
4. Update Supabase redirect URLs

## 🔐 Security Checklist

- ✅ Enable Supabase RLS policies
- ✅ Use environment variables (never commit .env)
- ✅ Enable HTTPS on production domain
- ✅ Verify webhook signatures from Paymob
- ✅ Implement rate limiting on Apps Script
- ✅ Regular security audits
- ✅ Keep dependencies updated

## 📱 Testing

### Test User Registration
1. Go to `/register`
2. Create account with valid email
3. Check email for verification

### Test Appointment Booking
1. Login as patient
2. Navigate to Appointments
3. Click "Book Appointment"
4. Select doctor, date, time slot
5. Confirm booking

### Test Payment Flow
1. Book an appointment
2. Go to Payments
3. Select payment method
4. Complete payment on gateway page
5. Verify payment status updates

## 🔧 Troubleshooting

### Apps Script CORS Issues
- Ensure deployment is set to "Anyone" access
- Check if URL is correct in .env

### Supabase Connection Fails
- Verify project URL and anon key
- Check RLS policies are configured
- Ensure tables exist

### Payment Not Confirming
- Verify webhook URL is correct
- Check Paymob dashboard for webhook logs
- Ensure transaction_id matches

## 📊 Database Schema

```
users
  ├── id (UUID, FK to auth.users)
  ├── name
  ├── email
  ├── phone
  ├── role
  └── created_at

doctors
  ├── id (UUID)
  ├── name
  ├── specialization
  ├── email
  ├── phone
  ├── fee
  └── created_at

appointments
  ├── id (UUID)
  ├── user_id (FK)
  ├── doctor_id (FK)
  ├── date
  ├── time_slot
  ├── status
  └── created_at

payments
  ├── id (UUID)
  ├── user_id (FK)
  ├── appointment_id (FK)
  ├── transaction_id
  ├── amount
  ├── gateway
  ├── status
  └── created_at
```

## 🎨 Customization

### Branding
- Update colors in `tailwind.config.js`
- Replace logo in `Header.jsx`
- Update app name in `.env`

### Add New Features
1. Create new page in `src/pages/`
2. Add route in `App.jsx`
3. Update backend API if needed
4. Update Supabase schema if required

## 📄 License

MIT License - feel free to use for commercial projects

## 🤝 Support

For issues and questions:
- Check documentation
- Review troubleshooting section
- Contact: info@ahmedclinic.com

## 🎉 You're Ready!

Your medical clinic SaaS platform is now ready to use. Start by creating admin accounts and adding doctors.

Happy healing! 🏥