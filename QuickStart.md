# Quick Start Guide - Ahmed Clinic SaaS

Get your clinic system running in 15 minutes!

## ⚡ Fast Setup (3 Steps)

### Step 1: Setup Supabase (5 min)

1. **Create Project**
   - Visit [supabase.com/dashboard](https://supabase.com/dashboard)
   - Click "New Project"
   - Name: `clinic-db`
   - Set strong password
   - Choose region: closest to your location

2. **Run SQL Setup**
   - Go to SQL Editor
   - Copy-paste this entire SQL:

```sql
-- Users table
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'patient',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doctors
CREATE TABLE doctors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  fee DECIMAL(10,2) DEFAULT 2000,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments
CREATE TABLE appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  doctor_id UUID REFERENCES doctors(id) NOT NULL,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  doctor_name TEXT,
  specialization TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
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

-- Sample doctors
INSERT INTO doctors (name, specialization, email, phone, fee) VALUES
  ('Ahmed Khan', 'General Physician', 'ahmed@clinic.com', '+92 300 1234567', 2000),
  ('Sara Ali', 'Cardiologist', 'sara@clinic.com', '+92 301 2345678', 3500),
  ('Hassan Raza', 'Pediatrician', 'hassan@clinic.com', '+92 302 3456789', 2500);

-- Security policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own appointments" ON appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create appointments" ON appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
```

3. **Get Your Keys**
   - Go to Settings → API
   - Copy `Project URL` and `anon/public` key

---

### Step 2: Deploy Backend (5 min)

1. **Open Google Apps Script**
   - Visit [script.google.com](https://script.google.com)
   - New Project → Name it "Clinic Backend"

2. **Paste Backend Code**
   - Copy ALL code from `apps-script-backend.gs`
   - Replace the CONFIG section:

```javascript
const CONFIG = {
  SUPABASE_URL: 'https://xxxxx.supabase.co',  // Your URL
  SUPABASE_KEY: 'your-anon-key-here',          // Your key
  PAYMOB_API_KEY: '',  // Leave empty for now
  PAYMOB_IFRAME_ID: ''  // Leave empty for now
};
```

3. **Deploy**
   - Click Deploy → New Deployment
   - Type: Web App
   - Execute as: Me
   - Who has access: **Anyone**
   - Click Deploy
   - **Copy the Web App URL**

---

### Step 3: Run Frontend (5 min)

1. **Install Dependencies**
```bash
cd clinic-saas
npm install
```

2. **Create Environment File**
Create `.env` in project root:

```env
# From Supabase (Step 1)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# From Apps Script (Step 2)
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec

# Payment (Skip for now)
VITE_PAYMOB_API_KEY=
VITE_PAYMENT_SUCCESS_URL=http://localhost:3000/payment-success
VITE_PAYMENT_CANCEL_URL=http://localhost:3000/payment-cancel

# App
VITE_APP_NAME=Ahmed Clinic
VITE_APP_URL=http://localhost:3000
```

3. **Start Development Server**
```bash
npm run dev
```

4. **Open Browser**
   - Go to `http://localhost:3000`
   - Click "Get Started"
   - Register your first account! 🎉

---

## ✅ You're Done! 

Your clinic system is now running locally. You can:
- ✅ Register users
- ✅ Book appointments  
- ✅ View dashboard
- ❌ Process payments (need Paymob setup)

---

## 🎯 Next Steps

### Enable Payments (Optional)

1. **Sign up for Paymob**
   - Visit [paymob.com](https://www.paymob.com)
   - Complete business verification
   - Get API key and iframe ID

2. **Update Configuration**
   - Add keys to `.env`
   - Update `apps-script-backend.gs` CONFIG
   - Redeploy Apps Script

3. **Set Webhook**
   - In Paymob dashboard: Settings → Webhooks
   - URL: `YOUR_APPS_SCRIPT_URL?webhook=payment`

### Deploy to Production

Choose one:

**Option A: Vercel (Easiest)**
```bash
npm install -g vercel
vercel login
vercel
```

**Option B: Netlify**
```bash
npm run build
# Upload dist/ folder to netlify.com
```

See `DEPLOYMENT.md` for detailed instructions.

---

## 🧪 Testing Checklist

- [ ] Register new user
- [ ] Login works
- [ ] Dashboard shows stats
- [ ] Can book appointment
- [ ] Appointment appears in list
- [ ] Can cancel appointment

---

## 🐛 Common Issues

### Can't connect to Supabase?
- Check URL format: `https://xxxxx.supabase.co` (no trailing slash)
- Verify anon key is correct
- Check browser console for errors

### Apps Script not working?
- Ensure "Anyone" access is set
- Redeploy if you changed code
- Check execution logs in Apps Script

### npm install fails?
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Ensure Node.js 18+ is installed

---

## 📚 Documentation

- **README.md** - Complete documentation
- **DEPLOYMENT.md** - Production deployment
- **FILE_STRUCTURE.md** - Code organization

---

## 💬 Need Help?

1. Check the error message carefully
2. Review the relevant documentation
3. Check browser console (F12)
4. Verify all environment variables

---

## 🎊 Success!

You now have a fully functional medical clinic management system!

**What you can do:**
- Patient registration & login
- Doctor management
- Appointment booking
- Payment processing (with Paymob)
- Dashboard analytics
- Email notifications

**Ready for production:**
- Secure authentication
- Role-based access
- Real-time updates
- Mobile responsive
- SEO optimized

---

**Happy Coding!** 🚀