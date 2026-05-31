# RS Trading — Complete Production-Grade Implementation Plan

> **Single Source of Truth** for building the RS Trading MLM platform from absolute scratch.
> Every section is written so that a team of junior developers can execute without verbal clarification from anyone.
> Version: 2.0 | Last Updated: 31 May 2026 | Status: Production Ready

---

## Table of Contents

1. [Project Overview](#section-1)
2. [Full Codebase Audit](#section-2)
3. [Final Tech Stack With Reasons](#section-3)
4. [Complete Folder and File Structure](#section-4)
5. [Complete Database Schema](#section-5)
6. [Complete API Design](#section-6)
7. [Authentication and Authorization System](#section-7)
8. [React Component Architecture](#section-8)
9. [State Management Architecture](#section-9)
10. [Phase-by-Phase Build Plan](#section-10)
11. [Third-Party Integrations](#section-11)
12. [Environment Variables](#section-12)
13. [Security Implementation](#section-13)
14. [Performance Optimization](#section-14)
15. [Testing Strategy](#section-15)
16. [Deployment and DevOps](#section-16)
17. [Day One Developer Setup Guide](#section-17)
18. [Income Business Logic Deep Dive](#section-18)
19. [Error Handling Architecture](#section-19)
20. [Accessibility and Internationalisation](#section-20)
21. [Admin Panel Feature Specifications](#section-21)
22. [Notification System Architecture](#section-22)
23. [File Upload and Media Management](#section-23)
24. [Background Jobs and Scheduled Tasks](#section-24)
25. [Scalability and Growth Planning](#section-25)

---

<a name="section-1"></a>

# SECTION 1 — PROJECT OVERVIEW

## What Is RS Trading?

RS Trading is a production-grade, India-focused multi-level marketing (MLM) and network marketing platform that operates as a digital referral income business. It enables members to earn income by growing a structured downline team across nine levels of depth.

The platform combines:

- A public marketing website for lead generation
- A secure member dashboard for income tracking and team management
- A full administrative back-office for platform operations

The platform solves the problem of trust, transparency, and automation in traditional MLM businesses. Instead of manual commission tracking via spreadsheets and WhatsApp, RS Trading gives every participant a real-time dashboard showing team growth, income, wallet balance, withdrawal history, and network tree — all calculated and credited automatically by the backend income engine.

## Three Types of Users

### Guest (Unauthenticated Public User)

A visitor who has not registered. Guests can browse all public pages: Home, About, Business Plan, How It Works, and Contact. They can read the income plan, see testimonials, and use the earnings calculator. Their primary call to action is to register using a sponsor's RS ID.

### Member (Authenticated User)

A person who has completed registration using a valid sponsor's RS ID and received a unique RS Trading ID (example: RS1001). After registration, the member must activate their account using a valid E-Pin. Before activation, the member can log in but sees a limited dashboard. After activation, the full income earning system becomes live.

Members can:

- View wallet balance, income, and transaction history
- Manage their team network and referrals
- Transfer E-Pins to other members
- Request withdrawals (minimum ₹500 balance required)
- Raise and track support tickets
- Update profile, bank details, and password
- Receive real-time notifications via WebSocket

### Admin (Super Administrator)

An internal operator who logs in at `/admin/login`. The admin has access to a separate admin panel with complete platform control:

- Approve or reject withdrawal requests
- Generate and assign E-Pins in bulk
- Manually credit income to members
- Block or unblock member accounts
- Manage CMS page content
- View platform-wide analytics and reports
- Manage system settings (income amounts, limits, toggles)
- View full audit logs of every admin action

## Complete Feature List

### Public Website

- Responsive glassmorphism navbar with scroll effect and mobile hamburger menu
- Hero section with animated taglines, live stat counters, and CTA buttons
- How It Works 4-step explainer section
- Full 9-level income structure table with member thresholds and payouts
- Interactive earnings calculator (visitors enter team numbers, see estimated income)
- Animated referral network tree visualization
- Live stats: total members, income distributed, active states
- Testimonials carousel
- Trust and compliance section: PAN verification, legal compliance, support highlights
- FAQ accordion (8 questions)
- Contact form with email delivery
- About page: company story, values, team mission
- Business Plan page: full 9-level income table
- How It Works detailed page: step-by-step walkthrough
- Privacy Policy, Terms and Conditions, Refund Policy pages
- Footer: quick links, support links, contact details, social icons, business hours card

### Authentication System

- Multi-step registration wizard (5 steps): Sponsor Validation → Personal Info → Address Details → Banking Info → Review and Submit
- Sponsor RS ID live validation before step 2
- Referral code auto-fill from `?ref=RS1234` URL parameter
- Account number confirmation field
- IFSC format enforcement: regex `[A-Z]{4}0[A-Z0-9]{6}`
- PAN format enforcement: regex `[A-Z]{5}[0-9]{4}[A-Z]`
- Password minimum 8 characters with confirmation
- Login via RS ID, email, or mobile number
- JWT access token (15-minute expiry) + refresh token (30-day expiry)
- Refresh token rotation: new refresh token issued on every refresh
- Refresh token reuse detection: old token presented → all tokens invalidated
- Forgot password via OTP to email or mobile (10-minute OTP expiry)
- Password reset with OTP verification
- Auto-redirect authenticated users away from login/register
- Auto-redirect unauthenticated users to login from protected routes
- Remember Me toggle to extend refresh token to 90 days
- Separate admin login at `/admin/login`

### Member Dashboard

- Overview: 6 stat cards (total income, direct income, current level, total referrals, active team, wallet balance)
- Income line chart: last 12 months
- Income breakdown donut chart: by income type
- Recent transactions table: 5 latest
- Recent team joins list: avatar, RS ID, city, date, status
- Account Activation: E-Pin input with live format validation
- E-Pin Management: view assigned pins (status badges), copy to clipboard, transfer to another RS ID, transfer history
- Team Network: downline table with depth selector (1–9), member status, join date, level badges, pagination
- Team Tree View: visual card-based tree for depth 1–3
- Referral Page: unique referral link, one-click copy, QR code, WhatsApp share button, referral statistics
- Wallet: balance card, total credited, total withdrawn, transaction history (filter by credit/debit), pagination
- Withdrawal Modal: amount input, minimum ₹500 validation, balance check, bank details preview
- Income Statement: date range filter, income type filter, paginated, PDF export
- Bank Details: update bank name, account holder, account number, branch name, IFSC, PAN
- Profile: update name, email, address, district, taluka, nominee, DOB, profile photo upload
- Change Password: current password verification, new password, confirm, strength indicator
- Support Tickets: list of tickets, create ticket with subject/category/message, reply thread view, status badges
- Notifications: bell icon with unread count badge, dropdown list, mark as read, real-time push via Socket.IO

### Admin Panel

- Dashboard: 6 stat cards, daily registrations chart, monthly payouts chart, recent registrations table, pending withdrawals quick-view
- User Management: search by name/RS ID/mobile/email, filter by status, paginated table, view user modal, block/unblock, edit user, manual activate, view transaction history from user modal
- Income Management: view all income transactions, filter by type/user/date, manual credit form with RS ID + amount + reason
- E-Pin Management: generate batch (1–1000 pins), view all pins with batch ID, assign to specific member, transfer history, batch CSV export
- Withdrawal Management: pending queue, approve (requires UTR reference + date), reject (requires reason text), withdrawal history tab, export to Excel
- Reports and Analytics: monthly registration trend, monthly payout trend, income breakdown by category, user level distribution, geographic distribution by district, date range filter, PDF/Excel export
- CMS Management: edit all public page content (hero text, about, testimonials, business plan description, contact details)
- System Settings: edit income amounts per level, withdrawal limits, level thresholds, toggle registration on/off, toggle maintenance mode
- Admin Logs: full audit trail of every admin action with timestamp, IP address, action type, target user
- Support Management: view all tickets, filter by status/category, reply to tickets, change ticket status, assign to admin staff

---

<a name="section-2"></a>

# SECTION 2 — FULL CODEBASE AUDIT

## Overall Codebase Score: 4.5 / 10

The visual design and architecture are excellent — top 25% of MLM platform codebases ever started. Modern stack. Well-designed Mongoose schemas. Correct transaction patterns in the income engine. The score is 4.5 because the implementation is only 25–30% complete. Every single frontend page uses mock data and never calls the real backend. The platform cannot be used by a single real user in its current state.

## File-by-File Audit

### client/package.json

- What it does: Declares all frontend npm dependencies and scripts.
- What is good: React 19, React Router DOM 7, TanStack Query v5, Zustand v5, Framer Motion 12 — all correct latest versions.
- What is broken: Tailwind CSS 4 installed but barely used — dual styling system. `@tailwindcss/vite` in dependencies instead of devDependencies. No testing library. No TypeScript. No Zod. No react-hook-form.
- Fix: Move `@tailwindcss/vite` to devDependencies. Add `react-hook-form`, `@hookform/resolvers`, `zod`, `vitest`, `@testing-library/react`, `qrcode.react`, `socket.io-client`.

### client/vite.config.js

- What it does: Configures Vite build tool with React plugin and path alias.
- What is good: `@` alias correctly points to `./src`. Used consistently throughout.
- What is broken: No manual chunk splitting. No bundle analysis. No build output config.
- Fix: Add `rollupOptions.output.manualChunks` for recharts, framer-motion, vendor, zustand. Add `rollup-plugin-visualizer`.

### client/src/App.jsx

- What it does: Root routing file with all route definitions and provider wrappers.
- What is good: Clean route organization. QueryClient configured with sensible defaults. Route guards correctly use Zustand auth state. AnimatePresence wraps Routes for page transitions.
- What is broken: No lazy loading — entire bundle downloads on first load. PrivateRoute only checks `isAuthenticated` flag, not JWT expiry. No 404 page. No `/privacy`, `/terms`, `/refund-policy` routes. No `/dashboard/withdrawals` route.
- Fix: Wrap all routes in `React.lazy()` + `<Suspense>`. Add token expiry check to PrivateRoute. Add all missing routes.

### client/src/index.css

- What it does: Global stylesheet with design system tokens and component classes.
- What is good: Excellent design foundation. Well-organized CSS variables. Smooth transitions. Shimmer skeleton animation. Responsive breakpoints.
- What is broken: Tailwind imported but not used — dual system. `white: 'nowrap'` in Sidebar.jsx is a typo for `whiteSpace: 'nowrap'`. No dark mode. No focus-visible styles for accessibility. `.tree-node` and `.tree-connector` defined but not implemented.
- Fix: Commit to one styling approach. Add `@media (prefers-color-scheme: dark)`. Add `:focus-visible` styles. Implement tree classes.

### client/src/services/api.js

- What it does: Axios instance with base URL, interceptors, and credentials.
- What is good: Token pulled from localStorage on every request (not cached in closure). withCredentials true. 15s timeout.
- What is broken: No automatic token refresh on 401 — interceptor just logs out the user. Zustand store retains user in memory after localStorage clear until page reload. No retry logic.
- Fix: Implement the full token refresh interceptor with queued request retry. Store refresh token in httpOnly cookie.

### client/src/store/authStore.js

- What it does: Zustand store for authentication state persisted to localStorage.
- What is good: Correct use of persist middleware. `toSafeObject()` pattern strips sensitive fields. `isAdmin()` derived getter.
- What is broken: Token stored twice — manually via `localStorage.setItem('rs_token')` AND via persist middleware. `logout()` removes `rs_user` which is never set. No token expiry field. No refresh token tracking.
- Fix: Remove manual localStorage.setItem. Add `accessTokenExpiry` field. Remove the `rs_user` reference from logout.

### client/src/store/uiStore.js

- What it does: Zustand store for UI state (sidebar, notifications, toasts).
- What is good: Correct — sidebar state is global.
- What is broken: `notifications` array never populated. Notification bell shows a static red dot. `toasts` array is a duplicate of react-hot-toast functionality.
- Fix: Remove `toasts`, `addToast`, `removeToast`. Add `notificationCount`, `setNotifications`, `setUnreadCount`.

### client/src/constants/planData.js

- What it does: Stores all static business data used across frontend.
- What is good: Excellent centralization. Full Maharashtra district list. Indian bank names. FAQ data.
- CRITICAL BUG: Payout amounts in `LEVEL_DATA` do not match the backend `INCOME_TABLE` in incomeEngine.js. Frontend shows Level 5 = ₹20,000 but backend pays ₹15,000. Level 6: frontend ₹40,000, backend ₹20,000. Level 7: ₹60,000 vs ₹30,000. Level 8: ₹1,00,000 vs ₹50,000. Level 9: ₹2,00,000 vs ₹75,000. Members see DIFFERENT numbers in marketing vs what is actually paid.
- Fix: Make backend the single source of truth. Add `/api/plan` endpoint returning live income table from SystemSetting collection. Frontend fetches from API with static fallback.

### client/src/pages/auth/Login.jsx

- CRITICAL: Login is completely mocked — accepts any password 3+ characters. Never calls the real backend.
- Fix: Replace with `authService.login({ identifier, password })`. Handle remember me flag. Store tokens correctly.

### client/src/pages/auth/Register.jsx

- CRITICAL: Registration is completely mocked. Sponsor validation is mocked — accepts any RS\* prefix. `?ref=` URL parameter not implemented. No IFSC/PAN regex validation. No age validation.
- Fix: Connect to real API. Add regex validators. Read `?ref=` param. Add password visibility toggle. Validate 18+ age.

### client/src/pages/auth/ForgotPassword.jsx

- CRITICAL: Completely mocked. OTP countdown timer not implemented. No numeric-only OTP input.
- Fix: Connect to real endpoints. Add 10-minute countdown. Use `type="tel"` with maxLength 6.

### client/src/pages/dashboard/Overview.jsx

- What is broken: All data is hardcoded mock data. `allDownline` calculation in backend uses a broken regex query on `sponsorRsId`. No loading states. No error states.
- Fix: Replace all mock data with `useQuery` calls. Add skeleton loading states. Fix backend allDownline calculation.

### client/src/pages/dashboard/Activation.jsx

- What is broken: Never calls `/api/epin/activate`. After activation, Zustand store `isActive` flag not updated so sidebar still shows "Inactive".
- Fix: Call real API. On success call `updateUser({ isActive: true, activationDate: new Date() })`.

### client/src/pages/dashboard/EPin.jsx

- What is broken: All mocked. Transfer never calls API. My E-Pins never fetches.
- Fix: Connect both tabs to real API with React Query.

### client/src/pages/dashboard/TeamNetwork.jsx

- What is broken: Completely mocked. No visual tree. No infinite scroll. No search within team.
- Fix: Implement tree visualization. Connect to real API. Add member count per level.

### client/src/pages/dashboard/Referral.jsx

- What is broken: All statistics mocked. No QR code. No share buttons.
- Fix: Generate referral link as `${VITE_SITE_URL}/register?ref=${user.rsId}`. Add `qrcode.react`. Add Web Share API button.

### client/src/pages/dashboard/Wallet.jsx

- What is broken: All mocked. Withdrawal modal has hardcoded ₹12,200 balance instead of reading from API.
- Fix: Connect wallet balance, summary, and transaction APIs. Read balance from query result.

### client/src/pages/dashboard/SupportTickets.jsx

- What is broken: No backend model, controller, routes, or API exists for support tickets. Completely mocked.
- Fix: Build full backend first (SupportTicket model, supportRoutes, adminSupportRoutes). Then connect frontend.

### client/src/pages/admin/AdminLogin.jsx

- What is broken: Mocked. Should call same `/api/auth/login` — backend differentiates by `user.role === 'admin'`.
- Fix: Connect to real login API.

### All Admin Pages (AdminOverview, UserManagement, EPinManagement, IncomeManagement, WithdrawalManagement, Reports, CMSManagement)

- What is broken: ALL completely mocked. Local state management loses data on page refresh.
- Fix: Replace all local state with React Query mutations. Connect all to real admin API endpoints.

### server/server.js

- What is good: Helmet applied first. CORS configured correctly. MongoDB strict mode true. Server won't start without DB.
- What is broken: Rate limiting installed but NEVER applied. No graceful shutdown. No request ID middleware. Morgan disabled in production but no alternative logging.
- Fix: Apply rate limiting. Add SIGTERM/SIGINT handlers. Add requestId middleware. Add Winston production logging.

### server/models/User.js

- What is good: Comprehensive schema. bcrypt salt 12. `toSafeObject()` correct. Good indexes.
- What is broken: `accountNumber` stored in plaintext. OTP field named confusingly. `activeTeamCount` never updated. Wallet balance race condition possible with concurrent withdrawals.
- Fix: Add `lastLoginAt`. Add email verification fields. Add distributed lock or atomic update for wallet deductions.

### server/models/EPin.js

- What is good: Clean schema. Transfer history as embedded array. BatchId.
- What is broken: No expiry date. `assignedTo` not enforced on transfer. `generatedBy` defaults to null.
- Fix: Add `expiresAt`. Enforce `assignedTo` before status changes to "transferred".

### server/models/Transaction.js

- What is good: Complete audit trail. `balanceAfter` enables ledger reconstruction. `level` field for income filtering.
- What is broken: No index on `category`. No `status` field. No `ipAddress` for fraud detection.
- Fix: Add compound indexes. Add `ipAddress` field.

### server/models/Withdrawal.js

- What is good: Bank fields copied at request time — correct. Protects against bank detail changes mid-processing.
- What is broken: No `tdsAmount`, `netAmount`, `adminNotes`, `branchName` fields. No `tdsDeducted` for TDS calculations.
- Fix: Add TDS fields. Add `branchName`. Add `adminNotes`.

### server/controllers/authController.js

- What is good: Refresh token rotation correct. Reuse detection works. OTP bcrypt-hashed.
- What is broken: CRITICAL: `generateRsId()` uses random 4-digit loop — causes collisions at scale. OTP logged to console.log — security leak. No Zod validation. No real email/SMS OTP delivery. Login identifier check uses `startsWith('RS')` — fragile.
- Fix: Replace with Counter-based monotonic RS ID. Remove console.log. Add Zod validation. Add real email/SMS delivery.

### server/services/incomeEngine.js

- What is good: MongoDB sessions for atomic transactions. Correct sponsor chain traversal. BFS for level calculation. Configurable income table.
- CRITICAL BUG: Income amounts in `INCOME_TABLE` do not match `planData.js`. Frontend shows different numbers than what is actually paid. Must be resolved before launch.
- POTENTIAL DOUBLE-CREDIT BUG: `processActivationIncome()` credits direct income AND level 1 income separately — if sponsor has level >= 1, they receive ₹1,500 (direct) + ₹1,500 (level 1) = ₹3,000 from one activation. Verify against actual business plan.
- PERFORMANCE BUG: `checkAndUpdateLevel()` does a BFS that with 10,000+ downline members could time out.
- UNIQUENESS BUG: `generateTxId()` uses `Date.now()` — duplicate IDs possible under concurrency.
- Fix: Sync INCOME_TABLE with planData.js. Use UUID for transaction IDs. Move level recalculation to background job.

### server/routes/userRoutes.js

- What is broken: Business logic in route handlers — should be in controllers. N+1 query in team BFS. Broken regex for total team count. No input validation. `bank-details` update does not reset `kycStatus.bank` to pending.
- Fix: Extract to userController.js. Fix team query with `$graphLookup`. Add Zod validation. Update kycStatus on bank change.

### server/routes/ePinRoutes.js

- CRITICAL BUG: Pin uniqueness check loads ALL existing pins into memory with `EPin.find({}, 'pin')` — with 100,000+ pins this is a memory DoS vector.
- SECURITY BUG: Activation does not verify that the E-Pin `assignedTo` matches the requesting user. Any user can use any available pin regardless of assignment.
- Fix: Check uniqueness per-pin individually. Add `assignedTo === user._id` check. Add recipient active check on transfer.

### server/routes/withdrawalRoutes.js

- CRITICAL RACE CONDITION: Two simultaneous withdrawal requests read the same `walletBalance` — both deduct, resulting in negative balance.
- CRASH BUG: If user has no bank details, `bankName`, `accountHolder`, `accountNumber` will be undefined/null — violates schema required constraints and crashes the server.
- Fix: Use `findOneAndUpdate` with `{ walletBalance: { $gte: amount } }` atomic check. Validate bank details completeness before allowing withdrawal.

### server/routes/adminRoutes.js

- SECURITY BUG: User search uses `{ $regex: search }` without escaping — regex injection vulnerability. A search string like `.*` returns all users. A string like `(?i)a` causes ReDoS.
- What is broken: All business logic in route file. No admin action logging. No `/api/admin/epin/assign`. No `/api/admin/users/:id/activate`. No CMS endpoints. No settings endpoints.
- Fix: Escape regex input. Add AdminLog. Split to controller files. Add all missing endpoints.

### server/utils/logger.js

- What is broken: Toy console wrapper. Not production-grade. No log levels. No JSON output. No log rotation. No log shipping.
- Fix: Replace with Winston configured for JSON + file + Logtail transport in production.

## Security Issues Found

1. OTP logged to `console.log()` in authController.js — server log access exposes OTPs
2. JWT secrets use placeholder text "change this in production" — risk of deploying defaults
3. MongoDB Atlas credentials in `.env` — if committed to git, production database is exposed
4. Regex injection in admin user search — ReDoS and data leakage vulnerability
5. No rate limiting on ANY endpoint — brute force and spam attacks possible
6. Account numbers stored in plaintext — violates PCI-DSS best practices
7. Access tokens in localStorage — vulnerable to XSS token theft
8. No CSRF protection
9. Pin uniqueness check loads ALL pins into memory — memory DoS with 100k+ pins
10. Missing bank details validation before withdrawal — null fields on required schema crash server
11. No input sanitization on free-text fields — stored XSS risk

## Performance Issues Found

1. N+1 query in `/api/user/team` — each BFS depth fires a separate DB query
2. Synchronous BFS in `checkAndUpdateLevel()` during activation — could time out for large trees
3. Loading all E-Pins into memory for uniqueness check
4. Broken total team count query using `$regex` on `sponsorRsId` — full collection scan
5. No caching layer — every dashboard load hits database
6. Missing indexes on `Transaction.category` and `Transaction.createdAt`
7. No pagination on several admin endpoints
8. All frontend components eagerly imported — full bundle on first load
9. No image compression or lazy loading

## Technical Debt Items

1. Every frontend page uses hardcoded mock data — must be replaced
2. Login, Register, ForgotPassword never connect to backend
3. Support ticket system has frontend but zero backend
4. CMS management has frontend but zero backend
5. Income amounts inconsistent between planData.js and incomeEngine.js
6. Total team count query broken in dashboard-stats
7. Logger is toy implementation
8. All business logic in route files
9. No Zod validation on any endpoint
10. No tests anywhere in the codebase
11. No CI/CD pipeline
12. No TypeScript
13. Dual styling system (Tailwind + custom CSS)
14. Styles embedded as `<style>` JSX tags inside components
15. Admin action logging completely absent

---

<a name="section-3"></a>

# SECTION 3 — FINAL TECH STACK WITH REASONS

## Frontend Stack

### Framework: React 19 with Vite 8

React 19 is the current stable version with improved concurrency and Server Components support. Vite 8 is dramatically faster than Webpack for HMR and has first-class React support via `@vitejs/plugin-react`. Alternative considered: Next.js — rejected because the platform is a SPA with protected dashboard routes that do not benefit from SSR, and adding Next.js would require a full rewrite.

### UI: Custom CSS Design System (no Shadcn, no Material UI)

The existing codebase has invested heavily in custom CSS with specific Indian MLM brand colors (emerald green primary, navy secondary, gold accent). Adopting a pre-built library would require rethinking the entire visual identity. The custom CSS system in `index.css` is mature enough to continue. New components use CSS Modules.

### Styling: Vanilla CSS + CSS Modules for new components

Tailwind CSS 4 is installed but barely used — creating a confusing dual system. Decision: keep Tailwind for utility needs only (spacing, flex shortcuts). All component-specific styles go in CSS Modules (`.module.css`). No `<style>` JSX tags in components.

### Animation: Framer Motion 12

Already installed and used throughout. Provides `AnimatePresence` for route transitions, `useInView` for scroll animations, and `motion.div` for micro-interactions. Chosen over React Spring because the API is more intuitive for the patterns used here.

### Global State: Zustand 5

Chosen over Redux Toolkit because it has zero boilerplate, works natively with React 19, and persist middleware handles localStorage automatically. Only two stores needed: `authStore` and `uiStore`. Everything else is server state managed by React Query.

### Server State: TanStack React Query 5

Handles all API data fetching, caching, background refetching, loading and error states. Eliminates useEffect+useState patterns for API calls. Query invalidation automatically refreshes related data after mutations. Stale time configuration controls freshness.

### Routing: React Router DOM 7

Already the project standard. Supports browser-based routing and data router API.

### Forms and Validation: React Hook Form + Zod

React Hook Form replaces manual form state management. Zod provides TypeScript-compatible schema validation that runs on both frontend (error messages) and backend (request body validation).

### HTTP Client: Axios 1

Already configured. Enhancement: full token refresh interceptor with queued request retry.

## Backend Stack

### Framework: Express.js 5

Express 5 has async/await error handling built in. The existing routing structure is correct for the platform needs.

### Database: MongoDB Atlas

Already in use. Flexible document model suits nested User objects (kycStatus, bank details) and embedded arrays (EPin transferHistory). Atlas provides automatic backups, scaling, and monitoring.

### ORM: Mongoose 9

Provides schema definition, validation, indexes, pre/post hooks, virtuals. Existing schemas are well-designed.

### Authentication: JWT (Access Token + Refresh Token)

15-minute access tokens + 30-day refresh tokens. Correct pattern for SPAs that need session persistence without server-side session storage.

### Token Storage: Access token in Zustand (localStorage), Refresh token in httpOnly cookie

Access token in Zustand memory + localStorage for persistence across sessions. Refresh token moves to httpOnly cookie set by the server — prevents XSS from stealing the refresh token while allowing silent renewal.

### File Storage: AWS S3

Profile photos, KYC documents stored in S3 bucket `rstrading-assets` in `ap-south-1` region. Backend uses signed URLs for secure upload/download. Multer parses multipart form data before S3 upload.

### Email: Nodemailer + Gmail SMTP (dev) / AWS SES (production)

Nodemailer already installed. Gmail SMTP for development. AWS SES for production — handles deliverability, bounce management, and TLS automatically. $0.10 per 1,000 emails.

### SMS / OTP: MSG91

Required for Indian mobile number OTP delivery. DLT (Distributed Ledger Technology) registration required by TRAI. Better delivery rates than Twilio for Indian numbers. ₹0.15–₹0.30 per SMS.

### Payments: Manual Bank Transfer now / Razorpay Payouts API (Phase 13)

Current withdrawal flow is manual — admin approves and does bank transfer outside the platform. Razorpay Payouts API will automate NEFT/IMPS transfers to member bank accounts.

### Real-Time: Socket.IO

WebSocket connections with automatic fallback to polling. Used for: income credit notifications, withdrawal status changes, team join alerts. Runs on the same Express HTTP server.

### Background Jobs: node-cron

Scheduled tasks: daily report generation, weekly summary emails, expired OTP cleanup, level recalculation queue. `node-cron` for scheduled tasks. For complex job queues: `Agenda.js` (MongoDB-backed, survives server restarts).

### Logging: Winston

Replaces the toy `console.log` logger. JSON output to files. Ships to Logtail (Better Stack) in production. Log levels: error, warn, info, http, debug.

### Error Monitoring: Sentry

Node.js SDK captures unhandled exceptions and slow transactions. React SDK captures frontend errors with user session context. Free tier: 5,000 errors/month.

### Caching: Redis (via Upstash for serverless-compatible managed Redis)

Caches dashboard stats per user for 60 seconds. Caches admin stats for 30 seconds. Caches plan data for 5 minutes. Prevents hammering MongoDB on every page load.

### Testing Frontend: Vitest + React Testing Library + Playwright

Vitest is Vite-native and fast. RTL tests components user-centrically. Playwright handles E2E browser automation.

### Testing Backend: Jest + Supertest

Jest for unit tests on service functions. Supertest fires real HTTP requests against the Express app.

### CI/CD: GitHub Actions

Tests, builds, and deploys on push to main branch.

### Frontend Hosting: Vercel

`vercel.json` in client folder confirms this. SPA routing via rewrites rule.

### Backend Hosting: Railway

Supports Node.js with automatic HTTPS, environment variable management, git-based deployment. Health check integration via `railway.toml`. Alternative: Render.

### Database Hosting: MongoDB Atlas

Already in use. Cluster should be in `ap-south-1` (Mumbai) for lowest latency for Indian users.

---

<a name="section-4"></a>

# SECTION 4 — COMPLETE FOLDER AND FILE STRUCTURE

```
rstrading.com/                                    # Root monorepo directory
├── .github/                                      # GitHub configuration
│   └── workflows/
│       ├── frontend.yml                          # Frontend: lint, test, build, deploy to Vercel
│       └── backend.yml                           # Backend: audit, test, deploy to Railway
│
├── client/                                       # React 19 frontend (Vite 8)
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── logo.webp                             # Optimised WebP logo
│   │   └── og-image.png                          # Open Graph social share image 1200x630
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   └── images/
│   │   │       ├── logo.png                      # Original PNG logo
│   │   │       └── logo.webp                     # Optimised WebP version
│   │   │
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx                    # Public nav with glassmorphism scroll effect
│   │   │   │   ├── Footer.jsx                    # Public footer with 4 columns
│   │   │   │   ├── DashboardLayout.jsx           # Shell for /dashboard/* pages
│   │   │   │   ├── AdminLayout.jsx               # Shell for /admin/* pages
│   │   │   │   └── Sidebar.jsx                   # Shared sidebar for dashboard and admin
│   │   │   │
│   │   │   ├── shared/
│   │   │   │   ├── ErrorBoundary.jsx             # Catches React render errors with fallback UI
│   │   │   │   ├── LoadingSpinner.jsx            # Full-page and inline spinner
│   │   │   │   ├── SkeletonCard.jsx              # Shimmer skeleton for stat cards
│   │   │   │   ├── SkeletonTable.jsx             # Shimmer skeleton for table rows
│   │   │   │   ├── EmptyState.jsx                # Empty data state with icon and message
│   │   │   │   ├── NotificationBell.jsx          # Bell icon with dropdown notification list
│   │   │   │   ├── ConfirmModal.jsx              # Generic "are you sure?" confirmation dialog
│   │   │   │   └── PageMeta.jsx                  # Sets document.title and meta description
│   │   │   │
│   │   │   ├── ui/
│   │   │   │   ├── Button.jsx                    # Primary, outline, ghost, danger variants
│   │   │   │   ├── Input.jsx                     # Controlled input with label and error message
│   │   │   │   ├── Select.jsx                    # Controlled select dropdown
│   │   │   │   ├── Textarea.jsx                  # Controlled textarea
│   │   │   │   ├── Badge.jsx                     # Status badge: green, red, gold, blue, gray
│   │   │   │   ├── Card.jsx                      # Card container with optional hover effect
│   │   │   │   ├── Modal.jsx                     # Accessible modal with overlay and focus trap
│   │   │   │   ├── Tabs.jsx                      # Tabbed navigation component
│   │   │   │   ├── Pagination.jsx                # Page number navigator
│   │   │   │   ├── SearchInput.jsx               # Search box with 300ms debounce
│   │   │   │   ├── StatCard.jsx                  # Dashboard stat card with icon and trend
│   │   │   │   └── DataTable.jsx                 # Sortable paginated data table
│   │   │   │
│   │   │   ├── forms/
│   │   │   │   ├── PasswordInput.jsx             # Password field with show/hide toggle
│   │   │   │   ├── OtpInput.jsx                  # 6-box OTP input with auto-focus
│   │   │   │   ├── FileUpload.jsx                # Drag and drop with preview
│   │   │   │   ├── BankDetailsForm.jsx           # Reusable bank details form section
│   │   │   │   └── AddressForm.jsx               # Reusable address form section
│   │   │   │
│   │   │   └── charts/
│   │   │       ├── IncomeLineChart.jsx           # Monthly income trend line chart (Recharts)
│   │   │       ├── IncomeBreakdownChart.jsx      # Income by type donut chart (Recharts)
│   │   │       ├── TeamGrowthChart.jsx           # Team growth bar chart (Recharts)
│   │   │       └── PayoutBarChart.jsx            # Monthly payout bar chart for admin (Recharts)
│   │   │
│   │   ├── constants/
│   │   │   ├── planData.js                       # Level data, FAQ, testimonials, districts, banks
│   │   │   ├── queryKeys.js                      # All React Query key constants (QUERY_KEYS object)
│   │   │   └── routes.js                         # Route path constants (ROUTES object)
│   │   │
│   │   ├── hooks/
│   │   │   ├── useDebounce.js                    # Debounce hook used in search inputs
│   │   │   ├── useLocalStorage.js                # Type-safe local storage hook
│   │   │   ├── useWindowSize.js                  # Window dimensions for responsive logic
│   │   │   ├── useCopyToClipboard.js             # Clipboard copy with toast feedback
│   │   │   └── useInfiniteTeam.js                # Infinite scroll hook for team network
│   │   │
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   │   ├── Home.jsx                      # Landing page composing all home sections
│   │   │   │   ├── About.jsx                     # Company story, values, team mission
│   │   │   │   ├── BusinessPlan.jsx              # Full 9-level income table page
│   │   │   │   ├── HowItWorks.jsx                # Step-by-step guide page
│   │   │   │   ├── Contact.jsx                   # Contact page with form
│   │   │   │   ├── Privacy.jsx                   # Privacy policy page
│   │   │   │   ├── Terms.jsx                     # Terms and conditions page
│   │   │   │   ├── RefundPolicy.jsx              # Refund policy page
│   │   │   │   └── sections/                     # Home page section components
│   │   │   │       ├── HeroSection.jsx
│   │   │   │       ├── StatsSection.jsx
│   │   │   │       ├── HowItWorksSection.jsx
│   │   │   │       ├── IncomeStructureSection.jsx
│   │   │   │       ├── EarningsCalculatorSection.jsx
│   │   │   │       ├── ReferralNetworkSection.jsx
│   │   │   │       ├── TestimonialsSection.jsx
│   │   │   │       ├── TrustSection.jsx
│   │   │   │       ├── FAQSection.jsx            # id="faq" required for footer anchor link
│   │   │   │       ├── CTASection.jsx
│   │   │   │       ├── ContactHeroSection.jsx
│   │   │   │       ├── ContactFormSection.jsx
│   │   │   │       ├── AboutHeroSection.jsx
│   │   │   │       ├── AboutStorySection.jsx
│   │   │   │       ├── AboutValuesSection.jsx
│   │   │   │       ├── BusinessPlanHeroSection.jsx
│   │   │   │       ├── HowItWorksHeroSection.jsx
│   │   │   │       └── HowItWorksDetailedSection.jsx
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx                     # Member login (RS ID / email / mobile)
│   │   │   │   ├── Register.jsx                  # 5-step registration wizard
│   │   │   │   └── ForgotPassword.jsx            # 3-step OTP password reset
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── Overview.jsx                  # Home: stats, charts, recent activity
│   │   │   │   ├── Activation.jsx                # E-Pin account activation
│   │   │   │   ├── EPin.jsx                      # E-Pin list and transfer
│   │   │   │   ├── TeamNetwork.jsx               # Downline tree and table
│   │   │   │   ├── Referral.jsx                  # Referral link, QR code, share
│   │   │   │   ├── Wallet.jsx                    # Balance, transactions, withdrawal
│   │   │   │   ├── Withdrawals.jsx               # Dedicated withdrawal history page
│   │   │   │   ├── Statement.jsx                 # Income statement with filters
│   │   │   │   ├── BankDetails.jsx               # Bank details update form
│   │   │   │   ├── Profile.jsx                   # Personal profile + photo upload
│   │   │   │   ├── ChangePassword.jsx            # Change password form
│   │   │   │   └── SupportTickets.jsx            # Ticket list, create, reply thread
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── AdminLogin.jsx                # Admin-specific login page
│   │   │       ├── AdminOverview.jsx             # Platform metrics dashboard
│   │   │       ├── UserManagement.jsx            # Search, filter, manage all members
│   │   │       ├── EPinManagement.jsx            # Generate, assign, view E-Pins
│   │   │       ├── IncomeManagement.jsx          # Income transactions + manual credit
│   │   │       ├── WithdrawalManagement.jsx      # Approve/reject withdrawal requests
│   │   │       ├── Reports.jsx                   # Analytics charts and export
│   │   │       ├── CMSManagement.jsx             # Website content editor
│   │   │       ├── AdminSettings.jsx             # System settings (income, limits, toggles)
│   │   │       ├── AdminLogs.jsx                 # Admin audit trail viewer
│   │   │       └── SupportManagement.jsx         # Admin support ticket management
│   │   │
│   │   ├── services/
│   │   │   ├── api.js                            # Axios instance + request/response interceptors
│   │   │   ├── authService.js                    # register, login, refresh, logout, validateSponsor
│   │   │   ├── userService.js                    # me, updateProfile, updateBankDetails, changePassword
│   │   │   ├── walletService.js                  # getBalance, getSummary, getTransactions
│   │   │   ├── epinService.js                    # activate, getMine, transfer
│   │   │   ├── withdrawalService.js              # request, getMine
│   │   │   ├── adminService.js                   # All admin API functions
│   │   │   ├── supportService.js                 # createTicket, list, getDetail, addReply
│   │   │   ├── notificationService.js            # getNotifications, markRead, markAllRead
│   │   │   └── socketClient.js                   # Socket.IO client connect/disconnect/events
│   │   │
│   │   ├── store/
│   │   │   ├── authStore.js                      # Auth state: user, token, isAuthenticated, isAdmin()
│   │   │   └── uiStore.js                        # UI state: sidebarOpen, notifications, unreadCount
│   │   │
│   │   └── utils/
│   │       ├── formatCurrency.js                 # INR currency formatting using Intl
│   │       ├── formatDate.js                     # Date, datetime, relative time formatters
│   │       ├── validators.js                     # IFSC, PAN, Indian mobile regex validators
│   │       └── tokenUtils.js                     # JWT decode and expiry check utilities
│   │
│   ├── e2e/                                      # Playwright E2E test files
│   │   ├── registration.spec.js
│   │   ├── login.spec.js
│   │   ├── activation.spec.js
│   │   ├── wallet.spec.js
│   │   └── admin.spec.js
│   │
│   ├── src/__tests__/                            # Vitest unit and component tests
│   │   ├── utils/
│   │   │   ├── formatCurrency.test.js
│   │   │   ├── formatDate.test.js
│   │   │   ├── validators.test.js
│   │   │   └── tokenUtils.test.js
│   │   └── components/
│   │       ├── Login.test.jsx
│   │       ├── Register.test.jsx
│   │       ├── StatCard.test.jsx
│   │       ├── Wallet.test.jsx
│   │       └── DataTable.test.jsx
│   │
│   ├── .env                                      # Local env vars — NOT committed to git
│   ├── .env.example                              # Env var template — committed to git
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html                                # Vite HTML entry point
│   ├── package.json
│   ├── vercel.json                               # Vercel SPA routing config
│   └── vite.config.js                            # Vite build config with chunk splitting
│
└── server/                                       # Express 5 backend API
    ├── controllers/
    │   ├── authController.js                     # register, login, refresh, logout, OTP
    │   ├── userController.js                     # profile, team, dashboardStats, referralInfo
    │   ├── epinController.js                     # activate, mine, transfer
    │   ├── walletController.js                   # balance, transactions, summary
    │   ├── withdrawalController.js               # request, myWithdrawals
    │   ├── supportController.js                  # createTicket, list, detail, reply
    │   ├── notificationController.js             # list, markRead, markAllRead
    │   └── admin/
    │       ├── adminUserController.js            # list, block, unblock, activate, edit, detail
    │       ├── adminEpinController.js            # generate, list, assign
    │       ├── adminIncomeController.js          # listAll, manualCredit
    │       ├── adminWithdrawalController.js      # list, approve, reject
    │       ├── adminReportController.js          # overview, incomeByLevel, geographic
    │       ├── adminCmsController.js             # getAll, getOne, update
    │       ├── adminSettingController.js         # getAll, update
    │       └── adminSupportController.js         # listAll, reply, updateStatus, assign
    │
    ├── middleware/
    │   ├── auth.js                               # authenticate, requireAdmin, requireActive
    │   ├── errorHandler.js                       # Global Express error handler
    │   ├── rateLimiter.js                        # Rate limiting configurations
    │   ├── validate.js                           # Zod validation middleware factory
    │   ├── upload.js                             # Multer S3 configuration
    │   ├── requestId.js                          # Attaches unique request ID header
    │   └── adminLogger.js                        # Logs every admin action to AdminLog
    │
    ├── models/
    │   ├── User.js                               # Core user schema
    │   ├── EPin.js                               # E-Pin schema with transfer history
    │   ├── Transaction.js                        # Wallet transaction audit trail
    │   ├── Withdrawal.js                         # Withdrawal request schema
    │   ├── SupportTicket.js                      # Support ticket schema
    │   ├── SupportMessage.js                     # Support ticket reply messages
    │   ├── Notification.js                       # User notification schema
    │   ├── CmsContent.js                         # CMS content key-value store
    │   ├── SystemSetting.js                      # Platform configuration key-value store
    │   ├── AdminLog.js                           # Admin action audit log
    │   └── Counter.js                            # Auto-increment counter for RS IDs
    │
    ├── routes/
    │   ├── authRoutes.js                         # /api/auth/*
    │   ├── userRoutes.js                         # /api/user/*
    │   ├── epinRoutes.js                         # /api/epin/*
    │   ├── walletRoutes.js                       # /api/wallet/*
    │   ├── withdrawalRoutes.js                   # /api/withdrawals/*
    │   ├── supportRoutes.js                      # /api/support/*
    │   ├── notificationRoutes.js                 # /api/notifications/*
    │   └── adminRoutes.js                        # /api/admin/* (all admin sub-routes)
    │
    ├── services/
    │   ├── incomeEngine.js                       # Income distribution on E-Pin activation
    │   ├── emailService.js                       # Nodemailer email sending with templates
    │   ├── smsService.js                         # MSG91 OTP SMS sending
    │   ├── s3Service.js                          # AWS S3 upload and signed URL generation
    │   ├── socketService.js                      # Socket.IO notification sender
    │   ├── pdfService.js                         # Income statement PDF generation
    │   └── cacheService.js                       # Redis get/set/invalidate helpers
    │
    ├── utils/
    │   ├── logger.js                             # Winston logger with Logtail transport
    │   ├── generateId.js                         # UUID-based TXN ID, WD ID, Ticket ID generators
    │   ├── validators.js                         # Zod schemas for all request bodies
    │   └── constants.js                          # Server-side constants
    │
    ├── scripts/
    │   └── seed.js                               # Seeds Counter, SystemSettings, admin user, test sponsor
    │
    ├── __tests__/
    │   ├── services/
    │   │   ├── incomeEngine.test.js
    │   │   └── authController.test.js
    │   └── routes/
    │       ├── auth.test.js
    │       ├── epin.test.js
    │       ├── withdrawal.test.js
    │       └── admin.test.js
    │
    ├── .env                                      # Local env vars — NOT committed
    ├── .env.example                              # Env var template — committed
    ├── .gitignore
    ├── package.json
    ├── railway.toml                              # Railway deployment config
    └── server.js                                 # Express app entry point
```

---

<a name="section-5"></a>

# SECTION 5 — COMPLETE DATABASE SCHEMA

## Migration Order

Migrate collections in this exact order to satisfy all reference dependencies:

1. Counter
2. User
3. EPin
4. Transaction
5. Withdrawal
6. SupportTicket
7. SupportMessage
8. Notification
9. CmsContent
10. SystemSetting
11. AdminLog

---

## Collection 1: counters

```
_id           String    Required  Unique    Counter name (e.g. "rsId")
seq           Number    Required            Current sequence value — seed with 1000
createdAt     Date      Auto
updatedAt     Date      Auto

Index: _id (unique, default)
Seed: { _id: "rsId", seq: 1000 }
```

---

## Collection 2: users

```
_id                     ObjectId    Auto        Unique primary key
rsId                    String      Required    Unique    "RS1001" format — from Counter
fullName                String      Required    Trim, max 100
mobile                  String      Required    Unique    10-digit Indian mobile
email                   String      Required    Unique    Lowercase, trimmed
passwordHash            String      Required              bcrypt hash (salt 12)
dob                     Date        Optional
sponsorId               ObjectId    Optional    ref:User  Direct sponsor (null for root)
sponsorRsId             String      Optional              RS ID of sponsor (denormalized)
sponsorName             String      Optional              Full name of sponsor (denormalized)
nomineeName             String      Optional    max 100
nomineeRelation         String      Optional    Enum: [Spouse, Parent, Sibling, Child, Other]
address                 String      Optional    max 500
district                String      Optional
taluka                  String      Optional
bankName                String      Optional
accountHolder           String      Optional
accountNumber           String      Optional    ENCRYPTED at rest
branchName              String      Optional
ifscCode                String      Optional    11 chars uppercase
panCard                 String      Optional    10 chars uppercase
profilePhoto            String      Optional    S3 URL
isActive                Boolean     Default: false
isBlocked               Boolean     Default: false
emailVerified           Boolean     Default: false
emailVerificationToken  String      Optional
role                    String      Default: user    Enum: [user, admin]
level                   Number      Default: 0       Min: 0  Max: 9
activationDate          Date        Optional
activationEPin          String      Optional
walletBalance           Number      Default: 0       Min: 0
totalIncome             Number      Default: 0
directIncome            Number      Default: 0
referralCount           Number      Default: 0
refreshToken            String      Optional
otp                     String      Optional    bcrypt hash of OTP
otpExpiry               Date        Optional
lastLoginAt             Date        Optional
kycStatus               Object      Default: { pan: "pending", bank: "pending" }
  kycStatus.pan         String      Enum: [pending, verified, rejected]
  kycStatus.bank        String      Enum: [pending, verified, rejected]
createdAt               Date        Auto
updatedAt               Date        Auto

Indexes:
  rsId: 1 (unique)
  mobile: 1 (unique)
  email: 1 (unique)
  sponsorId: 1
  isActive: 1
  isBlocked: 1
  role: 1
  createdAt: -1
```

---

## Collection 3: epins

```
_id               ObjectId    Auto        Primary key
pin               String      Required    Unique    EP + 8 alphanumeric (EP12ABCD56)
generatedBy       ObjectId    Required    ref:User  Admin who generated
assignedTo        ObjectId    Optional    ref:User  Member the pin is assigned to
usedBy            ObjectId    Optional    ref:User  Member who activated
status            String      Required    Enum: [available, assigned, transferred, used]  Default: available
usedAt            Date        Optional
expiresAt         Date        Optional    null = never expires
transferHistory   Array       Default: []
  from            ObjectId    ref:User
  to              ObjectId    ref:User
  date            Date        Default: Date.now
batchId           String      Optional    "BATCH-{timestamp}"
notes             String      Optional
createdAt         Date        Auto
updatedAt         Date        Auto

Indexes:
  pin: 1 (unique)
  assignedTo: 1, status: 1
  status: 1
  generatedBy: 1
  batchId: 1
```

---

## Collection 4: transactions

```
_id               ObjectId    Auto
transactionId     String      Required    Unique    UUID v4
userId            ObjectId    Required    ref:User
type              String      Required    Enum: [credit, debit]
category          String      Required    Enum: [direct_income, level_income, withdrawal, activation, bonus, transfer, refund]
amount            Number      Required    Min: 0
description       String      Required    Human-readable
balanceAfter      Number      Required    Wallet balance after this transaction
referenceId       String      Optional    Withdrawal ID, E-Pin, etc.
level             Number      Optional    Income level 1-9 for level_income
fromUserId        ObjectId    Optional    ref:User  Who triggered this credit
ipAddress         String      Optional    IP of the request
createdAt         Date        Auto
updatedAt         Date        Auto

Indexes:
  transactionId: 1 (unique)
  userId: 1, createdAt: -1
  userId: 1, type: 1
  userId: 1, category: 1
  category: 1
  createdAt: -1
```

---

## Collection 5: withdrawals

```
_id               ObjectId    Auto
withdrawalId      String      Required    Unique    WD + timestamp + counter
userId            ObjectId    Required    ref:User
amount            Number      Required    Min: 500
tdsAmount         Number      Default: 0
netAmount         Number      Required    amount - tdsAmount
bankName          String      Required    Copied at request time
accountHolder     String      Required    Copied at request time
accountNumber     String      Required    Masked version (****8921) for display
branchName        String      Optional    Copied at request time
ifscCode          String      Required    Copied at request time
panCard           String      Optional    Copied at request time
status            String      Required    Enum: [pending, approved, rejected]  Default: pending
processedBy       ObjectId    Optional    ref:User  Admin who processed
processedAt       Date        Optional
transactionRef    String      Optional    UTR / NEFT / IMPS reference
transactionDate   Date        Optional    Actual bank transfer date
rejectionReason   String      Optional    Shown to member
adminNotes        String      Optional    Internal admin notes — not shown to member
createdAt         Date        Auto
updatedAt         Date        Auto

Indexes:
  withdrawalId: 1 (unique)
  userId: 1, status: 1
  userId: 1, createdAt: -1
  status: 1, createdAt: -1
  processedBy: 1
```

---

## Collection 6: support_tickets

```
_id               ObjectId    Auto
ticketId          String      Required    Unique    TKT + timestamp
userId            ObjectId    Required    ref:User
subject           String      Required    max 200
category          String      Required    Enum: [general, payment, technical, epin, account, other]
status            String      Required    Enum: [open, in_progress, closed]  Default: open
priority          String      Required    Enum: [low, normal, high, urgent]  Default: normal
assignedTo        ObjectId    Optional    ref:User  Admin assigned
resolvedAt        Date        Optional
closedAt          Date        Optional
lastReplyAt       Date        Optional
lastReplyBy       String      Optional    Enum: [member, admin]
createdAt         Date        Auto
updatedAt         Date        Auto

Indexes:
  ticketId: 1 (unique)
  userId: 1, status: 1
  status: 1, createdAt: -1
  assignedTo: 1
```

---

## Collection 7: support_messages

```
_id           ObjectId    Auto
ticketId      ObjectId    Required    ref:SupportTicket
senderId      ObjectId    Required    ref:User
senderRole    String      Required    Enum: [member, admin]
message       String      Required    max 2000
attachments   Array       Default: []
  filename    String      S3 file key
  url         String      S3 public URL
  mimeType    String
isRead        Boolean     Default: false
createdAt     Date        Auto

Indexes:
  ticketId: 1, createdAt: 1
  senderId: 1
```

---

## Collection 8: notifications

```
_id           ObjectId    Auto
userId        ObjectId    Required    ref:User  Recipient
type          String      Required    Enum: [income_credit, withdrawal_approved, withdrawal_rejected, team_join, epin_transferred, system_message, ticket_reply]
title         String      Required    max 100
message       String      Required    max 300
isRead        Boolean     Default: false
actionUrl     String      Optional    Relative URL to navigate on click (/dashboard/wallet)
referenceId   String      Optional    Related object ID
createdAt     Date        Auto

Indexes:
  userId: 1, isRead: 1
  userId: 1, createdAt: -1
```

---

## Collection 9: cms_contents

```
_id           ObjectId    Auto
key           String      Required    Unique    e.g. "home_hero", "about_story"
title         String      Required              Admin display name
content       Mixed       Required              String or JSON object
isPublished   Boolean     Default: true
updatedBy     ObjectId    Optional    ref:User  Last admin who updated
createdAt     Date        Auto
updatedAt     Date        Auto

Index: key: 1 (unique)
```

---

## Collection 10: system_settings

```
_id           ObjectId    Auto
key           String      Required    Unique
value         Mixed       Required
description   String      Optional
isPublic      Boolean     Default: false    Expose to frontend via /api/plan
updatedBy     ObjectId    Optional    ref:User
createdAt     Date        Auto
updatedAt     Date        Auto

Seed values:
  withdrawal_min_amount       500
  withdrawal_max_amount       100000
  epin_value                  5000
  income_direct               1500
  income_level_1              1500
  income_level_2              5000
  income_level_3              7000
  income_level_4              10000
  income_level_5              15000
  income_level_6              20000
  income_level_7              30000
  income_level_8              50000
  income_level_9              75000
  level_threshold             4
  maintenance_mode            false
  registration_enabled        true

Index: key: 1 (unique)
```

---

## Collection 11: admin_logs

```
_id           ObjectId    Auto
adminId       ObjectId    Required    ref:User
action        String      Required    e.g. "block_user", "approve_withdrawal", "generate_epins"
targetType    String      Optional    User, Withdrawal, EPin
targetId      ObjectId    Optional    ID of the target document
targetRsId    String      Optional    RS ID of target for quick lookup
payload       Mixed       Optional    Snapshot of action payload
result        String      Required    Enum: [success, failure]
ipAddress     String      Optional
userAgent     String      Optional
createdAt     Date        Auto

Indexes:
  adminId: 1, createdAt: -1
  action: 1
  targetId: 1
  createdAt: -1
```

---

<a name="section-6"></a>

# SECTION 6 — COMPLETE API DESIGN

All endpoints use base path `/api`. All requests accept and return `Content-Type: application/json`. Protected routes require `Authorization: Bearer <accessToken>` header.

---

## Module: Auth (/api/auth)

### POST /api/auth/register

- Who: Public
- Description: Register new member. Auto-generates RS ID from Counter. Does not auto-login.
- Request Body:

```
sponsorRsId       string   required   e.g. RS1001
fullName          string   required   min 2, max 100
mobile            string   required   exactly 10 digits
email             string   required   valid email
password          string   required   min 8 chars
dob               string   optional   YYYY-MM-DD
nomineeName       string   optional
nomineeRelation   string   optional   enum
address           string   optional
district          string   optional
taluka            string   optional
bankName          string   optional
accountHolder     string   optional
accountNumber     string   optional   digits only
branchName        string   optional
ifscCode          string   optional   [A-Z]{4}0[A-Z0-9]{6}
panCard           string   optional   [A-Z]{5}[0-9]{4}[A-Z]
```

- Success (201): `{ success: true, message: "Registration successful!", rsId: "RS1042" }`
- Errors: 400 missing fields, 400 mobile taken, 400 email taken, 400 invalid sponsor, 400 Zod validation

### POST /api/auth/login

- Who: Public
- Rate Limit: 10 requests per 15 minutes per IP
- Request Body: `{ identifier: string, password: string }`
- identifier can be RS ID (starts with RS), email (contains @), or 10-digit mobile
- Success (200): `{ success: true, accessToken: "jwt...", user: { ...safeUserObject } }`
- Refresh token set as httpOnly cookie: name=`rs_refresh_token`, path=`/api/auth/refresh`, SameSite=Lax, Secure=true in production, maxAge=30 days
- Errors: 400 missing fields, 401 invalid credentials, 403 account blocked

### POST /api/auth/refresh

- Who: Public (uses httpOnly cookie)
- Request: Cookie `rs_refresh_token` sent automatically
- Success (200): `{ success: true, accessToken: "new_jwt..." }` + new cookie
- Errors: 401 no token, 401 invalid or reused token

### POST /api/auth/logout

- Who: Authenticated Bearer
- Action: Clears refreshToken from User document. Clears cookie.
- Success (200): `{ success: true, message: "Logged out successfully" }`

### POST /api/auth/validate-sponsor

- Who: Public
- Request Body: `{ sponsorId: string }`
- Success (200): `{ success: true, sponsor: { rsId, fullName, isActive } }`
- Error: 404 sponsor not found

### POST /api/auth/forgot-password

- Who: Public
- Rate Limit: 3 requests per hour per IP
- Request Body: `{ identifier: string }` (email or mobile)
- Action: Generates 6-digit OTP, bcrypt-hashes it, saves with 10-minute expiry, sends via email and SMS
- Success (200): `{ success: true, message: "OTP sent to your registered email" }`
- Error: 404 no account found

### POST /api/auth/reset-password

- Who: Public
- Request Body: `{ identifier: string, otp: string, newPassword: string }`
- Success (200): `{ success: true, message: "Password reset successful" }`
- Errors: 400 no OTP, 400 OTP expired, 400 invalid OTP

---

## Module: User (/api/user)

### GET /api/user/me

- Who: Authenticated Bearer
- Success (200): `{ success: true, user: { ...toSafeObject() } }`

### PUT /api/user/profile

- Who: Authenticated Bearer
- Body: `{ fullName?, email?, address?, district?, taluka?, nomineeName?, nomineeRelation?, dob? }`
- Success (200): `{ success: true, user: {...}, message: "Profile updated" }`

### PUT /api/user/bank-details

- Who: Authenticated Bearer
- Body: `{ bankName, accountHolder, accountNumber, branchName?, ifscCode, panCard }`
- Action: Updates bank fields AND sets `kycStatus.bank = "pending"`
- Success (200): `{ success: true, user: {...}, message: "Bank details updated" }`

### PUT /api/user/change-password

- Who: Authenticated Bearer
- Body: `{ currentPassword, newPassword }`
- Success (200): `{ success: true, message: "Password changed" }`
- Errors: 400 wrong current password, 400 new password < 8 chars

### GET /api/user/team

- Who: Authenticated Bearer
- Query: `level=1` (1-9), `page=1`, `limit=20`
- Uses `$graphLookup` aggregation for efficient tree traversal
- Success (200): `{ success: true, members: [...], total, page, totalPages }`

### GET /api/user/dashboard-stats

- Who: Authenticated Bearer
- Success (200): `{ success: true, stats: { walletBalance, totalIncome, directIncome, level, referralCount, totalTeamCount, activeTeamCount } }`

### GET /api/user/referral-info

- Who: Authenticated Bearer
- Success (200): `{ success: true, referralLink: "https://rstradingonline.co.in/register?ref=RS1001", referralCount, rsId }`

### POST /api/user/upload-photo

- Who: Authenticated Bearer
- Request: multipart/form-data, field name `photo`, max 2MB, JPEG/PNG/WebP only
- Success (200): `{ success: true, photoUrl: "https://s3...amazonaws.com/..." }`

### GET /api/plan

- Who: Public
- Description: Returns live income plan data from SystemSetting collection
- Success (200): `{ success: true, levels: [{ level: 1, payout: 1500 }, ...], directIncome: 1500, levelThreshold: 4 }`

---

## Module: E-Pin (/api/epin)

### POST /api/epin/activate

- Who: Authenticated Bearer
- Body: `{ pin: string }`
- Validates: pin exists, status is "available" OR "assigned", assignedTo matches current user, user not already active
- Action: Sets pin status="used", usedBy, usedAt. Sets user isActive=true, activationDate. Runs full income distribution via incomeEngine. Creates income notifications for all credited ancestors.
- Success (200): `{ success: true, message: "Account activated!", activationDate }`
- Errors: 400 missing pin, 400 invalid/used pin, 400 already active, 400 pin not assigned to you

### GET /api/epin/mine

- Who: Authenticated Bearer
- Query: `status?`, `page=1`, `limit=20`
- Success (200): `{ success: true, pins: [...], total }`

### POST /api/epin/transfer

- Who: Authenticated Bearer
- Body: `{ pin: string, recipientRsId: string }`
- Validates: pin belongs to current user, status=available or assigned, recipient exists, recipient not already active, recipient != sender
- Success (200): `{ success: true, message: "E-Pin transferred to Rahul Sharma (RS1010)" }`
- Errors: 400 pin not available, 404 recipient not found, 400 self-transfer, 400 recipient already active

---

## Module: Wallet (/api/wallet)

### GET /api/wallet/balance

- Who: Authenticated Bearer
- Success (200): `{ success: true, walletBalance, totalIncome, directIncome }`

### GET /api/wallet/transactions

- Who: Authenticated Bearer
- Query: `type?` (credit/debit), `category?`, `from?`, `to?`, `page=1`, `limit=20`
- Success (200): `{ success: true, transactions: [...], total, page, totalPages }`

### GET /api/wallet/summary

- Who: Authenticated Bearer
- Success (200): `{ success: true, totalCredited, totalDebited, netBalance }`

---

## Module: Withdrawals (/api/withdrawals)

### POST /api/withdrawals/request

- Who: Authenticated Bearer, Active account required
- Body: `{ amount: number }`
- Validates: amount >= 500, amount <= 100000, walletBalance >= amount (ATOMIC), bank details complete, no pending withdrawal exists
- Action: Atomically deducts from walletBalance using `findOneAndUpdate` with `{ walletBalance: { $gte: amount } }`. Creates Withdrawal doc. Creates debit Transaction.
- Success (201): `{ success: true, message: "Withdrawal submitted. Processing in 2-3 business days.", withdrawalId }`
- Errors: 400 below minimum, 400 above maximum, 400 insufficient balance, 403 not active, 400 bank details incomplete, 400 pending withdrawal exists

### GET /api/withdrawals/my

- Who: Authenticated Bearer
- Query: `status?`, `page=1`, `limit=10`
- Success (200): `{ success: true, withdrawals: [...], total }`

---

## Module: Support (/api/support)

### POST /api/support/tickets

- Who: Authenticated Bearer
- Body: `{ subject, message, category }`
- Success (201): `{ success: true, ticket: { ticketId, status, createdAt } }`

### GET /api/support/tickets

- Who: Authenticated Bearer
- Query: `status?`, `page=1`, `limit=10`
- Success (200): `{ success: true, tickets: [...], total }`

### GET /api/support/tickets/:ticketId

- Who: Authenticated Bearer (only ticket owner)
- Success (200): `{ success: true, ticket: { ...ticketFields, messages: [...] } }`
- Error: 403 not your ticket

### POST /api/support/tickets/:ticketId/reply

- Who: Authenticated Bearer (only ticket owner)
- Body: `{ message: string }`
- Success (201): `{ success: true, message: "Reply added" }`

---

## Module: Notifications (/api/notifications)

### GET /api/notifications

- Who: Authenticated Bearer
- Query: `page=1`, `limit=20`, `unread=true`
- Success (200): `{ success: true, notifications: [...], unreadCount, total }`

### PUT /api/notifications/:id/read

- Who: Authenticated Bearer
- Success (200): `{ success: true }`

### PUT /api/notifications/read-all

- Who: Authenticated Bearer
- Success (200): `{ success: true, message: "All marked as read" }`

---

## Module: Admin Users (/api/admin/users)

### GET /api/admin/users

- Who: Bearer + Admin
- Query: `search?` (name/rsId/mobile/email — regex escaped), `status?` (active/inactive/blocked), `page=1`, `limit=20`
- Success (200): `{ success: true, users: [...], total, page, totalPages }`

### GET /api/admin/users/:userId

- Who: Bearer + Admin
- Success (200): Full user detail with last 10 transactions populated

### PUT /api/admin/users/:userId/block

- Who: Bearer + Admin
- Action: Sets isBlocked=true. Creates AdminLog entry.
- Success (200): `{ success: true, message: "User blocked" }`

### PUT /api/admin/users/:userId/unblock

- Who: Bearer + Admin
- Success (200): `{ success: true, message: "User unblocked" }`

### PUT /api/admin/users/:userId/activate

- Who: Bearer + Admin
- Action: Sets isActive=true, activationDate=now WITHOUT requiring E-Pin. Admin override only. Creates AdminLog.
- Success (200): `{ success: true, message: "User manually activated" }`

### PUT /api/admin/users/:userId

- Who: Bearer + Admin
- Body: Any editable user fields
- Success (200): `{ success: true, message: "User updated" }`

---

## Module: Admin E-Pin (/api/admin/epin)

### POST /api/admin/epin/generate

- Who: Bearer + Admin
- Body: `{ count: integer (1-1000), notes?: string }`
- Action: Generates `count` unique pins with incrementally checked uniqueness. Creates AdminLog.
- Success (201): `{ success: true, count: 50, batchId: "BATCH-1748691234567" }`

### GET /api/admin/epin

- Who: Bearer + Admin
- Query: `status?`, `batchId?`, `page=1`, `limit=50`
- Success (200): `{ success: true, pins: [...], total }`

### POST /api/admin/epin/assign

- Who: Bearer + Admin
- Body: `{ pin: string, rsId: string }`
- Success (200): `{ success: true, message: "E-Pin assigned to RS1010" }`

---

## Module: Admin Income (/api/admin/income)

### GET /api/admin/income/transactions

- Who: Bearer + Admin
- Query: `category?`, `userId?`, `from?`, `to?`, `page=1`, `limit=50`
- Success (200): Paginated transactions with user.rsId and user.fullName populated

### POST /api/admin/income/manual

- Who: Bearer + Admin
- Body: `{ rsId, amount, description, type? (bonus/adjustment/incentive) }`
- Action: Credits amount to user walletBalance + totalIncome. Creates Transaction. Creates AdminLog. Sends notification to user.
- Success (200): `{ success: true, message: "₹5,000 credited to Rahul Sharma (RS1010)" }`

---

## Module: Admin Withdrawals (/api/admin/withdrawals)

### GET /api/admin/withdrawals

- Who: Bearer + Admin
- Query: `status?`, `page=1`, `limit=20`
- Success (200): Paginated withdrawals with user.rsId, user.fullName, user.mobile populated

### PUT /api/admin/withdrawals/:id/approve

- Who: Bearer + Admin
- Body: `{ transactionRef: string, transactionDate?: string }`
- Action: Sets status=approved, processedBy, processedAt, transactionRef, transactionDate. Creates AdminLog. Sends approval notification to user.
- Success (200): `{ success: true, message: "Withdrawal approved" }`

### PUT /api/admin/withdrawals/:id/reject

- Who: Bearer + Admin
- Body: `{ reason: string }`
- Action: Sets status=rejected. REFUNDS amount to user walletBalance using atomic $inc. Creates credit Transaction with category="refund". Creates AdminLog. Sends rejection notification to user.
- Success (200): `{ success: true, message: "Withdrawal rejected and amount refunded" }`

---

## Module: Admin Reports (/api/admin/reports)

### GET /api/admin/reports/overview

- Who: Bearer + Admin
- Success (200): `{ success: true, stats: { totalUsers, activeUsers, blockedUsers, totalIncome, pendingWithdrawals, pendingAmount, todayRegs, thisMonthRegs }, monthlyRegs: [...], monthlyPayouts: [...] }`

### GET /api/admin/reports/income-by-level

- Who: Bearer + Admin
- Query: `from?`, `to?`
- Success (200): `{ success: true, breakdown: [{ category, total, count, level? }] }`

### GET /api/admin/reports/geographic

- Who: Bearer + Admin
- Success (200): `{ success: true, distribution: [{ district, count }] }`

---

## Module: Admin CMS (/api/admin/cms)

### GET /api/admin/cms

- Who: Bearer + Admin
- Success (200): Array of all CmsContent documents

### GET /api/cms/:key

- Who: Public (for frontend rendering)
- Success (200): `{ success: true, content: { key, content } }`

### PUT /api/admin/cms/:key

- Who: Bearer + Admin
- Body: `{ content: any }`
- Success (200): `{ success: true, message: "Content updated" }`

---

## Module: Admin Settings (/api/admin/settings)

### GET /api/admin/settings

- Who: Bearer + Admin
- Success (200): All system settings as key-value object

### PUT /api/admin/settings/:key

- Who: Bearer + Admin
- Body: `{ value: any }`
- Action: Updates SystemSetting. Invalidates related Redis cache. Creates AdminLog.
- Success (200): `{ success: true, message: "Setting updated" }`

---

## Module: Admin Support (/api/admin/support)

### GET /api/admin/support/tickets

- Who: Bearer + Admin
- Query: `status?`, `category?`, `assignedTo?`, `page=1`, `limit=20`
- Success (200): Paginated tickets with user.rsId, user.fullName populated

### POST /api/admin/support/tickets/:ticketId/reply

- Who: Bearer + Admin
- Body: `{ message: string }`
- Action: Creates SupportMessage with senderRole="admin". Updates ticket lastReplyAt, lastReplyBy="admin". Sends ticket_reply notification to member.
- Success (201): `{ success: true }`

### PUT /api/admin/support/tickets/:ticketId/status

- Who: Bearer + Admin
- Body: `{ status: string }` (open/in_progress/closed)
- Success (200): `{ success: true }`

### PUT /api/admin/support/tickets/:ticketId/assign

- Who: Bearer + Admin
- Body: `{ adminId: string }`
- Success (200): `{ success: true }`

---

<a name="section-7"></a>

# SECTION 7 — AUTHENTICATION AND AUTHORIZATION SYSTEM

## Complete Auth Flow From App Open

### Step 1: App Loads

`main.jsx` renders `App.jsx`. Zustand `authStore` with persist middleware reads `rs_auth` from localStorage. If it exists, `isAuthenticated=true`, `user` and `token` are restored.

### Step 2: PrivateRoute Evaluation

```javascript
function PrivateRoute({ children }) {
  const { isAuthenticated, token, logout } = useAuthStore();
  if (!isAuthenticated || !token) return <Navigate to="/login" replace />;
  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    // Token expired — do NOT logout here. Let axios interceptor handle it on first API call.
    // This avoids a logout flash on every page load with an expired token.
  } catch (e) {
    logout();
    return <Navigate to="/login" replace />;
  }
  return children;
}
```

### Step 3: Registration With Referral Code

```javascript
// Register.jsx — on mount:
const searchParams = new URLSearchParams(window.location.search);
const refCode = searchParams.get("ref");
if (refCode) {
  setData((d) => ({ ...d, sponsorId: refCode.toUpperCase() }));
  autoValidateSponsor(refCode.toUpperCase()); // Fires validate-sponsor API immediately
}
```

### Step 4: Login Flow

```javascript
// Login.jsx — form submit:
const { accessToken, user } = await authService.login({ identifier, password });
setAuth(user, accessToken); // Zustand: stores token + user to localStorage
navigate("/dashboard");
// Refresh token set as httpOnly cookie by server — JS cannot access it
```

### Step 5: JWT Generation (Backend)

```javascript
// authController.js
const generateTokens = (userId, role) => ({
  accessToken: jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  }),
  refreshToken: jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  }),
});
```

### Step 6: Refresh Token Cookie (Backend)

```javascript
res.cookie("rs_refresh_token", refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/api/auth/refresh",
  maxAge: 30 * 24 * 60 * 60 * 1000,
});
```

### Step 7: Axios Token Refresh Interceptor (Frontend)

```javascript
// services/api.js
let isRefreshing = false;
let refreshSubscribers = [];

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve) =>
          refreshSubscribers.push((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(API(original));
          }),
        );
      }
      original._retry = true;
      isRefreshing = true;
      try {
        const { data } = await axios.post(
          "/api/auth/refresh",
          {},
          { withCredentials: true },
        );
        const newToken = data.accessToken;
        useAuthStore.getState().setAuth(useAuthStore.getState().user, newToken);
        refreshSubscribers.forEach((cb) => cb(newToken));
        refreshSubscribers = [];
        isRefreshing = false;
        original.headers.Authorization = `Bearer ${newToken}`;
        return API(original);
      } catch {
        isRefreshing = false;
        useAuthStore.getState().logout();
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  },
);
```

### Step 8: Logout (Frontend + Backend)

```javascript
// authStore.js — logout action:
logout: async () => {
  try {
    await API.post("/api/auth/logout");
  } catch {}
  set({ user: null, token: null, isAuthenticated: false });
};

// authController.js — backend handler:
exports.logout = async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (user) {
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
  }
  res.clearCookie("rs_refresh_token", { path: "/api/auth/refresh" });
  res.json({ success: true, message: "Logged out successfully" });
};
```

### Step 9: AdminRoute Guard

```javascript
function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (!isAdmin()) return <Navigate to="/admin/login" replace />;
  return children;
}
// isAdmin() = get().user?.role === 'admin'
```

### Step 10: Backend Middleware Chain

```javascript
// authenticate: verifies JWT, attaches req.user = { userId, role }
// requireAdmin: checks req.user.role === 'admin'
// requireActive: hits DB to confirm user.isActive === true

// Member routes:     router.use(authenticate)
// Admin routes:      router.use(authenticate, requireAdmin)
// Income routes:     router.post('/activate', authenticate, epinController.activate)
//                    // Note: activation itself makes user active — no requireActive here
// Wallet routes:     router.post('/request', authenticate, requireActive, withdrawalController.request)
```

### Step 11: Refresh Token Rotation and Reuse Detection

```javascript
// authController.js — refresh handler:
exports.refresh = async (req, res) => {
  const token = req.cookies.rs_refresh_token;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.userId);

  if (!user || user.refreshToken !== token) {
    // REUSE DETECTED: Invalidate all tokens for this user
    if (user) {
      user.refreshToken = null;
      await user.save({ validateBeforeSave: false });
    }
    return res
      .status(401)
      .json({ message: "Token reuse detected. Please log in again." });
  }

  const { accessToken, refreshToken } = generateTokens(user._id, user.role);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie("rs_refresh_token", refreshToken, {
    /* same options */
  });
  res.json({ success: true, accessToken });
};
```

---

<a name="section-8"></a>

# SECTION 8 — REACT COMPONENT ARCHITECTURE

## Layout Components

### Navbar.jsx

- File: `client/src/components/layout/Navbar.jsx`
- Renders: Fixed public navigation bar with glassmorphism scroll effect
- Props: None (reads from authStore)
- Local State: `scrolled: boolean`, `mobileOpen: boolean`
- Global State: `isAuthenticated` from useAuthStore
- API Calls: None
- Features: Route change detection closes mobile menu, body scroll lock when mobile menu open, conditional CTA buttons (Login/Register for guests, Dashboard for members)
- Fix needed: Move `<style>` tag to CSS module. Add `aria-expanded`, `aria-controls`, `role="navigation"`. Fix `logo.png` import to use `@/assets/images/logo.png`.

### Footer.jsx

- File: `client/src/components/layout/Footer.jsx`
- Renders: Dark footer with 4 columns and bottom bar
- Fix needed: Replace "#" social links with real URLs from planData.js. Fix FAQ anchor (`/#faq` requires `id="faq"` on FAQSection).

### Sidebar.jsx

- File: `client/src/components/layout/Sidebar.jsx`
- Props: `isAdmin: boolean`, `open: boolean`, `onClose: function`
- Fix needed: Fix typo `white: 'nowrap'` to `whiteSpace: 'nowrap'`. Move inline styles to CSS module.

### DashboardLayout.jsx

- Local State: None (reads from uiStore and authStore)
- Child Components: Sidebar, NotificationBell, UserDropdown (inline), Outlet
- Fix needed: Call backend logout on sign out. Implement notification dropdown. Fix user name hidden via inline `display: none`.

### AdminLayout.jsx

- Fix needed: Read actual admin name from authStore instead of hardcoded "Admin / Super Admin". Call backend logout.

## Auth Page Components

### Login.jsx

- Props: None
- Local State: `form: { identifier, password, remember }`, `showPwd: boolean`, `loading: boolean`, `shake: boolean`, `error: string`
- Global State: `setAuth` from useAuthStore
- API Calls: `authService.login(form)` on submit
- Child Components: PasswordInput

### Register.jsx

- Props: None
- Local State: `step: number (1-5)`, `data: object (all fields)`, `loading: boolean`, `validating: boolean`, `success: string|null`, `errors: object`
- API Calls: `authService.validateSponsor(sponsorId)`, `authService.register(data)`
- Child Components: BankDetailsForm, AddressForm, PasswordInput

### ForgotPassword.jsx

- Props: None
- Local State: `step: number (1-3)`, `identifier`, `otp`, `newPassword`, `confirmPassword`, `loading`, `countdown: number`
- API Calls: `authService.forgotPassword(identifier)`, `authService.resetPassword({ identifier, otp, newPassword })`
- Child Components: OtpInput, PasswordInput

## Dashboard Page Components

### Overview.jsx

- Props: None
- API Calls (all useQuery):
  - `['user', 'dashboard-stats']` → GET /api/user/dashboard-stats
  - `['wallet', 'transactions', { limit: 5 }]` → recent transactions
  - `['user', 'team', { limit: 5 }]` → recent team joins
  - `['income-chart']` → monthly income aggregation
- Child Components: StatCard, IncomeLineChart, IncomeBreakdownChart, DataTable, SkeletonCard

### Activation.jsx

- Local State: `pin: string`, `loading: boolean`, `error: string`
- Global State: `user`, `updateUser` from useAuthStore
- API Calls: `useMutation` → epinService.activate(pin) → POST /api/epin/activate
- On success: `updateUser({ isActive: true, activationDate: new Date() })`

### EPin.jsx

- Local State: `activeTab: string`, `filter: string`, `transferForm: object`, `page: number`
- API Calls:
  - `useQuery(['epin', 'mine', filter])` → GET /api/epin/mine
  - `useMutation` → epinService.transfer(form) → POST /api/epin/transfer (invalidates mine query)

### TeamNetwork.jsx

- Local State: `level: number (1-9)`, `page: number`, `view: 'table'|'tree'`
- API Calls: `useQuery(['user', 'team', { level, page }])` → GET /api/user/team?level=X&page=Y
- Child Components: DataTable, Pagination, Badge, TeamTreeView (recursive card tree for depth 1-3)

### Referral.jsx

- Local State: `copied: boolean`
- Global State: `user.rsId` from useAuthStore (for referral link construction)
- API Calls: `useQuery(['user', 'referral-info'])` → GET /api/user/referral-info
- Child Components: QRCodeCanvas from qrcode.react
- Features: Web Share API button for mobile, WhatsApp share deep link

### Wallet.jsx

- Local State: `filter: string`, `page: number`, `showModal: boolean`, `amount: string`
- API Calls:
  - `useQuery(['wallet', 'balance'])` staleTime: 0
  - `useQuery(['wallet', 'summary'])`
  - `useQuery(['wallet', 'transactions', { filter, page }])`
  - `useMutation` → withdrawalService.request(amount) → invalidates balance + summary queries
- Child Components: WithdrawalModal (inline), DataTable, Pagination, Badge

### SupportTickets.jsx

- Local State: `selectedTicketId: string|null`, `showCreate: boolean`, `newTicket: { subject, message, category }`, `replyText: string`
- API Calls:
  - `useQuery(['support', 'tickets', params])` → GET /api/support/tickets
  - `useQuery(['support', 'ticket', selectedTicketId])` → GET /api/support/tickets/:id (enabled when selectedTicketId exists)
  - `useMutation` → supportService.createTicket(newTicket) → invalidates tickets list
  - `useMutation` → supportService.addReply(ticketId, replyText) → invalidates ticket detail

## Admin Page Components

### UserManagement.jsx

- Local State: `search: string`, `statusFilter: string`, `page: number`, `selectedUser: object|null`
- API Calls:
  - `useQuery(['admin', 'users', { search, statusFilter, page }])` — debounced search
  - `useMutation` block → adminService.blockUser(userId) → invalidates users query
  - `useMutation` unblock → adminService.unblockUser(userId) → invalidates users query

### WithdrawalManagement.jsx

- Local State: `activeTab: 'pending'|'history'`, `page: number`, `approveModal: object|null`, `rejectModal: object|null`
- API Calls:
  - `useQuery(['admin', 'withdrawals', { status: activeTab, page }])` staleTime: 0, refetchInterval: 30000
  - `useMutation` approve → adminService.approveWithdrawal(id, form) → invalidates withdrawals query
  - `useMutation` reject → adminService.rejectWithdrawal(id, reason) → invalidates withdrawals query

## Shared UI Components

### Modal.jsx

- Props: `isOpen: boolean`, `onClose: function`, `title: string`, `children: ReactNode`, `maxWidth?: string`
- Features: Focus trap (tab cycles within modal), ESC key closes, backdrop click closes, AnimatePresence animation, `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to title

### DataTable.jsx

- Props: `columns: Array<{ key: string, label: string, render?: (row) => ReactNode }>`, `data: array`, `loading: boolean`, `emptyMessage?: string`
- Features: Shows SkeletonTable while loading. Shows EmptyState when data is empty array.

### StatCard.jsx

- Props: `icon: ReactNode`, `label: string`, `value: string|number`, `trend?: string`, `trendUp?: boolean`, `color?: string`, `loading?: boolean`
- Features: Shows SkeletonCard when loading=true. InView animation from Framer Motion.

### NotificationBell.jsx

- Props: None
- Local State: `isOpen: boolean`
- Global State: reads `unreadCount` from uiStore
- API Calls: `useQuery(['notifications', { limit: 10 }])` with refetchInterval: 30000
- Socket.IO: listens for 'notification' event and adds to query cache
- Features: Click notification navigates to `notification.actionUrl`. Mark all read button.

---

<a name="section-9"></a>

# SECTION 9 — STATE MANAGEMENT ARCHITECTURE

## Rule

Zustand stores only persist cross-session state (auth) and ephemeral shared UI state (sidebar, notifications). All business data lives in React Query.

## Zustand Store 1: authStore.js

```javascript
// State:
user: object | null; // Full user object from toSafeObject()
token: string | null; // JWT access token
isAuthenticated: boolean; // true if user + token exist

// Actions:
setAuth(user, token); // Called after login and token refresh
updateUser(updates); // Merges partial update — called after profile/bank/activation updates
logout(); // Async: calls backend logout, then clears state
isAdmin(); // Derived: user?.role === 'admin'

// Persistence:
name: "rs_auth";
partialize: (state) => ({
  user: state.user,
  token: state.token,
  isAuthenticated: state.isAuthenticated,
});
```

## Zustand Store 2: uiStore.js

```javascript
// State:
sidebarOpen: boolean; // Mobile sidebar open/close
unreadCount: number; // Unread notifications count (from API on mount)

// Actions:
toggleSidebar();
setSidebarOpen(open);
setUnreadCount(count);
decrementUnreadCount(); // Called when a notification is marked read
```

Note: `notifications` array is removed from uiStore. Notification data is managed entirely by React Query. uiStore only tracks `unreadCount` as a scalar for the bell badge.

## React Query Key Registry (queryKeys.js)

```javascript
export const QUERY_KEYS = {
  USER_ME: ["user", "me"],
  DASHBOARD_STATS: ["user", "dashboard-stats"],
  REFERRAL_INFO: ["user", "referral-info"],
  TEAM: (params) => ["user", "team", params],
  WALLET_BALANCE: ["wallet", "balance"],
  WALLET_SUMMARY: ["wallet", "summary"],
  WALLET_TXN: (params) => ["wallet", "transactions", params],
  MY_EPINS: (status) => ["epin", "mine", status],
  MY_WITHDRAWALS: (params) => ["withdrawals", "my", params],
  TICKETS: (params) => ["support", "tickets", params],
  TICKET_DETAIL: (id) => ["support", "ticket", id],
  NOTIFICATIONS: (params) => ["notifications", params],
  PLAN_DATA: ["plan"],
  ADMIN_STATS: ["admin", "dashboard-stats"],
  ADMIN_REPORTS: (params) => ["admin", "reports", params],
  ADMIN_USERS: (params) => ["admin", "users", params],
  ADMIN_EPINS: (params) => ["admin", "epins", params],
  ADMIN_WITHDRAWALS: (params) => ["admin", "withdrawals", params],
  ADMIN_INCOME: (params) => ["admin", "income", params],
  CMS: (key) => ["cms", key],
  CMS_ALL: ["cms", "all"],
  SETTINGS: ["admin", "settings"],
};
```

## React Query Stale Time Config Per Query

```
wallet-balance:       staleTime: 0           Always refetch — financial data
dashboard-stats:      staleTime: 60_000      1 minute
team:                 staleTime: 60_000      1 minute
notifications:        staleTime: 30_000      + refetchInterval: 30_000 (poll)
admin-withdrawals:    staleTime: 0           + refetchInterval: 30_000 (poll)
plan-data:            staleTime: 300_000     5 minutes (rarely changes)
cms:                  staleTime: 300_000     5 minutes
```

## Data Flow

```
MongoDB
  ↓  Express route + controller
Express JSON response
  ↓  Axios API instance (request interceptor adds Bearer, response interceptor refreshes token)
Service function (walletService.getBalance etc.)
  ↓  React Query useQuery
Component receives:
  - data (the response object)
  - isLoading (true while fetching)
  - isError (true if fetch failed)
  - error (the error object)

On mutation success:
  queryClient.invalidateQueries(QUERY_KEYS.WALLET_BALANCE)
    ↓ React Query auto-refetches
  Component re-renders with fresh data

On login success:
  authService.login(form) → response has { accessToken, user }
    ↓
  useAuthStore.getState().setAuth(user, accessToken)
    ↓
  Zustand persists to localStorage
    ↓
  PrivateRoute reads isAuthenticated = true → renders protected page
```

---

<a name="section-10"></a>

# SECTION 10 — PHASE-BY-PHASE BUILD PLAN

---

## Phase 1: Monorepo Setup and Tooling

**Goal:** Configure complete dev environment. Verify existing code runs. Install all missing dependencies.
**Estimated Days:** 2

**Tasks:**

1. Verify Node.js >= 20 and npm >= 10: `node -v && npm -v`
2. Run `cd client && npm install`
3. Run `cd server && npm install`
4. Install additional frontend deps: `npm install react-hook-form @hookform/resolvers zod qrcode.react socket.io-client dompurify`
5. Install frontend dev deps: `npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @playwright/test rollup-plugin-visualizer`
6. Install additional backend deps: `npm install winston uuid zod socket.io @aws-sdk/client-s3 multer multer-s3 node-cron nodemailer express-mongo-sanitize ioredis @sentry/node`
7. Install backend dev deps: `npm install -D jest supertest`
8. Configure Vitest in `vite.config.js` with jsdom environment
9. Create `client/src/constants/queryKeys.js`
10. Create `client/src/constants/routes.js`
11. Create `server/utils/validators.js` (Zod schemas)
12. Create `server/utils/constants.js`
13. Create `server/utils/generateId.js` (UUID-based)
14. Configure ESLint with React hooks rules
15. Verify backend starts: `cd server && npm run dev`
16. Verify frontend starts: `cd client && npm run dev`
17. Test health check: `curl http://localhost:5000/health`

**Files Created:**

- `client/src/constants/queryKeys.js`
- `client/src/constants/routes.js`
- `server/utils/validators.js`
- `server/utils/constants.js`
- `server/utils/generateId.js`
- `.github/workflows/frontend.yml`
- `.github/workflows/backend.yml`

---

## Phase 2: Database and Backend Foundation

**Goal:** Implement all missing Mongoose models, production logger, request validation middleware, and rate limiting.
**Estimated Days:** 3

**Tasks:**

1. Replace `server/utils/logger.js` with Winston + Logtail transport
2. Create `server/models/Counter.js`
3. Create `server/models/SupportTicket.js`
4. Create `server/models/SupportMessage.js`
5. Create `server/models/Notification.js`
6. Create `server/models/CmsContent.js`
7. Create `server/models/SystemSetting.js`
8. Create `server/models/AdminLog.js`
9. Update `server/models/User.js`: add `lastLoginAt`, `emailVerified`, `emailVerificationToken`
10. Update `server/models/Withdrawal.js`: add `tdsAmount`, `netAmount`, `adminNotes`, `branchName`
11. Update `server/models/Transaction.js`: add `ipAddress` field, add `category: 1` index
12. Create `server/middleware/rateLimiter.js` with auth-specific and general limiters
13. Create `server/middleware/validate.js` Zod factory
14. Create `server/middleware/requestId.js`
15. Create `server/middleware/adminLogger.js`
16. Apply `generalLimiter` and `requestId` middleware in `server.js`
17. Apply `mongoSanitize()` middleware in `server.js`
18. Update `server/middleware/errorHandler.js` with Winston and error ID generation
19. Create `server/scripts/seed.js` for Counter, SystemSettings, admin user, test sponsor
20. Run seed: `cd server && node scripts/seed.js`

**Files Created:** All 8 new model files, 4 new middleware files, seed.js

---

## Phase 3: Authentication System

**Goal:** Connect Login, Register, ForgotPassword to real backend. Implement httpOnly cookie refresh token. Fix all auth security issues.
**Estimated Days:** 4

**Tasks:**

1. Update `authController.js`: use Counter for RS ID generation (replace random loop)
2. Update `authController.js`: set httpOnly refresh token cookie on login and refresh
3. Update `authController.js`: clear cookie on logout
4. Update `authController.js`: hash OTP, REMOVE console.log of OTP
5. Update `authController.js`: send real email AND SMS OTP via emailService + smsService
6. Update `authController.js`: send welcome email after successful registration
7. Add Zod validation to all auth endpoints via validate middleware
8. Apply `authLimiter` to `/login`, `forgotPasswordLimiter` to `/forgot-password`, registration limiter to `/register`
9. Create `server/services/emailService.js` with sendOTP, sendWelcome, sendWithdrawalApproval, sendWithdrawalRejection, sendTicketReply
10. Create `server/services/smsService.js` with sendOTP via MSG91
11. Update `authStore.js`: remove manual `localStorage.setItem('rs_token')`, add `accessTokenExpiry` field
12. Update `api.js`: implement full token refresh interceptor with queued retry
13. Create `client/src/services/authService.js`
14. Create `client/src/utils/tokenUtils.js`
15. Update `Login.jsx`: connect to real API, remove all mock logic
16. Update `Register.jsx`: connect validateSponsor + register to real API, add `?ref=` param reading, add IFSC/PAN regex validation, add age validation
17. Update `ForgotPassword.jsx`: connect to real API, add countdown timer (600 seconds), numeric OTP input
18. Update `App.jsx` PrivateRoute: add token expiry check
19. Update `DashboardLayout.jsx` + `AdminLayout.jsx`: call backend logout on sign out
20. Connect `AdminLogin.jsx` to real login API

**Files Created:** `authService.js`, `tokenUtils.js`, `emailService.js`, `smsService.js`

---

## Phase 4: Public Website Pages

**Goal:** Complete all public pages. Add CMS backend. Fix all broken links.
**Estimated Days:** 3

**Tasks:**

1. Create `server/routes/cmsRoutes.js` with public GET `/api/cms/:key`
2. Create `server/controllers/adminCmsController.js`
3. Seed CmsContent collection with default content for all sections
4. Update `Home.jsx`: fetch CMS data with static fallback via `useQuery(['cms', 'home'])`
5. Create `Privacy.jsx`, `Terms.jsx`, `RefundPolicy.jsx` pages with appropriate content
6. Add routes for `/privacy`, `/terms`, `/refund-policy` in `App.jsx`
7. Fix `Footer.jsx`: replace "#" social links with real URLs. Fix Privacy/Terms/Refund Policy links. Fix FAQ anchor link.
8. Fix `Navbar.jsx`: use `@/assets/images/logo.png` import path. Move `<style>` tag to CSS module. Add ARIA attributes.
9. Add `id="faq"` to `FAQSection.jsx` container div
10. Create `PageMeta.jsx` component: sets `document.title` and `<meta name="description">` via portal
11. Add `<PageMeta>` to all public page components with unique title and description
12. Update `ContactFormSection.jsx`: submit to real `/api/contact` endpoint (create simple contact route that sends email)
13. Update `planData.js`: SYNC payout amounts to match backend SystemSetting income values
14. Verify mobile responsiveness at 375px, 768px, 1280px for all public pages
15. Add Open Graph meta tags to index.html

**Files Created:** `Privacy.jsx`, `Terms.jsx`, `RefundPolicy.jsx`, `PageMeta.jsx`, `cmsRoutes.js`, `adminCmsController.js`

---

## Phase 5: User Dashboard Core

**Goal:** Connect Overview, Profile, BankDetails, ChangePassword. Create all shared UI components and custom hooks.
**Estimated Days:** 5

**Tasks:**

1. Create all shared UI components: `Button.jsx`, `Input.jsx`, `Select.jsx`, `Textarea.jsx`, `Badge.jsx`, `Card.jsx`, `Modal.jsx`, `Tabs.jsx`, `Pagination.jsx`, `SearchInput.jsx`, `StatCard.jsx`, `DataTable.jsx`, `LoadingSpinner.jsx`, `SkeletonCard.jsx`, `SkeletonTable.jsx`, `EmptyState.jsx`
2. Create custom hooks: `useDebounce.js`, `useCopyToClipboard.js`, `useWindowSize.js`
3. Create `client/src/services/userService.js`
4. Move business logic from `userRoutes.js` to `server/controllers/userController.js`
5. Fix N+1 team query with `$graphLookup` aggregation
6. Fix broken dashboard-stats `allDownline` count
7. Add `/api/user/referral-info` endpoint
8. Add `/api/user/dashboard-stats` with correct counts
9. Add Zod validation to all user routes
10. Update `bank-details` route to set `kycStatus.bank = "pending"` on change
11. Connect `Overview.jsx` to real dashboard-stats, transactions, and team-joins APIs
12. Add skeleton loading to all stat cards in Overview
13. Connect `Profile.jsx` to PUT /api/user/profile
14. Connect `BankDetails.jsx` to PUT /api/user/bank-details
15. Connect `ChangePassword.jsx` to PUT /api/user/change-password
16. Add `updateUser()` store call after successful profile/bank/activation updates

**Files Created:** All 16 UI components, 3 hooks, `userService.js`, `userController.js`

---

## Phase 6: E-Pin System

**Goal:** Complete E-Pin activation and management end-to-end.
**Estimated Days:** 3

**Tasks:**

1. Fix uniqueness check in pin generation: check each new pin individually against DB (not load all)
2. Add `assignedTo === user._id` validation in activation route
3. Add recipient active check in transfer route
4. Add recipient not-self check in transfer route
5. Move E-Pin logic from `epinRoutes.js` to `server/controllers/epinController.js`
6. Add Zod validation to all E-Pin routes
7. Create `client/src/services/epinService.js`
8. Connect `Activation.jsx` to POST /api/epin/activate
9. Call `updateUser({ isActive: true })` on activation success
10. Connect `EPin.jsx` My E-Pins tab to GET /api/epin/mine
11. Connect `EPin.jsx` Transfer form to POST /api/epin/transfer
12. Invalidate mine query on successful transfer
13. Create notification for sponsor on team member activation
14. Test full activation flow: admin generates 1 pin → assigns to test user → user logs in → activates → check sponsor wallet for ₹1,500 direct income

**Files Created:** `epinService.js`, `epinController.js`

---

## Phase 7: Team Network and Referral System

**Goal:** Build team tree visualization and referral sharing features.
**Estimated Days:** 3

**Tasks:**

1. Implement GET /api/user/team with `$graphLookup` for efficient depth traversal
2. Add GET /api/user/team/stats returning member count per level
3. Connect `TeamNetwork.jsx` table view to real API
4. Build `TeamTreeView` component for visual card-based tree (depth 1-3)
5. Add level selector (1-9) with correct API call on change
6. Connect `Referral.jsx` to GET /api/user/referral-info
7. Generate referral link: `${VITE_SITE_URL}/register?ref=${user.rsId}`
8. Add `QRCodeCanvas` from qrcode.react to display QR code of referral link
9. Add native Web Share API button: `navigator.share({ url: referralLink, title: 'Join RS Trading' })`
10. Add WhatsApp share link: `https://api.whatsapp.com/send?text=${encodedMessage}`
11. Install qrcode.react: `npm install qrcode.react`
12. Create `useInfiniteTeam.js` hook for infinite scroll on team table

**Files Created:** `useInfiniteTeam.js`

---

## Phase 8: Wallet and Withdrawal System

**Goal:** Complete wallet page and withdrawal flow end-to-end with race condition fix.
**Estimated Days:** 3

**Tasks:**

1. Fix race condition in withdrawal: use atomic `findOneAndUpdate` with `{ walletBalance: { $gte: amount } }`
2. Add bank details completeness validation before allowing withdrawal
3. Add check: no pending withdrawal exists for this user before allowing new request
4. Add maximum withdrawal limit from SystemSetting
5. Add GET /api/wallet/summary endpoint
6. Add `netAmount` calculation in withdrawal model
7. Move withdrawal logic to `server/controllers/withdrawalController.js`
8. Add Zod validation to withdrawal routes
9. Create `client/src/services/walletService.js`
10. Create `client/src/services/withdrawalService.js`
11. Connect `Wallet.jsx` to all three wallet APIs (balance, summary, transactions)
12. Connect withdrawal modal to POST /api/withdrawals/request
13. Invalidate wallet-balance and wallet-summary queries after withdrawal submission
14. Create `Withdrawals.jsx` page for dedicated withdrawal history
15. Add `/dashboard/withdrawals` route in `App.jsx`
16. Connect `Statement.jsx` to GET /api/wallet/transactions with date + category filter

**Files Created:** `walletService.js`, `withdrawalService.js`, `withdrawalController.js`, `Withdrawals.jsx`

---

## Phase 9: Income Engine Fixes and Statement System

**Goal:** Fix all income engine bugs. Sync income amounts. Add PDF export.
**Estimated Days:** 2

**Tasks:**

1. Move income amounts from hardcoded constants in `incomeEngine.js` to read from SystemSetting collection via `cacheService.get('income_table')`
2. SYNC `planData.js` LEVEL_DATA payout amounts to exactly match SystemSetting income values
3. Clarify and fix the potential double-credit: confirm whether Level 1 direct income and Level 1 income are the same or different. If same, remove the separate credit.
4. Replace `generateTxId()` in incomeEngine with UUID v4
5. Move `checkAndUpdateLevel()` to a background job queue instead of running synchronously during activation
6. Create `server/services/pdfService.js` with income statement PDF generation
7. Add income notification creation for each credited ancestor after activation
8. Test full income distribution: create 3-level test chain, activate bottom user, verify all ancestors receive correct amounts
9. Add PDF export button to `Statement.jsx` calling GET /api/wallet/statement/pdf

**Files Created:** `pdfService.js`

---

## Phase 10: Support Ticket System

**Goal:** Build complete support ticket backend and connect frontend.
**Estimated Days:** 3

**Tasks:**

1. Create `server/routes/supportRoutes.js`
2. Create `server/controllers/supportController.js` with createTicket, list, detail, reply
3. Add admin support routes to adminRoutes.js
4. Create `server/controllers/admin/adminSupportController.js` with listAll, reply, updateStatus, assign
5. Send email to admin when new ticket is created
6. Send email to member when admin replies (via emailService.sendTicketReply)
7. Send Socket.IO notification to member when admin replies
8. Create `client/src/services/supportService.js`
9. Connect `SupportTickets.jsx` createTicket form to POST /api/support/tickets
10. Connect ticket list to GET /api/support/tickets
11. Connect ticket detail to GET /api/support/tickets/:id
12. Connect reply form to POST /api/support/tickets/:id/reply
13. Implement ticket thread view with member vs admin message styling

**Files Created:** `supportRoutes.js`, `supportController.js`, `adminSupportController.js`, `supportService.js`

---

## Phase 11: Admin Panel Complete

**Goal:** Connect all admin pages to real APIs. Implement admin action logging.
**Estimated Days:** 5

**Tasks:**

1. Create all 8 admin controller files (see folder structure)
2. Refactor `adminRoutes.js` to use controller functions
3. Fix regex injection in user search: `search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`
4. Add `adminLogger.js` middleware to all admin mutation routes
5. Create `client/src/services/adminService.js`
6. Connect `AdminOverview.jsx` to admin dashboard-stats and reports APIs
7. Connect `UserManagement.jsx`: search + filter to GET /api/admin/users, block/unblock mutations
8. Connect `EPinManagement.jsx`: generate + assign forms, pin list
9. Connect `IncomeManagement.jsx`: transaction list + manual credit form
10. Connect `WithdrawalManagement.jsx`: pending/history tabs with React Query, approve/reject mutations with refetchInterval: 30000
11. Connect `Reports.jsx` to reports overview and income-by-level APIs
12. Connect `CMSManagement.jsx` to CMS get/update APIs
13. Create `AdminSettings.jsx` page connected to settings APIs
14. Create `AdminLogs.jsx` page showing admin audit trail
15. Create `SupportManagement.jsx` admin page connected to admin support APIs
16. Add admin login flow to `AdminLogin.jsx`
17. Test complete admin workflow end-to-end

**Files Created:** All admin controllers, `adminService.js`, `AdminSettings.jsx`, `AdminLogs.jsx`, `SupportManagement.jsx`

---

## Phase 12: Real-Time Notifications

**Goal:** Socket.IO real-time notifications. Connect notification bell.
**Estimated Days:** 3

**Tasks:**

1. Convert `server.js` to use `http.createServer(app)` for Socket.IO compatibility
2. Set up Socket.IO server with `userSockets` Map for userId→socketId tracking
3. Create `server/services/socketService.js` with `sendNotificationToUser(userId, notification)` and `sendAdminNotification(notification)`
4. Add Socket.IO notification after: income credit (incomeEngine.js), withdrawal approved (adminWithdrawalController), withdrawal rejected, E-Pin transferred, support ticket reply
5. Create `server/routes/notificationRoutes.js`
6. Create `server/controllers/notificationController.js`
7. Create `client/src/services/socketClient.js` with connect, onNotification, disconnect
8. Initialize socket connection in `DashboardLayout.jsx` after user is authenticated
9. Disconnect socket in `DashboardLayout.jsx` cleanup (return from useEffect)
10. Update `NotificationBell.jsx` to use real notifications query + socket events
11. Create `client/src/services/notificationService.js`
12. Test real-time delivery: login as member A, open another tab as admin, approve a withdrawal for member A, verify notification appears instantly without page refresh

**Files Created:** `socketService.js`, `notificationRoutes.js`, `notificationController.js`, `socketClient.js`, `notificationService.js`, `NotificationBell.jsx`

---

## Phase 13: Third-Party Integrations

**Goal:** Connect real email, SMS, S3 file upload.
**Estimated Days:** 4

**Tasks:**

1. Verify `emailService.js` works with Gmail SMTP in dev
2. Create all email templates: welcome, OTP, withdrawal approved, withdrawal rejected, support reply
3. Register with MSG91, complete DLT registration (takes 3-7 days — start this early)
4. Verify `smsService.js` works with MSG91 credentials
5. Create AWS S3 bucket `rstrading-assets` in ap-south-1
6. Create IAM user with S3FullAccess, download credentials
7. Create `server/services/s3Service.js`
8. Create `server/middleware/upload.js` with Multer memoryStorage + MIME type validation
9. Add profile photo upload endpoint GET /api/user/upload-photo
10. Connect `Profile.jsx` FileUpload component to S3 upload endpoint
11. Create `server/services/cacheService.js` with Redis get/set/invalidate using Upstash Redis
12. Apply Redis caching to dashboard-stats (60s per user) and plan data (5 min global)
13. Add Sentry to frontend `main.jsx` and backend `server.js`

**Files Created:** `s3Service.js`, `upload.js`, `cacheService.js`

---

## Phase 14: Testing

**Goal:** Comprehensive tests for all critical paths.
**Estimated Days:** 5

**Tasks:**

1. Write backend unit tests: `incomeEngine.test.js`, `authController.test.js`, `generateId.test.js`
2. Write backend integration tests: `auth.test.js`, `epin.test.js`, `withdrawal.test.js`, `admin.test.js`
3. Configure Vitest for frontend
4. Write frontend unit tests: `formatCurrency.test.js`, `formatDate.test.js`, `validators.test.js`, `tokenUtils.test.js`
5. Write frontend component tests: `Login.test.jsx`, `Register.test.jsx`, `StatCard.test.jsx`, `Wallet.test.jsx`, `DataTable.test.jsx`
6. Install Playwright: `npx playwright install`
7. Write E2E tests: `registration.spec.js`, `login.spec.js`, `activation.spec.js`, `wallet.spec.js`, `admin.spec.js`
8. Add test commands to both CI pipelines
9. Verify minimum 70% backend coverage and 50% frontend coverage

---

## Phase 15: Performance Optimization

**Goal:** Lighthouse 90+ scores. Optimized bundle and database queries.
**Estimated Days:** 3

**Tasks:**

1. Add `React.lazy()` and `<Suspense>` to all route-level components in `App.jsx`
2. Add `rollup-plugin-visualizer` and run bundle analysis
3. Add `manualChunks` in `vite.config.js` to separate recharts, framer-motion, vendor
4. Convert `logo.png` to `logo.webp`: `cwebp logo.png -o logo.webp -q 85`
5. Add `loading="lazy"` to all non-critical images
6. Add `<link rel="preload">` for logo and primary font in `index.html`
7. Add font-display: swap to font imports
8. Add Redis caching layer for all expensive queries
9. Verify `$graphLookup` is used for team queries (not N+1)
10. Run Lighthouse on both public pages and dashboard
11. Fix any accessibility issues found by Lighthouse (color contrast, missing aria-labels, form labels)
12. Fix any SEO issues found (missing meta descriptions, duplicate titles)
13. Target: Performance 90+, Accessibility 95+, SEO 95+, Best Practices 95+

---

## Phase 16: Deployment and Go Live

**Goal:** Production deployment to Vercel + Railway. Custom domain. Monitoring.
**Estimated Days:** 3

**Tasks:**

1. Set all production environment variables in Vercel dashboard for frontend
2. Set all production environment variables in Railway for backend
3. Configure custom domain `rstradingonline.co.in` in Vercel
4. Configure `api.rstradingonline.co.in` custom domain in Railway
5. Update `server.js` CORS to include production frontend domain
6. Enable MongoDB Atlas IP whitelist for Railway deployment IP (or allow all and use AUTH)
7. Run seed script against production DB: `railway run node server/scripts/seed.js`
8. Configure UptimeRobot to monitor `https://api.rstradingonline.co.in/health` every 5 min
9. Verify Sentry is receiving events from production
10. Enable GitHub Actions automated deploy on push to main
11. Create test admin account and test member account on production
12. Run full E2E manual test: register → activate → earn income → request withdrawal → admin approve
13. Set up DNS: A record or CNAME for both rstradingonline.co.in and api.rstradingonline.co.in
14. Verify HTTPS on both domains after DNS propagation (24-48 hours)

---

<a name="section-11"></a>

# SECTION 11 — THIRD-PARTY INTEGRATIONS COMPLETE GUIDE

## 1. Email — Nodemailer + Gmail SMTP (dev) / AWS SES (production)

**Used for:** Welcome email after registration, OTP delivery for password reset, withdrawal approved/rejected notifications, support ticket reply alerts.

**Setup (Gmail for dev):**

1. Enable 2-Step Verification on your Gmail account at `myaccount.google.com/security`
2. Navigate to App Passwords → Select app "Mail" → Generate
3. Save the 16-character app password as `EMAIL_PASS`

**Setup (AWS SES for production):**

1. Create AWS account at `aws.amazon.com`
2. Navigate to SES → Verified Identities → Create identity → Domain → `rstradingonline.co.in`
3. Add the DNS TXT records shown by SES to your domain's DNS
4. Request production access (move out of sandbox) via the "Get production access" button
5. Create SMTP credentials: SES → SMTP Settings → Create SMTP credentials
6. Save the access key as `EMAIL_USER` and secret as `EMAIL_PASS`

**Environment variables:**

```
EMAIL_HOST=smtp.gmail.com                      (dev)
EMAIL_HOST=email-smtp.ap-south-1.amazonaws.com (prod)
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com                (dev) or SMTP_ACCESS_KEY (prod)
EMAIL_PASS=16_char_app_password                (dev) or SMTP_SECRET_KEY (prod)
EMAIL_FROM=RS Trading <noreply@rstradingonline.co.in>
```

**Backend implementation:**

```javascript
// server/services/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

exports.sendOTP = async (toEmail, toName, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: toEmail,
      subject: "Your RS Trading OTP",
      html: `<p>Dear ${toName},</p><p>Your one-time password is: <strong style="font-size:24px">${otp}</strong></p><p>This OTP expires in 10 minutes.</p><p>If you did not request this, please ignore this email.</p>`,
    });
  } catch (err) {
    // Always catch — email failure must NOT crash the main registration/login flow
    logger.error("Email send failed", { to: toEmail, error: err.message });
  }
};
```

**Important:** Always wrap email sends in try-catch. If email fails, the main operation must still succeed.
**Cost:** AWS SES $0.10 per 1,000 emails.

---

## 2. SMS / OTP — MSG91

**Used for:** OTP delivery to Indian mobile numbers for password reset and registration verification.

**Setup:**

1. Register at `msg91.com`
2. Complete KYC verification (2-3 business days)
3. Create DLT entity registration under TRAI regulations (3-7 business days — start this in Phase 13 immediately)
4. Create and register a DLT-approved OTP template: "Dear User, Your RS Trading OTP is {#var#}. Valid for 10 minutes. Do not share with anyone."
5. Get API Auth Key from the dashboard

**Environment variables:**

```
MSG91_AUTH_KEY=your_auth_key_here
MSG91_SENDER_ID=RSTRDG
MSG91_OTP_TEMPLATE_ID=your_dlt_template_id
```

**Backend implementation:**

```javascript
// server/services/smsService.js
const axios = require("axios");

exports.sendOTP = async (mobileNumber, otp) => {
  try {
    await axios.post(
      "https://control.msg91.com/api/v5/otp",
      {
        template_id: process.env.MSG91_OTP_TEMPLATE_ID,
        mobile: `91${mobileNumber}`,
        otp: otp,
        authkey: process.env.MSG91_AUTH_KEY,
        otp_expiry: 10,
      },
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    logger.error("SMS send failed", {
      mobile: mobileNumber,
      error: err.message,
    });
  }
};
```

**Cost:** ₹0.15–₹0.30 per SMS for transactional OTPs.
**Gotcha:** DLT registration is mandatory for all transactional SMS in India. Without it, your SMS will be blocked. Begin this process well before go-live.

---

## 3. File Storage — AWS S3

**Used for:** Profile photo uploads. KYC document uploads (future).

**Setup:**

1. Create AWS account
2. Go to S3 → Create bucket → Name: `rstrading-assets` → Region: `ap-south-1` → Block all public access: OFF
3. Add bucket CORS policy to allow uploads from your domain
4. Create IAM user: IAM → Users → Create user → Attach `AmazonS3FullAccess` policy → Create access key → Download

**Environment variables:**

```
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=ap-south-1
AWS_S3_BUCKET=rstrading-assets
```

**Backend implementation:**

```javascript
// server/services/s3Service.js
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.uploadFile = async (file, prefix = "general") => {
  const ext = file.originalname.split(".").pop();
  const key = `${prefix}/${uuidv4()}.${ext}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};
```

**Cost:** ~$0.023/GB stored + $0.09/GB transferred.

---

## 4. Real-Time — Socket.IO

**Used for:** Push notifications for income credits, withdrawal status changes, team joins, ticket replies.

**No separate service — runs on same Express server.**

**Environment variables:**

```
VITE_SOCKET_URL=http://localhost:5000    (dev)
VITE_SOCKET_URL=https://api.rstradingonline.co.in    (prod)
```

**Backend setup:**

```javascript
// server/server.js
const http = require("http");
const { Server } = require("socket.io");

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_URL, credentials: true },
});

const userSockets = new Map(); // userId (string) → socketId (string)

io.on("connection", (socket) => {
  socket.on("authenticate", (userId) => {
    userSockets.set(userId.toString(), socket.id);
  });
  socket.on("disconnect", () => {
    for (const [uid, sid] of userSockets.entries()) {
      if (sid === socket.id) {
        userSockets.delete(uid);
        break;
      }
    }
  });
});

module.exports = { app, httpServer, io, userSockets };

// IMPORTANT: Start server with httpServer, not app:
httpServer.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
```

**Frontend setup:**

```javascript
// client/src/services/socketClient.js
import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
  if (socket?.connected) return socket;
  socket = io(import.meta.env.VITE_SOCKET_URL, {
    withCredentials: true,
    transports: ["websocket", "polling"],
  });
  socket.emit("authenticate", userId);
  return socket;
};

export const onNotification = (callback) =>
  socket?.on("notification", callback);
export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
```

---

## 5. Error Monitoring — Sentry

**Used for:** Capturing unhandled exceptions on frontend and backend. Performance monitoring.

**Setup:**

1. Create account at `sentry.io`
2. Create two projects: one for React (platform: react), one for Node.js (platform: node-express)
3. Copy DSN from each project's settings

**Environment variables:**

```
VITE_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0   (frontend)
SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0         (backend)
```

**Frontend:** `npm install @sentry/react`

```javascript
// client/src/main.jsx
import * as Sentry from "@sentry/react";
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 0.1,
  enabled: import.meta.env.PROD,
});
```

**Backend:** `npm install @sentry/node`

```javascript
// server/server.js — before all middleware
const Sentry = require("@sentry/node");
Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 0.1 });
app.use(Sentry.requestHandler());
// ... all routes and middleware ...
app.use(Sentry.errorHandler()); // Before your custom errorHandler
```

**Cost:** Free tier — 5,000 errors/month. Paid from $26/month.

---

## 6. Analytics — Google Analytics 4

**Used for:** Public page visit tracking. Registration funnel. User engagement.

**Setup:**

1. Create property at `analytics.google.com`
2. Get Measurement ID (starts with G-)

**Environment variables:**

```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Frontend implementation in `index.html`:**

```html
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=%VITE_GA_MEASUREMENT_ID%"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "%VITE_GA_MEASUREMENT_ID%");
</script>
```

**Cost:** Free.

---

## 7. Logging — Winston + Logtail (Better Stack)

**Used for:** Centralized structured log aggregation in production.

**Setup:** Register at `betterstack.com`. Create a new Source under Logs. Copy the Source Token.

**Environment variables:**

```
LOGTAIL_SOURCE_TOKEN=your_source_token_here
```

**Backend:** `npm install @logtail/node @logtail/winston`

```javascript
// server/utils/logger.js
const winston = require("winston");
const { Logtail } = require("@logtail/node");
const { LogtailTransport } = require("@logtail/winston");

const logtail =
  process.env.NODE_ENV === "production"
    ? new Logtail(process.env.LOGTAIL_SOURCE_TOKEN)
    : null;

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.colorize({ all: true }),
    }),
    ...(logtail ? [new LogtailTransport(logtail)] : []),
  ],
});

module.exports = logger;
```

**Cost:** Free tier — 1GB/month.

---

<a name="section-12"></a>

# SECTION 12 — ENVIRONMENT VARIABLES

## Frontend Variables

| Variable               | Purpose                         | Where To Get         | Required | Example                           |
| ---------------------- | ------------------------------- | -------------------- | -------- | --------------------------------- |
| VITE_API_URL           | Backend API base URL            | Your Railway URL     | Yes      | http://localhost:5000             |
| VITE_APP_NAME          | App display name                | Hardcode             | Yes      | RS Trading                        |
| VITE_SITE_URL          | Frontend URL for referral links | Your Vercel domain   | Yes      | https://rstradingonline.co.in     |
| VITE_SOCKET_URL        | Socket.IO backend URL           | Same as VITE_API_URL | Yes      | http://localhost:5000             |
| VITE_SENTRY_DSN        | Sentry frontend DSN             | Sentry dashboard     | No       | https://key@o0.ingest.sentry.io/0 |
| VITE_GA_MEASUREMENT_ID | Google Analytics                | GA dashboard         | No       | G-XXXXXXXXXX                      |

### client/.env.example

```
# RS Trading Frontend — copy to .env and fill in values

VITE_API_URL=http://localhost:5000
VITE_APP_NAME=RS Trading
VITE_SITE_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:5000
VITE_SENTRY_DSN=
VITE_GA_MEASUREMENT_ID=
```

## Backend Variables

| Variable              | Purpose                      | Where To Get                                                               | Required | Example                                               |
| --------------------- | ---------------------------- | -------------------------------------------------------------------------- | -------- | ----------------------------------------------------- |
| PORT                  | Express server port          | Choose any                                                                 | Yes      | 5000                                                  |
| NODE_ENV              | Environment name             | Set manually                                                               | Yes      | development                                           |
| MONGO_URI             | MongoDB Atlas URI            | Atlas dashboard                                                            | Yes      | mongodb+srv://user:pass@cluster.mongodb.net/rstrading |
| JWT_SECRET            | Access token signing secret  | `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` | Yes      | 64-char hex                                           |
| JWT_REFRESH_SECRET    | Refresh token signing secret | Same command                                                               | Yes      | different 64-char hex                                 |
| FRONTEND_URL          | CORS allowed origin          | Your Vercel URL                                                            | Yes      | http://localhost:3000                                 |
| EMAIL_HOST            | SMTP hostname                | Email provider                                                             | Yes      | smtp.gmail.com                                        |
| EMAIL_PORT            | SMTP port                    | Email provider                                                             | Yes      | 587                                                   |
| EMAIL_USER            | SMTP username                | Email account                                                              | Yes      | your@gmail.com                                        |
| EMAIL_PASS            | SMTP app password            | Gmail App Passwords                                                        | Yes      | 16-char-app-password                                  |
| EMAIL_FROM            | From address                 | Choose                                                                     | Yes      | RS Trading <noreply@rstradingonline.co.in>            |
| MSG91_AUTH_KEY        | MSG91 API key                | MSG91 dashboard                                                            | Yes      | your_key                                              |
| MSG91_SENDER_ID       | DLT sender ID                | MSG91 DLT                                                                  | Yes      | RSTRDG                                                |
| MSG91_OTP_TEMPLATE_ID | DLT OTP template ID          | MSG91 dashboard                                                            | Yes      | template_id                                           |
| AWS_ACCESS_KEY_ID     | AWS IAM access key           | AWS IAM console                                                            | No       | AKIAIOSFODNN7EXAMPLE                                  |
| AWS_SECRET_ACCESS_KEY | AWS IAM secret               | AWS IAM console                                                            | No       | secret                                                |
| AWS_REGION            | AWS region                   | Choose                                                                     | No       | ap-south-1                                            |
| AWS_S3_BUCKET         | S3 bucket name               | AWS S3                                                                     | No       | rstrading-assets                                      |
| REDIS_URL             | Redis connection URL         | Upstash dashboard                                                          | No       | redis://...                                           |
| SENTRY_DSN            | Sentry backend DSN           | Sentry dashboard                                                           | No       | https://key@...                                       |
| LOGTAIL_SOURCE_TOKEN  | Better Stack token           | Logtail dashboard                                                          | No       | your_token                                            |
| ADMIN_SECRET_KEY      | Seed script admin key        | Generate random                                                            | Yes      | random_secret                                         |

### server/.env.example

```
# RS Trading Backend — copy to .env and fill in values

PORT=5000
NODE_ENV=development

MONGO_URI=mongodb+srv://username:password@cluster0.abc123.mongodb.net/rstrading?retryWrites=true&w=majority

# Generate: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=replace_with_64_char_hex_string_here
JWT_REFRESH_SECRET=replace_with_different_64_char_hex_string_here

FRONTEND_URL=http://localhost:3000

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password
EMAIL_FROM=RS Trading <noreply@rstradingonline.co.in>

MSG91_AUTH_KEY=
MSG91_SENDER_ID=RSTRDG
MSG91_OTP_TEMPLATE_ID=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-south-1
AWS_S3_BUCKET=rstrading-assets

REDIS_URL=

SENTRY_DSN=
LOGTAIL_SOURCE_TOKEN=

ADMIN_SECRET_KEY=your_admin_secret_here
```

---

<a name="section-13"></a>

# SECTION 13 — SECURITY IMPLEMENTATION

## 1. Input Validation — Zod on Every Endpoint

```javascript
// server/middleware/validate.js
const { z } = require("zod");

exports.validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join(", ");
    return res.status(400).json({ success: false, message: errors });
  }
  req.body = result.data; // Replace with validated + sanitized data
  next();
};

// server/utils/validators.js — example schemas
exports.registerSchema = z.object({
  sponsorRsId: z.string().min(4).max(10).toUpperCase().trim(),
  fullName: z.string().min(2).max(100).trim(),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(8).max(128),
  ifscCode: z
    .string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/)
    .optional(),
  panCard: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/)
    .optional(),
  accountNumber: z
    .string()
    .regex(/^\d{8,18}$/)
    .optional(),
});
```

## 2. NoSQL Injection Prevention

Install: `npm install express-mongo-sanitize`

```javascript
// server/server.js
const mongoSanitize = require("express-mongo-sanitize");
app.use(mongoSanitize()); // Removes $ and . from request objects
```

## 3. XSS Prevention

Frontend: React JSX escapes all output by default. Never use `dangerouslySetInnerHTML` with user content. For CMS HTML: `npm install dompurify` and wrap: `DOMPurify.sanitize(cmsContent)`.

Backend: `npm install xss` — sanitize free-text fields in the validate middleware.

## 4. Rate Limiting

```javascript
// server/middleware/rateLimiter.js
const rateLimit = require("express-rate-limit");

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 login attempts per 15 min per IP
  message: {
    success: false,
    message: "Too many login attempts. Try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

exports.forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 OTP requests per hour per IP
  message: {
    success: false,
    message: "Too many OTP requests. Try again in 1 hour.",
  },
});

exports.generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: "Too many requests." },
});

// server/routes/authRoutes.js — apply:
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);
router.post(
  "/register",
  registrationLimiter,
  validate(registerSchema),
  authController.register,
);

// server/server.js — apply globally:
app.use("/api", generalLimiter);
```

## 5. HTTP Security Headers

```javascript
// server/server.js
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://www.googletagmanager.com"],
        imgSrc: ["'self'", "data:", "https://*.amazonaws.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "https://api.fontshare.com",
        ],
        connectSrc: ["'self'", "https://api.rstradingonline.co.in"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);
```

## 6. CORS Configuration

```javascript
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://rstradingonline.co.in",
  "https://www.rstradingonline.co.in",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
```

## 7. Withdrawal Race Condition Fix (CRITICAL)

```javascript
// server/controllers/withdrawalController.js
const user = await User.findOneAndUpdate(
  {
    _id: req.user.userId,
    isActive: true,
    isBlocked: false,
    walletBalance: { $gte: amount }, // Atomic check AND debit
  },
  { $inc: { walletBalance: -amount } },
  { new: true, session },
);

if (!user) {
  throw new Error("Insufficient balance or account not eligible");
}
```

## 8. Regex Injection Fix in Admin User Search

```javascript
// server/controllers/admin/adminUserController.js
const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const searchQuery = {
  $or: [
    { fullName: { $regex: escapedSearch, $options: "i" } },
    { rsId: { $regex: escapedSearch, $options: "i" } },
    { mobile: { $regex: escapedSearch, $options: "i" } },
    { email: { $regex: escapedSearch, $options: "i" } },
  ],
};
```

## 9. E-Pin Security Rules

1. Pin can only be assigned to one user at a time.
2. Activation validates `pin.assignedTo.equals(req.user.userId)` — reject if mismatch.
3. Activated account cannot be reactivated.
4. Transfer blocked if recipient is already active.
5. Self-transfer blocked.
6. Log every pin state change in AdminLog with IP address.

## 10. Withdrawal Fraud Prevention Rules

1. Minimum ₹500 per request.
2. Maximum ₹1,00,000 per request (from SystemSetting).
3. Only one pending withdrawal allowed at a time per user.
4. Bank details must be complete (all required fields non-null).
5. Bank details locked at request time — immutable until approved/rejected.
6. Admin approval required for every withdrawal.
7. All withdrawals logged with IP and user agent.

## 11. File Upload Security

```javascript
// server/middleware/upload.js
const multer = require("multer");
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
  },
});

module.exports = upload;
```

## 12. Environment Variable Validation on Startup

```javascript
// server/server.js — first lines before any app setup:
const requiredEnvVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
  "FRONTEND_URL",
  "PORT",
];
const missing = requiredEnvVars.filter((k) => !process.env[k]);
if (missing.length > 0) {
  console.error(
    "FATAL: Missing required environment variables:",
    missing.join(", "),
  );
  process.exit(1);
}
```

## 13. Dependency Vulnerability Scanning

Add to both CI pipelines:

```yaml
- name: Security audit
  run: npm audit --audit-level=high
```

Enable Dependabot in `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/client"
    schedule: { interval: "weekly" }
  - package-ecosystem: "npm"
    directory: "/server"
    schedule: { interval: "weekly" }
```

---

<a name="section-14"></a>

# SECTION 14 — PERFORMANCE OPTIMIZATION

## 1. Code Splitting — All Route Components Lazy Loaded

```javascript
// client/src/App.jsx — replace ALL static imports:
const Home = React.lazy(() => import("@/pages/public/Home"));
const Login = React.lazy(() => import("@/pages/auth/Login"));
const Register = React.lazy(() => import("@/pages/auth/Register"));
const DashboardLayout = React.lazy(
  () => import("@/components/layout/DashboardLayout"),
);
const Overview = React.lazy(() => import("@/pages/dashboard/Overview"));
// ... every single route component

const SuspenseFallback = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <LoadingSpinner />
  </div>
);

// Wrap Routes:
<Suspense fallback={<SuspenseFallback />}>
  <Routes>{/* all routes */}</Routes>
</Suspense>;
```

## 2. Manual Chunk Splitting in Vite

```javascript
// vite.config.js
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [react(), tailwindcss(), visualizer({ open: false })],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-framer": ["framer-motion"],
          "vendor-recharts": ["recharts"],
          "vendor-lucide": ["lucide-react"],
          "vendor-zustand": ["zustand"],
          "vendor-socket": ["socket.io-client"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

## 3. Image Optimization

```bash
# Install cwebp: brew install webp  (Mac) or apt-get install webp  (Linux)
cwebp logo.png -o logo.webp -q 85
```

```html
<!-- index.html -->
<link rel="preload" as="image" href="/logo.webp" type="image/webp" />
```

```jsx
// Use picture element for WebP with PNG fallback:
<picture>
  <source srcSet={logoWebp} type="image/webp" />
  <img src={logoPng} alt="RS Trading Logo" loading="eager" width="120" height="40" />
</picture>

// All non-critical images:
<img src={image} alt="description" loading="lazy" />
```

## 4. Redis Caching for Backend

```javascript
// server/services/cacheService.js
const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);

exports.get = async (key) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

exports.set = async (key, value, ttlSeconds = 60) => {
  await redis.setex(key, ttlSeconds, JSON.stringify(value));
};

exports.del = async (key) => redis.del(key);

// Usage in controllers:
// const cached = await cacheService.get(`dash:${userId}`);
// if (cached) return res.json(cached);
// ... compute data ...
// await cacheService.set(`dash:${userId}`, data, 60);
```

Cache keys and TTLs:

```
dashboard-stats per user:   dash:{userId}       60 seconds
admin-dashboard-stats:      admin:dash          30 seconds
plan-data:                  plan:data           300 seconds (5 minutes)
withdrawal pending count:   wd:pending:count    30 seconds
```

## 5. Optimized Team Query with $graphLookup

```javascript
// server/controllers/userController.js
const result = await User.aggregate([
  { $match: { _id: new mongoose.Types.ObjectId(userId) } },
  {
    $graphLookup: {
      from: "users",
      startWith: "$_id",
      connectFromField: "_id",
      connectToField: "sponsorId",
      as: "downline",
      maxDepth: parseInt(level) - 1,
      depthField: "depth",
      restrictSearchWithMatch: { isActive: true }, // Only active members
    },
  },
  {
    $project: {
      downline: {
        $slice: [
          {
            $filter: {
              input: "$downline",
              cond: { $eq: ["$$this.depth", parseInt(level) - 1] },
            },
          },
          (page - 1) * limit,
          limit,
        ],
      },
      totalAtLevel: {
        $size: {
          $filter: {
            input: "$downline",
            cond: { $eq: ["$$this.depth", parseInt(level) - 1] },
          },
        },
      },
    },
  },
]);
```

## 6. Font Loading Optimization

```html
<!-- index.html — in <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preconnect" href="https://api.fontshare.com" />
<link
  href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap"
  rel="stylesheet"
/>
<link
  href="https://api.fontshare.com/v2/css?f[]=satoshi@700,800,900&display=swap"
  rel="stylesheet"
/>
```

Add `font-display: swap` in CSS to eliminate FOIT (Flash of Invisible Text).

## 7. Lighthouse Score Targets

Target: Performance 90+, Accessibility 95+, SEO 95+, Best Practices 95+

To hit Performance 90+:

- Code split all routes (saves ~600KB initial bundle)
- Convert images to WebP (saves ~50% image size)
- Preload logo and primary font
- font-display: swap
- Remove unused CSS

To hit Accessibility 95+:

- All `<img>` tags have meaningful `alt` text
- All `<button>` tags have descriptive text or `aria-label`
- All form `<input>` tags have `<label>` with matching `for`/`id`
- Color contrast ratio minimum 4.5:1 for normal text
- All interactive elements have `:focus-visible` outline styles
- Navigation has `role="navigation"` and `aria-label`
- Modal has `role="dialog"`, `aria-modal="true"`, `aria-labelledby`

To hit SEO 95+:

- Every page has unique `<title>` via PageMeta.jsx
- Every page has unique `<meta name="description">` via PageMeta.jsx
- Semantic HTML5: `<main>`, `<article>`, `<section>`, `<nav>`, `<footer>`
- Open Graph tags in index.html: `og:title`, `og:description`, `og:image`

---

<a name="section-15"></a>

# SECTION 15 — TESTING STRATEGY

## Backend Unit Tests — `server/__tests__/services/`

Framework: Jest
Run command: `cd server && npx jest --testPathPattern=services`

Tests to write:

### incomeEngine.test.js

- `processActivationIncome()`: mock MongoDB session, verify direct income ₹1,500 credited to sponsor
- `processActivationIncome()`: verify level 1 income credited if sponsor.level >= 1
- `processActivationIncome()`: verify chain traversal stops at depth 9
- `processActivationIncome()`: verify inactive ancestor is skipped (no income credited)
- `checkAndUpdateLevel()`: verify level increments when active children count reaches threshold
- `checkAndUpdateLevel()`: verify level never exceeds 9

### authController.test.js

- `register()`: validates all required fields present
- `register()`: rejects duplicate mobile
- `register()`: rejects duplicate email
- `register()`: rejects invalid sponsor RS ID
- `register()`: creates user with correct sponsorId reference
- `login()`: returns 401 for wrong password
- `login()`: returns 403 for blocked user
- `login()`: accepts login by RS ID, email, and mobile

## Backend Integration Tests — `server/__tests__/routes/`

Framework: Jest + Supertest
Run command: `cd server && npx jest --testPathPattern=routes`

### auth.test.js

```javascript
describe("POST /api/auth/register", () => {
  it("creates a new member and returns RS ID", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(validRegistrationPayload);
    expect(res.status).toBe(201);
    expect(res.body.rsId).toMatch(/^RS\d{4}$/);
  });
  it("rejects duplicate mobile", async () => {
    // Register same mobile twice
    expect(secondRes.status).toBe(400);
    expect(secondRes.body.message).toContain(
      "Mobile number already registered",
    );
  });
});
```

### withdrawal.test.js — Race Condition Test

```javascript
describe("Concurrent withdrawal requests", () => {
  it("prevents negative wallet balance", async () => {
    // Set up user with ₹1,000 balance
    // Fire two concurrent requests for ₹800 each
    const [res1, res2] = await Promise.all([
      request(app)
        .post("/api/withdrawals/request")
        .set("Authorization", `Bearer ${token}`)
        .send({ amount: 800 }),
      request(app)
        .post("/api/withdrawals/request")
        .set("Authorization", `Bearer ${token}`)
        .send({ amount: 800 }),
    ]);
    // Exactly one must succeed and one must fail
    const statuses = [res1.status, res2.status].sort();
    expect(statuses).toEqual([201, 400]);
    // Verify wallet balance is not negative
    const user = await User.findById(userId);
    expect(user.walletBalance).toBeGreaterThanOrEqual(0);
  });
});
```

## Frontend Unit Tests — `client/src/__tests__/utils/`

Framework: Vitest
Run command: `cd client && npx vitest run`

### formatCurrency.test.js

```javascript
import { formatCurrency } from "@/utils/formatCurrency";
describe("formatCurrency", () => {
  it("formats ₹0 correctly", () => expect(formatCurrency(0)).toBe("₹0"));
  it("formats ₹1,500 correctly", () =>
    expect(formatCurrency(1500)).toBe("₹1,500"));
  it("formats ₹1,00,000 in Indian notation", () =>
    expect(formatCurrency(100000)).toBe("₹1,00,000"));
  it("handles null gracefully", () => expect(formatCurrency(null)).toBe("₹0"));
});
```

## Frontend Component Tests — `client/src/__tests__/components/`

### Login.test.jsx

```javascript
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "@/pages/auth/Login";

describe("Login form", () => {
  it("shows error when submitted empty", async () => {
    render(<Login />);
    fireEvent.click(screen.getByText("Sign In"));
    await waitFor(() =>
      expect(screen.getByText(/required/i)).toBeInTheDocument(),
    );
  });
  it("calls authService.login on valid submit", async () => {
    // Mock authService.login, fill form, submit, verify mock called
  });
});
```

## E2E Tests — `client/e2e/`

Framework: Playwright
Install: `npx playwright install`
Run command: `cd client && npx playwright test`

### registration.spec.js

```javascript
test("complete 5-step registration", async ({ page }) => {
  await page.goto("/register");
  // Step 1: Sponsor validation
  await page.fill('[name="sponsorId"]', "RS1000");
  await page.click("text=Validate Sponsor");
  await expect(page.locator("text=Ramesh Kumar")).toBeVisible();
  await page.click("text=Next");
  // ... complete remaining 4 steps
  await expect(page.locator("text=Registration Successful")).toBeVisible();
  await expect(page.locator("text=/RS\\d{4}/")).toBeVisible(); // RS ID shown
});
```

## Minimum Coverage Targets

- Backend services and controllers: 70% line coverage
- Backend utilities: 80% line coverage
- Frontend utils: 80% line coverage
- Frontend components: 50% line coverage

## GitHub Actions Test Execution

```yaml
# frontend.yml:
- name: Run frontend tests
  run: cd client && npx vitest run --coverage
  env:
    VITE_API_URL: http://localhost:5000

# backend.yml:
- name: Run backend tests
  run: cd server && npx jest --coverage --forceExit --coverageThreshold='{"global":{"lines":70}}'
  env:
    NODE_ENV: test
    MONGO_URI: ${{ secrets.MONGO_URI_TEST }}
    JWT_SECRET: test_jwt_secret_ci_only_not_real
    JWT_REFRESH_SECRET: test_refresh_secret_ci_only_not_real
```

---

<a name="section-16"></a>

# SECTION 16 — DEPLOYMENT AND DEVOPS

## Frontend Deployment — Vercel

```bash
# Manual first deploy:
cd client
npm run build      # Outputs to dist/
npx vercel --prod
```

`client/vercel.json`:

```json
{
  "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [{ "key": "X-Content-Type-Options", "value": "nosniff" }]
    }
  ]
}
```

## Backend Deployment — Railway

`server/railway.toml`:

```toml
[build]
  builder = "nixpacks"

[deploy]
  startCommand = "node server.js"
  healthcheckPath = "/health"
  healthcheckTimeout = 30
  restartPolicyType = "on_failure"
  restartPolicyMaxRetries = 3
```

## GitHub Actions — Frontend CI/CD

```yaml
# .github/workflows/frontend.yml
name: Frontend CI/CD

on:
  push:
    branches: [main]
    paths: ["client/**"]
  pull_request:
    branches: [main]
    paths: ["client/**"]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: client

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
          cache-dependency-path: client/package-lock.json

      - run: npm ci

      - name: Lint
        run: npm run lint

      - name: Security audit
        run: npm audit --audit-level=high

      - name: Test
        run: npx vitest run --coverage

      - name: Build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_SITE_URL: ${{ secrets.VITE_SITE_URL }}
          VITE_SOCKET_URL: ${{ secrets.VITE_SOCKET_URL }}
          VITE_SENTRY_DSN: ${{ secrets.VITE_SENTRY_DSN }}
          VITE_GA_MEASUREMENT_ID: ${{ secrets.VITE_GA_MEASUREMENT_ID }}
        run: npm run build

      - name: Deploy to Vercel
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: client
          vercel-args: "--prod"
```

## GitHub Actions — Backend CI/CD

```yaml
# .github/workflows/backend.yml
name: Backend CI/CD

on:
  push:
    branches: [main]
    paths: ["server/**"]
  pull_request:
    branches: [main]
    paths: ["server/**"]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: server

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
          cache-dependency-path: server/package-lock.json

      - run: npm ci

      - name: Security audit
        run: npm audit --audit-level=high

      - name: Test
        env:
          NODE_ENV: test
          MONGO_URI: ${{ secrets.MONGO_URI_TEST }}
          JWT_SECRET: test_jwt_secret_ci_only
          JWT_REFRESH_SECRET: test_refresh_secret_ci_only
          FRONTEND_URL: http://localhost:3000
          PORT: 5000
        run: npx jest --coverage --forceExit

      - name: Deploy to Railway
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'
        run: |
          npm install -g @railway/cli
          railway up --service rs-trading-backend
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## Database Migrations in Production

MongoDB + Mongoose has no traditional migration system. Use this approach:

1. All schema changes must be backward compatible — add new fields with defaults, never immediately remove fields
2. For destructive changes: (a) add new field alongside old in same deploy, (b) run migration script to backfill new field, (c) remove old field in next deploy
3. Run seed or migration scripts from Railway CLI:

```bash
railway run --service rs-trading-backend node server/scripts/seed.js
```

## Rollback Procedure

Frontend (Vercel):

1. Go to Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"
4. Takes effect in under 10 seconds

Backend (Railway):

1. Go to Railway Dashboard → Service → Deployments
2. Find last working deployment → Click "Rollback"
3. OR: `git revert HEAD && git push origin main` — Railway auto-deploys

## Monitoring Setup

Uptime monitoring: UptimeRobot (free) monitors `https://api.rstradingonline.co.in/health` every 5 minutes. Alerts via email and SMS on downtime.

Error alerting: Sentry sends email when error rate spikes or new error type appears.

Log monitoring: Logtail aggregates all Winston logs and alerts on `level: 'error'` entries.

## SSL and Domain

Both Vercel and Railway automatically provision and renew Let's Encrypt SSL for custom domains.

DNS setup:

1. Purchase `rstradingonline.co.in` from GoDaddy or Namecheap
2. Vercel: Add `rstradingonline.co.in` and `www.rstradingonline.co.in` → Get A record / CNAME values → Add to DNS
3. Railway: Add `api.rstradingonline.co.in` → Get CNAME value → Add to DNS
4. DNS propagation: 24–48 hours

---

<a name="section-17"></a>

# SECTION 17 — DAY ONE LOCAL SETUP GUIDE

## Prerequisites

```bash
node -v    # Must be >= 20.x.x
npm -v     # Must be >= 10.x.x
git --version

# If Node.js not installed:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc   # or ~/.zshrc
nvm install 20 && nvm use 20
```

## Step 1: Clone Repository

```bash
git clone https://github.com/your-org/rstrading.git
cd rstrading
```

## Step 2: Install Backend Dependencies

```bash
cd server
npm install
```

## Step 3: Configure Backend Environment

```bash
cp .env.example .env
```

Open `server/.env` and fill in:

```bash
PORT=5000
NODE_ENV=development

# MongoDB Atlas — get from cloud.mongodb.com → Connect → Driver → Copy URI
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.abc123.mongodb.net/rstrading?retryWrites=true&w=majority

# Generate JWT secrets (run this command twice, use different outputs for each):
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=paste_first_64_char_hex_here
JWT_REFRESH_SECRET=paste_second_different_64_char_hex_here

FRONTEND_URL=http://localhost:3000

# Gmail App Password — myaccount.google.com/apppasswords
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_app_password
EMAIL_FROM=RS Trading <noreply@rstradingonline.co.in>

# Leave empty for dev — OTPs will log to console instead of SMS
MSG91_AUTH_KEY=
MSG91_SENDER_ID=RSTRDG
MSG91_OTP_TEMPLATE_ID=

# Leave empty for dev — file uploads won't work without S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-south-1
AWS_S3_BUCKET=rstrading-assets

# Leave empty for dev — Redis cache disabled
REDIS_URL=

SENTRY_DSN=
LOGTAIL_SOURCE_TOKEN=

ADMIN_SECRET_KEY=mysecretadminkey123
```

## Step 4: MongoDB Atlas Setup (If New)

1. Go to `cloud.mongodb.com` → Create free M0 cluster
2. Security → Database Access → Add user with password
3. Security → Network Access → Add IP address: `0.0.0.0/0` (for development)
4. Click Connect → Compass or Driver → Copy connection string
5. Replace `<username>` and `<password>` in MONGO_URI with your credentials

## Step 5: Seed the Database

```bash
# While in server/ directory:
node scripts/seed.js
```

This creates:

- RS ID counter starting at 1000
- System settings with all income amounts
- Admin user: `email=admin@rstrading.co.in`, `password=Admin@123`, `role=admin`
- Test sponsor: `rsId=RS1000`, `fullName=Ramesh Kumar`

Expected output:

```
[INFO] Counter seeded: { _id: 'rsId', seq: 1000 }
[INFO] System settings seeded: 16 settings created
[INFO] Admin user created: admin@rstrading.co.in
[INFO] Test sponsor created: RS1000
[INFO] Database seeding complete!
```

## Step 6: Start the Backend

```bash
# In server/ directory:
npm run dev
```

Expected output:

```
[INFO] ✅ MongoDB connected successfully
[INFO] 🚀 RS Trading API running on port 5000
[INFO] 📍 Environment: development
```

**Keep this terminal running. Open a new terminal for the next steps.**

## Step 7: Install Frontend Dependencies

```bash
cd ../client   # Navigate from server/ to client/
npm install
```

## Step 8: Configure Frontend Environment

```bash
cp .env.example .env
```

Set these values in `client/.env`:

```bash
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=RS Trading
VITE_SITE_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:5000
VITE_SENTRY_DSN=
VITE_GA_MEASUREMENT_ID=
```

## Step 9: Start the Frontend

```bash
# In client/ directory:
npm run dev
```

Expected output:

```
  VITE v8.x.x  ready in xxx ms
  ➜  Local:   http://localhost:3000/
```

## Step 10: Verify Everything Is Working

Open each URL and confirm the expected result:

```
http://localhost:5000/health
  → { "status": "ok", "timestamp": "2026-05-31T..." }

http://localhost:3000/
  → RS Trading dark landing page with hero section

http://localhost:3000/login
  → Dark glassmorphism login form

http://localhost:3000/register
  → 5-step registration wizard

http://localhost:3000/admin/login
  → Admin login page with blue/navy theme
```

**Test Admin Login:**

1. Go to `http://localhost:3000/admin/login`
2. Enter `admin@rstrading.co.in` and `Admin@123`
3. Expected: Redirect to `/admin` dashboard

**Test Registration:**

1. Go to `http://localhost:3000/register`
2. Enter Sponsor ID: `RS1000`
3. Click Validate — should show "Ramesh Kumar (Verified)"
4. Complete all 5 steps with test data
5. Submit — should show success screen with your RS ID (e.g. RS1001)

**Test Member Login:**

1. Go to `http://localhost:3000/login`
2. Enter your new RS ID and password
3. Expected: Redirect to `/dashboard` with inactive account state

## Step 11: Run Both Servers Simultaneously (One Command)

Install `concurrently` at the project root:

```bash
cd ..   # Navigate to rstrading/ root
npm init -y
npm install -D concurrently
```

Add to root `package.json`:

```json
{
  "scripts": {
    "dev": "concurrently \"cd server && npm run dev\" \"cd client && npm run dev\"",
    "test": "concurrently \"cd server && npx jest\" \"cd client && npx vitest run\""
  }
}
```

Run both at once:

```bash
npm run dev
```

## Step 12: Running Tests

```bash
# Backend unit + integration tests:
cd server && npx jest

# Frontend unit + component tests:
cd client && npx vitest

# E2E tests (requires both servers running):
cd client && npx playwright test

# All tests at once from root:
npm run test
```

## Troubleshooting

**MongoDB connection fails:**

- Check MONGO_URI format — no spaces
- Verify Atlas IP whitelist includes `0.0.0.0/0`
- Verify username and password in URI are URL-encoded if they contain special characters

**Port already in use:**

```bash
# Mac/Linux:
lsof -ti:5000 | xargs kill -9   # Kill process on port 5000
lsof -ti:3000 | xargs kill -9   # Kill process on port 3000
```

**npm install fails:**

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Vite build fails — tailwindcss error:**

- Verify `@tailwindcss/vite` is in `devDependencies` not `dependencies`
- Run `npm install -D @tailwindcss/vite`

---

<a name="section-18"></a>

# SECTION 18 — INCOME BUSINESS LOGIC DEEP DIVE

## Complete Income Distribution Flow on E-Pin Activation

When a member activates their account with a valid E-Pin, the backend runs this exact sequence inside a MongoDB session (atomic transaction):

### Step 1: Validate the Activation

```javascript
// Validate pin exists and is activatable
const pin = await EPin.findOne({
  pin: pinCode,
  status: { $in: ["available", "assigned"] },
}).session(session);
if (!pin) throw new Error("Invalid or already used E-Pin");
if (pin.assignedTo && !pin.assignedTo.equals(user._id))
  throw new Error("This E-Pin is not assigned to your account");
if (user.isActive) throw new Error("Account is already active");
```

### Step 2: Activate the User

```javascript
user.isActive = true;
user.activationDate = new Date();
user.activationEPin = pinCode;
await user.save({ session });
pin.status = "used";
pin.usedBy = user._id;
pin.usedAt = new Date();
await pin.save({ session });
```

### Step 3: Direct Income to Sponsor

```javascript
// Fetch income amounts from SystemSetting (cached in Redis)
const directAmount = await getSystemSetting("income_direct"); // ₹1,500

const sponsor = await User.findById(user.sponsorId).session(session);
if (sponsor && sponsor.isActive && !sponsor.isBlocked) {
  sponsor.walletBalance += directAmount;
  sponsor.totalIncome += directAmount;
  sponsor.directIncome += directAmount;
  sponsor.referralCount += 1;
  await sponsor.save({ session });

  await Transaction.create(
    [
      {
        transactionId: uuidv4(),
        userId: sponsor._id,
        type: "credit",
        category: "direct_income",
        amount: directAmount,
        description: `Direct Income from ${user.fullName} (${user.rsId})`,
        balanceAfter: sponsor.walletBalance,
        fromUserId: user._id,
      },
    ],
    { session },
  );
}
```

### Step 4: Level Income Up the Chain

```javascript
const INCOME_TABLE = await getIncomeLevels(); // Reads from SystemSetting
// INCOME_TABLE = { 1: 1500, 2: 5000, 3: 7000, 4: 10000, 5: 15000, 6: 20000, 7: 30000, 8: 50000, 9: 75000 }
const LEVEL_THRESHOLD = await getSystemSetting("level_threshold"); // 4

let currentAncestorId = user.sponsorId;
let depth = 1;

while (currentAncestorId && depth <= 9) {
  const ancestor = await User.findById(currentAncestorId).session(session);
  if (!ancestor) break;

  // Only credit if ancestor is active AND their level >= current depth
  if (ancestor.isActive && !ancestor.isBlocked && ancestor.level >= depth) {
    const levelAmount = INCOME_TABLE[depth];

    ancestor.walletBalance += levelAmount;
    ancestor.totalIncome += levelAmount;
    await ancestor.save({ session });

    await Transaction.create(
      [
        {
          transactionId: uuidv4(),
          userId: ancestor._id,
          type: "credit",
          category: "level_income",
          amount: levelAmount,
          description: `Level ${depth} Income from ${user.fullName} (${user.rsId})`,
          balanceAfter: ancestor.walletBalance,
          level: depth,
          fromUserId: user._id,
        },
      ],
      { session },
    );

    // Send real-time notification
    await createNotification(
      ancestor._id,
      "income_credit",
      `₹${levelAmount} Level ${depth} Income`,
      `/dashboard/wallet`,
    );
    socketService.sendNotificationToUser(ancestor._id, notification);
  }

  currentAncestorId = ancestor.sponsorId;
  depth++;
}
```

### Step 5: Recalculate Sponsor Level (Background Job)

```javascript
// DO NOT run synchronously — add to job queue instead
await jobQueue.add("recalculateLevel", { userId: sponsor._id });
```

The background job runs `checkAndUpdateLevel()`:

```javascript
async function checkAndUpdateLevel(userId) {
  const THRESHOLD = await getSystemSetting("level_threshold"); // 4
  const user = await User.findById(userId);

  let calculatedLevel = 0;

  // Check each level 1 through 9
  for (let lvl = 1; lvl <= 9; lvl++) {
    // Count active direct children
    const directActiveChildren = await User.countDocuments({
      sponsorId: userId,
      isActive: true,
    });

    if (directActiveChildren >= THRESHOLD * lvl) {
      calculatedLevel = lvl;
    } else {
      break; // Levels are sequential — if level N fails, stop
    }
  }

  // Only update if newly calculated level is higher
  if (calculatedLevel > user.level) {
    user.level = calculatedLevel;
    await user.save({ validateBeforeSave: false });

    await createNotification(
      userId,
      "system_message",
      `Congratulations! You've reached Level ${calculatedLevel}!`,
      "/dashboard",
    );
  }
}
```

## IMPORTANT: Direct Income vs Level 1 Income

The potential double-credit scenario needs business plan clarification:

- If the sponsor receives ₹1,500 as Direct Income AND is also eligible for ₹1,500 as Level 1 Income, they receive ₹3,000 from one activation.
- This must be verified against the actual RS Trading business plan document.
- If this IS the intended behavior: document it clearly and the current implementation is correct.
- If this is NOT intended (Direct Income IS Level 1 Income): remove the separate Level 1 credit when depth=1 and the ancestor is the direct sponsor.

## Income Table (Must Match Both Backend and Frontend)

```
Direct Income (to immediate sponsor):  ₹1,500
Level 1:   ₹1,500   (requires level >= 1 — needs 4 active direct referrals)
Level 2:   ₹5,000   (requires level >= 2)
Level 3:   ₹7,000   (requires level >= 3)
Level 4:   ₹10,000  (requires level >= 4)
Level 5:   ₹15,000  (requires level >= 5)
Level 6:   ₹20,000  (requires level >= 6)
Level 7:   ₹30,000  (requires level >= 7)
Level 8:   ₹50,000  (requires level >= 8)
Level 9:   ₹75,000  (requires level >= 9)
```

These values MUST be identical in:

- `server/scripts/seed.js` (seeds SystemSetting collection)
- `client/src/constants/planData.js` (LEVEL_DATA array) — should be fetched from API in production

---

<a name="section-19"></a>

# SECTION 19 — ERROR HANDLING ARCHITECTURE

## Backend Error Handling

Every async Express route must catch errors. With Express 5, async errors propagate automatically. For Express 4, use express-async-errors: `npm install express-async-errors` and `require('express-async-errors')` at the top of `server.js`.

## Global Error Handler

```javascript
// server/middleware/errorHandler.js
const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger");

module.exports = (err, req, res, next) => {
  const errorId = uuidv4().slice(0, 8).toUpperCase();

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const fieldName =
      field === "mobile"
        ? "Mobile number"
        : field === "email"
          ? "Email"
          : field === "rsId"
            ? "RS ID"
            : field;
    return res
      .status(400)
      .json({ success: false, message: `${fieldName} is already registered.` });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return res.status(400).json({ success: false, message: messages });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError")
    return res.status(401).json({ success: false, message: "Invalid token" });
  if (err.name === "TokenExpiredError")
    return res.status(401).json({ success: false, message: "Token expired" });

  // Multer file size error
  if (err.code === "LIMIT_FILE_SIZE")
    return res
      .status(400)
      .json({ success: false, message: "File size exceeds 2MB limit" });

  // Generic server error
  logger.error("Unhandled error", {
    errorId,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
    userId: req.user?.userId,
  });

  res.status(500).json({
    success: false,
    message: "Something went wrong on our end. Please try again.",
    errorId, // Return to user so they can report it
  });
};
```

## Frontend Error Handling

All API calls from service functions use try-catch or rely on React Query's `onError` callback:

```javascript
// In components using React Query:
const { data, isLoading, isError, error } = useQuery({
  queryKey: QUERY_KEYS.DASHBOARD_STATS,
  queryFn: userService.getDashboardStats,
  onError: (err) => {
    const message =
      err.response?.data?.message || "Failed to load dashboard data";
    toast.error(message);
  },
});

// Render error state:
if (isError)
  return (
    <EmptyState
      icon={<AlertCircle />}
      message="Failed to load. Please refresh."
    />
  );
```

## React Error Boundary

```javascript
// client/src/components/shared/ErrorBoundary.jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    Sentry.captureException(error, { extra: info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <p>Please refresh the page or contact support.</p>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

Wrap the entire app in ErrorBoundary in `main.jsx`:

```javascript
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
```

---

<a name="section-20"></a>

# SECTION 20 — ACCESSIBILITY AND INTERNATIONALISATION

## Accessibility Requirements (WCAG 2.1 AA)

### Color Contrast

- Normal text (below 18px): minimum contrast ratio 4.5:1
- Large text (18px+ or 14px bold): minimum 3:1
- Check all combinations of the design system colors using https://webaim.org/resources/contrastchecker

### Keyboard Navigation

- All interactive elements (buttons, links, inputs, modals) must be reachable by Tab key
- Add `:focus-visible` styles to all interactive elements in index.css:

```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 4px;
}
```

### Screen Reader Requirements

- All `<img>` tags: meaningful `alt` attribute or `alt=""` for decorative images
- All icon-only buttons: `aria-label` attribute
- All form inputs: `<label for="inputId">` paired with `<input id="inputId">`
- Modals: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title"`
- Navigation: `<nav aria-label="Main navigation">`
- Live regions for toast notifications: `aria-live="polite"` on toast container

### Skip Navigation

Add a skip link as the first element of every page:

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
<main id="main-content"></main>
```

## Language and Localisation

The platform is currently English-only with Indian locale for numbers and dates. Future internationalisation considerations:

- All user-facing strings should use a translation object (not yet required but plan for it)
- Date formatting uses `en-IN` locale via Intl API — already implemented in `formatDate.js`
- Currency formatting uses `en-IN` locale with INR — already implemented in `formatCurrency.js`
- Address fields, district list, and bank list are specific to Maharashtra/India

---

<a name="section-21"></a>

# SECTION 21 — ADMIN PANEL FEATURE SPECIFICATIONS

## Admin Dashboard Metrics

The admin overview page must show these exact metrics fetched from GET /api/admin/reports/overview:

```
Stat Card 1:  Total Registered Members        (all users with role=user)
Stat Card 2:  Active Members                  (isActive=true, isBlocked=false)
Stat Card 3:  Total Income Distributed         (sum of all credit transactions)
Stat Card 4:  Pending Withdrawals Amount       (sum of amount for status=pending withdrawals)
Stat Card 5:  E-Pins Generated Total          (count of all E-Pins)
Stat Card 6:  Today's New Registrations       (users with createdAt >= today's midnight)

Chart 1: Daily Registrations — Line chart — last 30 days
Chart 2: Monthly Payouts — Bar chart — last 12 months

Table 1: Recent 10 Registrations — rsId, fullName, mobile, district, createdAt
Table 2: Pending Withdrawals (top 5) — withdrawalId, member name, amount, requested date
```

## Admin User Management Specifications

Search behavior:

- Search fires on every keystroke with 500ms debounce
- Searches across: fullName, rsId, mobile, email simultaneously
- Results update without page reload
- "Clear" button resets search and filter

Status filters:

- All: no filter applied
- Active: isActive=true, isBlocked=false
- Inactive: isActive=false, isBlocked=false
- Blocked: isBlocked=true

User Detail Modal shows:

- Full profile: RS ID, full name, email, mobile, DOB, address, district, taluka
- Sponsor: sponsor RS ID, sponsor name (clickable to view sponsor)
- Banking: bank name, account holder, masked account number (\*\*\*\*8921), IFSC, PAN, kycStatus
- Stats: wallet balance, total income, direct income, level, referral count, activation date
- Recent 10 transactions: type, category, amount, date
- Actions: Block/Unblock button, Edit button, Manual Activate button (admin override)

## Admin Withdrawal Processing

The admin withdrawal queue must:

- Auto-refresh every 30 seconds via `refetchInterval: 30000`
- Show a red badge with count of pending withdrawals in the sidebar nav item
- Sort by createdAt ascending (oldest first) by default
- Show: withdrawalId, member RS ID + name, amount, bank name, masked account, requested date

Approve Modal fields:

- Transaction Reference (UTR/NEFT/IMPS number) — required, text input
- Transaction Date — optional, date picker (defaults to today)
- Admin Notes — optional, textarea (internal only, not shown to member)

Reject Modal fields:

- Rejection Reason — required, textarea, max 500 chars (shown to member in notification)

After approve:

- Withdrawal status = approved
- Send approval notification to member via Socket.IO
- Send approval email to member
- Create AdminLog entry

After reject:

- Withdrawal status = rejected
- REFUND amount to member's walletBalance atomically
- Create credit Transaction with category="refund"
- Send rejection notification to member via Socket.IO with reason
- Create AdminLog entry

## Admin E-Pin Generation

Generation form:

- Count input: number, min 1, max 1000, step 1
- Notes textarea: optional, for admin reference
- On submit: POST /api/admin/epin/generate
- On success: show "50 E-Pins generated" toast with batchId
- Invalidate E-Pin list query

E-Pin table columns:

- Pin code (monospace font with copy button)
- Status badge (available=green, assigned=gold, transferred=blue, used=gray)
- Batch ID
- Generated date
- Assigned to (RS ID if assigned)
- Used by (RS ID if used)
- Actions: Assign button (for available pins)

Assign Modal:

- RS ID input with live sponsor validation (check if RS ID exists)
- Confirm button only enabled when valid RS ID entered

---

<a name="section-22"></a>

# SECTION 22 — NOTIFICATION SYSTEM ARCHITECTURE

## Notification Types

| Type                | Triggered By                       | Title               | Message                                              | Action URL             |
| ------------------- | ---------------------------------- | ------------------- | ---------------------------------------------------- | ---------------------- |
| income_credit       | incomeEngine.js                    | Income Credited     | ₹{amount} {category} from {name} ({rsId})            | /dashboard/wallet      |
| withdrawal_approved | adminWithdrawalController          | Withdrawal Approved | Your withdrawal of ₹{amount} has been approved       | /dashboard/withdrawals |
| withdrawal_rejected | adminWithdrawalController          | Withdrawal Rejected | Your withdrawal of ₹{amount} was rejected: {reason}  | /dashboard/withdrawals |
| team_join           | incomeEngine.js (after activation) | New Team Member     | {name} ({rsId}) from {district} has joined your team | /dashboard/team        |
| epin_transferred    | epinController                     | E-Pin Received      | You received E-Pin {pin} from {name} ({rsId})        | /dashboard/epin        |
| ticket_reply        | adminSupportController             | Support Reply       | Admin replied to ticket #{ticketId}                  | /dashboard/support     |
| system_message      | Admin manually                     | (custom title)      | (custom message)                                     | (optional custom URL)  |

## Notification Delivery Flow

1. Backend event occurs (income credited, withdrawal approved, etc.)
2. Backend calls `createNotification(userId, type, title, message, actionUrl)` which:
   - Creates Notification document in MongoDB
   - Calls `socketService.sendNotificationToUser(userId, notificationObj)`
3. `socketService` looks up the user's socket ID from `userSockets` Map
4. If socket found (user is online): emits `'notification'` event to that specific socket
5. If socket not found (user is offline): notification sits in MongoDB, will be fetched on next load
6. Frontend `NotificationBell` polls `GET /api/notifications?limit=10` every 30 seconds as a backup
7. Frontend socket client listens for `'notification'` event in `DashboardLayout.jsx`:

```javascript
// DashboardLayout.jsx — useEffect on mount:
const socket = connectSocket(user._id);
socket.on("notification", (notification) => {
  queryClient.setQueryData(QUERY_KEYS.NOTIFICATIONS, (old) => ({
    ...old,
    notifications: [notification, ...(old?.notifications || [])].slice(0, 10),
    unreadCount: (old?.unreadCount || 0) + 1,
  }));
  toast.success(notification.message);
  useUIStore.getState().setUnreadCount((prev) => prev + 1);
});
return () => disconnectSocket();
```

---

<a name="section-23"></a>

# SECTION 23 — FILE UPLOAD AND MEDIA MANAGEMENT

## Profile Photo Upload Flow

Frontend:

1. User clicks the avatar circle in Profile.jsx
2. `FileUpload.jsx` shows a file input that accepts `image/jpeg,image/png,image/webp`
3. User selects a file
4. Client-side validation: file size < 2MB, MIME type in allowed list
5. If valid: show preview using `URL.createObjectURL(file)`
6. User clicks Save
7. `userService.uploadPhoto(file)` calls POST /api/user/upload-photo as multipart/form-data

Backend:

1. `upload.js` Multer middleware validates MIME type and size
2. Route calls `s3Service.uploadFile(file, 'profiles')`
3. S3 stores file with UUID filename: `profiles/{uuid}.jpg`
4. Returns S3 URL
5. Updates `user.profilePhoto = url`
6. Returns updated user object
7. Frontend calls `updateUser({ profilePhoto: url })` on auth store

## File Naming Convention

Profile photos: `profiles/{uuid}.{ext}` — e.g., `profiles/550e8400-e29b-41d4-a716-446655440000.jpg`
KYC documents (future): `kyc/{userId}/{documentType}-{uuid}.{ext}`

## Deleting Old Photos

When a user uploads a new profile photo, the old S3 object should be deleted to prevent storage waste:

```javascript
// s3Service.js
exports.deleteFile = async (key) => {
  const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
  await s3.send(
    new DeleteObjectCommand({ Bucket: process.env.AWS_S3_BUCKET, Key: key }),
  );
};

// In userController.js — uploadPhoto handler:
if (user.profilePhoto) {
  const oldKey = user.profilePhoto.split(".amazonaws.com/")[1];
  await s3Service.deleteFile(oldKey); // Best effort — catch errors
}
```

---

<a name="section-24"></a>

# SECTION 24 — BACKGROUND JOBS AND SCHEDULED TASKS

## Jobs Overview

| Job                 | Schedule              | Description                                                                 |
| ------------------- | --------------------- | --------------------------------------------------------------------------- |
| cleanExpiredOtps    | Every 15 minutes      | Clears OTP + otpExpiry from users where otpExpiry < now                     |
| sendWeeklySummary   | Every Sunday 9:00 AM  | Sends weekly income summary email to all active members                     |
| generateDailyReport | Every day at 11:59 PM | Aggregates and stores daily platform stats                                  |
| recalculateLevels   | On-demand queue       | Recalculates user level after team activation (background, not synchronous) |

## node-cron Setup

```javascript
// server/server.js — add after DB connection:
const cron = require("node-cron");

// Clean expired OTPs every 15 minutes
cron.schedule("*/15 * * * *", async () => {
  try {
    const result = await User.updateMany(
      { otpExpiry: { $lt: new Date() }, otp: { $ne: null } },
      { $unset: { otp: 1, otpExpiry: 1 } },
    );
    if (result.modifiedCount > 0) {
      logger.info(`Cleaned ${result.modifiedCount} expired OTPs`);
    }
  } catch (err) {
    logger.error("OTP cleanup job failed", { error: err.message });
  }
});

// Send weekly summary every Sunday at 9:00 AM
cron.schedule("0 9 * * 0", async () => {
  try {
    const activeUsers = await User.find({
      isActive: true,
      isBlocked: false,
    }).select("email fullName rsId walletBalance totalIncome");
    for (const user of activeUsers) {
      await emailService.sendWeeklySummary(user.email, user.fullName, {
        walletBalance: user.walletBalance,
        totalIncome: user.totalIncome,
      });
    }
    logger.info(`Weekly summary sent to ${activeUsers.length} members`);
  } catch (err) {
    logger.error("Weekly summary job failed", { error: err.message });
  }
});
```

## Level Recalculation Queue

Instead of running `checkAndUpdateLevel()` synchronously during activation (which blocks the response and could time out for large trees), add it to a simple in-memory queue:

```javascript
// server/utils/jobQueue.js
const queue = [];
let processing = false;

exports.addJob = (type, data) => {
  queue.push({ type, data, addedAt: new Date() });
  processNext();
};

async function processNext() {
  if (processing || queue.length === 0) return;
  processing = true;
  const job = queue.shift();
  try {
    if (job.type === "recalculateLevel") {
      await incomeEngine.checkAndUpdateLevel(job.data.userId);
    }
  } catch (err) {
    logger.error("Job processing failed", { job, error: err.message });
  }
  processing = false;
  processNext();
}
```

For production scale with many concurrent activations, replace with Agenda.js (MongoDB-backed persistent queue):

```bash
npm install agenda
```

---

<a name="section-25"></a>

# SECTION 25 — SCALABILITY AND GROWTH PLANNING

## Current Architecture Limits

The current single-server architecture can handle approximately:

- 1,000 concurrent users
- 100 API requests per second
- 50,000 total registered users
- 500 activations per day

## Phase 1 Scaling (50,000–200,000 users)

When the platform reaches 50,000 users, these changes become necessary:

1. **Add Redis caching** (already planned in Phase 13) — eliminates 70% of DB reads for dashboard stats
2. **MongoDB indexes** — all required indexes are already defined in the schemas. Verify they are created: `db.users.getIndexes()` in MongoDB Compass.
3. **Add MongoDB read replica** — Atlas allows adding read replicas with one click. Route all GET queries to the replica using Mongoose's `{ readPreference: 'secondaryPreferred' }`.
4. **Upgrade MongoDB Atlas tier** — M0 (free) → M10 ($57/month) → M20 for production traffic.

## Phase 2 Scaling (200,000–1,000,000 users)

1. **Horizontal backend scaling** — Deploy multiple Railway instances behind a load balancer. Requires sticky sessions for Socket.IO — use `socket.io-redis` adapter.
2. **Income engine optimization** — Move income distribution to a dedicated worker process so it doesn't block the main Express server.
3. **Database sharding** — Shard the User collection by `rsId` prefix if document count exceeds 10M.
4. **CDN for static assets** — Move all CSS, JS, and image bundles to Cloudflare CDN.
5. **Background email queue** — Replace direct Nodemailer sends with a queue (Bull or BullMQ) to handle email rate limits at scale.

## Monitoring Alerts to Set Up

1. UptimeRobot: health check every 5 minutes — alert if down for 2+ consecutive checks
2. Sentry: alert if error rate exceeds 1% of requests in 5-minute window
3. MongoDB Atlas: alert if CPU > 80%, memory > 90%, or disk > 80%
4. Railway: alert if deployment fails or memory usage exceeds 80%
5. Logtail: alert on any `level: 'error'` log entry in production

---

_End of RS Trading Complete Production-Grade Implementation Plan_

_Document Version: 2.0_
_Generated: 31 May 2026_
_Total Sections: 25_
_Source: Full codebase audit of App.jsx routing structure and all provided server-side code_

---

> This document is the single source of truth. All implementation decisions must reference this document. Any deviation from this plan must be documented and justified.
