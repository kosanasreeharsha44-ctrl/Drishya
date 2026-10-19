# Drishya Creative Studio — Setup & Operations Guide
**Founder & Director:** Harsha  
**Brand:** Drishya — *"See your story differently."*

---

## 1. Quick Start & Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run unit tests for pricing & progress logic
node --test src/utils/pricing.test.ts

# 3. Launch local dev server (default port 3000)
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 2. Developer & Admin Access for Harsha

The Admin Portal is accessible via:
1. Navigating to `/admin` or `#admin` in your URL bar.
2. Clicking the **Admin** button in the desktop top-right navbar or mobile drawer.

### Default Pre-Configured Demo Credentials:
* **Admin Email:** `kosanasreeharsha44@gmail.com` (or `harsha@drishya.studio`)
* **Password:** `Harsha@Drishya2026!`
* **2FA Code (Optional):** `123456` or `2026`
* *Tip:* Click the **"Auto-Fill"** button on the login screen for 1-click authentication during demos.

---

## 3. Harsha's Admin Operations Guide

### A. Dashboard Module
* **KPI Overview:** Live count of Total, In Progress, Review, and Completed projects, collected revenue (₹), new inquiries, and active ideas.
* **Production Status Bar:** Visual multi-segment bar displaying real-time project distribution.
* **Upcoming Deadlines:** Color-coded countdown badges highlighting projects due soon.
* **Recent Inquiries:** View incoming quote submissions and convert them to active projects in 1 click.

### B. Projects Management
* **Checklist Milestones:** Each project includes an interactive progress checklist (Script & Storyboard, Rough Cut, Color Grade & VFX, Sound Design, Final 4K Export, Delivery).
* **Automatic Progress Calculation:** Ticking items recalculates completion % immediately.
* **Auto-Complete Trigger:** Checking all milestones automatically offers to transition the project to `Completed` and updates your dashboard statistics.
* **Filters & Sort:** Filter by status (`Pending`, `In Progress`, `Review`, `Completed`), service type, payment status (`Unpaid`, `Partial`, `Paid`), or sort by deadline.

### C. Inquiries Inbox
* All quote requests submitted via the public contact form appear here in real time.
* **"Convert to Project" Button:** Converts an inquiry directly into a project record with default production tasks and estimates pre-filled.

### D. Idea Submission & Revenue Share Ledger
* Tracks co-creation pitches from collaborators.
* **Financial Accounting Ledger:** For each accepted idea, enter the gross revenue earned (₹) and agreed share % (e.g., 20%). The system automatically calculates:
  * **Amount Owed (₹)** = `(Revenue * Share %) / 100`
  * **Balance Remaining Due (₹)** = `Amount Owed - Amount Paid`
* Log payout notes and transaction IDs (UPI / IMPS reference).

### E. Portfolio CMS
* Add, edit, reorder, or temporarily hide portfolio items without writing code.
* Supports **YouTube video embeds**, **theatrical poster key art**, and **interactive Before/After color grade sliders**.

### F. Settings & Data Backups
* **Export CSV:** 1-click download of `drishya_projects.csv`, `drishya_inquiries.csv`, and `drishya_ideas_revenue.csv` for accounting and spreadsheets.
* **JSON Backup:** Download a full JSON database snapshot.
* **Factory Reset:** Restore clean seed demo data at any time.

---

## 4. Android PWA Installation Guide

Drishya is a Progressive Web App (PWA) that installs as a native-feeling application on Android:

1. **Android (Chrome):**
   * Open `https://your-domain.com` in Google Chrome on your Android phone.
   * Tap the **Install App** button in the header, or open Chrome's menu (`⋮`) and select **"Install app"** or **"Add to Home Screen"**.
   * Drishya will appear in your Android app drawer with the cyan-magenta neon "D" icon, launch in full-screen standalone mode without a browser URL bar, and cache assets for offline access.

2. **iOS Safari (iPhone / iPad):**
   * Tap the **Share** button (box with upward arrow) at the bottom of Safari.
   * Tap **"Add to Home Screen"**.
   * Tap **Add** in the top right.

---

## 5. Production Deployment to Vercel

```bash
# 1. Install Vercel CLI (optional) or connect your GitHub repository to vercel.com
npm install -g vercel

# 2. Build test
npm run build

# 3. Deploy
vercel --prod
```

### Custom Domain Setup:
1. In Vercel Project Settings → **Domains**, enter `drishya.studio` (or `drishya.com` / `drishya.in`).
2. Add the provided `CNAME` or `A` records to your DNS provider (e.g., Cloudflare, GoDaddy, Namecheap):
   * Type: `A` | Name: `@` | Value: `76.76.21.21`
   * Type: `CNAME` | Name: `www` | Value: `cname.vercel-dns.com`

---

## 6. Email Service Integration (Resend / Brevo)

For live external email delivery of auto-replies and alerts:
1. Sign up for a free tier account at [Resend](https://resend.com) or [Brevo](https://brevo.com).
2. Add your API key to `.env`:
   ```bash
   RESEND_API_KEY="re_your_api_key_here"
   ```
3. Verify your sending domain (`harsha@drishya.studio`) with SPF and DKIM records.
