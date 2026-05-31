# RS Trading — Complete Production-Grade Implementation Plan

> This document is the single source of truth for building the RS Trading MLM platform from scratch. Every section is written to be specific enough that a team of junior developers can execute without verbal clarification from anyone.

---

# SECTION 1 — PROJECT OVERVIEW

## What Is RS Trading?

RS Trading is a production-grade, India-focused multi-level marketing (MLM) and network marketing platform that operates as a digital referral income business. It enables members to earn income by growing a structured downline team across nine levels of depth. The platform combines a public marketing website, a secure member dashboard, and a full administrative back-office into one unified product accessible from any device.

The platform solves the problem of trust, transparency, and automation in traditional MLM businesses. Instead of manual commission tracking via spreadsheets, WhatsApp groups, and bank transfers that go unverified, RS Trading gives every participant a real-time dashboard showing their team, income, wallet balance, withdrawal history, and network tree — all calculated and credited automatically by the backend engine.

## Three Types of Users

**Guest (Unauthenticated Public User)**
A person who visits the website but has not registered. Guests can browse all public pages: Home, About, Business Plan, How It Works, and Contact. They can read about the income plan, see testimonials, and use the earnings calculator. Guests cannot access any dashboard features. Their primary call to action is to register using a sponsor's RS ID.

**Member (Authenticated User)**
A person who has completed registration using a valid sponsor's RS ID and has been issued a unique RS Trading ID (for example, RS1001). After registration, the member must activate their account by using a valid E-Pin. Before activation, the member can log in and view their dashboard in a limited state. After activation, the full income earning system becomes live for that member. Members can view their wallet, income statement, team network, referrals, support tickets, bank details, and profile. Members can request withdrawals once they have a minimum balance of ₹500 in their wallet.

**Admin (Super Administrator)**
An internal staff member or platform operator who logs in at the /admin/login URL using admin credentials. The admin has access to a separate admin panel that shows all users, all transactions, all E-Pin records, all withdrawal requests, all income distributions, and all analytics. The admin can approve or reject withdrawals, generate new E-Pins, manually credit income to users, block or unblock members, manage CMS pages, and view platform-wide reports.

## Complete Feature List

### Public Website Features
- Responsive navigation bar with glassmorphism scroll effect and mobile hamburger menu
- Hero section with animated taglines, earnings statistics, and call-to-action buttons
- How It Works section explaining the 4-step process
- Income Structure section displaying all 9 levels with member thresholds and payout amounts
- Earnings calculator that lets visitors enter team numbers to estimate income
- Referral Network animated tree visualization showing how the downline grows
- Stats section showing total members, income distributed, and active states
- Testimonials section from real members
- Trust and compliance section with PAN verification, legal compliance, and support highlights
- FAQ accordion section answering 8 common questions
- Contact form with name, email, mobile, and message fields
- About page with company story, values, and team mission
- Business Plan page with the complete 9-level income table
- How It Works detailed page with step-by-step instructions
- Footer with quick links, support links, contact details, social media icons, and business hours card

### Authentication Features
- Multi-step registration form with 5 steps: Sponsor Validation, Personal Info, Address Details, Banking Info, Review and Submit
- Sponsor ID validation via live API call before proceeding to step 2
- Account number confirmation field to prevent banking errors
- IFSC code format enforcement (11 uppercase characters)
- PAN card format enforcement (10 uppercase characters)
- Password minimum 8 characters with confirmation field
- Login using RS ID, email, or mobile number
- JWT access token (15 minute expiry) and refresh token (30 day expiry)
- Refresh token rotation — new refresh token issued on every refresh
- Refresh token reuse detection — if old refresh token is presented, all tokens invalidated
- Forgot password flow using OTP sent to registered email or mobile
- OTP expiry of 10 minutes
- Password reset using OTP verification
- Auto-redirect authenticated users away from login/register pages
- Auto-redirect unauthenticated users to login from protected routes
- Separate admin login page at /admin/login

### Member Dashboard Features
- Overview page with 6 stat cards: total income, direct income, current level, total referrals, active team, and wallet balance
- Income overview line chart showing last 12 months of income
- Income breakdown donut/pie chart showing income by type
- Recent transactions table with 5 latest entries
- Recent team joins list with member avatar, RS ID, city, date, and active status
- Account Activation page to enter E-Pin and activate account
- E-Pin Management page showing all assigned E-Pins with status (available, used, transferred), copy to clipboard, and transfer to another RS ID
- E-Pin transfer history table
- Team Network page showing downline members at configurable depth with pagination, member status, join date, and level badges
- Referral page showing unique referral link with one-click copy, QR code display, and referral statistics
- Wallet page with available balance card, total credited, total withdrawn, and transaction history with filter by credit/debit and pagination
- Withdrawal modal with minimum ₹500 validation and balance check
- Income Statement page filtered by date range, income type, and paginated
- Bank Details page to update bank name, account holder, account number, branch name, IFSC code, and PAN card
- Profile page to update full name, email, address, district, taluka, nominee name, and nominee relation
- Change Password page with current password verification, new password, and confirm password fields
- Support Tickets page with list of all tickets, create new ticket form with subject and message, and reply thread view

### Admin Panel Features
- Admin dashboard overview with 6 stat cards: total users, active users, income distributed, pending withdrawal amount, E-Pins generated, today's registrations
- Daily registrations line chart
- Monthly payouts bar chart
- Recent registrations table
- Pending withdrawals quick-view table with link to full withdrawals page
- User Management with search by name, RS ID, or mobile; filter by status (all, active, inactive, blocked); paginated table; view user detail modal; block/unblock actions; edit user info
- Income Management to view all income transactions, filter by income type, view income by user, and add manual bonus income to any member by RS ID
- E-Pin Management to generate new batch of E-Pins (1 to 1000 at a time) with optional notes, view all E-Pins with batch ID, assign E-Pins to specific users, and view transfer history
- Withdrawal Management with pending withdrawals queue, approve withdrawal modal requiring transaction reference number and date, reject withdrawal modal requiring reason text, withdrawal history tab
- Reports and Analytics with monthly registration trend, monthly payout trend, income category breakdown, user level distribution, geographic distribution by district
- CMS Management to edit website content including hero text, about section, business plan description, testimonials, and contact details

## Business Logic

### Referral and Registration Flow
Every new member must provide a valid sponsor RS ID at registration time. The system validates this ID against the database before allowing the registration form to proceed. On successful registration, the new member gets a unique RS ID in the format RS followed by a 4-digit number (example: RS1001). The sponsor's referral count is incremented when the new member activates their account.

### E-Pin Activation
An E-Pin is a unique 10-character alphanumeric code beginning with EP (example: EP12ABCD56). E-Pins are generated by the admin in batches. Generated pins are in "available" status by default. The admin assigns pins to distributors or directly to members. A member can transfer an available pin to another RS Trading member. When a member uses a pin to activate their account, the pin status changes to "used", the member's `isActive` flag is set to true, and the `activationDate` is recorded. A pin can only be used once. A member can only be activated once.

### Income Distribution on Activation
When a member activates their account with a valid E-Pin, the backend income engine runs a full distribution chain:

Step 1 — Direct Income: The immediate sponsor of the new member receives ₹1,500 credited to their wallet instantly, provided the sponsor is active. This is always credited regardless of the sponsor's level.

Step 2 — Level Income: The system walks up the sponsor chain starting from depth 1 (the sponsor) all the way up to depth 9. At each depth, if the ancestor is active AND their stored `level` field is greater than or equal to the current depth, the ancestor receives the level-specific payout. The level payouts are:
- Level 1: ₹1,500
- Level 2: ₹5,000
- Level 3: ₹7,000
- Level 4: ₹10,000
- Level 5: ₹15,000
- Level 6: ₹20,000
- Level 7: ₹30,000
- Level 8: ₹50,000
- Level 9: ₹75,000

The entire income distribution runs inside a MongoDB session transaction. If any step fails, the entire transaction is rolled back.

### Level Calculation
After a new member is activated, the system recalculates the sponsor's level. The algorithm performs a BFS (breadth-first search) starting from the sponsor. At each BFS depth, it counts the number of active direct children. If the count meets or exceeds the threshold for that level (currently 4 for all levels 1 through 9), the level is incremented. The user's `level` field is updated if the newly calculated level exceeds the current stored level. This is also transactional.

Note: The planData.js in the frontend shows different member thresholds per level (50, 200, 500, etc.) which represent cumulative team sizes at those levels. The backend incomeEngine.js uses a simpler threshold of 4 direct children per level. This discrepancy must be resolved — see Section 2 audit.

### Wallet and Withdrawals
Every income credit goes directly to the user's `walletBalance` field. When a user requests a withdrawal, the amount is immediately debited from `walletBalance` and a Withdrawal document is created with status "pending". A Transaction record is created for the debit. The withdrawal goes into the admin queue. When the admin approves a withdrawal, they enter the bank transaction reference number and date. The withdrawal status changes to "approved". When the admin rejects a withdrawal, the amount is refunded to the user's `walletBalance`, a credit Transaction record is created with category "refund", and the withdrawal status changes to "rejected" with the rejection reason stored.

Minimum withdrawal amount is ₹500. There is no documented maximum withdrawal limit in the current code.

### Team Network Tree Structure
The team network is a binary-style multi-child tree using sponsor references. Every user document has a `sponsorId` field pointing to their direct sponsor's MongoDB ObjectId, and a `sponsorRsId` field storing the text ID for quick lookups. The tree traversal for the /team endpoint uses a BFS approach: start with the requesting user's ID, find all users with sponsorId matching that ID (level 1 children), then find all users with sponsorId matching any of those children (level 2), and so on.

### Support Tickets
Members can create support tickets from the dashboard. Each ticket has a subject, message body, and status. Admin can view all tickets and reply. The reply thread is stored as messages linked to the ticket. Note: The SupportTickets.jsx page exists in the frontend but the backend has no support ticket model, controller, or routes yet — this is a gap identified in the audit.

## End Goal of the Platform

The platform's end goal is to give RS Trading the ability to onboard thousands of members across Maharashtra and India, automate all income distributions without human intervention, provide full financial transparency to members through their dashboards, and give the admin team complete control over the business operations through the admin panel. The platform must handle 50,000+ users, process hundreds of withdrawal requests per week, and generate reports for business decisions — all in a reliable, secure, and maintainable way.

---

# SECTION 2 — FULL CODEBASE AUDIT

## File-by-File Audit

### client/package.json
**What it does:** Declares all frontend npm dependencies and scripts.
**What it contains:** React 19, React DOM 19, React Router DOM 7, TanStack React Query 5, Zustand 5, Framer Motion 12, Lucide React, React Hot Toast, Recharts 3, Axios 1, Tailwind CSS 4 (via Vite plugin), Vite 8 as build tool.
**What is good:** Modern stack choices. Using React 19 stable. TanStack Query v5 is the correct latest version. Zustand v5 is correct.
**What is broken or missing:** Tailwind CSS 4 is installed but the codebase uses mostly custom CSS classes and inline styles — Tailwind is barely used. This creates a dual styling system with no clear convention. `@tailwindcss/vite` is imported as a dependency (not devDependency) which is wrong. No testing library (vitest, @testing-library/react) is installed. No TypeScript. No Zod for form validation. No react-hook-form.
**What needs to be improved:** Decide on one styling approach: either fully adopt Tailwind 4 utility classes or remove it and keep custom CSS. Add testing dependencies. Add form validation library. Move `@tailwindcss/vite` to devDependencies.

### client/vite.config.js
**What it does:** Configures Vite build tool.
**What it contains:** React plugin, path alias `@` pointing to `./src`, and TailwindCSS Vite plugin.
**What is good:** Path alias `@` is set up correctly — used consistently throughout the codebase.
**What is broken or missing:** No build output configuration. No chunk splitting strategy. No environment-specific configs. TailwindCSS Vite plugin is imported but not doing much useful work.
**What needs to be improved:** Add manual chunk splitting for large libraries like recharts and framer-motion. Add build target and sourcemap configuration.

### client/src/main.jsx
**What it does:** Entry point for the React app.
**What it contains:** Renders `<App />` inside `React.StrictMode`.
**What is good:** Correct and minimal. StrictMode is enabled which catches common mistakes.
**What is broken or missing:** Nothing critical at this level.
**What needs to be improved:** Consider adding a global error boundary wrapper around `<App />`.

### client/src/App.jsx
**What it does:** Root routing file that defines all application routes and wraps the app in necessary providers.
**What it contains:** BrowserRouter, Routes, QueryClientProvider, Toaster from react-hot-toast, AnimatePresence from framer-motion. Defines PrivateRoute, AdminRoute, PublicOnlyRoute guard components. Defines all public, auth, dashboard, and admin routes.
**What is good:** Clean route organization. QueryClient is configured with sensible defaults (retry: 1, staleTime: 30s, refetchOnWindowFocus: false). Route guards are implemented correctly using Zustand auth state. AnimatePresence wraps Routes enabling page transition animations.
**What is broken or missing:** PrivateRoute does not check if the token is still valid — it only checks the Zustand `isAuthenticated` flag which persists in localStorage. A user with an expired JWT and a corrupted localStorage state would pass the PrivateRoute check until they make an API call. No lazy loading — all components are eagerly imported, meaning the full bundle downloads on first page load. No 404 page component — the fallback just redirects to "/". No route for `/dashboard/withdrawal` or separate withdrawal page. No `/privacy`, `/terms`, or `/refund-policy` routes despite footer links to them. `refetchOnWindowFocus` is false which is fine for this platform but should be documented as a deliberate choice.
**What needs to be improved:** Wrap all route components in `React.lazy()` and `<Suspense>`. Add a real 404 page. Add routes for legal pages. Add token expiry validation to PrivateRoute by checking the decoded token expiry against current time.

### client/src/index.css
**What it does:** Global stylesheet with design system tokens, component classes, and utility classes.
**What it contains:** Google Fonts imports (Manrope), Fontshare import (Satoshi), Tailwind CSS import, custom CSS variables defined under `@theme`, reset styles, typography scale, scrollbar styles, component classes for cards, buttons, inputs, badges, navbar, sidebar, table, modals, stats cards, dashboard layout, and responsive breakpoints.
**What is good:** Excellent design system foundation. Well-organized component classes with clear naming. Good use of CSS variables. Smooth transitions and hover effects. Shimmer skeleton animation. Modal overlay styles. Dashboard layout is properly implemented with fixed sidebar and scrollable main content. Responsive breakpoints at 768px and 640px.
**What is broken or missing:** Tailwind is imported (`@import "tailwindcss"`) but very few Tailwind utilities are actually used — most styling is done via custom CSS classes and inline styles. This creates confusion. The `@theme` block is a Tailwind v4 configuration syntax but the rest of the file is plain CSS — mixing paradigms. `.btn-gold` class is defined but has no text color specified. `.tree-node` and `.tree-connector` classes exist but the tree visualization is not implemented. No dark mode support. No print styles. No focus-visible styles for accessibility.
**What needs to be improved:** Either commit to Tailwind v4 and eliminate custom classes, or remove Tailwind entirely. Add dark mode media query. Add proper focus-visible outlines for keyboard navigation. Add ARIA-related utility classes.

### client/src/services/api.js
**What it does:** Creates and configures the Axios instance for all API calls.
**What it contains:** Axios instance creation with baseURL from env, withCredentials true, and 15s timeout. Request interceptor that attaches the JWT token from localStorage. Response interceptor that handles 401 errors by clearing token and redirecting to /login.
**What is good:** Correct implementation pattern. Token is pulled from localStorage on every request (not cached in closure). withCredentials enables cookie-based sessions if needed. Timeout prevents hanging requests.
**What is broken or missing:** No automatic token refresh on 401 — the interceptor just logs out the user. There is no retry logic with refresh token. The response interceptor clears `rs_user` from localStorage but the Zustand store still has the user in memory until page reload — this could cause a brief flash of authenticated state. No request cancellation support. No exponential backoff for retries.
**What needs to be improved:** Implement a proper token refresh interceptor that: (1) on 401, calls /api/auth/refresh with the stored refresh token, (2) if refresh succeeds, retries the original request with the new token, (3) if refresh fails, logs out the user and redirects to login. The refresh token itself should be stored in an httpOnly cookie (not localStorage) for security.

### client/src/store/authStore.js
**What it does:** Zustand store for authentication state.
**What it contains:** State: `user` (object), `token` (string), `isAuthenticated` (boolean). Actions: `setAuth(user, token)`, `updateUser(updates)`, `logout()`, `isAdmin()`. Persisted to localStorage under key `rs_auth` using Zustand persist middleware.
**What is good:** Correct use of Zustand persist middleware. `toSafeObject()` pattern is correctly used on backend to strip sensitive fields before sending to frontend. `isAdmin()` function is a derived getter.
**What is broken or missing:** The `token` is being stored twice — once manually via `localStorage.setItem('rs_token', token)` in `setAuth()` and again via the Zustand persist middleware. This creates two storage entries (`rs_token` and `rs_auth`) with the same token. The `logout()` action removes `rs_token` and `rs_user` but `rs_user` is never set anywhere in the current code. The refresh token is never stored in the frontend — there is no mechanism to use the refresh token for silent token refresh. No expiry checking on the stored token.
**What needs to be improved:** Remove the manual `localStorage.setItem('rs_token', token)` call since persist handles it. The refresh token should be stored in an httpOnly cookie (handled by the backend). Add an `accessTokenExpiry` field to the store so PrivateRoute can check if the token has expired before making any API call.

### client/src/store/uiStore.js
**What it does:** Zustand store for UI state.
**What it contains:** State: `sidebarOpen` (boolean), `notifications` (array), `toasts` (array). Actions: `toggleSidebar()`, `setSidebarOpen(open)`, `addToast(toast)`, `removeToast(id)`.
**What is good:** Correct and minimal. Sidebar state is global since both the sidebar and the layout header need to read/control it.
**What is broken or missing:** `notifications` array is never populated anywhere in the codebase. There is no API call to fetch notifications. The notification bell in the header shows a static red dot. The `toasts` array and `addToast`/`removeToast` are redundant since the app uses react-hot-toast for all toast notifications — this duplicate system is confusing.
**What needs to be improved:** Remove `toasts` and `addToast`/`removeToast` from uiStore since react-hot-toast is used globally. Add notification fetching logic when the dashboard mounts. Add `notificationCount` derived state.

### client/src/constants/planData.js
**What it does:** Stores static business data used across the frontend.
**What it contains:** `LEVEL_DATA` array with 9 level objects containing level number, member threshold, sponsor count, payout amount. `TOTAL_POTENTIAL` calculated from LEVEL_DATA. `FAQ_DATA` array with 8 question-answer pairs. `TESTIMONIALS` array with 3 testimonials. `TRUST_FEATURES` array with 4 trust items. `HOW_IT_WORKS` steps array. `DISTRICTS` array with 36 Maharashtra districts. `NOMINEE_RELATIONS` array. `BANK_NAMES` array with 20 Indian banks.
**What is good:** Excellent centralization of static data. No hardcoded strings scattered across component files. Proper Indian banking data. Full district list for Maharashtra.
**What is broken or missing:** Critical discrepancy: `LEVEL_DATA` shows different payout amounts than the backend `INCOME_TABLE` in incomeEngine.js. The frontend shows Level 5 payout as ₹20,000 but the backend has Level 5 as ₹15,000. Level 6 frontend is ₹40,000, backend is ₹20,000. Level 7 frontend is ₹60,000, backend is ₹30,000. Level 8 frontend is ₹1,00,000, backend is ₹50,000. Level 9 frontend is ₹2,00,000, backend is ₹75,000. This is a critical business logic inconsistency — members will see different numbers in the marketing material than what is actually paid.
**What needs to be improved:** Sync the payout amounts between planData.js and incomeEngine.js. The backend should be the single source of truth. The frontend should fetch the plan data from an API endpoint `/api/plan` rather than hardcoding it.

### client/src/utils/formatCurrency.js
**What it does:** Currency and number formatting utilities.
**What it contains:** `formatCurrency(amount)` that uses Intl.NumberFormat with en-IN locale and INR currency. `formatNumber(num)` for Indian comma-separated numbers.
**What is good:** Correct use of Intl API. Indian locale ensures proper lakh/crore formatting.
**What is broken or missing:** No handling of negative amounts. No compact notation option (e.g., ₹1.2L for ₹1,20,000).
**What needs to be improved:** Add `formatCurrencyCompact(amount)` for dashboard stat cards showing large amounts.

### client/src/utils/formatDate.js
**What it does:** Date formatting utilities.
**What it contains:** `formatDate(dateStr)` formatted as "15 May 2025". `formatDateTime(dateStr)` with time included.
**What is good:** Uses Intl API with en-IN locale. Handles null/undefined with fallback "—".
**What is broken or missing:** No `formatRelative(dateStr)` for "2 days ago" style display useful in notifications and activity feeds.
**What needs to be improved:** Add relative time formatter using Intl.RelativeTimeFormat.

### client/src/components/layout/Navbar.jsx
**What it does:** Public website navigation bar.
**What it contains:** Scroll-aware glassmorphism effect, animated active link indicator using Framer Motion layoutId, mobile hamburger menu with full-screen overlay, conditional CTA buttons based on authentication state (Login/Register for guests, Dashboard for members).
**What is good:** Premium design execution. Correct scroll effect. Route change detection closes mobile menu. Body scroll is locked when mobile menu is open. Logo uses flex-shrink 0 to prevent squishing.
**What is broken or missing:** All styles are inside a `<style>` JSX tag inside the component — this is a pattern that creates new style rules on every render and pollutes the global style sheet. Should use CSS Modules or be moved to index.css. No ARIA labels on mobile menu. No skip-to-content link for accessibility. The logo image import path `../../assets/images/logo.png` will break if the component is moved — use the `@/assets/images/logo.png` alias instead.
**What needs to be improved:** Move all scoped styles to a navbar.module.css or into index.css. Add aria-expanded attribute to hamburger button. Add aria-controls. Add role="navigation" to the nav element.

### client/src/components/layout/Footer.jsx
**What it does:** Public website footer.
**What it contains:** Brand column with logo, description, and social icons. Quick links column. Support links column. Contact column with email, phone, address, and business hours glassmorphism card. Bottom bar with copyright and legal links.
**What is good:** Visually complete. Correct dark theme matching the public pages. Social icon hover animations.
**What is broken or missing:** Social icon links are all "#" — no real social URLs. Privacy Policy, Terms, and Refund Policy are linked but the routes do not exist. FAQ links to "/#faq" which assumes a hash anchor exists on the home page but no id="faq" anchor is set in the FAQ section.
**What needs to be improved:** Replace "#" social links with real URLs stored in planData.js or a config file. Create /privacy, /terms, /refund-policy routes and pages. Add id="faq" to the FAQ section component.

### client/src/components/layout/Sidebar.jsx
**What it does:** Navigation sidebar for both user dashboard and admin panel.
**What it contains:** Logo at top, user info card with name, RS ID, and active status dot, nav items with icons using NavLink for active state detection, level badge at bottom for users with level > 0, logout button.
**What is good:** Single component serves both user and admin layouts by checking the `isAdmin` prop. NavLink `end` prop correctly prevents /dashboard from being active when on /dashboard/wallet. Level badge is a nice UX touch.
**What is broken or missing:** `white: 'nowrap'` in line 95 is not valid CSS — it should be `whiteSpace: 'nowrap'`. All styles are inline objects making maintenance very difficult. No tooltip for icon-only collapsed sidebar (no collapsed state at all). Mobile close button styling uses `display: none` toggled by CSS media query but the close button element is present in DOM always — should use state.
**What needs to be improved:** Fix the typo `white: 'nowrap'` to `whiteSpace: 'nowrap'`. Move inline styles to CSS classes. Consider a collapsible sidebar for desktop with icon-only mode.

### client/src/components/layout/DashboardLayout.jsx
**What it does:** Layout wrapper for all user dashboard pages.
**What it contains:** Sidebar overlay for mobile, Sidebar component, topbar with page title from a path-to-title map, notification bell with red dot, user dropdown menu with profile/change password links and logout.
**What is good:** Page titles are mapped correctly from pathname. User dropdown has smooth Framer Motion animations. Date display in topbar is a nice touch.
**What is broken or missing:** The notification bell is completely static — clicking it does nothing. No notification dropdown. `user-name` class div inside the dropdown trigger has `display: none` style applied inline — this seems like a layout issue where name was meant to show on larger screens but is always hidden. Logout only calls the Zustand logout action — it does not call the backend `/api/auth/logout` endpoint to invalidate the refresh token on the server.
**What needs to be improved:** Call `/api/auth/logout` on logout. Implement notification dropdown. Fix the user name display in the dropdown trigger. Add a loading state while waiting for user data.

### client/src/components/layout/AdminLayout.jsx
**What it does:** Layout wrapper for all admin panel pages.
**What it contains:** Same pattern as DashboardLayout but with admin-specific page titles, blue gradient color scheme, Shield icon, and hardcoded "Admin / Super Admin" labels.
**What is good:** Consistent with DashboardLayout pattern. Admin branding is visually distinct (blue vs green).
**What is broken or missing:** Admin name is hardcoded as "A" and "Admin / Super Admin" — should display the actual admin user's name from the auth store. Logout does not call backend logout endpoint. No notification bell implementation.
**What needs to be improved:** Read actual admin user details from useAuthStore. Call backend logout on sign out.

### client/src/pages/auth/Login.jsx
**What it does:** User login page.
**What it contains:** Dark glassmorphism design, RS ID/email/mobile input, password with show/hide toggle, remember me checkbox, form shake animation on error, admin login link, register link. Currently uses MOCK login — accepts any password 3+ characters.
**What is good:** Excellent visual design. Shake animation on failed login is a professional touch. Supports three identifier types matching the backend login API. Good accessible form attributes (autoComplete, type="password").
**What is broken or missing:** CRITICAL: Login is completely mocked — it never calls the real backend API. It generates a fake user object and a fake token string. The "Remember me" checkbox does nothing — the logic to extend token expiry based on this is missing. No form validation library — raw state management for a simple form.
**What needs to be improved:** Replace the mock login with a real `API.post('/api/auth/login', { identifier, password })` call. Store the returned access token and refresh token. Implement remember me by passing a flag to the backend to issue a longer-lived refresh token.

### client/src/pages/auth/Register.jsx
**What it does:** Multi-step user registration page.
**What it contains:** 5-step wizard: sponsor validation, personal info, address details, banking info, review and submit. Uses MOCK sponsor validation and MOCK registration submission.
**What is good:** Outstanding UX. Step tracker with animated transitions between steps. Per-step validation with specific error messages. Account number confirmation field. Review screen showing all data before submit. Success screen with generated RS ID.
**What is broken or missing:** CRITICAL: Registration is completely mocked — it never calls the real backend API. Sponsor validation is mocked — it accepts any RS* prefix. The URL query parameter for pre-filling sponsor ID (for referral links) is not implemented. Password visibility toggle is missing in the registration form. No age validation on date of birth. No regex validation on IFSC code format (should be `[A-Z]{4}0[A-Z0-9]{6}`). No regex on PAN card format (should be `[A-Z]{5}[0-9]{4}[A-Z]`).
**What needs to be improved:** Connect to real API endpoints. Add regex validation for IFSC and PAN. Read `?ref=RS1234` query parameter to pre-fill sponsor ID. Add password visibility toggle. Validate minimum age (e.g., 18 years) from date of birth.

### client/src/pages/auth/ForgotPassword.jsx
**What it does:** Forgot password flow page.
**What it contains:** Multi-step forgot password: enter identifier (email or mobile), receive OTP, enter OTP and new password. Currently mocked.
**What is good:** Multi-step flow matches the backend endpoints. Proper mobile/email detection logic.
**What is broken or missing:** Like login and register, this is completely mocked and never calls any backend API. OTP input does not use proper numeric-only input. OTP countdown timer is not implemented.
**What needs to be improved:** Connect to real `/api/auth/forgot-password` and `/api/auth/reset-password` endpoints. Add OTP countdown timer (10 minutes). Use `type="tel"` for OTP input with maxLength 6.

### client/src/pages/dashboard/Overview.jsx
**What it does:** User dashboard home page.
**What it contains:** Welcome greeting based on time of day, 6 stat cards, income overview line chart, income breakdown pie chart, recent transactions table, recent team joins list. All data is MOCK/hardcoded.
**What is good:** Visually the most complete page in the dashboard. Rich with charts. InView animation on stat cards using Framer Motion. Chart formatting uses formatCurrency utility.
**What is broken or missing:** All data is hardcoded mock data. No API calls. No loading states. No error states. The `allDownline` calculation in the backend userRoutes.js dashboard-stats endpoint uses a broken regex query `{ $regex: new RegExp('^${user.rsId}') }` on `sponsorRsId` field — this would only work if the field stored a chain of RS IDs which it does not; `sponsorRsId` only stores the direct sponsor's RS ID.
**What needs to be improved:** Replace all mock data with `useQuery` React Query calls. Add skeleton loading states. Fix the broken backend allDownline calculation. Add actual referral count from a COUNT query on the User collection.

### client/src/pages/dashboard/Activation.jsx
**What it does:** Account activation page where a member enters their E-Pin.
**What it contains:** E-Pin input form. Currently mocked.
**What is good:** Correct concept. Checks if the account is already active and shows appropriate message.
**What is broken or missing:** Completely mocked — never calls `/api/epin/activate`. After successful activation, the user's `isActive` flag in the Zustand store is not updated, so the sidebar still shows "Inactive" status badge.
**What needs to be improved:** Call real API. On success, call `updateUser({ isActive: true, activationDate: new Date() })` on the auth store. Show E-Pin format hint (EP followed by 8 characters).

### client/src/pages/dashboard/EPin.jsx
**What it does:** E-Pin management page for members.
**What it contains:** Two tabs: My E-Pins (with filter by status and copy to clipboard) and Transfer E-Pin (with recipient RS ID and pin selector form). All mocked.
**What is good:** Good UX with tab navigation and status filters. Copy to clipboard works using the browser clipboard API.
**What is broken or missing:** All data is mocked. Transfer form never calls `/api/epin/transfer`. My E-Pins never calls `/api/epin/mine`. No real-time feedback on available balance of pins.
**What needs to be improved:** Connect both tabs to real API endpoints using React Query.

### client/src/pages/dashboard/TeamNetwork.jsx
**What it does:** Team tree and downline member list page.
**What it contains:** Mocked team member table with level depth selector.
**What is good:** Level depth selector concept is correct matching the backend `/api/user/team?level=X` endpoint.
**What is broken or missing:** Completely mocked. No visual tree representation. No infinite scroll or proper pagination. No member search within team.
**What needs to be improved:** Implement actual tree visualization using D3 or recursive React components. Connect to real API. Add member count per level.

### client/src/pages/dashboard/Referral.jsx
**What it does:** Referral program page showing the user's referral link.
**What it contains:** Referral link display with copy button, referral statistics, sharing tips.
**What is good:** Correct concept — referral link is constructed from the user's RS ID.
**What is broken or missing:** All statistics are mocked. No QR code generation (mentioned in overview but not implemented here). No actual share buttons for WhatsApp or social media.
**What needs to be improved:** Generate referral link as `${VITE_SITE_URL}/register?ref=${user.rsId}`. Add QR code using `qrcode.react` library. Add native Web Share API button for mobile.

### client/src/pages/dashboard/Wallet.jsx
**What it does:** Wallet page with balance card, stats, transaction history with filter and pagination, and withdrawal modal.
**What it contains:** Balance card with gradient background and withdraw button, quick stats row, transaction history table with credit/debit filter and pagination, withdrawal modal with amount input.
**What is good:** Best-implemented dashboard page. Pagination logic works correctly in the mocked version. Withdrawal modal has proper validation. Balance is prominently displayed.
**What is broken or missing:** All data is mocked. Withdrawal modal has hardcoded ₹12,200 balance instead of reading from store/API. Never calls `/api/wallet/balance` or `/api/wallet/transactions` or `/api/withdrawals/request`.
**What needs to be improved:** Connect all three API endpoints. Read balance from the wallet balance query result. Invalidate the wallet balance and transactions queries on successful withdrawal submission.

### client/src/pages/dashboard/Statement.jsx
**What it does:** Income statement page.
**What it contains:** Mocked income transactions filtered by date range and type.
**What is good:** Date range filtering UI is implemented.
**What is broken or missing:** Completely mocked. No API connection. No export to CSV/PDF feature.
**What needs to be improved:** Connect to `/api/wallet/transactions` with type filter. Add export functionality.

### client/src/pages/dashboard/BankDetails.jsx
**What it does:** Bank details update form.
**What it contains:** Form to update bank name, account holder, account number, branch name, IFSC code, PAN card. Pre-populates from user data. Mocked submission.
**What is good:** Correct fields matching the User model.
**What is broken or missing:** Never calls `/api/user/bank-details`. Bank name is a free text input but the registration uses a dropdown — should be consistent. No account number masking when displaying existing data.
**What needs to be improved:** Connect to real API. Use the same BANK_NAMES dropdown as registration. Show current values from the user store. Invalidate user query on success.

### client/src/pages/dashboard/Profile.jsx
**What it does:** Profile update form.
**What it contains:** Form to update full name, email, DOB, address, district, taluka, nominee name, nominee relation.
**What is good:** Correct fields matching the update whitelist in userRoutes.js.
**What is broken or missing:** Mocked. Profile photo upload is visible in the UI design but there is no file upload implementation. No API call.
**What needs to be improved:** Connect to `/api/user/profile`. Add multer-based file upload for profile photo. Update auth store with new user data on success.

### client/src/pages/dashboard/ChangePassword.jsx
**What it does:** Change password form.
**What it contains:** Current password, new password, confirm password fields.
**What is good:** Correct fields matching `/api/user/change-password`.
**What is broken or missing:** Mocked. No connection to real API. No password strength indicator. No show/hide toggle on password fields.
**What needs to be improved:** Connect to real API. Add password visibility toggle. Add password strength indicator.

### client/src/pages/dashboard/SupportTickets.jsx
**What it does:** Support ticket management for members.
**What it contains:** Ticket list, create new ticket form with subject and message, and a mock reply thread.
**What is good:** Good UX concept. Ticket status badges (Open, In Progress, Closed). Reply thread format is appropriate.
**What is broken or missing:** No backend model, controller, routes, or API exists for support tickets. Completely mocked. No file attachment support. No email notification when ticket is created.
**What needs to be improved:** Build the backend first (SupportTicket model, supportRoutes, adminSupportRoutes). Then connect this page to the real API.

### client/src/pages/admin/AdminLogin.jsx
**What it does:** Admin login page at /admin/login.
**What it contains:** Separate login form for admin users with a dark/navy color scheme. Mocked.
**What is good:** Visually distinct from member login. Correct concept of separating admin entry point.
**What is broken or missing:** Mocked — never calls any API. Should call the same `/api/auth/login` endpoint — the backend differentiates by checking `user.role === 'admin'`. No CSRF protection on the admin login form. No brute force rate limiting.
**What needs to be improved:** Connect to `/api/auth/login`. The backend `requireAdmin` middleware protects all admin routes, so the same login flow works.

### client/src/pages/admin/AdminOverview.jsx
**What it does:** Admin dashboard home page with platform statistics.
**What it contains:** 6 stat cards, daily registration line chart, monthly payouts bar chart, recent registrations table, pending withdrawals table. All mocked.
**What is good:** Visually complete. Bar chart is appropriate for monthly payout data. Both charts use Recharts correctly.
**What is broken or missing:** All data is hardcoded mock data. Never calls `/api/admin/dashboard-stats` or `/api/admin/reports/overview`.
**What needs to be improved:** Connect to real API endpoints using React Query.

### client/src/pages/admin/UserManagement.jsx
**What it does:** Admin user management page with search, filter, and actions.
**What it contains:** Search input, status filter buttons, paginated user table, user detail modal, block/unblock actions. All mocked.
**What is good:** Good search and filter UX. Modal pattern for user detail is the right approach. Block button text toggles correctly based on current status.
**What is broken or missing:** Mock data only. Actions never call real APIs. Edit button exists but has no edit form. No ability to manually activate a user. No ability to view user's full transaction history from here.
**What needs to be improved:** Connect to `/api/admin/users` with search and status query params. Connect block to `/api/admin/users/:userId/block`. Add user edit modal. Add manual income credit from this view.

### client/src/pages/admin/EPinManagement.jsx
**What it does:** Admin E-Pin management page.
**What it contains:** Generate E-Pins form with count input, view all E-Pins table, assign E-Pin to member. All mocked.
**What is good:** Count validation (1–1000) matches the backend.
**What is broken or missing:** Mocked. Never calls `/api/epin/generate`. No batch download as CSV/text file. No batch assignment form.
**What needs to be improved:** Connect to real API. Add batch export. Add assignment flow.

### client/src/pages/admin/IncomeManagement.jsx
**What it does:** Admin income management page.
**What it contains:** Income transactions list with filters, manual income credit form. All mocked.
**What is good:** Manual credit form has RS ID input and amount input which matches the backend endpoint.
**What is broken or missing:** Mocked. Never calls `/api/admin/income/manual` or any transaction fetch endpoint.
**What needs to be improved:** Connect to real API. Add income type filter. Add user search autocomplete for the RS ID field.

### client/src/pages/admin/WithdrawalManagement.jsx
**What it does:** Admin withdrawal processing page.
**What it contains:** Pending tab and History tab. Approve modal requiring transaction reference and date. Reject modal requiring reason. Local state management to move items between pending and history lists.
**What is good:** Best-implemented admin page. Approve and reject modals are complete with all required fields. Local state correctly moves items between lists.
**What is broken or missing:** Completely local state — never calls `/api/admin/withdrawals`, `/api/admin/withdrawals/:id/approve`, or `/api/admin/withdrawals/:id/reject`. After page refresh, all actions are lost. No bulk approve feature. No export to Excel.
**What needs to be improved:** Replace all local state management with React Query mutations. Add optimistic updates. Add real-time polling every 30 seconds for new withdrawal requests.

### client/src/pages/admin/Reports.jsx
**What it does:** Reports and analytics page.
**What it contains:** Multiple chart views: monthly registrations, monthly payouts, income category breakdown, level distribution. All mocked.
**What is good:** Good chart variety. Uses different chart types appropriately.
**What is broken or missing:** All data is hardcoded. Never calls `/api/admin/reports/overview`. No date range filter. No data export.
**What needs to be improved:** Connect to real API. Add date range picker. Add export to PDF/Excel.

### client/src/pages/admin/CMSManagement.jsx
**What it does:** CMS page to edit website content.
**What it contains:** Form sections to edit hero text, about section, business plan text, testimonials, and contact details.
**What is good:** Good concept for non-developer content management.
**What is broken or missing:** No backend CMS model, controller, or routes exist. No database storage. No API connection. Content is not actually rendered from database anywhere on the public pages.
**What needs to be improved:** Build the full backend CMS system. Add a CMS content API endpoint. Update public pages to fetch content from the API with fallback to static data.

### server/server.js
**What it does:** Express application entry point.
**What it contains:** Helmet, CORS, body parsers, Morgan logging, route mounting for 6 route files, health check endpoint, error handler, MongoDB connection, server startup.
**What is good:** Helmet is correctly applied as first middleware. CORS is configured with allowed origins, credentials, methods, and headers. JSON body limit is 10mb. Mongoose strict mode is set to true. Server won't start without successful DB connection.
**What is broken or missing:** No rate limiting is applied even though express-rate-limit is installed. No request ID middleware for tracing logs across distributed requests. No graceful shutdown handling (SIGTERM, SIGINT). Morgan only logs in non-production but logging in production should go to a file/service, not just be disabled. No API version prefix — routes are at `/api/auth` not `/api/v1/auth`.
**What needs to be improved:** Add rate limiting at application and route level. Add graceful shutdown. Add request ID middleware. Add production logging to file. Add health check that checks DB connectivity.

### server/models/User.js
**What it does:** Mongoose schema and model for the User collection.
**What it contains:** rsId, fullName, mobile, email, passwordHash, dob, sponsorId, sponsorRsId, sponsorName, nomineeName, nomineeRelation, address, district, taluka, bankName, accountHolder, accountNumber, branchName, ifscCode, panCard, isActive, isBlocked, role, level, activationDate, activationEPin, walletBalance, totalIncome, directIncome, referralCount, activeTeamCount, refreshToken, otp, otpExpiry, profilePhoto, kycStatus. Pre-save hook for bcrypt hashing. `comparePassword()` method. `toSafeObject()` method. Four indexes.
**What is good:** Very comprehensive schema for an MLM platform. Pre-save password hashing with salt rounds 12. `toSafeObject()` strips sensitive fields correctly. Indexes on rsId, mobile, email, and sponsorId are all appropriate. Enum values for role and nomineeRelation. KYC status sub-document for PAN and bank verification.
**What is broken or missing:** `accountNumber` field is stored in plain text — account numbers should be masked or encrypted at rest. OTP is stored as bcrypt hash which is correct but the field is named just `otp` which is confusing — `otpHash` would be clearer. `activeTeamCount` field is never updated anywhere in the codebase — it is defined but the incomeEngine does not update it. `level` has max: 9 but the income engine iterates 1-9 levels using depth, which is correct. `walletBalance` has min: 0 but when a withdrawal is debited before admin approves, the balance could go negative momentarily if two concurrent withdrawals are processed — race condition exists.
**What needs to be improved:** Add a `lastLoginAt` timestamp field. Add email verification fields (`emailVerified`, `emailVerificationToken`). Add a field for profile photo S3 URL. Use a distributed lock or transaction with a check-and-set pattern to prevent the wallet balance race condition. Mark `accountNumber` field for encryption at rest.

### server/models/EPin.js
**What it does:** Mongoose schema for E-Pin documents.
**What it contains:** pin, generatedBy, assignedTo, usedBy, status enum, usedAt, transferHistory array, batchId, notes.
**What is good:** Clean and complete. Transfer history as an embedded array is good for audit trail. BatchId enables admin to track which generation batch a pin came from. Indexes on pin and assignedTo+status are correct.
**What is broken or missing:** `assignedTo` has no validation that it must be set before status changes to "transferred". No expiry date field — E-Pins can sit unused forever. `generatedBy` defaults to null — if the admin generates them, this should always be set.
**What needs to be improved:** Add `expiresAt` field. Enforce `assignedTo` when status is "transferred".

### server/models/Transaction.js
**What it does:** Mongoose schema for wallet transaction records.
**What it contains:** transactionId, userId, type (credit/debit), category enum, amount, description, balanceAfter, referenceId, level, fromUserId.
**What is good:** Complete audit trail model. `balanceAfter` enables ledger reconstruction. `level` field enables level-specific income filtering. `fromUserId` tracks who triggered a credit.
**What is broken or missing:** No `toUserId` for tracking who received a transfer (only `fromUserId`). No `status` field — all transactions are implicitly "completed" but a pending or failed status could be useful. No index on `category` which would be needed for income type filtering in reports.
**What needs to be improved:** Add index on `category`. Add index on `createdAt` for date-range queries. Add `ipAddress` field for fraud detection.

### server/models/Withdrawal.js
**What it does:** Mongoose schema for withdrawal requests.
**What it contains:** withdrawalId, userId, amount, bankName, accountHolder, accountNumber, ifscCode, status enum, processedBy, processedAt, transactionRef, transactionDate, rejectionReason, notes.
**What is good:** All required bank fields are captured at request time (not linked to current bank details) which is correct — if a user changes their bank details, it should not affect a pending withdrawal.
**What is broken or missing:** `branchName` is not stored in the withdrawal record even though it is in the User model. No `requestDate` field — `createdAt` from timestamps serves this purpose. No `tdsDeducted` field for TDS calculations. No `netAmount` field (amount after TDS). No `adminNotes` field for internal comments.
**What needs to be improved:** Add `tdsAmount`, `netAmount`, and `adminNotes` fields. Add `branchName`. Add index on `userId` for member withdrawal history queries.

### server/controllers/authController.js
**What it does:** Handles all authentication operations.
**What it contains:** `generateRsId()` with uniqueness loop, `generateTokens()` for JWT pair, and handlers for register, login, refresh, logout, validateSponsor, forgotPassword, resetPassword.
**What is good:** Refresh token rotation is correctly implemented. Refresh token reuse detection works — if the stored token doesn't match the presented one, access is denied. OTP is bcrypt-hashed before storage. `validateBeforeSave: false` is used correctly for partial updates. Checks for blocked users on login.
**What is broken or missing:** `generateRsId()` uses a do-while loop with random 4-digit numbers — with a large user base, collisions become frequent and the loop could iterate many times. Better to use a monotonically incrementing counter. Register endpoint has no input validation beyond simple null checks — no regex, no length limits, no sanitization. No email verification after registration. No rate limiting on auth endpoints specifically. ForgotPassword logs the OTP to console.log — this is a security issue. The login identifier check uses `startsWith('RS')` which means any string starting with "RS" would be treated as an RS ID query, not email or mobile.
**What needs to be improved:** Replace random RS ID generation with a database counter collection. Add Zod validation on all request bodies. Add express-rate-limit specifically to `/api/auth/login` and `/api/auth/forgot-password`. Remove console.log of OTP. Implement actual email/SMS OTP delivery. Add email verification flow post-registration.

### server/middleware/auth.js
**What it does:** JWT authentication and role-based access control middleware.
**What it contains:** `authenticate` middleware that extracts and verifies JWT from Authorization header, `requireAdmin` that checks role, `requireActive` that fetches the user from DB to check isActive flag.
**What is good:** Standard and correct JWT verification. Role check is simple and effective. `requireActive` correctly hits the DB instead of trusting the JWT claim.
**What is broken or missing:** `authenticate` does not check token blacklist — if a user logs out, their old access token remains valid until expiry (up to 15 minutes). This is standard for short-lived JWTs but a blacklist or session-based approach would be more secure for admin actions. `requireActive` makes a database query on every protected route call — this adds latency. Should be used selectively only on income-generating routes. No `requireOwner` middleware to prevent users from accessing other users' data.
**What needs to be improved:** Cache the user's active status in Redis to reduce DB load on `requireActive`. Add a token blacklist for admin logout scenarios.

### server/middleware/errorHandler.js
**What it does:** Global Express error handling middleware.
**What it contains:** Handles MongoDB duplicate key error (code 11000), Mongoose validation error, JWT errors, and generic 500 errors. Shows full error in development mode.
**What is good:** Handles the most common error types correctly. Extracts field name from duplicate key error for a user-friendly message. Shows stack trace only in development.
**What is broken or missing:** No logging to a logging service. No error ID generation for client-server error correlation. No handling of Express 5's async error catching differences. No handling of PayloadTooLargeError for oversized request bodies.
**What needs to be improved:** Add Winston/Pino logger integration. Generate a unique error ID for each 500 error. Return the error ID in the response so users can report it.

### server/services/incomeEngine.js
**What it does:** Core business logic for income distribution when a member activates.
**What it contains:** `INCOME_TABLE` with direct and 9 level payouts, `LEVEL_THRESHOLD` (all set to 4), `processActivationIncome()` that distributes direct and level income up the sponsor chain, `checkAndUpdateLevel()` that recalculates a user's level based on active team.
**What is good:** Uses MongoDB sessions for atomic transactions — critical for financial operations. Correctly traverses the sponsor chain using a loop. Level check uses BFS correctly. Income amounts are configurable in one place. Generates unique transaction IDs.
**What is broken or missing:** CRITICAL: Income amounts in INCOME_TABLE do not match planData.js on the frontend. `generateTxId()` uses `Date.now()` which could generate duplicate IDs under high concurrency — should use UUID. `processActivationIncome()` credits direct income AND level income at depth 1 separately — this means the sponsor receives both ₹1,500 as direct income AND ₹1,500 as level 1 income if they have level >= 1. This could be double-crediting. This needs clarification against the business plan. `checkAndUpdateLevel()` does a BFS but if a user has 10,000 downline members, this BFS could be extremely slow and time out. The LEVEL_THRESHOLD of 4 for all levels means reaching Level 9 requires 4^9 = 262,144 active members — this seems very high and may not match the actual business plan.
**What needs to be improved:** Sync INCOME_TABLE with planData.js. Use UUID for transaction IDs. Add a business plan document to verify the double-credit scenario. Add a background job for level recalculation instead of doing it synchronously during activation.

### server/routes/authRoutes.js
**What it does:** Mounts all authentication routes.
**What it contains:** 7 routes for register, login, refresh, logout, validate-sponsor, forgot-password, reset-password.
**What is good:** Correct and complete. `/forgot-password` and `/reset-password` are public (no auth required). `/logout` correctly requires authentication.
**What is broken or missing:** No rate limiting applied at route level. No request body size limit per route. Express-rate-limit is installed but never used.
**What needs to be improved:** Apply rate limiting: `/login` max 10 requests per 15 minutes per IP. `/forgot-password` max 3 requests per hour per IP. `/register` max 5 requests per hour per IP.

### server/routes/userRoutes.js
**What it does:** User dashboard data routes.
**What it contains:** GET /me, PUT /profile, PUT /bank-details, PUT /change-password, GET /team, GET /dashboard-stats.
**What is good:** Profile update uses an allowlist of editable fields. Team endpoint supports level depth and pagination.
**What is broken or missing:** Business logic is in the route handlers directly — should be in controllers. Team endpoint's BFS is done in a loop with individual DB queries — N+1 query problem. `dashboard-stats` uses a broken regex query for total team count. No input validation on profile updates. `bank-details` update does not set `kycStatus.bank = 'pending'` after change — bank details should re-enter pending verification state after a change. `change-password` has no minimum password length check. Missing `/api/user/referral-link` endpoint. Missing `/api/user/notifications` endpoint.
**What needs to be improved:** Move business logic to controllers. Fix N+1 query in team BFS with a single aggregation pipeline. Fix dashboard-stats total team count. Apply input validation middleware. Add missing endpoints. Update bank kycStatus on bank details change.

### server/routes/ePinRoutes.js
**What it does:** E-Pin lifecycle routes.
**What it contains:** POST /activate, GET /mine, POST /transfer, POST /generate (admin only).
**What is good:** Activation and transfer use MongoDB transactions correctly. Pin generation is admin-protected. Uniqueness is checked against existing pins before generation.
**What is broken or missing:** Pin generation checks uniqueness by loading ALL existing pins into memory (`EPin.find({}, 'pin')`) — with 100,000+ pins this will consume enormous memory. Activation does not verify that the E-Pin was assigned to the requesting user (`assignedTo`). Any user can use any available pin regardless of who it was assigned to. Transfer does not check if the recipient already has an unactivated account — could transfer a pin to an already-active member who cannot use it. No endpoint to get a specific pin's status. No bulk assignment endpoint.
**What needs to be improved:** Fix uniqueness check to generate incrementally, checking each new pin individually against the DB. Add `assignedTo === user._id` check on activation. Add recipient validation on transfer.

### server/routes/walletRoutes.js
**What it does:** Wallet balance and transaction history routes.
**What it contains:** GET /balance, GET /transactions with type and date range filters.
**What is good:** Clean and minimal. Date range filtering is correctly implemented.
**What is broken or missing:** User model is required inside the route handler function instead of at module top — this will work but is inconsistent style. No monthly summary endpoint for the dashboard chart. No total credit/debit summary endpoint.
**What needs to be improved:** Move User require to top of file. Add `/api/wallet/summary` endpoint returning total credited, total debited, and net balance.

### server/routes/withdrawalRoutes.js
**What it does:** User withdrawal request and history routes.
**What it contains:** POST /request, GET /my.
**What is good:** Withdrawal debits wallet immediately and uses a transaction. Minimum amount is enforced. Active check is performed.
**What is broken or missing:** RACE CONDITION: If a user submits two withdrawal requests simultaneously, both could read the same `walletBalance` value and both could deduct from it — resulting in a negative balance. Needs a findOneAndUpdate with a check: `{ _id: userId, walletBalance: { $gte: amount } }`. Bank details are copied from the user's current bank details — if the user has no bank details set, `bankName`, `accountHolder`, and `accountNumber` will be undefined/null in the withdrawal record, which violates the schema's required constraint. No maximum withdrawal limit. No daily withdrawal limit.
**What needs to be improved:** Fix the race condition using atomic findOneAndUpdate. Add validation that bank details are complete before allowing withdrawal. Add maximum withdrawal limits. Add daily/weekly withdrawal frequency limits.

### server/routes/adminRoutes.js
**What it does:** All admin panel routes.
**What it contains:** Dashboard stats, user list with search/filter, block/unblock, withdrawal list, approve/reject withdrawals with transactions, manual income credit, reports overview.
**What is good:** All routes are protected by authenticate + requireAdmin. Withdrawal approval and rejection use transactions. Rejection refunds the wallet correctly. Manual income creates a transaction record. Reports use MongoDB aggregation pipelines.
**What is broken or missing:** All business logic is in the route file — should be in separate controller files. No pagination on the dashboard-stats endpoint. `admin/users` search uses regex without escaping — regex injection vulnerability. Approval endpoint does not check that the withdrawal user still has the approved amount available — though since the amount was debited at request time this is fine, but it could be clearer. No admin action logging — every admin action should be recorded in an AdminLog collection. No `/api/admin/epin/assign` endpoint to assign pins to specific members. No `/api/admin/users/:id/activate` endpoint. No CMS endpoints despite CMSManagement.jsx existing on the frontend.
**What needs to be improved:** Escape regex input. Add AdminLog model and logging middleware. Add missing endpoints. Split into controller files. Add pagination to all list endpoints.

### server/utils/logger.js
**What it does:** Simple console-based logger.
**What it contains:** Three methods: info (green), error (red), warn (yellow) — all wrapping console.log/error/warn with ANSI color codes.
**What is good:** Better than raw console.log. Color coding makes development logs readable.
**What is broken or missing:** Not a production-grade logger. No log levels configuration. No log rotation. No log shipping to a centralized service. No structured JSON output. No correlation ID in logs. Should be replaced with Winston or Pino for production.
**What needs to be improved:** Replace with Winston configured to write JSON to files and stream to a logging service like Datadog or Logtail in production.

## Overall Codebase Score: 4.5 out of 10

The score reflects the following reality: The visual design and architecture of this codebase is genuinely excellent — it is in the top 25% of MLM platform codebases ever started. The choice of technologies is modern and correct. The backend models, business logic, and transaction patterns are well-thought-out. However, the score is 4.5 because the actual implementation is only 25-30% complete. The most critical gap is that the frontend never calls the backend — every single page uses mock data and mock API calls. The platform cannot be used by a single real user in its current state. Additionally, there are security vulnerabilities, race conditions, and data inconsistencies that must be fixed before going live.

## Security Issues Found

1. OTP plaintext logged to `console.log()` in authController.js — anyone with server log access sees OTPs
2. JWT secrets in `.env` file with placeholder text "change this in production" — risk of deploying with default secrets
3. MongoDB Atlas credentials hardcoded in server `.env` — if this file is committed to git it exposes the production database
4. Regex injection in admin user search (`{ $regex: search }`) — a search string like `.*` could return all users and a string like `(?i)a` could cause ReDoS
5. No rate limiting on any endpoint — vulnerable to brute force attacks on login, spam on registration
6. Account numbers stored in plaintext in the database — violates PCI-DSS best practices
7. Tokens stored in localStorage — vulnerable to XSS attacks (httpOnly cookie would be safer)
8. No CSRF protection for state-changing requests
9. Pin uniqueness check loads ALL pins into memory — with 100k+ pins this is a memory DoS vector
10. Missing bank details validation before withdrawal — null fields in required schema fields could crash the server
11. No input sanitization on free-text fields like `description`, `notes`, `address` — XSS storage risk

## Performance Issues Found

1. N+1 query in `/api/user/team` — each level of the BFS fires a separate DB query
2. Synchronous BFS in `checkAndUpdateLevel()` during activation — could time out for large trees
3. Loading all E-Pins into memory for uniqueness check in `generatePin()`
4. Broken total team count query using `$regex` on `sponsorRsId` — will be a full collection scan
5. No caching layer — every dashboard load hits the database
6. No indexes on `Transaction.category`, `Transaction.createdAt` — range queries will be slow
7. No pagination on admin dashboard stats — fetches entire pending withdrawal list into memory
8. All frontend components eagerly imported — entire app bundle downloads on first page load
9. Charts in Overview.jsx render 12 months of data from a hardcoded array — will be slow with real aggregation without caching
10. No image compression or lazy loading implemented

## Technical Debt Items Found

1. Every single frontend page uses hardcoded mock data — must be replaced with real API calls
2. Login, register, and forgot-password pages never connect to the backend
3. Support ticket system has frontend but zero backend
4. CMS management has frontend but zero backend
5. Income amounts are inconsistent between frontend planData.js and backend incomeEngine.js
6. Total team count query is broken in `/api/user/dashboard-stats`
7. Logger is a toy implementation — needs to be replaced with production-grade Winston/Pino
8. All business logic is in route files — should be in separate controller files
9. No input validation using Zod or express-validator anywhere on any endpoint
10. No unit tests, integration tests, or E2E tests anywhere in the codebase
11. No CI/CD pipeline configuration
12. No Docker configuration
13. No TypeScript — all JS without type safety
14. Dual styling system (Tailwind CSS imported but custom CSS used everywhere)
15. Styles embedded as `<style>` JSX tags inside components causing global style pollution
16. Admin action logging is completely absent

---

# SECTION 3 — FINAL TECH STACK WITH REASONS

## Frontend

**Framework: React 19 with Vite 8**
React 19 is used because it is the current stable version with Server Components support and improved concurrency. Vite 8 is the build tool because it is dramatically faster than Webpack or CRA for development hot reload and has first-class React support via @vitejs/plugin-react.

**UI Component Library: Custom CSS classes (no Shadcn, no Material UI, no Ant Design)**
The existing codebase has already invested heavily in a custom CSS design system with specific Indian MLM brand colors (emerald green primary, navy secondary, gold accent). Adopting a pre-built component library would require rethinking the entire visual identity. The custom CSS system in index.css is mature enough to continue with — the only addition is extracting inline styles from components.

**CSS and Styling Solution: Vanilla CSS with CSS Modules for new components**
Tailwind CSS 4 is currently installed but barely used, creating a dual system. The decision is to keep Tailwind for new utility needs only (spacing, flexbox shortcuts) and continue the custom CSS class system for component-specific styles. All new components use CSS Modules (.module.css) instead of `<style>` JSX tags.

**Animation Library: Framer Motion 12 (already installed)**
Already installed and used throughout. Provides AnimatePresence for route transitions, useInView for scroll animations, and motion.div for micro-animations. It is chosen over React Spring because the API is more intuitive for the component patterns used here.

**State Management (Global): Zustand 5 (already installed)**
Zustand is chosen over Redux Toolkit because it has no boilerplate, works natively with React 19, and the persist middleware handles localStorage serialization automatically. Only two stores are needed: authStore and uiStore. Everything else is server state managed by React Query.

**Server State and Caching: TanStack React Query 5 (already installed)**
React Query v5 handles all API data fetching, caching, background refetching, loading and error states. It eliminates the need for useEffect+useState patterns for API calls. Query invalidation automatically refreshes related data after mutations. Stale time configuration controls how long data is considered fresh without refetching.

**Routing: React Router DOM 7 (already installed)**
Already the project standard. RRD 7 supports both the browser-based routing used here and the newer data router API if needed in the future.

**Form Handling and Validation: React Hook Form + Zod**
React Hook Form replaces the current manual state management for forms. It provides uncontrolled form inputs with minimal re-renders. Zod provides TypeScript-compatible schema validation that runs on both frontend (validation messages) and backend (request body validation). Together they eliminate the duplicate validation code currently written in components and route handlers.

**HTTP Client: Axios 1 (already installed)**
Already configured with the correct interceptors. The enhancement is adding the token refresh interceptor so users are not logged out when the access token expires.

## Backend

**Backend Framework: Express.js 5 (already installed)**
Express 5 is the current stable major version. It has async/await error handling built in without needing express-async-errors. The existing routing structure is correct for the platform's needs.

**Database: MongoDB Atlas (already configured)**
MongoDB Atlas is the hosted cloud MongoDB service already in use. The flexible document model suits the nested objects in the User schema (kycStatus, bank details) and the embedded array in EPin (transferHistory).

**ORM or Query Builder: Mongoose 9 (already installed)**
Mongoose provides schema definition, validation, indexes, pre/post hooks, and virtuals. The existing schemas are well-designed with Mongoose.

**Authentication Method: JWT (Access Token + Refresh Token)**
The current implementation uses 15-minute access tokens and 30-day refresh tokens. This is the correct pattern for single-page applications that need session persistence without server-side session storage.

**Token Storage Strategy: Access token in Zustand (localStorage for persistence), Refresh token in httpOnly cookie**
Currently both tokens are in localStorage. The enhanced approach: access token stays in Zustand (memory + localStorage for persistence across browser sessions), refresh token moves to an httpOnly cookie set by the server. This prevents XSS from stealing the refresh token while allowing silent access token renewal.

**File and Image Storage: AWS S3 (via @aws-sdk/client-s3)**
Profile photos, KYC documents, and any uploaded files are stored in AWS S3. The backend uses signed URLs for secure upload and download. Multer handles multipart form data parsing before S3 upload.

**Email Service: Nodemailer with Gmail SMTP (development) / AWS SES (production)**
Nodemailer is already installed. Gmail SMTP works for development. AWS SES is recommended for production because it handles deliverability, bounce management, and TLS automatically.

**SMS Service: MSG91 or Twilio for OTP delivery**
OTP verification requires SMS delivery. MSG91 is preferred for India because it has better delivery rates for Indian mobile numbers, DLT registration support (required by TRAI), and a simple REST API. Twilio is the alternative if international SMS is needed.

**Payment Gateway for Withdrawals: Manual Bank Transfer (for now), Razorpay Payouts API (future)**
The current withdrawal flow is manual — admin approves and does a bank transfer outside the platform. The Razorpay Payouts API can automate this by sending money directly to member bank accounts via NEFT/IMPS. Integration should be planned for Phase 13.

**Real-time Notifications: Socket.IO**
Socket.IO provides WebSocket connections with automatic fallback to polling. Used for: new withdrawal status notification to members, new pending withdrawal alert to admin, new team join notification. Socket.IO is installed server-side and the client package is added to the frontend.

**Background Job Processing: node-cron or Agenda.js**
For periodic tasks like: generating daily income reports, sending weekly summary emails to members, clearing expired OTPs. `node-cron` is simpler for scheduled tasks. `Agenda.js` (backed by MongoDB) provides persistent job queues that survive server restarts.

**Logging: Winston**
Winston replaces the current toy logger. Configured to write JSON logs to files and ship to a logging service. Log levels: error, warn, info, http (Morgan), debug.

**Monitoring: Sentry for error tracking**
Sentry's Node.js SDK captures unhandled exceptions, Express errors, and slow transactions automatically. The Sentry React SDK captures frontend errors and user session context.

**Error Tracking: Sentry (same as monitoring)**
Sentry's performance monitoring feature tracks API response times and database query times.

**Testing Framework (Frontend): Vitest + React Testing Library + Playwright**
Vitest is Vite-native and fast. React Testing Library tests components in a user-centric way. Playwright handles E2E browser automation.

**Testing Framework (Backend): Jest + Supertest**
Jest runs unit tests for service functions. Supertest fires real HTTP requests against the Express app in tests.

**CI/CD Pipeline: GitHub Actions**
GitHub Actions runs tests, builds the frontend, and deploys on push to main branch.

**Frontend Hosting: Vercel (vercel.json already exists)**
The `vercel.json` in the client folder confirms Vercel is the chosen platform. The `rewrites` rule in vercel.json routes all paths to index.html for SPA routing.

**Backend Hosting: Railway or Render**
Railway and Render both support Node.js deployments with automatic HTTPS, environment variable management, and git-based deployment. Railway has better performance for the price. For production at scale, consider AWS Elastic Beanstalk or a Kubernetes deployment.

**Database Hosting: MongoDB Atlas (already in use)**
The current Atlas cluster connection string is already in the `.env`. The cluster should be in the `ap-south-1` (Mumbai) region for lowest latency for Indian users.

---

# SECTION 4 — COMPLETE MONOREPO FOLDER AND FILE STRUCTURE

```
rstrading.com/                              # Root monorepo directory
├── .github/                                # GitHub configuration
│   └── workflows/                          # GitHub Actions CI/CD pipelines
│       ├── frontend.yml                    # Frontend build, test, and deploy pipeline
│       └── backend.yml                     # Backend test and deploy pipeline
├── client/                                 # React frontend application (Vite)
│   ├── public/                             # Static assets served at root URL
│   │   ├── favicon.ico                     # Browser tab icon
│   │   └── og-image.png                    # Open Graph social share image
│   ├── src/                                # All application source code
│   │   ├── assets/                         # Static assets imported by components
│   │   │   └── images/                     # Image files
│   │   │       └── logo.png                # RS Trading logo used in navbar and auth pages
│   │   ├── components/                     # All React components grouped by type
│   │   │   ├── layout/                     # Layout wrapper components
│   │   │   │   ├── Navbar.jsx              # Public website navigation bar
│   │   │   │   ├── Footer.jsx              # Public website footer
│   │   │   │   ├── DashboardLayout.jsx     # Layout for all /dashboard/* pages
│   │   │   │   ├── AdminLayout.jsx         # Layout for all /admin/* pages
│   │   │   │   └── Sidebar.jsx             # Shared sidebar for dashboard and admin
│   │   │   ├── shared/                     # Reusable components used across pages
│   │   │   │   ├── ErrorBoundary.jsx       # Catches and displays React render errors
│   │   │   │   ├── LoadingSpinner.jsx      # Full-page and inline loading spinner
│   │   │   │   ├── SkeletonCard.jsx        # Shimmer skeleton for loading states
│   │   │   │   ├── SkeletonTable.jsx       # Shimmer skeleton for table loading states
│   │   │   │   ├── EmptyState.jsx          # Empty data state with icon and message
│   │   │   │   ├── NotificationBell.jsx    # Notification bell with dropdown panel
│   │   │   │   ├── ConfirmModal.jsx        # Generic confirmation dialog modal
│   │   │   │   └── PageMeta.jsx            # Sets document.title and meta tags per page
│   │   │   ├── ui/                         # Primitive UI components
│   │   │   │   ├── Button.jsx              # Primary, outline, ghost, danger button
│   │   │   │   ├── Input.jsx               # Controlled input with label and error
│   │   │   │   ├── Select.jsx              # Controlled select dropdown
│   │   │   │   ├── Textarea.jsx            # Controlled textarea
│   │   │   │   ├── Badge.jsx               # Status badge (green, red, gold, gray)
│   │   │   │   ├── Card.jsx                # Card container with optional hover effect
│   │   │   │   ├── Modal.jsx               # Accessible modal with overlay and focus trap
│   │   │   │   ├── Tabs.jsx                # Tabbed navigation component
│   │   │   │   ├── Pagination.jsx          # Page number navigator component
│   │   │   │   ├── SearchInput.jsx         # Search box with debounce
│   │   │   │   ├── StatCard.jsx            # Dashboard stat card with icon and trend
│   │   │   │   └── DataTable.jsx           # Sortable, paginated data table
│   │   │   ├── forms/                      # Form-specific components
│   │   │   │   ├── PasswordInput.jsx       # Password input with show/hide toggle
│   │   │   │   ├── OtpInput.jsx            # 6-box OTP input with auto-focus
│   │   │   │   ├── FileUpload.jsx          # Drag and drop file upload with preview
│   │   │   │   ├── BankDetailsForm.jsx     # Reusable bank details form section
│   │   │   │   └── AddressForm.jsx         # Reusable address form section
│   │   │   └── charts/                     # Data visualization components
│   │   │       ├── IncomeLineChart.jsx     # Monthly income trend line chart
│   │   │       ├── IncomeBreakdownChart.jsx # Income by type donut chart
│   │   │       ├── TeamGrowthChart.jsx     # Team growth bar chart
│   │   │       └── PayoutBarChart.jsx      # Monthly payout bar chart for admin
│   │   ├── constants/                      # Application constants
│   │   │   ├── planData.js                 # Level data, FAQ, testimonials, districts, banks
│   │   │   ├── queryKeys.js                # All React Query key constants
│   │   │   └── routes.js                   # Route path constants to avoid hardcoded strings
│   │   ├── hooks/                          # Custom React hooks
│   │   │   ├── useDebounce.js              # Debounce hook for search inputs
│   │   │   ├── useLocalStorage.js          # Type-safe local storage hook
│   │   │   ├── useWindowSize.js            # Window dimensions hook for responsive logic
│   │   │   ├── useCopyToClipboard.js       # Clipboard copy with toast feedback
│   │   │   └── useInfiniteTeam.js          # Infinite scroll hook for team network tree
│   │   ├── pages/                          # Page components organized by section
│   │   │   ├── public/                     # Pages accessible without authentication
│   │   │   │   ├── Home.jsx                # Landing page that composes all home sections
│   │   │   │   ├── About.jsx               # About page
│   │   │   │   ├── BusinessPlan.jsx        # Business plan and income level tables page
│   │   │   │   ├── HowItWorks.jsx          # Step-by-step how it works page
│   │   │   │   ├── Contact.jsx             # Contact page with form
│   │   │   │   ├── Privacy.jsx             # Privacy policy page
│   │   │   │   ├── Terms.jsx               # Terms and conditions page
│   │   │   │   ├── RefundPolicy.jsx        # Refund policy page
│   │   │   │   └── sections/               # Section components for the Home page
│   │   │   │       ├── HeroSection.jsx
│   │   │   │       ├── StatsSection.jsx
│   │   │   │       ├── HowItWorksSection.jsx
│   │   │   │       ├── IncomeStructureSection.jsx
│   │   │   │       ├── EarningsCalculatorSection.jsx
│   │   │   │       ├── ReferralNetworkSection.jsx
│   │   │   │       ├── TestimonialsSection.jsx
│   │   │   │       ├── TrustSection.jsx
│   │   │   │       ├── FAQSection.jsx
│   │   │   │       ├── CTASection.jsx
│   │   │   │       ├── ContactHeroSection.jsx
│   │   │   │       ├── ContactFormSection.jsx
│   │   │   │       ├── AboutHeroSection.jsx
│   │   │   │       ├── AboutStorySection.jsx
│   │   │   │       ├── AboutValuesSection.jsx
│   │   │   │       ├── BusinessPlanHeroSection.jsx
│   │   │   │       ├── HowItWorksHeroSection.jsx
│   │   │   │       └── HowItWorksDetailedSection.jsx
│   │   │   ├── auth/                       # Login, register, password reset pages
│   │   │   │   ├── Login.jsx               # Member login page
│   │   │   │   ├── Register.jsx            # 5-step registration wizard
│   │   │   │   └── ForgotPassword.jsx      # Forgot password with OTP flow
│   │   │   ├── dashboard/                  # Member dashboard pages
│   │   │   │   ├── Overview.jsx            # Dashboard home with stats and charts
│   │   │   │   ├── Activation.jsx          # E-Pin account activation page
│   │   │   │   ├── EPin.jsx                # E-Pin list and transfer page
│   │   │   │   ├── TeamNetwork.jsx         # Downline team tree and table page
│   │   │   │   ├── Referral.jsx            # Referral link and sharing page
│   │   │   │   ├── Wallet.jsx              # Wallet balance and transactions page
│   │   │   │   ├── Withdrawals.jsx         # NEW: Dedicated withdrawal request history page
│   │   │   │   ├── Statement.jsx           # Income statement with date range filter
│   │   │   │   ├── BankDetails.jsx         # Bank account details update page
│   │   │   │   ├── Profile.jsx             # Personal profile update page
│   │   │   │   ├── ChangePassword.jsx      # Change password page
│   │   │   │   └── SupportTickets.jsx      # Support ticket list and creation page
│   │   │   └── admin/                      # Admin panel pages
│   │   │       ├── AdminLogin.jsx          # Admin-specific login page
│   │   │       ├── AdminOverview.jsx       # Admin dashboard with platform metrics
│   │   │       ├── UserManagement.jsx      # Search, filter, manage all members
│   │   │       ├── EPinManagement.jsx      # Generate, assign, view E-Pins
│   │   │       ├── IncomeManagement.jsx    # View all income, manual credit
│   │   │       ├── WithdrawalManagement.jsx # Approve/reject withdrawal requests
│   │   │       ├── Reports.jsx             # Analytics and reports charts
│   │   │       ├── CMSManagement.jsx       # Website content management
│   │   │       └── AdminSettings.jsx       # NEW: System settings management page
│   │   ├── services/                       # API communication layer
│   │   │   ├── api.js                      # Axios instance with interceptors
│   │   │   ├── authService.js              # Functions for auth API calls
│   │   │   ├── userService.js              # Functions for user API calls
│   │   │   ├── walletService.js            # Functions for wallet API calls
│   │   │   ├── epinService.js              # Functions for E-Pin API calls
│   │   │   ├── withdrawalService.js        # Functions for withdrawal API calls
│   │   │   ├── adminService.js             # Functions for admin API calls
│   │   │   ├── supportService.js           # Functions for support ticket API calls
│   │   │   └── notificationService.js      # Functions for notification API calls
│   │   ├── store/                          # Zustand global state stores
│   │   │   ├── authStore.js                # Authentication state (user, token, isAdmin)
│   │   │   └── uiStore.js                  # UI state (sidebar, notifications, loading)
│   │   └── utils/                          # Utility functions
│   │       ├── formatCurrency.js           # INR currency formatting
│   │       ├── formatDate.js               # Date and datetime formatting
│   │       ├── validators.js               # Reusable validation functions (IFSC, PAN, mobile)
│   │       └── tokenUtils.js               # JWT decode, expiry check utilities
│   ├── .env                                # Local environment variables (not committed)
│   ├── .env.example                        # Template for env variables (committed)
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html                          # Vite HTML entry point
│   ├── package.json
│   ├── vercel.json                         # Vercel deployment configuration
│   └── vite.config.js                      # Vite build configuration
└── server/                                 # Express.js backend API
    ├── controllers/                        # Business logic separated from routes
    │   ├── authController.js               # Registration, login, refresh, logout, OTP
    │   ├── userController.js               # Profile, team, dashboard stats, referral
    │   ├── epinController.js               # E-Pin activation, transfer, mine
    │   ├── walletController.js             # Balance, transactions, statement
    │   ├── withdrawalController.js         # Request, history
    │   ├── supportController.js            # Create ticket, list, reply, close
    │   ├── notificationController.js       # List, mark read, mark all read
    │   └── admin/                          # Admin-specific controllers
    │       ├── adminUserController.js      # List, block, unblock, activate, edit
    │       ├── adminEpinController.js      # Generate, assign, list all
    │       ├── adminIncomeController.js    # List all income, manual credit
    │       ├── adminWithdrawalController.js # List, approve, reject
    │       ├── adminReportController.js    # All analytics aggregations
    │       ├── adminCmsController.js       # Get and update CMS content
    │       └── adminSettingController.js   # Get and update system settings
    ├── middleware/                         # Express middleware functions
    │   ├── auth.js                         # authenticate, requireAdmin, requireActive
    │   ├── errorHandler.js                 # Global error handling
    │   ├── rateLimiter.js                  # Rate limiting configurations
    │   ├── validate.js                     # Zod request body validation middleware
    │   ├── upload.js                       # Multer configuration for file uploads
    │   └── requestId.js                    # Attaches unique request ID to each request
    ├── models/                             # Mongoose schemas and models
    │   ├── User.js                         # Core user schema
    │   ├── EPin.js                         # E-Pin schema
    │   ├── Transaction.js                  # Wallet transaction schema
    │   ├── Withdrawal.js                   # Withdrawal request schema
    │   ├── SupportTicket.js                # NEW: Support ticket schema
    │   ├── SupportMessage.js               # NEW: Support ticket reply message schema
    │   ├── Notification.js                 # NEW: User notification schema
    │   ├── CmsContent.js                   # NEW: CMS content document schema
    │   ├── SystemSetting.js                # NEW: Platform configuration schema
    │   ├── AdminLog.js                     # NEW: Admin action audit log schema
    │   └── Counter.js                      # NEW: Auto-increment counter for RS IDs
    ├── routes/                             # Express route definitions
    │   ├── authRoutes.js                   # /api/auth/*
    │   ├── userRoutes.js                   # /api/user/*
    │   ├── epinRoutes.js                   # /api/epin/*
    │   ├── walletRoutes.js                 # /api/wallet/*
    │   ├── withdrawalRoutes.js             # /api/withdrawals/*
    │   ├── supportRoutes.js                # NEW: /api/support/*
    │   ├── notificationRoutes.js           # NEW: /api/notifications/*
    │   └── adminRoutes.js                  # /api/admin/* (all admin sub-routes)
    ├── services/                           # Standalone business logic services
    │   ├── incomeEngine.js                 # Income distribution on activation
    │   ├── emailService.js                 # NEW: Nodemailer email sending functions
    │   ├── smsService.js                   # NEW: MSG91 OTP sending functions
    │   ├── s3Service.js                    # NEW: AWS S3 upload/download functions
    │   ├── socketService.js                # NEW: Socket.IO real-time notification sender
    │   └── pdfService.js                   # NEW: PDF generation for income statements
    ├── utils/                              # Backend utility functions
    │   ├── logger.js                       # Winston logger configuration
    │   ├── generateId.js                   # NEW: Unique ID generators (RS ID, TXN ID, WD ID)
    │   ├── validators.js                   # NEW: Zod schemas for all request bodies
    │   └── constants.js                    # NEW: Server-side constants (income table, etc.)
    ├── .env                                # Local environment variables (not committed)
    ├── .env.example                        # Template for env variables (committed)
    ├── .gitignore
    ├── package.json
    └── server.js                           # Express app entry point
```

---

# SECTION 5 — COMPLETE DATABASE SCHEMA

## Migration Order

Migrate tables in this exact order to satisfy all foreign key (reference) dependencies:

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

## Table 1: Counter Collection

```
Collection: counters

Field: _id          String    Required  Unique  The counter name (e.g., "rsId")
Field: seq          Number    Required          Current sequence value, starts at 1000
Field: createdAt    Date      Auto
Field: updatedAt    Date      Auto

Index: _id (unique, default)

Purpose: Used to generate monotonically incrementing RS IDs like RS1001, RS1002, etc.
Seed with: { _id: "rsId", seq: 1000 }
```

## Table 2: Users Collection

```
Collection: users

Field: _id                ObjectId    Auto       Unique primary key
Field: rsId               String      Required   Unique  "RS1001" format, generated from Counter
Field: fullName           String      Required   Trimmed, max 100 chars
Field: mobile             String      Required   Unique  10-digit Indian mobile number
Field: email              String      Required   Unique  Lowercase, trimmed
Field: passwordHash       String      Required          bcrypt hash of password (salt 12)
Field: dob                Date        Optional          Date of birth
Field: sponsorId          ObjectId    Optional   ref: User  Direct sponsor reference (null for root)
Field: sponsorRsId        String      Optional          RS ID string of sponsor (denormalized)
Field: sponsorName        String      Optional          Full name of sponsor (denormalized)
Field: nomineeName        String      Optional          Nominee's full name
Field: nomineeRelation    String      Optional   Enum: [Spouse, Parent, Sibling, Child, Other]
Field: address            String      Optional          Full residential address
Field: district           String      Optional          Maharashtra district
Field: taluka             String      Optional          Taluka within district
Field: bankName           String      Optional          Bank name for withdrawals
Field: accountHolder      String      Optional          Account holder name as per bank records
Field: accountNumber      String      Optional          Bank account number (store encrypted)
Field: branchName         String      Optional          Bank branch name
Field: ifscCode           String      Optional          11-character IFSC code (uppercase)
Field: panCard            String      Optional          10-character PAN number (uppercase)
Field: profilePhoto       String      Optional          S3 URL of profile photo
Field: isActive           Boolean     Default: false    Account activation status
Field: isBlocked          Boolean     Default: false    Admin block status
Field: emailVerified      Boolean     Default: false    Email verification status
Field: emailVerificationToken  String Optional          Token for email verification link
Field: role               String      Default: user  Enum: [user, admin]
Field: level              Number      Default: 0     Min: 0  Max: 9  Income level
Field: activationDate     Date        Optional          Date when E-Pin was used
Field: activationEPin     String      Optional          The E-Pin code used for activation
Field: walletBalance      Number      Default: 0     Min: 0
Field: totalIncome        Number      Default: 0     Min: 0
Field: directIncome       Number      Default: 0     Min: 0
Field: referralCount      Number      Default: 0         Direct active referrals count
Field: refreshToken       String      Optional          Current valid refresh token hash
Field: otp                String      Optional          bcrypt hash of current OTP
Field: otpExpiry          Date        Optional          OTP expiry timestamp
Field: lastLoginAt        Date        Optional          Last successful login timestamp
Field: kycStatus          Object      Default: {...}
  kycStatus.pan           String      Enum: [pending, verified, rejected]  Default: pending
  kycStatus.bank          String      Enum: [pending, verified, rejected]  Default: pending
Field: createdAt          Date        Auto
Field: updatedAt          Date        Auto

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

## Table 3: EPins Collection

```
Collection: epins

Field: _id              ObjectId    Auto       Unique primary key
Field: pin              String      Required   Unique  "EP" + 8 alphanumeric chars (EP12ABCD56)
Field: generatedBy      ObjectId    Required   ref: User  Admin who generated the pin
Field: assignedTo       ObjectId    Optional   ref: User  Member the pin is assigned to
Field: usedBy           ObjectId    Optional   ref: User  Member who activated with this pin
Field: status           String      Required   Enum: [available, assigned, transferred, used]  Default: available
Field: usedAt           Date        Optional          Timestamp when pin was activated
Field: expiresAt        Date        Optional          Expiry date (null = never expires)
Field: transferHistory  Array       Default: []       Array of transfer records
  transferHistory[].from    ObjectId  ref: User  Sender of the transfer
  transferHistory[].to      ObjectId  ref: User  Receiver of the transfer
  transferHistory[].date    Date      Default: Date.now
Field: batchId          String      Optional          Batch identifier for admin tracking
Field: notes            String      Optional          Admin notes
Field: createdAt        Date        Auto
Field: updatedAt        Date        Auto

Indexes:
  pin: 1 (unique)
  assignedTo: 1, status: 1
  status: 1
  generatedBy: 1
  batchId: 1
```

## Table 4: Transactions Collection

```
Collection: transactions

Field: _id              ObjectId    Auto       Unique primary key
Field: transactionId    String      Required   Unique  "TXN" + timestamp + random (use UUID v4)
Field: userId           ObjectId    Required   ref: User  Owner of this transaction
Field: type             String      Required   Enum: [credit, debit]
Field: category         String      Required   Enum: [direct_income, level_income, withdrawal, activation, bonus, transfer, refund]
Field: amount           Number      Required   Min: 0
Field: description      String      Required   Human-readable description of the transaction
Field: balanceAfter     Number      Required             Wallet balance after this transaction
Field: referenceId      String      Optional             External reference (withdrawal ID, epin, etc.)
Field: level            Number      Optional             Income level (1-9) for level_income category
Field: fromUserId       ObjectId    Optional   ref: User  User who triggered this credit
Field: ipAddress        String      Optional             IP address of the request for fraud tracking
Field: createdAt        Date        Auto
Field: updatedAt        Date        Auto

Indexes:
  transactionId: 1 (unique)
  userId: 1, createdAt: -1
  userId: 1, type: 1
  userId: 1, category: 1
  category: 1
  createdAt: -1
```

## Table 5: Withdrawals Collection

```
Collection: withdrawals

Field: _id              ObjectId    Auto       Unique primary key
Field: withdrawalId     String      Required   Unique  "WD" + timestamp + counter (e.g., WD1748691234001)
Field: userId           ObjectId    Required   ref: User
Field: amount           Number      Required   Min: 500
Field: tdsAmount        Number      Default: 0          TDS deducted (if applicable)
Field: netAmount        Number      Required             amount - tdsAmount
Field: bankName         String      Required             Copied from user at time of request
Field: accountHolder    String      Required             Copied from user at time of request
Field: accountNumber    String      Required             Copied from user at time of request
Field: branchName       String      Optional             Copied from user at time of request
Field: ifscCode         String      Required             Copied from user at time of request (uppercase)
Field: panCard          String      Optional             Copied from user at time of request
Field: status           String      Required   Enum: [pending, approved, rejected]  Default: pending
Field: processedBy      ObjectId    Optional   ref: User  Admin who processed
Field: processedAt      Date        Optional             Timestamp of processing
Field: transactionRef   String      Optional             UTR/NEFT/IMPS reference from bank
Field: transactionDate  Date        Optional             Actual transfer date
Field: rejectionReason  String      Optional             Reason shown to member
Field: adminNotes       String      Optional             Internal notes not shown to member
Field: createdAt        Date        Auto
Field: updatedAt        Date        Auto

Indexes:
  withdrawalId: 1 (unique)
  userId: 1, status: 1
  userId: 1, createdAt: -1
  status: 1, createdAt: -1
  processedBy: 1
```

## Table 6: SupportTickets Collection

```
Collection: support_tickets

Field: _id              ObjectId    Auto       Unique primary key
Field: ticketId         String      Required   Unique  "TKT" + timestamp
Field: userId           ObjectId    Required   ref: User
Field: subject          String      Required   Max: 200 chars
Field: category         String      Required   Enum: [general, payment, technical, epin, account, other]
Field: status           String      Required   Enum: [open, in_progress, closed]  Default: open
Field: priority         String      Required   Enum: [low, normal, high, urgent]  Default: normal
Field: assignedTo       ObjectId    Optional   ref: User  Admin assigned to this ticket
Field: resolvedAt       Date        Optional
Field: closedAt         Date        Optional
Field: lastReplyAt      Date        Optional
Field: lastReplyBy      String      Optional   Enum: [member, admin]
Field: createdAt        Date        Auto
Field: updatedAt        Date        Auto

Indexes:
  ticketId: 1 (unique)
  userId: 1, status: 1
  userId: 1, createdAt: -1
  status: 1, createdAt: -1
  assignedTo: 1
```

## Table 7: SupportMessages Collection

```
Collection: support_messages

Field: _id          ObjectId    Auto       Unique primary key
Field: ticketId     ObjectId    Required   ref: SupportTicket
Field: senderId     ObjectId    Required   ref: User
Field: senderRole   String      Required   Enum: [member, admin]
Field: message      String      Required   Max: 2000 chars
Field: attachments  Array       Default: []
  attachments[].filename  String  S3 file key
  attachments[].url       String  S3 public URL
  attachments[].mimeType  String
Field: isRead       Boolean     Default: false
Field: createdAt    Date        Auto

Indexes:
  ticketId: 1, createdAt: 1
  senderId: 1
```

## Table 8: Notifications Collection

```
Collection: notifications

Field: _id          ObjectId    Auto       Unique primary key
Field: userId       ObjectId    Required   ref: User  Recipient
Field: type         String      Required   Enum: [income_credit, withdrawal_approved, withdrawal_rejected, team_join, epin_transferred, system_message, ticket_reply]
Field: title        String      Required   Max: 100 chars
Field: message      String      Required   Max: 300 chars
Field: isRead       Boolean     Default: false
Field: actionUrl    String      Optional   Relative URL to navigate to on click
Field: referenceId  String      Optional   ID of related object (withdrawalId, ticketId, etc.)
Field: createdAt    Date        Auto

Indexes:
  userId: 1, isRead: 1
  userId: 1, createdAt: -1
  userId: 1, type: 1
```

## Table 9: CmsContent Collection

```
Collection: cms_contents

Field: _id          ObjectId    Auto
Field: key          String      Required   Unique  Identifier (e.g., "home_hero", "about_story")
Field: title        String      Required             Human-readable name for admin
Field: content      Mixed       Required             String or JSON object with page content
Field: isPublished  Boolean     Default: true
Field: updatedBy    ObjectId    Optional   ref: User  Last admin who updated
Field: createdAt    Date        Auto
Field: updatedAt    Date        Auto

Indexes:
  key: 1 (unique)
  isPublished: 1
```

## Table 10: SystemSettings Collection

```
Collection: system_settings

Field: _id                      ObjectId    Auto
Field: key                      String      Required   Unique  Setting identifier
Field: value                    Mixed       Required             Setting value (string, number, boolean, object)
Field: description              String      Optional             Description for admin display
Field: isPublic                 Boolean     Default: false       Whether to expose to frontend
Field: updatedBy                ObjectId    Optional   ref: User
Field: createdAt                Date        Auto
Field: updatedAt                Date        Auto

Example keys:
  withdrawal_min_amount         Number    500
  withdrawal_max_amount         Number    100000
  withdrawal_processing_days    Number    3
  epin_value                    Number    5000
  income_direct                 Number    1500
  income_level_1                Number    1500
  income_level_2                Number    5000
  income_level_3                Number    7000
  income_level_4                Number    10000
  income_level_5                Number    15000
  income_level_6                Number    20000
  income_level_7                Number    30000
  income_level_8                Number    50000
  income_level_9                Number    75000
  level_threshold               Number    4
  maintenance_mode              Boolean   false
  registration_enabled          Boolean   true

Indexes:
  key: 1 (unique)
  isPublic: 1
```

## Table 11: AdminLogs Collection

```
Collection: admin_logs

Field: _id          ObjectId    Auto
Field: adminId      ObjectId    Required   ref: User  Admin who performed the action
Field: action       String      Required             Action identifier (e.g., "block_user", "approve_withdrawal")
Field: targetType   String      Optional             Type of target (User, Withdrawal, EPin, etc.)
Field: targetId     ObjectId    Optional             ID of the target document
Field: targetRsId   String      Optional             RS ID of target for quick lookup
Field: payload      Mixed       Optional             Snapshot of action payload
Field: result       String      Required   Enum: [success, failure]
Field: ipAddress    String      Optional
Field: userAgent    String      Optional
Field: createdAt    Date        Auto

Indexes:
  adminId: 1, createdAt: -1
  action: 1
  targetId: 1
  createdAt: -1
```

---

# SECTION 6 — COMPLETE API DESIGN

All endpoints use the base path prefix `/api`. All requests accept and return `Content-Type: application/json`. Authentication requires `Authorization: Bearer <accessToken>` header for protected routes.

## Module: Authentication (/api/auth)

---

### POST /api/auth/register

**Description:** Register a new member with sponsor validation and auto-generated RS ID.
**Authorization:** Public — no token required.
**Request Body:**
```json
{
  "sponsorRsId":       "string  required  e.g. RS1001",
  "fullName":          "string  required  min 2 chars max 100 chars",
  "mobile":            "string  required  exactly 10 digits no spaces",
  "email":             "string  required  valid email format",
  "password":          "string  required  min 8 chars",
  "dob":               "string  optional  ISO date format YYYY-MM-DD",
  "nomineeName":       "string  optional  max 100 chars",
  "nomineeRelation":   "string  optional  enum Spouse Parent Sibling Child Other",
  "address":           "string  optional  max 500 chars",
  "district":          "string  optional",
  "taluka":            "string  optional",
  "bankName":          "string  optional",
  "accountHolder":     "string  optional",
  "accountNumber":     "string  optional  digits only",
  "branchName":        "string  optional",
  "ifscCode":          "string  optional  11 chars uppercase regex [A-Z]{4}0[A-Z0-9]{6}",
  "panCard":           "string  optional  10 chars uppercase regex [A-Z]{5}[0-9]{4}[A-Z]"
}
```
**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful! Your RS Trading ID has been created.",
  "rsId": "RS1042"
}
```
**Error Responses:**
- 400 `"All required fields must be filled"` — missing sponsorRsId, fullName, mobile, email, or password
- 400 `"Mobile number already registered"` — mobile is taken
- 400 `"Email already registered"` — email is taken
- 400 `"Invalid Sponsor ID. Please verify with your sponsor."` — sponsorRsId not found
- 400 `"Password must be at least 8 characters"` — Zod validation failure
- 400 `"Invalid IFSC code format"` — Zod validation failure
- 500 `"Internal server error"` — unexpected error

---

### POST /api/auth/login

**Description:** Login using RS ID, email, or mobile number. Returns access and refresh tokens.
**Authorization:** Public.
**Request Body:**
```json
{
  "identifier": "string  required  RS ID, email, or 10-digit mobile",
  "password":   "string  required"
}
```
**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64a1b2c3d4e5f6a7b8c9d0e1",
    "rsId": "RS1001",
    "fullName": "Demo User",
    "email": "demo@email.com",
    "mobile": "9876543210",
    "role": "user",
    "isActive": true,
    "isBlocked": false,
    "level": 3,
    "walletBalance": 12200,
    "totalIncome": 48500,
    "directIncome": 18500,
    "referralCount": 12,
    "sponsorRsId": "RS1000",
    "sponsorName": "Ramesh Kumar",
    "district": "Pune",
    "kycStatus": { "pan": "verified", "bank": "pending" },
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```
The refresh token is set as an httpOnly cookie named `rs_refresh_token` with path `/api/auth/refresh`, SameSite=Lax, Secure=true in production.

**Error Responses:**
- 400 `"Identifier and password are required"` — missing fields
- 401 `"Invalid credentials"` — user not found or wrong password
- 403 `"Your account has been blocked. Contact support."` — blocked user

---

### POST /api/auth/refresh

**Description:** Exchange a valid refresh token for a new access token and a new refresh token (rotation).
**Authorization:** Public — uses httpOnly cookie.
**Request:** Cookie `rs_refresh_token` is sent automatically by the browser.
**Success Response (200):**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
A new `rs_refresh_token` cookie replaces the old one.

**Error Responses:**
- 401 `"No refresh token"` — cookie missing
- 401 `"Invalid refresh token"` — token mismatch or reuse detected

---

### POST /api/auth/logout

**Description:** Logout the current user. Invalidates refresh token in database.
**Authorization:** Bearer token required.
**Request Body:** None.
**Success Response (200):**
```json
{ "success": true, "message": "Logged out successfully" }
```
The `rs_refresh_token` cookie is cleared by the server.

---

### POST /api/auth/validate-sponsor

**Description:** Check if a Sponsor RS ID exists and return sponsor's name.
**Authorization:** Public.
**Request Body:**
```json
{ "sponsorId": "string  required  e.g. RS1001" }
```
**Success Response (200):**
```json
{
  "success": true,
  "sponsor": {
    "rsId": "RS1001",
    "fullName": "Ramesh Kumar",
    "isActive": true
  }
}
```
**Error Responses:**
- 400 `"Sponsor ID required"` — missing sponsorId
- 404 `"Invalid Sponsor ID"` — not found

---

### POST /api/auth/forgot-password

**Description:** Send an OTP to the registered email or mobile for password reset.
**Authorization:** Public.
**Request Body:**
```json
{ "identifier": "string  required  email or mobile number" }
```
**Success Response (200):**
```json
{ "success": true, "message": "OTP sent to your registered email" }
```
**Error Responses:**
- 404 `"No account found with this email/mobile"` — user not found

---

### POST /api/auth/reset-password

**Description:** Reset password using the OTP received via email or mobile.
**Authorization:** Public.
**Request Body:**
```json
{
  "identifier":   "string  required  email or mobile",
  "otp":          "string  required  6-digit OTP",
  "newPassword":  "string  required  min 8 chars"
}
```
**Success Response (200):**
```json
{ "success": true, "message": "Password reset successful" }
```
**Error Responses:**
- 400 `"Invalid request"` — no OTP stored for this user
- 400 `"OTP has expired"` — past 10-minute window
- 400 `"Invalid OTP"` — OTP does not match

---

## Module: User Profile (/api/user)

---

### GET /api/user/me

**Description:** Get the full profile of the currently logged-in user.
**Authorization:** Bearer token required.
**Request Body:** None.
**Success Response (200):**
```json
{
  "success": true,
  "user": { /* Full user object via toSafeObject() */ }
}
```

---

### PUT /api/user/profile

**Description:** Update editable personal profile fields.
**Authorization:** Bearer token required.
**Request Body (all optional, only send fields to update):**
```json
{
  "fullName":         "string  optional",
  "email":            "string  optional  valid email",
  "address":          "string  optional",
  "district":         "string  optional",
  "taluka":           "string  optional",
  "nomineeName":      "string  optional",
  "nomineeRelation":  "string  optional  enum",
  "dob":              "string  optional  YYYY-MM-DD"
}
```
**Success Response (200):**
```json
{ "success": true, "user": { /* Updated user object */ }, "message": "Profile updated successfully" }
```

---

### PUT /api/user/bank-details

**Description:** Update bank account details. Resets kycStatus.bank to pending.
**Authorization:** Bearer token required.
**Request Body:**
```json
{
  "bankName":       "string  required",
  "accountHolder":  "string  required",
  "accountNumber":  "string  required  digits only",
  "branchName":     "string  optional",
  "ifscCode":       "string  required  11 chars",
  "panCard":        "string  required  10 chars"
}
```
**Success Response (200):**
```json
{ "success": true, "user": { /* Updated user object */ }, "message": "Bank details updated" }
```

---

### PUT /api/user/change-password

**Description:** Change password after verifying current password.
**Authorization:** Bearer token required.
**Request Body:**
```json
{
  "currentPassword":  "string  required",
  "newPassword":      "string  required  min 8 chars"
}
```
**Success Response (200):**
```json
{ "success": true, "message": "Password changed successfully" }
```
**Error Responses:**
- 400 `"Current password is incorrect"` — bcrypt comparison fails
- 400 `"New password must be at least 8 characters"` — Zod validation

---

### GET /api/user/team

**Description:** Get paginated list of downline members at specified depth level.
**Authorization:** Bearer token required.
**Query Parameters:**
```
level   integer  optional  default 1   Depth level to fetch (1 = direct, 2 = indirect, etc.)
page    integer  optional  default 1
limit   integer  optional  default 20  max 100
```
**Success Response (200):**
```json
{
  "success": true,
  "members": [
    {
      "rsId": "RS1010",
      "fullName": "Rahul Sharma",
      "mobile": "9876543210",
      "sponsorRsId": "RS1001",
      "isActive": true,
      "level": 2,
      "createdAt": "2025-01-20T00:00:00.000Z"
    }
  ],
  "total": 48,
  "page": 1,
  "totalPages": 3
}
```

---

### GET /api/user/dashboard-stats

**Description:** Get summary statistics for the member's dashboard overview page.
**Authorization:** Bearer token required.
**Success Response (200):**
```json
{
  "success": true,
  "stats": {
    "walletBalance": 12200,
    "totalIncome": 48500,
    "directIncome": 18500,
    "level": 3,
    "referralCount": 48,
    "totalTeamCount": 312,
    "activeTeamCount": 298
  }
}
```

---

### GET /api/user/referral-info

**Description:** Get referral link and referral count for the share page.
**Authorization:** Bearer token required.
**Success Response (200):**
```json
{
  "success": true,
  "referralLink": "https://rstradingonline.co.in/register?ref=RS1001",
  "referralCount": 48,
  "rsId": "RS1001"
}
```

---

### POST /api/user/upload-photo

**Description:** Upload a new profile photo. Accepted formats: JPEG, PNG, WebP. Max size: 2MB.
**Authorization:** Bearer token required.
**Request:** multipart/form-data with field name `photo`.
**Success Response (200):**
```json
{ "success": true, "photoUrl": "https://s3.ap-south-1.amazonaws.com/rstrading-assets/profiles/RS1001_1748691234.jpg", "message": "Profile photo updated" }
```

---

## Module: E-Pin (/api/epin)

---

### POST /api/epin/activate

**Description:** Activate account using a valid E-Pin. Triggers income distribution.
**Authorization:** Bearer token required.
**Request Body:**
```json
{ "pin": "string  required  E-Pin code e.g. EPABCD1234" }
```
**Success Response (200):**
```json
{
  "success": true,
  "message": "Account activated successfully!",
  "activationDate": "2025-05-31T08:00:00.000Z"
}
```
**Error Responses:**
- 400 `"E-Pin required"` — missing pin
- 400 `"Invalid or already used E-Pin"` — pin not found or not in available status
- 400 `"Account is already active"` — user's isActive is already true
- 400 `"This E-Pin is not assigned to your account"` — pin's assignedTo doesn't match user

---

### GET /api/epin/mine

**Description:** Get all E-Pins assigned to the current logged-in member.
**Authorization:** Bearer token required.
**Query Parameters:**
```
status  string   optional   Filter by status: available, transferred, used
page    integer  optional   default 1
limit   integer  optional   default 20
```
**Success Response (200):**
```json
{
  "success": true,
  "pins": [
    {
      "_id": "...",
      "pin": "EP12ABCD56",
      "status": "available",
      "assignedTo": "...",
      "batchId": "BATCH-1748691234567",
      "createdAt": "2025-05-01T00:00:00.000Z",
      "usedAt": null
    }
  ],
  "total": 4
}
```

---

### POST /api/epin/transfer

**Description:** Transfer an available E-Pin to another RS Trading member.
**Authorization:** Bearer token required.
**Request Body:**
```json
{
  "pin":           "string  required  The E-Pin code to transfer",
  "recipientRsId": "string  required  RS ID of the recipient (e.g. RS1010)"
}
```
**Success Response (200):**
```json
{ "success": true, "message": "E-Pin transferred to Rahul Sharma (RS1010)" }
```
**Error Responses:**
- 400 `"Pin not found or not available for transfer"` — pin doesn't belong to user or already used
- 404 `"Recipient RS ID not found"` — recipientRsId not in database
- 400 `"Cannot transfer to your own account"` — self-transfer prevention
- 400 `"Recipient's account is already active"` — pin would be unusable by recipient

---

## Module: Wallet (/api/wallet)

---

### GET /api/wallet/balance

**Description:** Get the current wallet balance and income totals.
**Authorization:** Bearer token required.
**Success Response (200):**
```json
{
  "success": true,
  "walletBalance": 12200,
  "totalIncome": 48500,
  "directIncome": 18500
}
```

---

### GET /api/wallet/transactions

**Description:** Get paginated transaction history with optional filters.
**Authorization:** Bearer token required.
**Query Parameters:**
```
type      string   optional  Filter by type: credit or debit
category  string   optional  Filter by category: direct_income, level_income, withdrawal, etc.
from      string   optional  Start date ISO format
to        string   optional  End date ISO format
page      integer  optional  default 1
limit     integer  optional  default 20  max 100
```
**Success Response (200):**
```json
{
  "success": true,
  "transactions": [
    {
      "_id": "...",
      "transactionId": "TXN-uuid-here",
      "type": "credit",
      "category": "direct_income",
      "amount": 1500,
      "description": "Direct Income from Priya Patel (RS1092)",
      "balanceAfter": 12200,
      "level": null,
      "fromUserId": { "rsId": "RS1092", "fullName": "Priya Patel" },
      "createdAt": "2025-05-26T14:30:00.000Z"
    }
  ],
  "total": 48,
  "page": 1,
  "totalPages": 3
}
```

---

### GET /api/wallet/summary

**Description:** Get total credited and total debited summary for the wallet stats cards.
**Authorization:** Bearer token required.
**Success Response (200):**
```json
{
  "success": true,
  "totalCredited": 56200,
  "totalDebited": 44000,
  "netBalance": 12200
}
```

---

## Module: Withdrawals (/api/withdrawals)

---

### POST /api/withdrawals/request

**Description:** Submit a new withdrawal request. Debits wallet immediately.
**Authorization:** Bearer token required. Account must be active and bank details must be complete.
**Request Body:**
```json
{ "amount": "number  required  min 500  max 100000" }
```
**Success Response (201):**
```json
{
  "success": true,
  "message": "Withdrawal request submitted. Processing within 2-3 business days.",
  "withdrawalId": "WD1748691234001"
}
```
**Error Responses:**
- 400 `"Minimum withdrawal amount is ₹500"` — amount < 500
- 400 `"Maximum withdrawal amount is ₹1,00,000"` — amount > 100000
- 400 `"Insufficient balance"` — walletBalance < amount
- 403 `"Account not activated"` — isActive is false
- 400 `"Bank details are incomplete. Please update your bank details first."` — missing account fields

---

### GET /api/withdrawals/my

**Description:** Get all withdrawal requests for the current member.
**Authorization:** Bearer token required.
**Query Parameters:**
```
status  string   optional  Filter: pending, approved, rejected
page    integer  optional  default 1
limit   integer  optional  default 10
```
**Success Response (200):**
```json
{
  "success": true,
  "withdrawals": [
    {
      "_id": "...",
      "withdrawalId": "WD1748691234001",
      "amount": 8000,
      "netAmount": 8000,
      "status": "pending",
      "bankName": "State Bank of India",
      "accountHolder": "Demo User",
      "accountNumber": "****8921",
      "ifscCode": "SBIN0001234",
      "createdAt": "2025-05-26T00:00:00.000Z"
    }
  ],
  "total": 5
}
```

---

## Module: Support Tickets (/api/support)

---

### POST /api/support/tickets

**Description:** Create a new support ticket.
**Authorization:** Bearer token required.
**Request Body:**
```json
{
  "subject":   "string  required  max 200 chars",
  "message":   "string  required  max 2000 chars",
  "category":  "string  required  enum: general payment technical epin account other"
}
```
**Success Response (201):**
```json
{
  "success": true,
  "ticket": { "ticketId": "TKT1748691234001", "status": "open", "createdAt": "..." }
}
```

---

### GET /api/support/tickets

**Description:** Get all support tickets for the current member.
**Authorization:** Bearer token required.
**Query Parameters:**
```
status  string   optional  Filter: open, in_progress, closed
page    integer  optional  default 1
limit   integer  optional  default 10
```
**Success Response (200):**
```json
{
  "success": true,
  "tickets": [
    {
      "ticketId": "TKT1748691234001",
      "subject": "Withdrawal not processed",
      "category": "payment",
      "status": "open",
      "lastReplyAt": "2025-05-26T14:00:00.000Z",
      "lastReplyBy": "admin",
      "createdAt": "2025-05-25T10:00:00.000Z"
    }
  ],
  "total": 3
}
```

---

### GET /api/support/tickets/:ticketId

**Description:** Get a single ticket with its full message thread.
**Authorization:** Bearer token required. Only the ticket owner can view their ticket.
**Success Response (200):**
```json
{
  "success": true,
  "ticket": {
    "ticketId": "TKT1748691234001",
    "subject": "Withdrawal not processed",
    "status": "open",
    "messages": [
      {
        "_id": "...",
        "senderId": "...",
        "senderRole": "member",
        "message": "My withdrawal of ₹8000 was approved 5 days ago but not credited.",
        "createdAt": "2025-05-25T10:00:00.000Z"
      },
      {
        "_id": "...",
        "senderRole": "admin",
        "message": "We are looking into this. It will be resolved within 24 hours.",
        "createdAt": "2025-05-26T14:00:00.000Z"
      }
    ]
  }
}
```

---

### POST /api/support/tickets/:ticketId/reply

**Description:** Add a reply message to an existing ticket.
**Authorization:** Bearer token required. Only ticket owner can reply.
**Request Body:**
```json
{ "message": "string  required  max 2000 chars" }
```
**Success Response (201):**
```json
{ "success": true, "message": "Reply added" }
```

---

## Module: Notifications (/api/notifications)

---

### GET /api/notifications

**Description:** Get the latest notifications for the current member.
**Authorization:** Bearer token required.
**Query Parameters:**
```
page    integer  optional  default 1
limit   integer  optional  default 20
unread  boolean  optional  If true, only return unread notifications
```
**Success Response (200):**
```json
{
  "success": true,
  "notifications": [
    {
      "_id": "...",
      "type": "income_credit",
      "title": "Income Credited",
      "message": "₹1,500 direct income credited from Priya Patel (RS1092)",
      "isRead": false,
      "actionUrl": "/dashboard/wallet",
      "createdAt": "2025-05-26T14:30:00.000Z"
    }
  ],
  "unreadCount": 3,
  "total": 15
}
```

---

### PUT /api/notifications/:id/read

**Description:** Mark a specific notification as read.
**Authorization:** Bearer token required.
**Success Response (200):**
```json
{ "success": true, "message": "Notification marked as read" }
```

---

### PUT /api/notifications/read-all

**Description:** Mark all notifications as read.
**Authorization:** Bearer token required.
**Success Response (200):**
```json
{ "success": true, "message": "All notifications marked as read" }
```

---

## Module: Admin Users (/api/admin/users)

---

### GET /api/admin/users

**Authorization:** Bearer token + admin role required.
**Query Parameters:**
```
search   string   optional  Search by name, rsId, mobile, email
status   string   optional  active | inactive | blocked
page     integer  optional  default 1
limit    integer  optional  default 20
```
**Success Response (200):**
```json
{
  "success": true,
  "users": [ /* Array of user objects without passwordHash, refreshToken, otp */ ],
  "total": 50248,
  "page": 1,
  "totalPages": 2513
}
```

---

### GET /api/admin/users/:userId

**Authorization:** Bearer token + admin role required.
**Success Response (200):** Full user detail with recent transactions.

---

### PUT /api/admin/users/:userId/block

**Authorization:** Bearer + admin.
**Success Response (200):**
```json
{ "success": true, "message": "User blocked successfully" }
```

---

### PUT /api/admin/users/:userId/unblock

**Authorization:** Bearer + admin.
**Success Response (200):**
```json
{ "success": true, "message": "User unblocked successfully" }
```

---

### PUT /api/admin/users/:userId/activate

**Authorization:** Bearer + admin. Manually activate a user without an E-Pin (for admin override).
**Success Response (200):**
```json
{ "success": true, "message": "User activated manually" }
```

---

### PUT /api/admin/users/:userId

**Authorization:** Bearer + admin. Edit user profile fields.
**Request Body:** Any editable user fields.
**Success Response (200):**
```json
{ "success": true, "message": "User updated" }
```

---

## Module: Admin E-Pin (/api/admin/epin)

---

### POST /api/admin/epin/generate

**Description:** Generate a new batch of E-Pins.
**Authorization:** Bearer + admin.
**Request Body:**
```json
{
  "count":  "integer  required  min 1  max 1000",
  "notes":  "string   optional  Max 200 chars"
}
```
**Success Response (201):**
```json
{
  "success": true,
  "message": "50 E-Pins generated",
  "count": 50,
  "batchId": "BATCH-1748691234567"
}
```

---

### GET /api/admin/epin

**Authorization:** Bearer + admin.
**Query Parameters:**
```
status   string   optional  available | assigned | transferred | used
batchId  string   optional
page     integer  optional  default 1
limit    integer  optional  default 50
```
**Success Response (200):**
```json
{
  "success": true,
  "pins": [ /* Array of EPin objects */ ],
  "total": 12840
}
```

---

### POST /api/admin/epin/assign

**Description:** Assign an available E-Pin to a specific member.
**Authorization:** Bearer + admin.
**Request Body:**
```json
{
  "pin":    "string  required",
  "rsId":   "string  required  Recipient member's RS ID"
}
```
**Success Response (200):**
```json
{ "success": true, "message": "E-Pin assigned to RS1010" }
```

---

## Module: Admin Income (/api/admin/income)

---

### GET /api/admin/income/transactions

**Authorization:** Bearer + admin.
**Query Parameters:**
```
category  string   optional  Filter by income category
userId    string   optional  Filter by user ObjectId
from      string   optional  Start date
to        string   optional  End date
page      integer  optional  default 1
limit     integer  optional  default 50
```
**Success Response (200):** Paginated transaction list with user population.

---

### POST /api/admin/income/manual

**Description:** Manually credit income to any member.
**Authorization:** Bearer + admin.
**Request Body:**
```json
{
  "rsId":         "string  required  Target member RS ID",
  "amount":       "number  required  min 1",
  "description":  "string  required  Max 200 chars  Reason for manual credit",
  "type":         "string  optional  Enum: bonus adjustment incentive"
}
```
**Success Response (200):**
```json
{ "success": true, "message": "₹5,000 credited to Rahul Sharma (RS1010)" }
```

---

## Module: Admin Withdrawals (/api/admin/withdrawals)

---

### GET /api/admin/withdrawals

**Authorization:** Bearer + admin.
**Query Parameters:**
```
status   string   optional  pending | approved | rejected
page     integer  optional  default 1
limit    integer  optional  default 20
```
**Success Response (200):** Paginated withdrawals with user info populated.

---

### PUT /api/admin/withdrawals/:id/approve

**Authorization:** Bearer + admin.
**Request Body:**
```json
{
  "transactionRef":   "string  required  UTR/NEFT/IMPS reference",
  "transactionDate":  "string  optional  YYYY-MM-DD  defaults to today"
}
```
**Success Response (200):**
```json
{ "success": true, "message": "Withdrawal approved successfully" }
```

---

### PUT /api/admin/withdrawals/:id/reject

**Authorization:** Bearer + admin.
**Request Body:**
```json
{ "reason": "string  required  max 500 chars" }
```
**Success Response (200):**
```json
{ "success": true, "message": "Withdrawal rejected and amount refunded" }
```

---

## Module: Admin Reports (/api/admin/reports)

---

### GET /api/admin/reports/overview

**Description:** Platform overview stats for the admin dashboard.
**Authorization:** Bearer + admin.
**Success Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 50248,
    "activeUsers": 38102,
    "blockedUsers": 124,
    "totalIncome": 10400000,
    "pendingWithdrawals": 3,
    "pendingAmount": 25000,
    "todayRegs": 41,
    "thisMonthRegs": 1240
  },
  "monthlyRegs": [ { "_id": "2025-01", "count": 980 } ],
  "monthlyPayouts": [ { "_id": "2025-01", "total": 1800000 } ]
}
```

---

### GET /api/admin/reports/income-by-level

**Authorization:** Bearer + admin.
**Query Parameters:** `from`, `to` date strings.
**Success Response (200):**
```json
{
  "success": true,
  "breakdown": [
    { "category": "direct_income", "total": 4500000, "count": 3000 },
    { "category": "level_income", "level": 1, "total": 3000000, "count": 2000 }
  ]
}
```

---

## Module: Admin CMS (/api/admin/cms)

---

### GET /api/admin/cms

**Authorization:** Bearer + admin.
**Success Response (200):** Array of all CMS content documents.

---

### GET /api/admin/cms/:key

**Authorization:** Public (for frontend rendering) or Bearer for admin editing.
**Success Response (200):**
```json
{
  "success": true,
  "content": {
    "key": "home_hero",
    "title": "Home Hero Section",
    "content": {
      "headline": "India's Most Trusted Network Marketing Platform",
      "subheadline": "Build your team and earn income...",
      "ctaText": "Start Your Journey"
    }
  }
}
```

---

### PUT /api/admin/cms/:key

**Authorization:** Bearer + admin.
**Request Body:**
```json
{ "content": { /* Updated content object or string */ } }
```
**Success Response (200):**
```json
{ "success": true, "message": "Content updated" }
```

---

## Module: Admin Settings (/api/admin/settings)

---

### GET /api/admin/settings

**Authorization:** Bearer + admin.
**Success Response (200):** All system settings as key-value pairs.

---

### PUT /api/admin/settings/:key

**Authorization:** Bearer + admin.
**Request Body:**
```json
{ "value": "any  required  New value for the setting" }
```
**Success Response (200):**
```json
{ "success": true, "message": "Setting updated" }
```

---

# SECTION 7 — AUTHENTICATION AND AUTHORIZATION SYSTEM

## Complete Auth Flow From App Open

**Step 1: App loads**

When the user opens the browser and navigates to any URL, `main.jsx` renders `App.jsx`. The Zustand `authStore` with the persist middleware automatically reads the `rs_auth` key from localStorage. If it exists, `isAuthenticated` is set to true and `user` and `token` are restored from storage.

**Step 2: Route guard evaluation**

React Router renders the matching `<Route>`. If the route has a `<PrivateRoute>` guard, it reads `isAuthenticated` from the Zustand store synchronously. If false, it immediately renders `<Navigate to="/login" replace />`. If true, it renders the protected page component.

The enhanced `PrivateRoute` implementation:
```javascript
function PrivateRoute({ children }) {
  const { isAuthenticated, token, logout } = useAuthStore();
  
  if (!isAuthenticated || !token) return <Navigate to="/login" replace />;
  
  // Check if access token is expired
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    if (decoded.exp * 1000 < Date.now()) {
      // Token expired — try to refresh via the interceptor on the first API call
      // We do NOT logout here to avoid flash — let the axios interceptor handle it
    }
  } catch (e) {
    logout();
    return <Navigate to="/login" replace />;
  }
  
  return children;
}
```

**Step 3: Registration with referral code**

The registration page reads the `?ref=RS1001` query parameter on mount. If present, it pre-fills the Sponsor ID field and automatically triggers the sponsor validation API call. The user sees the sponsor name appear before filling in any other field, making the referral flow frictionless.

```javascript
// In Register.jsx useEffect on mount:
const searchParams = new URLSearchParams(window.location.search);
const refCode = searchParams.get('ref');
if (refCode) {
  setData(d => ({ ...d, sponsorId: refCode.toUpperCase() }));
  // Auto-validate the sponsor
  validateSponsorById(refCode.toUpperCase());
}
```

**Step 4: Registration API call**

The register form's step 5 submit handler calls `authService.register(formData)`. The service function calls `API.post('/api/auth/register', formData)`. On success (201), the response contains the generated rsId. The success screen is shown. No auto-login after registration — the user must login separately.

**Step 5: Login flow**

The login form submits `identifier` and `password` to `authService.login({ identifier, password })`. The service calls `API.post('/api/auth/login', { identifier, password })`.

On success (200), the response contains `accessToken` and `user`. The refresh token is set as an httpOnly cookie by the server. The frontend:
```javascript
const { accessToken, user } = response.data;
setAuth(user, accessToken);  // Zustand action stores to localStorage
navigate('/dashboard');
```

**Step 6: JWT access token generation (backend)**

```javascript
// authController.js
const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );
  return { accessToken, refreshToken };
};
```

**Step 7: Refresh token storage (backend)**

The refresh token is stored in the database in the `user.refreshToken` field AND sent to the client as an httpOnly cookie:
```javascript
res.cookie('rs_refresh_token', refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/api/auth/refresh',
  maxAge: 30 * 24 * 60 * 60 * 1000  // 30 days
});
```

**Step 8: Token storage on the frontend**

The access token is stored in Zustand (persisted to localStorage key `rs_auth`). The refresh token is NOT stored in JavaScript — it exists only as an httpOnly cookie automatically sent by the browser to `/api/auth/refresh`.

**Step 9: Axios request interceptor**

The request interceptor in `api.js` attaches the access token to every API call:
```javascript
API.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

**Step 10: Token refresh — automatic when access token expires**

The response interceptor detects a 401 error and attempts a silent token refresh:
```javascript
let isRefreshing = false;
let refreshSubscribers = [];

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    
    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(API(originalRequest));
          });
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Cookie is sent automatically by the browser
        const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        const newToken = data.accessToken;
        
        useAuthStore.getState().setAuth(
          useAuthStore.getState().user,
          newToken
        );
        
        // Retry all queued requests
        refreshSubscribers.forEach(cb => cb(newToken));
        refreshSubscribers = [];
        isRefreshing = false;
        
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);
      } catch (refreshErr) {
        // Refresh failed — logout
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      }
    }
    
    return Promise.reject(err);
  }
);
```

**Step 11: Logout flow**

```javascript
// In logout action (authStore.js) — enhanced:
logout: async () => {
  try {
    // Call backend to invalidate refresh token in DB and clear cookie
    await API.post('/api/auth/logout');
  } catch (e) {
    // Best effort — continue with frontend logout
  }
  set({ user: null, token: null, isAuthenticated: false });
}
```

The backend logout handler:
```javascript
exports.logout = async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (user) {
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
  }
  // Clear the httpOnly cookie
  res.clearCookie('rs_refresh_token', { path: '/api/auth/refresh' });
  res.json({ success: true, message: 'Logged out successfully' });
};
```

**Step 12: How AdminRoute works**

```javascript
function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (!isAdmin()) return <Navigate to="/admin/login" replace />;
  return children;
}
```

`isAdmin()` reads `get().user?.role === 'admin'` from the stored user object. The user object's role is populated from the JWT claims on login.

**Step 13: How the backend validates tokens**

The `authenticate` middleware:
```javascript
exports.authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization token required' });
  }
  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // { userId, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
```

**Step 14: Role-based access control**

Member routes: `router.use(authenticate)` — requires valid JWT
Admin routes: `router.use(authenticate, requireAdmin)` — requires valid JWT AND `role === 'admin'`
Active-only routes: `router.post('/activate', authenticate, ...)` — does NOT require requireActive since the purpose is to become active
Income routes: `router.post('/some-route', authenticate, requireActive, ...)` — requires active account

---

# SECTION 8 — COMPLETE REACT COMPONENT ARCHITECTURE

## Layout Components

### Navbar.jsx — `client/src/components/layout/Navbar.jsx`
**Renders:** Fixed top navigation bar for public pages.
**Props:** None (reads from authStore)
**Local State:** `scrolled` boolean, `mobileOpen` boolean
**Global State:** `isAuthenticated` from useAuthStore
**API Calls:** None
**Child Components:** None (renders Link and motion.div)

### Footer.jsx — `client/src/components/layout/Footer.jsx`
**Renders:** Public website footer with 4 columns and bottom bar.
**Props:** None
**Local State:** None
**Global State:** None
**API Calls:** None
**Child Components:** None

### Sidebar.jsx — `client/src/components/layout/Sidebar.jsx`
**Renders:** Left navigation sidebar for both dashboard and admin layouts.
**Props:**
- `isAdmin: boolean` — switches between user and admin navigation items
- `open: boolean` — controls mobile visibility
- `onClose: function` — callback to close sidebar on mobile
**Local State:** None
**Global State:** `user`, `logout` from useAuthStore
**API Calls:** None
**Child Components:** NavLink (React Router)

### DashboardLayout.jsx — `client/src/components/layout/DashboardLayout.jsx`
**Renders:** Full dashboard shell with sidebar, topbar, and page content area.
**Props:** None (Outlet renders child page)
**Local State:** None
**Global State:** `sidebarOpen`, `toggleSidebar`, `setSidebarOpen` from useUIStore. `user`, `logout` from useAuthStore.
**API Calls:** None directly
**Child Components:** Sidebar, UserDropdown (inline), NotificationBell, Outlet

### AdminLayout.jsx — `client/src/components/layout/AdminLayout.jsx`
**Renders:** Admin panel shell with sidebar and topbar.
**Props:** None
**Local State:** None
**Global State:** Same as DashboardLayout
**API Calls:** None
**Child Components:** Sidebar (isAdmin=true), Outlet

## Public Page Components

### Home.jsx — `client/src/pages/public/Home.jsx`
**Renders:** The homepage by composing all section components.
**Props:** None
**Local State:** None
**Global State:** None
**API Calls:** `useQuery(['cms', 'home'])` to fetch CMS content (fallback to static data from planData.js)
**Child Components:** Navbar, HeroSection, StatsSection, HowItWorksSection, IncomeStructureSection, EarningsCalculatorSection, ReferralNetworkSection, TestimonialsSection, TrustSection, FAQSection, CTASection, Footer

### HeroSection.jsx — `client/src/pages/public/sections/HeroSection.jsx`
**Renders:** Full-viewport dark hero with animated taglines, CTA buttons, and floating stats.
**Props:**
- `headline: string` — CMS-driven headline text
- `subheadline: string` — CMS-driven subheadline
**Local State:** `currentTagline: number` — cycles through animated taglines
**Global State:** None
**API Calls:** None (props from parent)
**Child Components:** None

### EarningsCalculatorSection.jsx — `client/src/pages/public/sections/EarningsCalculatorSection.jsx`
**Renders:** Interactive earnings calculator with slider inputs for each level.
**Props:** None
**Local State:** `levelCounts: object` — number of members at each level input by user. `totalEstimate: number` — calculated from LEVEL_DATA.
**Global State:** None
**API Calls:** None
**Child Components:** None

## Auth Page Components

### Login.jsx — `client/src/pages/auth/Login.jsx`
**Renders:** Dark glassmorphism login form.
**Props:** None
**Local State:** `form: { identifier, password, remember }`, `showPwd: boolean`, `loading: boolean`, `shake: boolean`, `error: string`
**Global State:** `setAuth` from useAuthStore
**API Calls:** `authService.login(form)` — on form submit
**Child Components:** PasswordInput

### Register.jsx — `client/src/pages/auth/Register.jsx`
**Renders:** 5-step multi-page registration wizard.
**Props:** None
**Local State:** `step: number`, `data: object (all form fields)`, `loading: boolean`, `validatingPin: boolean`, `success: string|null`, `errors: object`
**Global State:** None (register does not auto-login)
**API Calls:**
- `authService.validateSponsor(sponsorId)` — on validate button click
- `authService.register(data)` — on step 5 submit
**Child Components:** BankDetailsForm, AddressForm, PasswordInput, OtpInput (for review), CheckCircle (icon)

### ForgotPassword.jsx — `client/src/pages/auth/ForgotPassword.jsx`
**Renders:** 3-step forgot password flow.
**Props:** None
**Local State:** `step: number (1-3)`, `identifier: string`, `otp: string`, `newPassword: string`, `confirmPassword: string`, `loading: boolean`, `countdown: number`
**Global State:** None
**API Calls:**
- `authService.forgotPassword(identifier)` — on step 1 submit
- `authService.resetPassword({ identifier, otp, newPassword })` — on step 3 submit
**Child Components:** OtpInput, PasswordInput

## Dashboard Page Components

### Overview.jsx — `client/src/pages/dashboard/Overview.jsx`
**Renders:** Dashboard home with stats, charts, and recent activity tables.
**Props:** None
**Local State:** None
**Global State:** `user` from useAuthStore
**API Calls:**
- `useQuery(['dashboard-stats'])` — calls `GET /api/user/dashboard-stats`
- `useQuery(['wallet-transactions', { limit: 5 }])` — recent transactions
- `useQuery(['team', { limit: 5 }])` — recent team joins
- `useQuery(['income-chart'])` — monthly income data for line chart
**Child Components:** StatCard, IncomeLineChart, IncomeBreakdownChart, DataTable, SkeletonCard

### Activation.jsx — `client/src/pages/dashboard/Activation.jsx`
**Renders:** E-Pin activation form. Shows already-active state if user is active.
**Props:** None
**Local State:** `pin: string`, `loading: boolean`, `error: string`
**Global State:** `user`, `updateUser` from useAuthStore
**API Calls:** `useMutation` calling `epinService.activate(pin)` — POST /api/epin/activate
**Child Components:** None

### EPin.jsx — `client/src/pages/dashboard/EPin.jsx`
**Renders:** Tabbed view: My E-Pins list and Transfer E-Pin form.
**Props:** None
**Local State:** `activeTab: string`, `filter: string`, `transferForm: object`, `loading: boolean`
**Global State:** None
**API Calls:**
- `useQuery(['my-epins', filter])` — GET /api/epin/mine
- `useMutation` calling `epinService.transfer(form)` — POST /api/epin/transfer (invalidates my-epins query)
**Child Components:** DataTable, Tabs, Badge

### TeamNetwork.jsx — `client/src/pages/dashboard/TeamNetwork.jsx`
**Renders:** Team downline with depth selector and paginated member table.
**Props:** None
**Local State:** `level: number (1-9)`, `page: number`
**Global State:** None
**API Calls:** `useQuery(['team', { level, page }])` — GET /api/user/team?level=X&page=Y
**Child Components:** DataTable, Pagination, Badge, StatCard (level summary)

### Referral.jsx — `client/src/pages/dashboard/Referral.jsx`
**Renders:** Referral link display with QR code, copy button, and share buttons.
**Props:** None
**Local State:** `copied: boolean`
**Global State:** `user` from useAuthStore
**API Calls:** `useQuery(['referral-info'])` — GET /api/user/referral-info
**Child Components:** QRCodeCanvas (from qrcode.react)

### Wallet.jsx — `client/src/pages/dashboard/Wallet.jsx`
**Renders:** Wallet balance card, summary stats, transaction history table with filter/pagination, and withdrawal modal.
**Props:** None
**Local State:** `filter: string`, `page: number`, `showModal: boolean`
**Global State:** None
**API Calls:**
- `useQuery(['wallet-balance'])` — GET /api/wallet/balance
- `useQuery(['wallet-summary'])` — GET /api/wallet/summary
- `useQuery(['wallet-transactions', { filter, page }])` — GET /api/wallet/transactions
- `useMutation` calling `withdrawalService.request(amount)` — POST /api/withdrawals/request
**Child Components:** WithdrawalModal, DataTable, Pagination, Badge

### Statement.jsx — `client/src/pages/dashboard/Statement.jsx`
**Renders:** Income statement with date range filter and transaction list.
**Props:** None
**Local State:** `dateFrom: string`, `dateTo: string`, `category: string`, `page: number`
**Global State:** None
**API Calls:** `useQuery(['statement', { dateFrom, dateTo, category, page }])` — GET /api/wallet/transactions with filter params
**Child Components:** DataTable, Pagination

### BankDetails.jsx — `client/src/pages/dashboard/BankDetails.jsx`
**Renders:** Bank details form pre-filled with current user data.
**Props:** None
**Local State:** `form: object` (bank fields), `loading: boolean`
**Global State:** `user`, `updateUser` from useAuthStore
**API Calls:** `useMutation` calling `userService.updateBankDetails(form)` — PUT /api/user/bank-details
**Child Components:** BankDetailsForm

### Profile.jsx — `client/src/pages/dashboard/Profile.jsx`
**Renders:** Personal profile form with photo upload.
**Props:** None
**Local State:** `form: object`, `photoPreview: string|null`, `loading: boolean`
**Global State:** `user`, `updateUser` from useAuthStore
**API Calls:**
- `useMutation` calling `userService.updateProfile(form)` — PUT /api/user/profile
- `useMutation` calling `userService.uploadPhoto(file)` — POST /api/user/upload-photo
**Child Components:** FileUpload, AddressForm

### ChangePassword.jsx — `client/src/pages/dashboard/ChangePassword.jsx`
**Renders:** Change password form.
**Props:** None
**Local State:** `form: { currentPassword, newPassword, confirmPassword }`, `loading: boolean`
**Global State:** None
**API Calls:** `useMutation` calling `userService.changePassword(form)` — PUT /api/user/change-password
**Child Components:** PasswordInput

### SupportTickets.jsx — `client/src/pages/dashboard/SupportTickets.jsx`
**Renders:** Ticket list, create ticket form, and ticket detail thread.
**Props:** None
**Local State:** `selectedTicket: object|null`, `showCreate: boolean`, `newTicket: object`
**Global State:** None
**API Calls:**
- `useQuery(['tickets'])` — GET /api/support/tickets
- `useQuery(['ticket-detail', selectedTicket?.ticketId])` — GET /api/support/tickets/:ticketId
- `useMutation` calling `supportService.createTicket(newTicket)` — POST /api/support/tickets
- `useMutation` calling `supportService.addReply(ticketId, message)` — POST /api/support/tickets/:id/reply
**Child Components:** Modal, Badge, EmptyState

## Admin Page Components

### AdminOverview.jsx — `client/src/pages/admin/AdminOverview.jsx`
**Renders:** Admin dashboard with platform metrics, charts, and quick-view tables.
**Props:** None
**Local State:** None
**Global State:** None
**API Calls:**
- `useQuery(['admin-dashboard-stats'])` — GET /api/admin/dashboard-stats
- `useQuery(['admin-reports-overview'])` — GET /api/admin/reports/overview
**Child Components:** StatCard, IncomeLineChart, PayoutBarChart, DataTable

### UserManagement.jsx — `client/src/pages/admin/UserManagement.jsx`
**Renders:** Searchable, filterable user list with modals for view/edit/block.
**Props:** None
**Local State:** `search: string`, `statusFilter: string`, `page: number`, `selectedUser: object|null`
**Global State:** None
**API Calls:**
- `useQuery(['admin-users', { search, statusFilter, page }])` — GET /api/admin/users
- `useMutation` calling `adminService.blockUser(userId)` — PUT /api/admin/users/:id/block
- `useMutation` calling `adminService.unblockUser(userId)` — PUT /api/admin/users/:id/unblock
**Child Components:** SearchInput, DataTable, UserDetailModal, Pagination, Badge

### EPinManagement.jsx — `client/src/pages/admin/EPinManagement.jsx`
**Renders:** E-Pin generation form, all E-Pins table with filters, assign form.
**Props:** None
**Local State:** `generateForm: { count, notes }`, `filter: string`, `page: number`
**Global State:** None
**API Calls:**
- `useQuery(['admin-epins', { filter, page }])` — GET /api/admin/epin
- `useMutation` calling `adminService.generateEpins(form)` — POST /api/admin/epin/generate
- `useMutation` calling `adminService.assignEpin(pin, rsId)` — POST /api/admin/epin/assign
**Child Components:** DataTable, Modal, Badge

### IncomeManagement.jsx — `client/src/pages/admin/IncomeManagement.jsx`
**Renders:** All income transactions list and manual credit form.
**Props:** None
**Local State:** `filter: { category, from, to }`, `page: number`, `creditForm: object`
**Global State:** None
**API Calls:**
- `useQuery(['admin-income', { filter, page }])` — GET /api/admin/income/transactions
- `useMutation` calling `adminService.manualCredit(creditForm)` — POST /api/admin/income/manual
**Child Components:** DataTable, Modal, Badge, SearchInput

### WithdrawalManagement.jsx — `client/src/pages/admin/WithdrawalManagement.jsx`
**Renders:** Pending withdrawals queue and history, with approve/reject modals.
**Props:** None
**Local State:** `activeTab: string`, `page: number`, `approveModal: object|null`, `rejectModal: object|null`
**Global State:** None
**API Calls:**
- `useQuery(['admin-withdrawals', { status: activeTab, page }])` — GET /api/admin/withdrawals
- `useMutation` calling `adminService.approveWithdrawal(id, form)` — PUT /api/admin/withdrawals/:id/approve
- `useMutation` calling `adminService.rejectWithdrawal(id, reason)` — PUT /api/admin/withdrawals/:id/reject
**Child Components:** ApproveModal, RejectModal, DataTable, Badge, Pagination

### Reports.jsx — `client/src/pages/admin/Reports.jsx`
**Renders:** Analytics charts and downloadable reports.
**Props:** None
**Local State:** `dateRange: { from, to }`, `reportType: string`
**Global State:** None
**API Calls:**
- `useQuery(['admin-reports', dateRange])` — GET /api/admin/reports/overview
- `useQuery(['admin-income-by-level', dateRange])` — GET /api/admin/reports/income-by-level
**Child Components:** IncomeLineChart, PayoutBarChart, IncomeBreakdownChart

### CMSManagement.jsx — `client/src/pages/admin/CMSManagement.jsx`
**Renders:** Tabbed CMS editor for all website content sections.
**Props:** None
**Local State:** `activeSection: string`, `editingContent: object`, `saving: boolean`
**Global State:** None
**API Calls:**
- `useQuery(['cms-all'])` — GET /api/admin/cms
- `useMutation` calling `adminService.updateCms(key, content)` — PUT /api/admin/cms/:key
**Child Components:** Tabs, Card, Button

## Shared UI Components

### Modal.jsx — `client/src/components/ui/Modal.jsx`
**Props:** `isOpen: boolean`, `onClose: function`, `title: string`, `children: ReactNode`, `maxWidth: string`
**Features:** Focus trap, ESC key to close, backdrop click to close, AnimatePresence animation.

### DataTable.jsx — `client/src/components/ui/DataTable.jsx`
**Props:** `columns: array of { key, label, render? }`, `data: array`, `loading: boolean`, `emptyMessage: string`

### Pagination.jsx — `client/src/components/ui/Pagination.jsx`
**Props:** `page: number`, `totalPages: number`, `onPageChange: function`

### StatCard.jsx — `client/src/components/ui/StatCard.jsx`
**Props:** `icon: ReactNode`, `label: string`, `value: string|number`, `trend: string`, `trendUp: boolean`, `color: string`, `loading: boolean`

### Badge.jsx — `client/src/components/ui/Badge.jsx`
**Props:** `variant: 'green'|'red'|'gold'|'blue'|'gray'`, `children: ReactNode`

### SearchInput.jsx — `client/src/components/ui/SearchInput.jsx`
**Props:** `value: string`, `onChange: function`, `placeholder: string`
**Features:** Debounced onChange with 300ms delay via useDebounce hook.

### NotificationBell.jsx — `client/src/components/shared/NotificationBell.jsx`
**Renders:** Bell icon with unread count badge and dropdown list of notifications.
**Props:** None
**Local State:** `isOpen: boolean`
**Global State:** `notifications`, `unreadCount` from uiStore (populated from API)
**API Calls:**
- `useQuery(['notifications', { limit: 10 }])` — GET /api/notifications
- `useMutation` calling `notificationService.markRead(id)` — on notification click

---

# SECTION 9 — STATE MANAGEMENT COMPLETE PLAN

## What Lives in Zustand Global Store

The rule is simple: Zustand stores only persist cross-session state (auth) and ephemeral UI state (sidebar, notifications) that multiple components far apart in the component tree need to share. Business data always lives in React Query.

### Store 1: authStore.js

**File path:** `client/src/store/authStore.js`
**Purpose:** Authentication state persisted to localStorage across browser sessions.

```javascript
// State fields and their types:
user:           object | null      // Full user object from toSafeObject()
token:          string | null      // JWT access token
isAuthenticated: boolean           // True if user and token exist

// Actions:
setAuth(user: object, token: string): void
  // Sets user, token, isAuthenticated=true
  // Called after successful login or token refresh

updateUser(updates: Partial<User>): void
  // Merges partial updates into stored user object
  // Called after profile update, activation, bank details update

logout(): void
  // Sets user=null, token=null, isAuthenticated=false
  // Also calls backend /api/auth/logout

isAdmin(): boolean
  // Derived: returns user?.role === 'admin'

// Persistence config:
name: 'rs_auth'
partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated })
```

### Store 2: uiStore.js

**File path:** `client/src/store/uiStore.js`
**Purpose:** UI state that multiple distant components share.

```javascript
// State fields:
sidebarOpen:        boolean    // Mobile sidebar open state
notifications:      array      // Array of notification objects
unreadCount:        number     // Count of unread notifications

// Actions:
toggleSidebar(): void
setSidebarOpen(open: boolean): void
setNotifications(notifications: array): void
  // Called when notification query resolves
setUnreadCount(count: number): void
decrementUnreadCount(): void
  // Called when a notification is marked as read
```

## What Lives in React Query Server State

React Query manages all data that comes from the backend API. Each query has a unique key, a fetch function, and stale/cache configuration.

### Complete React Query Key Registry

```javascript
// File: client/src/constants/queryKeys.js

export const QUERY_KEYS = {
  // User
  USER_ME:            ['user', 'me'],
  DASHBOARD_STATS:    ['user', 'dashboard-stats'],
  REFERRAL_INFO:      ['user', 'referral-info'],
  TEAM:               (params) => ['user', 'team', params],

  // Wallet
  WALLET_BALANCE:     ['wallet', 'balance'],
  WALLET_SUMMARY:     ['wallet', 'summary'],
  WALLET_TXN:         (params) => ['wallet', 'transactions', params],

  // E-Pin
  MY_EPINS:           (status) => ['epin', 'mine', status],

  // Withdrawals
  MY_WITHDRAWALS:     (params) => ['withdrawals', 'my', params],

  // Support
  TICKETS:            (params) => ['support', 'tickets', params],
  TICKET_DETAIL:      (id) => ['support', 'ticket', id],

  // Notifications
  NOTIFICATIONS:      (params) => ['notifications', params],

  // Admin
  ADMIN_STATS:        ['admin', 'dashboard-stats'],
  ADMIN_REPORTS:      (params) => ['admin', 'reports', params],
  ADMIN_USERS:        (params) => ['admin', 'users', params],
  ADMIN_EPINS:        (params) => ['admin', 'epins', params],
  ADMIN_WITHDRAWALS:  (params) => ['admin', 'withdrawals', params],
  ADMIN_INCOME:       (params) => ['admin', 'income', params],
  CMS:                (key) => ['cms', key],
  CMS_ALL:            ['cms', 'all'],
  SETTINGS:           ['admin', 'settings'],
};
```

### React Query Configuration Per Query Type

```javascript
// App.jsx QueryClient configuration:
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30 * 1000,           // 30 seconds — data considered fresh
      gcTime: 5 * 60 * 1000,          // 5 minutes — how long unused data is kept in cache
      refetchOnWindowFocus: false,     // Don't auto-refetch when user switches tabs
    },
  },
});

// Per-query staleTime overrides:
// wallet-balance: staleTime: 0 — always refetch (financial data must be fresh)
// dashboard-stats: staleTime: 60000 — 1 minute
// team: staleTime: 60000 — 1 minute
// notifications: staleTime: 30000 — 30 seconds, refetchInterval: 30000 — poll every 30s
// admin-withdrawals: staleTime: 0, refetchInterval: 30000 — poll every 30s
```

## What Lives in Local Component useState

The rule: if only ONE component needs the state and it doesn't need to survive unmounting, use useState.

Examples:
- Form field values and their error messages
- Modal open/closed state
- Active tab in a tabbed component
- Pagination page number
- Local filter selections (before sending to query key)
- Loading state for individual form submissions
- Toggle for password show/hide

## Data Flow Diagram

```
Backend MongoDB
      |
      | HTTP (Express routes + controllers)
      |
Express API endpoint
      |
      | Response JSON
      |
Axios API instance (with request/response interceptors)
      |
Service function (authService.js, userService.js, etc.)
      |
React Query useQuery / useMutation
      |
      |---- On success → Component renders data directly
      |
      |---- On mutation success → queryClient.invalidateQueries([key])
      |                         → React Query refetches affected queries
      |
      |---- On auth data → useAuthStore.setAuth() or .updateUser()
      |                  → Zustand stores user+token in memory+localStorage
      |
Component reads:
  - useQuery data for API/server state
  - useAuthStore for user identity
  - useUIStore for sidebar/notifications
  - useState for local form/UI state
```

---

# SECTION 10 — PHASE BY PHASE BUILD PLAN

## Phase 1: Monorepo Setup and Tooling

**Goal:** Configure the complete development environment including linting, formatting, path aliases, environment variables, and verify the existing code runs.

**Estimated Days:** 2

**Tasks:**
1. Verify Node.js >= 20 and npm >= 10 are installed
2. Run `cd client && npm install` to install frontend dependencies
3. Run `cd server && npm install` to install backend dependencies
4. Create `client/.env` from the .env.example template with local values
5. Create `server/.env` from the .env.example template with local MongoDB Atlas URI and JWT secrets
6. Install additional frontend dependencies: `npm install react-hook-form @hookform/resolvers zod qrcode.react`
7. Install additional backend dependencies: `npm install winston uuid zod socket.io @aws-sdk/client-s3 multer-s3 node-cron nodemailer`
8. Install dev dependencies: `npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom`
9. Configure Vitest in vite.config.js
10. Configure ESLint with React hooks rules
11. Add `server/utils/validators.js` with all Zod schemas for request validation
12. Add `server/utils/constants.js` with the income table and level thresholds
13. Add `server/utils/generateId.js` with UUID-based ID generators
14. Verify backend starts: `cd server && npm run dev`
15. Verify frontend starts: `cd client && npm run dev`
16. Verify the health check endpoint: `curl http://localhost:5000/health`

**Files to Create:**
- `client/.env.example`
- `server/.env.example`
- `client/src/constants/queryKeys.js`
- `client/src/constants/routes.js`
- `server/utils/validators.js`
- `server/utils/constants.js`
- `server/utils/generateId.js`
- `.github/workflows/frontend.yml`
- `.github/workflows/backend.yml`

## Phase 2: Database Design and Backend Foundation

**Goal:** Implement all missing Mongoose models, add production logging, fix the logger, and add request validation middleware.

**Estimated Days:** 3

**Tasks:**
1. Replace `server/utils/logger.js` with Winston configuration
2. Create `server/models/Counter.js` with the auto-increment counter schema
3. Create `server/models/SupportTicket.js` with full schema
4. Create `server/models/SupportMessage.js` with full schema
5. Create `server/models/Notification.js` with full schema
6. Create `server/models/CmsContent.js` with full schema
7. Create `server/models/SystemSetting.js` with full schema
8. Create `server/models/AdminLog.js` with full schema
9. Update `server/models/User.js` to add lastLoginAt, emailVerified, emailVerificationToken fields
10. Update `server/models/Withdrawal.js` to add tdsAmount, netAmount, adminNotes, branchName fields
11. Update `server/models/Transaction.js` to add ipAddress field and index on category
12. Seed the Counter collection with `{ _id: "rsId", seq: 1000 }`
13. Seed SystemSetting collection with all income and threshold values
14. Create `server/middleware/rateLimiter.js` with auth-specific and general rate limiters
15. Create `server/middleware/validate.js` with Zod validation middleware factory
16. Create `server/middleware/requestId.js`
17. Apply rate limiters in server.js
18. Update `server/middleware/errorHandler.js` to use Winston and generate error IDs
19. Write seed script for admin user creation

**Files to Create:**
- `server/models/SupportTicket.js`
- `server/models/SupportMessage.js`
- `server/models/Notification.js`
- `server/models/CmsContent.js`
- `server/models/SystemSetting.js`
- `server/models/AdminLog.js`
- `server/models/Counter.js`
- `server/middleware/rateLimiter.js`
- `server/middleware/validate.js`
- `server/middleware/requestId.js`
- `server/scripts/seed.js`

## Phase 3: Authentication System Frontend and Backend

**Goal:** Connect the Login, Register, and ForgotPassword pages to the real backend. Implement token refresh. Fix all auth security issues.

**Estimated Days:** 4

**Tasks:**
1. Update `authController.js` to use Counter for RS ID generation
2. Update `authController.js` to set httpOnly refresh token cookie
3. Update `authController.js` to clear cookie on logout
4. Update `authController.js` to hash OTP correctly and remove console.log
5. Add Zod validation to all auth endpoints via validate middleware
6. Apply rate limiters to `/login` and `/forgot-password` routes
7. Update `authStore.js` to remove manual localStorage.setItem for token
8. Update `api.js` with the full token refresh interceptor implementation
9. Update `Login.jsx` to call `authService.login()` and remove mock data
10. Update `Register.jsx` to call `authService.validateSponsor()` and `authService.register()`
11. Update `Register.jsx` to read `?ref=` query param for sponsor ID pre-fill
12. Update `ForgotPassword.jsx` to call real API endpoints with OTP countdown timer
13. Create `client/src/services/authService.js` with all auth API functions
14. Update `client/src/utils/tokenUtils.js` with JWT decode and expiry check
15. Update `PrivateRoute` in App.jsx with token expiry checking
16. Update `DashboardLayout.jsx` logout to call backend logout
17. Create `AdminLogin.jsx` to call the same login API with role check
18. Test the complete login, refresh, logout cycle manually

**Files to Create:**
- `client/src/services/authService.js`
- `client/src/utils/tokenUtils.js`

**Files to Modify:**
- `server/controllers/authController.js`
- `server/routes/authRoutes.js`
- `client/src/services/api.js`
- `client/src/store/authStore.js`
- `client/src/pages/auth/Login.jsx`
- `client/src/pages/auth/Register.jsx`
- `client/src/pages/auth/ForgotPassword.jsx`
- `client/src/App.jsx`
- `client/src/components/layout/DashboardLayout.jsx`

## Phase 4: Public Website Pages

**Goal:** Complete all public-facing pages with proper CMS integration and SEO.

**Estimated Days:** 3

**Tasks:**
1. Create `/api/cms/:key` GET endpoint (public) in a new cmsRoutes.js
2. Create CmsContent seed data for all page sections
3. Update each public page to fetch CMS data with static fallback
4. Create `client/src/pages/public/Privacy.jsx` page
5. Create `client/src/pages/public/Terms.jsx` page
6. Create `client/src/pages/public/RefundPolicy.jsx` page
7. Add routes for /privacy, /terms, /refund-policy in App.jsx
8. Fix Footer.jsx links for Privacy, Terms, Refund Policy, and FAQ anchor
9. Fix Navbar.jsx to use `@/assets/images/logo.png` import path
10. Add `id="faq"` to FAQSection.jsx container
11. Add PageMeta.jsx component for setting document.title and meta description per page
12. Add PageMeta usage to all public page components
13. Update ContactFormSection.jsx to submit to a real `/api/contact` endpoint
14. Review and verify all 18 section components render correctly
15. Test mobile responsiveness on all public pages at 375px, 768px, and 1280px widths

**Files to Create:**
- `client/src/pages/public/Privacy.jsx`
- `client/src/pages/public/Terms.jsx`
- `client/src/pages/public/RefundPolicy.jsx`
- `client/src/components/shared/PageMeta.jsx`
- `server/routes/cmsRoutes.js`
- `server/controllers/adminCmsController.js`

## Phase 5: User Dashboard Core

**Goal:** Connect Overview, Profile, BankDetails, and ChangePassword pages to real APIs. Create all shared UI components.

**Estimated Days:** 5

**Tasks:**
1. Create all shared UI components: Button.jsx, Input.jsx, Select.jsx, Textarea.jsx, Badge.jsx, Card.jsx, Modal.jsx, Tabs.jsx, Pagination.jsx, SearchInput.jsx, StatCard.jsx, DataTable.jsx, LoadingSpinner.jsx, SkeletonCard.jsx, SkeletonTable.jsx, EmptyState.jsx
2. Create all custom hooks: useDebounce.js, useCopyToClipboard.js, useWindowSize.js
3. Create `client/src/services/userService.js`
4. Fix userRoutes.js: extract business logic to userController.js, fix N+1 team query, fix dashboard-stats total team count, add referral-info endpoint, add Zod validation
5. Connect Overview.jsx to real API using useQuery
6. Connect Profile.jsx to real API using useMutation
7. Connect BankDetails.jsx to real API using useMutation
8. Connect ChangePassword.jsx to real API using useMutation
9. Add skeleton loading states to all connected pages
10. Add error states to all connected pages
11. Implement `updateUser()` store action calls after successful profile/bank updates
12. Test each page end-to-end with real API data

**Files to Create:**
- All shared UI component files
- All custom hook files
- `client/src/services/userService.js`
- `server/controllers/userController.js`

## Phase 6: E-Pin System

**Goal:** Complete the E-Pin activation flow and E-Pin management page end-to-end.

**Estimated Days:** 3

**Tasks:**
1. Fix `ePinRoutes.js` uniqueness check from loading all pins to per-pin individual DB check
2. Add `assignedTo === user._id` check in the activation route
3. Add recipient active check in transfer route
4. Fix the status enum to include "assigned" status
5. Create `server/controllers/epinController.js` and move logic there
6. Create `client/src/services/epinService.js`
7. Connect `Activation.jsx` to real `/api/epin/activate` API
8. Call `updateUser({ isActive: true, activationDate: new Date() })` on activation success
9. Connect `EPin.jsx` My E-Pins tab to `/api/epin/mine`
10. Connect `EPin.jsx` Transfer form to `/api/epin/transfer`
11. Invalidate the my-epins query on successful transfer
12. Add notification creation after activation (for team join notification to sponsor)
13. Test full activation flow: admin generates pin → assigns to user → user activates → sponsor receives income

**Files to Create:**
- `client/src/services/epinService.js`
- `server/controllers/epinController.js`

## Phase 7: Team Network and Referral System

**Goal:** Build the team network tree visualization and referral sharing features.

**Estimated Days:** 3

**Tasks:**
1. Fix the N+1 query in `/api/user/team` using a proper aggregation pipeline
2. Add team count by level endpoint `/api/user/team/stats`
3. Create `/api/user/referral-info` endpoint
4. Connect `TeamNetwork.jsx` to real API with level selector and pagination
5. Build a simple visual tree component showing direct referrals (depth 1) as a card tree
6. Connect `Referral.jsx` to real referral-info API
7. Add `qrcode.react` for QR code generation
8. Add Web Share API button for mobile sharing
9. Add WhatsApp share deep link button
10. Add copy-to-clipboard for the referral link
11. Install qrcode.react: `npm install qrcode.react`

**Files to Create:**
- `client/src/hooks/useInfiniteTeam.js`
- `client/src/services/userService.js` (additions)

## Phase 8: Wallet and Withdrawal System

**Goal:** Complete the wallet page and withdrawal flow end-to-end.

**Estimated Days:** 3

**Tasks:**
1. Fix the race condition in withdrawal request using atomic findOneAndUpdate
2. Add bank details completeness validation before allowing withdrawal
3. Add maximum withdrawal limit from SystemSetting
4. Create `/api/wallet/summary` endpoint
5. Add `netAmount` calculation in the withdrawal model
6. Create `client/src/services/walletService.js`
7. Create `client/src/services/withdrawalService.js`
8. Connect `Wallet.jsx` to real balance, summary, and transaction APIs
9. Connect the withdrawal modal to the real `/api/withdrawals/request` API
10. Create `Withdrawals.jsx` page for dedicated withdrawal history view
11. Connect `Statement.jsx` to real transaction API with date filter
12. Add the Withdrawals.jsx route in App.jsx at `/dashboard/withdrawals`

**Files to Create:**
- `client/src/services/walletService.js`
- `client/src/services/withdrawalService.js`
- `client/src/pages/dashboard/Withdrawals.jsx`

## Phase 9: Income and Statement System

**Goal:** Sync income amounts between frontend and backend, ensure income engine accuracy.

**Estimated Days:** 2

**Tasks:**
1. Move income amounts from hardcoded constants in incomeEngine.js to read from SystemSetting collection
2. Sync planData.js LEVEL_DATA payout amounts to match the backend
3. Replace random transaction IDs with UUID v4
4. Add income notification creation for each credited income
5. Test the full income distribution by creating a test user, activating them, and verifying income credits up the chain
6. Connect Statement.jsx to the real transaction API
7. Add income category filter to the statement page
8. Add PDF export for income statement using pdfService.js

**Files to Create:**
- `server/services/pdfService.js`

## Phase 10: Support Ticket System

**Goal:** Build the complete support ticket system backend and connect the frontend.

**Estimated Days:** 3

**Tasks:**
1. Create `server/routes/supportRoutes.js` with all member ticket routes
2. Create `server/controllers/supportController.js` with all handler functions
3. Create admin support routes in adminRoutes.js for listing all tickets and replying
4. Create `server/controllers/admin/adminSupportController.js`
5. Send email notification to admin when a new ticket is created
6. Send email notification to member when admin replies
7. Create `client/src/services/supportService.js`
8. Connect `SupportTickets.jsx` to all real API endpoints
9. Implement the ticket thread view with sender identification (member vs admin)
10. Add status badge updates on ticket status changes

**Files to Create:**
- `server/routes/supportRoutes.js`
- `server/controllers/supportController.js`
- `server/controllers/admin/adminSupportController.js`
- `client/src/services/supportService.js`

## Phase 11: Admin Panel Complete

**Goal:** Connect all admin pages to real APIs. Implement admin action logging.

**Estimated Days:** 5

**Tasks:**
1. Create `server/controllers/admin/adminUserController.js`
2. Create `server/controllers/admin/adminEpinController.js`
3. Create `server/controllers/admin/adminIncomeController.js`
4. Create `server/controllers/admin/adminWithdrawalController.js`
5. Create `server/controllers/admin/adminReportController.js`
6. Create `server/controllers/admin/adminSettingController.js`
7. Refactor adminRoutes.js to use controller functions
8. Add AdminLog creation to all admin mutation operations
9. Fix regex injection in user search by using proper escaping: `search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`
10. Create `client/src/services/adminService.js`
11. Connect AdminOverview.jsx to real APIs
12. Connect UserManagement.jsx to real APIs with search and filter
13. Connect EPinManagement.jsx to real APIs with E-Pin generation and assign
14. Connect IncomeManagement.jsx to real APIs
15. Connect WithdrawalManagement.jsx to real APIs with React Query mutations
16. Connect Reports.jsx to real analytics APIs
17. Connect CMSManagement.jsx to real CMS APIs
18. Create AdminSettings.jsx page and connect to settings APIs
19. Add admin action log viewer to AdminSettings or a new AdminLogs.jsx page
20. Test the complete admin workflow: generate pins → assign → user activates → income distributes → admin approves withdrawal

**Files to Create:**
- `server/controllers/admin/adminUserController.js`
- `server/controllers/admin/adminEpinController.js`
- `server/controllers/admin/adminIncomeController.js`
- `server/controllers/admin/adminWithdrawalController.js`
- `server/controllers/admin/adminReportController.js`
- `server/controllers/admin/adminSettingController.js`
- `client/src/services/adminService.js`
- `client/src/pages/admin/AdminSettings.jsx`

## Phase 12: Notifications and Real-Time Features

**Goal:** Implement Socket.IO for real-time notifications and connect the notification bell.

**Estimated Days:** 3

**Tasks:**
1. Add Socket.IO to server.js: `const httpServer = require('http').createServer(app); const io = require('socket.io')(httpServer, { cors: { origin: process.env.FRONTEND_URL } });`
2. Create `server/services/socketService.js` with `sendNotificationToUser(userId, notification)` function
3. Add Socket.IO client to the frontend: `npm install socket.io-client`
4. Create `client/src/services/socketClient.js` that connects to the backend Socket.IO server after login
5. Initialize socket connection in DashboardLayout.jsx on mount
6. Call `socketService.sendNotificationToUser()` after:
   - Income is credited (in incomeEngine.js)
   - Withdrawal is approved (in adminWithdrawalController.js)
   - Withdrawal is rejected
   - E-Pin is transferred to someone
   - Support ticket receives a reply
7. Update uiStore to handle incoming socket notifications
8. Connect the NotificationBell component to the notifications query and socket stream
9. Create `server/routes/notificationRoutes.js` and `server/controllers/notificationController.js`
10. Create `client/src/services/notificationService.js`
11. Test real-time notification delivery end-to-end

**Files to Create:**
- `server/services/socketService.js`
- `client/src/services/socketClient.js`
- `server/routes/notificationRoutes.js`
- `server/controllers/notificationController.js`
- `client/src/services/notificationService.js`
- `client/src/components/shared/NotificationBell.jsx`

## Phase 13: Third-Party Integrations

**Goal:** Integrate real email, SMS, and file storage services.

**Estimated Days:** 4

**Tasks:**
1. Create `server/services/emailService.js` with Nodemailer and email templates
2. Create email templates for: registration welcome, OTP, withdrawal approved, withdrawal rejected, support ticket reply
3. Register with MSG91 or Twilio and get API credentials for SMS
4. Create `server/services/smsService.js` with OTP sending function
5. Update authController forgotPassword to send real SMS/email OTP
6. Create an AWS S3 bucket in ap-south-1 region
7. Create `server/services/s3Service.js` with upload and get signed URL functions
8. Create `server/middleware/upload.js` with Multer S3 configuration
9. Add the profile photo upload endpoint `/api/user/upload-photo`
10. Connect Profile.jsx FileUpload component to the S3 upload endpoint

## Phase 14: Testing

**Goal:** Write comprehensive tests for all critical paths.

**Estimated Days:** 5

**Tasks:**
1. Configure Jest for backend: `npm install -D jest supertest @jest/globals`
2. Write backend unit tests for: incomeEngine.processActivationIncome, authController.register, authController.login, withdrawalRoutes race condition prevention
3. Write backend integration tests using Supertest for: POST /api/auth/register, POST /api/auth/login, POST /api/epin/activate (full income distribution), POST /api/withdrawals/request
4. Configure Vitest and React Testing Library for frontend
5. Write component tests for: Login form submission, Register wizard step navigation, Wallet withdrawal modal amount validation, StatCard renders value correctly
6. Write E2E tests with Playwright for: Complete registration flow, Login and navigate to dashboard, Activate account with E-Pin, Request withdrawal
7. Set minimum 70% code coverage target for backend services and controllers
8. Configure GitHub Actions to run all tests on every PR

## Phase 15: Performance Optimization

**Goal:** Achieve Lighthouse scores of 90+ for Performance, Accessibility, and SEO.

**Estimated Days:** 3

**Tasks:**
1. Add React.lazy() and Suspense to all route components in App.jsx
2. Add bundle analysis: `npm install -D rollup-plugin-visualizer`
3. Add manual chunks in vite.config.js to separate recharts, framer-motion, and vendor
4. Add image lazy loading to all section images
5. Compress the logo.png to WebP format
6. Add Redis for server-side caching: `npm install redis`
7. Cache dashboard-stats for 60 seconds per user in Redis
8. Cache admin-dashboard-stats for 30 seconds in Redis
9. Fix the N+1 team query using a recursive MongoDB aggregation
10. Add `$lookup` pipeline optimization to avoid multiple round-trips in withdrawal list
11. Run Lighthouse and fix all issues until scores are above 90

## Phase 16: Deployment and Go Live

**Goal:** Deploy frontend to Vercel, backend to Railway, configure custom domain and SSL.

**Estimated Days:** 3

**Tasks:**
1. Set all production environment variables in Vercel dashboard for the frontend
2. Set all production environment variables in Railway for the backend
3. Configure the custom domain `rstradingonline.co.in` in Vercel
4. Configure CORS in server.js to allow the production frontend domain
5. Enable MongoDB Atlas IP whitelist for the Railway deployment IP
6. Run all database migrations/seeds against production MongoDB
7. Set up Sentry DSN in both frontend and backend
8. Configure uptime monitoring (UptimeRobot or Better Uptime) for the health check endpoint
9. Enable GitHub Actions automated deployment on push to main
10. Test the complete production deployment with a real user registration and activation

---

# SECTION 11 — THIRD-PARTY INTEGRATIONS COMPLETE GUIDE

## 1. Email Service — Nodemailer + Gmail (dev) / AWS SES (production)

**Used for:** Registration welcome email, OTP delivery for password reset, withdrawal approval/rejection notification, support ticket reply notification.

**Create account:**
- Development: Use a Gmail account. Enable 2FA, then create an App Password at https://myaccount.google.com/apppasswords. Use the 16-character app password as EMAIL_PASS.
- Production: Create an AWS account at https://aws.amazon.com. Navigate to SES → Create identity → Verify your domain. Request production access (move out of sandbox). Get SMTP credentials.

**Environment variables needed:**
```
EMAIL_HOST=smtp.gmail.com  (dev) or email-smtp.ap-south-1.amazonaws.com (prod)
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com  (dev) or AKIAIOSFODNN7EXAMPLE (prod)
EMAIL_PASS=your_app_password  (dev) or the SMTP secret (prod)
EMAIL_FROM="RS Trading <noreply@rstradingonline.co.in>"
```

**Backend integration:**
```javascript
// server/services/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

exports.sendOTP = async (toEmail, toName, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: 'Your RS Trading OTP',
    html: `<p>Dear ${toName},</p><p>Your OTP is: <strong>${otp}</strong></p><p>This OTP is valid for 10 minutes.</p>`,
  });
};

exports.sendWelcome = async (toEmail, toName, rsId) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: 'Welcome to RS Trading!',
    html: `<p>Dear ${toName},</p><p>Welcome! Your RS Trading ID is: <strong>${rsId}</strong></p>`,
  });
};
```

**Common mistakes to avoid:**
- Do not use Gmail SMTP in production — it has rate limits and is not reliable. Use AWS SES.
- Always wrap email sends in try-catch — if email fails, the main operation (registration, etc.) should not fail.

**Cost:** AWS SES costs $0.10 per 1,000 emails in production.

---

## 2. SMS and OTP Service — MSG91

**Used for:** OTP delivery for password reset to Indian mobile numbers, welcome SMS after registration.

**Create account:** Go to https://msg91.com. Register, complete KYC, and create a DLT (Distributed Ledger Technology) template for OTP SMS as required by TRAI regulations in India.

**Environment variables:**
```
MSG91_AUTH_KEY=your_auth_key_here
MSG91_SENDER_ID=RSTRDG
MSG91_OTP_TEMPLATE_ID=your_dlt_template_id
```

**Backend integration:**
```javascript
// server/services/smsService.js
const axios = require('axios');

exports.sendOTP = async (mobileNumber, otp) => {
  const response = await axios.post('https://control.msg91.com/api/v5/otp', {
    template_id: process.env.MSG91_OTP_TEMPLATE_ID,
    mobile: `91${mobileNumber}`,  // India country code
    otp: otp,
    authkey: process.env.MSG91_AUTH_KEY,
    otp_expiry: 10,  // minutes
  }, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};
```

**Cost:** Approximately ₹0.15 to ₹0.30 per SMS for transactional OTPs.

**Important:** DLT registration can take 3-7 business days. Start this process early in Phase 13.

---

## 3. File Storage — AWS S3

**Used for:** Profile photo uploads, KYC document uploads.

**Create account:** Create an AWS account. Go to S3 → Create bucket named `rstrading-assets` in region `ap-south-1`. Disable public access block. Create an IAM user with `AmazonS3FullAccess` policy. Download the access key and secret key.

**Environment variables:**
```
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=ap-south-1
AWS_S3_BUCKET=rstrading-assets
```

**Backend integration:**
```javascript
// server/services/s3Service.js
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.uploadFile = async (file, prefix = 'general') => {
  const key = `${prefix}/${uuidv4()}-${file.originalname}`;
  await s3.send(new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  }));
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};
```

**Cost:** S3 costs approximately $0.023 per GB stored + $0.09 per GB transferred.

---

## 4. Error Monitoring — Sentry

**Used for:** Capturing unhandled JavaScript errors on the frontend, Express errors on the backend, performance monitoring.

**Create account:** Go to https://sentry.io. Create a new organization. Create two projects: one for React (platform: react) and one for Node.js (platform: node-express).

**Environment variables:**
```
# Frontend
VITE_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0

# Backend
SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
```

**Frontend integration:**
```javascript
// client/src/main.jsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 0.1,
  environment: import.meta.env.MODE,
  enabled: import.meta.env.PROD,
});
```

**Backend integration:**
```javascript
// server/server.js — before all routes
const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 0.1 });
app.use(Sentry.requestHandler());
// ... routes ...
app.use(Sentry.errorHandler());  // Before your custom errorHandler
```

**Cost:** Free tier includes 5,000 errors per month. Paid plans from $26/month.

---

## 5. Real-Time Notifications — Socket.IO

**Used for:** Push notifications to member dashboard when income is credited, withdrawal status changes, team member joins.

**Environment variables:**
```
# No separate service — Socket.IO runs on the same Express server
# Frontend URL needed for CORS:
VITE_SOCKET_URL=http://localhost:5000
```

**Backend setup:**
```javascript
// server/server.js
const http = require('http');
const { Server } = require('socket.io');

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_URL, credentials: true },
});

// Map userId to socket ID for sending targeted notifications
const userSockets = new Map();

io.on('connection', (socket) => {
  socket.on('authenticate', (userId) => {
    userSockets.set(userId.toString(), socket.id);
  });
  socket.on('disconnect', () => {
    for (const [uid, sid] of userSockets.entries()) {
      if (sid === socket.id) { userSockets.delete(uid); break; }
    }
  });
});

// Export for use in controllers
module.exports = { app, httpServer, io, userSockets };

// Start server using httpServer not app
httpServer.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
```

**Frontend setup:**
```javascript
// client/src/services/socketClient.js
import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (userId) => {
  socket = io(import.meta.env.VITE_SOCKET_URL, { withCredentials: true });
  socket.emit('authenticate', userId);
  return socket;
};

export const onNotification = (callback) => {
  socket?.on('notification', callback);
};

export const disconnectSocket = () => {
  socket?.disconnect();
};
```

---

## 6. Analytics — Google Analytics 4

**Used for:** Tracking public page visits, registration funnel, and user engagement metrics.

**Environment variables:**
```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Frontend integration:**
```javascript
// client/index.html — in <head>:
<script async src="https://www.googletagmanager.com/gtag/js?id=%VITE_GA_MEASUREMENT_ID%"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '%VITE_GA_MEASUREMENT_ID%');
</script>
```

**Cost:** Free.

---

## 7. Logging Service — Winston + Logtail (Better Stack)

**Used for:** Centralized structured log aggregation from the backend server.

**Environment variables:**
```
LOGTAIL_SOURCE_TOKEN=your_source_token_here
NODE_ENV=production
```

**Backend setup:**
```javascript
// server/utils/logger.js
const winston = require('winston');
const { Logtail } = require('@logtail/node');
const { LogtailTransport } = require('@logtail/winston');

const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({ format: winston.format.colorize({ all: true }) }),
    ...(process.env.NODE_ENV === 'production' ? [new LogtailTransport(logtail)] : []),
  ],
});

module.exports = logger;
```

**Cost:** Logtail free tier includes 1GB/month.

---

# SECTION 12 — COMPLETE ENVIRONMENT VARIABLES

## Frontend Environment Variables

| Variable | What it does | Where to get it | Required | Example |
|---|---|---|---|---|
| VITE_API_URL | Base URL of the backend API | Your Railway/Render backend URL | Required | http://localhost:5000 |
| VITE_APP_NAME | Application display name | Hardcode | Required | RS Trading |
| VITE_SITE_URL | Frontend site URL for referral links | Your Vercel domain | Required | https://rstradingonline.co.in |
| VITE_SENTRY_DSN | Sentry error tracking DSN | Sentry dashboard | Optional | https://key@o0.ingest.sentry.io/0 |
| VITE_GA_MEASUREMENT_ID | Google Analytics measurement ID | Google Analytics | Optional | G-XXXXXXXXXX |
| VITE_SOCKET_URL | Socket.IO backend URL for WebSocket | Same as VITE_API_URL | Required | http://localhost:5000 |

### client/.env.example

```
# RS Trading Frontend Environment Variables
# Copy this file to .env and fill in your values

# Backend API URL (no trailing slash)
VITE_API_URL=http://localhost:5000

# Application name shown in UI
VITE_APP_NAME=RS Trading

# Frontend site URL used to generate referral links
VITE_SITE_URL=http://localhost:3000

# Sentry DSN for error tracking (optional in development)
VITE_SENTRY_DSN=

# Google Analytics Measurement ID (optional)
VITE_GA_MEASUREMENT_ID=

# Socket.IO backend URL (same as API URL)
VITE_SOCKET_URL=http://localhost:5000
```

## Backend Environment Variables

| Variable | What it does | Where to get it | Required | Example |
|---|---|---|---|---|
| PORT | Port the Express server listens on | Choose any | Required | 5000 |
| NODE_ENV | Environment name | Set manually | Required | development |
| MONGO_URI | MongoDB Atlas connection string | Atlas dashboard | Required | mongodb+srv://user:pass@cluster.mongodb.net/rstrading |
| JWT_SECRET | Secret for signing access tokens | Generate random 64-char string | Required | 64_char_random_hex_string |
| JWT_REFRESH_SECRET | Secret for signing refresh tokens | Generate random 64-char string | Required | different_64_char_random_hex |
| FRONTEND_URL | Allowed CORS origin | Your frontend URL | Required | http://localhost:3000 |
| EMAIL_HOST | SMTP server hostname | Email provider | Required | smtp.gmail.com |
| EMAIL_PORT | SMTP port | Email provider | Required | 587 |
| EMAIL_USER | SMTP username | Email provider account | Required | your_email@gmail.com |
| EMAIL_PASS | SMTP password or app password | Email provider | Required | 16_char_app_password |
| EMAIL_FROM | From address for outgoing emails | Choose | Required | RS Trading <noreply@rstradingonline.co.in> |
| MSG91_AUTH_KEY | MSG91 authentication key | MSG91 dashboard | Required | your_auth_key |
| MSG91_SENDER_ID | DLT registered sender ID | MSG91 DLT registration | Required | RSTRDG |
| MSG91_OTP_TEMPLATE_ID | DLT OTP template ID | MSG91 dashboard | Required | template_id |
| AWS_ACCESS_KEY_ID | AWS IAM user access key | AWS IAM console | Optional | AKIAIOSFODNN7EXAMPLE |
| AWS_SECRET_ACCESS_KEY | AWS IAM user secret key | AWS IAM console | Optional | secret |
| AWS_REGION | AWS region for S3 bucket | Choose | Optional | ap-south-1 |
| AWS_S3_BUCKET | S3 bucket name | AWS S3 console | Optional | rstrading-assets |
| SENTRY_DSN | Sentry backend DSN | Sentry dashboard | Optional | https://key@o0.ingest.sentry.io/0 |
| LOGTAIL_SOURCE_TOKEN | Better Stack logging token | Logtail dashboard | Optional | your_token |
| ADMIN_SECRET_KEY | Secret used when creating first admin user | Generate random | Required | random_secret |

### server/.env.example

```
# RS Trading Backend Environment Variables
# Copy this file to .env and fill in your values

# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/rstrading?retryWrites=true&w=majority

# JWT Secrets (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=replace_with_64_char_hex_string
JWT_REFRESH_SECRET=replace_with_different_64_char_hex_string

# CORS
FRONTEND_URL=http://localhost:3000

# Email (Gmail for development, AWS SES for production)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password
EMAIL_FROM=RS Trading <noreply@rstradingonline.co.in>

# SMS - MSG91 (required for OTP delivery)
MSG91_AUTH_KEY=your_msg91_auth_key
MSG91_SENDER_ID=RSTRDG
MSG91_OTP_TEMPLATE_ID=your_dlt_template_id

# AWS S3 (for profile photos and document uploads)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=rstrading-assets

# Error Monitoring (Sentry)
SENTRY_DSN=

# Logging (Better Stack Logtail)
LOGTAIL_SOURCE_TOKEN=

# Admin Creation Secret (used only during seeding)
ADMIN_SECRET_KEY=your_admin_secret_key_here
```

---

# SECTION 13 — COMPLETE SECURITY IMPLEMENTATION

## 1. Input Validation on Every API Endpoint Using Zod

**Protects against:** SQL injection equivalent (NoSQL injection), malformed data, unexpected field types.

**Implementation:**
```javascript
// server/middleware/validate.js
const { z } = require('zod');

exports.validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map(i => i.message).join(', ');
    return res.status(400).json({ success: false, message: errors });
  }
  req.body = result.data;  // Replace with validated/sanitized data
  next();
};

// server/utils/validators.js — example schemas
const { z } = require('zod');

exports.registerSchema = z.object({
  sponsorRsId:      z.string().min(4).max(10).toUpperCase(),
  fullName:         z.string().min(2).max(100).trim(),
  mobile:           z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),
  email:            z.string().email().toLowerCase(),
  password:         z.string().min(8).max(128),
  dob:              z.string().optional(),
  nomineeName:      z.string().max(100).optional(),
  nomineeRelation:  z.enum(['Spouse', 'Parent', 'Sibling', 'Child', 'Other']).optional(),
  address:          z.string().max(500).optional(),
  district:         z.string().max(100).optional(),
  taluka:           z.string().max(100).optional(),
  bankName:         z.string().max(100).optional(),
  accountHolder:    z.string().max(100).optional(),
  accountNumber:    z.string().regex(/^\d{8,18}$/).optional(),
  branchName:       z.string().max(100).optional(),
  ifscCode:         z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/).optional(),
  panCard:          z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/).optional(),
});
```

**Where it goes:** Applied to every POST and PUT route via the validate middleware.

## 2. Output Sanitization

**Protects against:** Leaking sensitive data in API responses.

**Implementation:** All User queries use `.select('-passwordHash -refreshToken -otp -otpExpiry')` projection. The `toSafeObject()` method is used on full user documents. Account numbers are masked in all API responses: show only last 4 digits as `****8921`.

**Where it goes:** In all API response serialization.

## 3. SQL Injection Prevention (NoSQL Injection)

**Protects against:** MongoDB operator injection via request fields like `{ "$gt": "" }`.

**Implementation:**
```javascript
// Add to server.js after body parser
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());  // Removes $ and . from request objects
```
Install: `npm install express-mongo-sanitize`

## 4. XSS Prevention on Frontend

**Protects against:** Stored XSS where malicious HTML is stored in the DB and rendered to other users.

**Implementation:** React JSX is XSS-safe by default — it escapes all output. Never use `dangerouslySetInnerHTML` with user-controlled content. For CMS content that contains HTML, use DOMPurify:
```javascript
import DOMPurify from 'dompurify';
// Only when rendering CMS HTML:
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(cmsContent) }} />
```

## 5. XSS Prevention on Backend

**Protects against:** Stored XSS payloads in free-text fields.

**Implementation:**
```javascript
const xss = require('xss');
// In validate middleware, sanitize all string fields:
const sanitizeString = (str) => xss(str, { whiteList: {}, stripIgnoreTag: true });
```
Apply to description, notes, message, and other free-text fields.

## 6. CSRF Protection

**Protects against:** Cross-site request forgery attacks.

**Implementation:** Since the frontend and backend are on different domains (Vercel vs Railway), the `withCredentials: true` + CORS `origin` restriction provides CSRF protection for cookie-based auth. For additional protection, use the SameSite=Lax attribute on the refresh token cookie (already implemented). For APIs that use only the Bearer token (access token from Authorization header), CSRF is not a concern since browser CORS prevents cross-origin reads of the Bearer token.

## 7. Rate Limiting

**Protects against:** Brute force attacks, denial of service, OTP enumeration.

**Implementation:**
```javascript
// server/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,                    // 10 login attempts per 15 minutes per IP
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

exports.forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 3,                     // 3 OTP requests per hour per IP
  message: { success: false, message: 'Too many OTP requests. Try again in 1 hour.' },
});

exports.generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests. Please slow down.' },
});
```

**Where it goes:**
```javascript
// server/routes/authRoutes.js
const { authLimiter, forgotPasswordLimiter } = require('../middleware/rateLimiter');
router.post('/login', authLimiter, authController.login);
router.post('/forgot-password', forgotPasswordLimiter, authController.forgotPassword);

// server/server.js
const { generalLimiter } = require('./middleware/rateLimiter');
app.use('/api', generalLimiter);
```

## 8. HTTP Security Headers Using Helmet

**Protects against:** Clickjacking, MIME sniffing, information disclosure.

**Implementation:** Helmet is already applied. Enhance it:
```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://www.googletagmanager.com"],
      imgSrc: ["'self'", "data:", "https://*.amazonaws.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://api.fontshare.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
```

## 9. CORS Configuration

**Protects against:** Unauthorized cross-origin API access.

**Implementation (already in server.js, enhance):**
```javascript
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://www.rstradingonline.co.in',
  'https://rstradingonline.co.in',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

## 10. JWT Secret Rotation Strategy

**Protects against:** Compromise of JWT secrets.

**Implementation:**
- Store JWT secrets as randomly generated 64-character hex strings.
- Generate new secrets: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- Use environment variable management system (Railway, Vercel, AWS Secrets Manager) — never commit secrets to git.
- Rotate secrets by: (1) generating new secrets, (2) updating env vars, (3) restarting the server — all existing tokens will be invalidated, users will be auto-refreshed by the interceptor, then logged out.

## 11. Refresh Token Rotation and Reuse Detection

**Already implemented** in authController.js. Each time a refresh is successful, a new refresh token is issued and the old one is invalidated in the database. If an old token is presented (reuse detection), the stored token won't match and a 401 is returned.

**Enhancement: Token family invalidation**
If reuse is detected, invalidate ALL tokens for that user by setting `refreshToken = null` and requiring a full re-login. This prevents refresh token theft from being exploited.

## 12. Password Hashing Using bcrypt

**Already implemented** in User.js pre-save hook with salt rounds 12. Do not reduce the salt rounds — 12 is the correct value balancing security and performance.

## 13. E-Pin Fraud Prevention

**Rules to implement:**
1. An E-Pin can only be assigned to one user at a time.
2. An E-Pin can only be activated by the user it's currently assigned to.
3. An activated account cannot be reactivated.
4. Transfer is blocked if recipient's account is already active.
5. Self-transfer is blocked (cannot transfer to your own account).
6. Log every E-Pin state change in AdminLog with IP address.

## 14. Referral Abuse Prevention

**Rules to implement:**
1. A user cannot be their own sponsor.
2. Sponsor must have registered before the new member (enforced by valid rsId existence check).
3. Rate limit registration per IP to prevent mass account creation.
4. Require unique mobile number and email per account.

## 15. Withdrawal Fraud Prevention

**Rules to implement:**
1. Minimum withdrawal amount ₹500.
2. Maximum withdrawal amount per request (configurable in SystemSetting).
3. Only one pending withdrawal allowed per user at a time: check if a pending withdrawal exists before allowing a new request.
4. Bank details must be complete before requesting withdrawal.
5. The withdrawal bank details are locked at request time — cannot be changed while pending.
6. Admin approval required for every withdrawal.
7. All withdrawals are logged with IP address and user agent.

## 16. File Upload Security

**Rules:**
- Accept only JPEG, PNG, WebP for profile photos (validate MIME type and file extension).
- Reject files over 2MB.
- Generate a new random filename on upload — never use the original filename.
- Scan uploaded files with ClamAV or a cloud malware scanning service before storing.

**Implementation:**
```javascript
// server/middleware/upload.js
const multer = require('multer');
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },  // 2MB
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    }
  },
});
```

## 17. Dependency Vulnerability Scanning

**Implementation:**
- Run `npm audit` in both client and server directories weekly.
- Add `npm audit --audit-level=high` to the GitHub Actions pipeline — fails the build if high or critical vulnerabilities exist.
- Use Dependabot to auto-create PRs for dependency updates.

## 18. Environment Variable Protection

- Never commit `.env` files to git — they are in `.gitignore`.
- Use Railway secrets for backend and Vercel environment variables for frontend in production.
- Do not log environment variables anywhere in code.
- Validate required environment variables on server startup:

```javascript
// server/server.js — before app setup
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'FRONTEND_URL'];
const missingVars = requiredEnvVars.filter(key => !process.env[key]);
if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
}
```

---

# SECTION 14 — PERFORMANCE OPTIMIZATION COMPLETE PLAN

## 1. React Code Splitting With Lazy and Suspense

All route-level components are lazy-loaded. This reduces the initial bundle size from ~800KB to ~150KB.

```javascript
// client/src/App.jsx — replace all static imports with:
const Home = React.lazy(() => import('@/pages/public/Home'));
const Login = React.lazy(() => import('@/pages/auth/Login'));
const Register = React.lazy(() => import('@/pages/auth/Register'));
const DashboardLayout = React.lazy(() => import('@/components/layout/DashboardLayout'));
const Overview = React.lazy(() => import('@/pages/dashboard/Overview'));
// ... all other routes

// Wrap Routes in Suspense:
<Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LoadingSpinner /></div>}>
  <Routes>
    {/* all routes */}
  </Routes>
</Suspense>
```

## 2. Image Lazy Loading

```html
<!-- All img tags: -->
<img src={logo} alt="RS Trading" loading="lazy" />
```

For dynamically loaded images in lists, use the IntersectionObserver API or the `react-intersection-observer` library.

## 3. Image Compression and WebP Conversion

- Convert logo.png to logo.webp using `cwebp logo.png -o logo.webp -q 85`
- Use `<picture>` element with WebP fallback:
```html
<picture>
  <source srcSet={logoWebp} type="image/webp" />
  <img src={logoPng} alt="RS Trading Logo" />
</picture>
```

## 4. React Query Caching Configuration

```javascript
// Specific configurations per query:
useQuery({
  queryKey: QUERY_KEYS.WALLET_BALANCE,
  queryFn: walletService.getBalance,
  staleTime: 0,              // Always refetch wallet balance — financial data must be fresh
  gcTime: 30 * 1000,
});

useQuery({
  queryKey: QUERY_KEYS.DASHBOARD_STATS,
  queryFn: userService.getDashboardStats,
  staleTime: 60 * 1000,      // 1 minute
  gcTime: 5 * 60 * 1000,
});

useQuery({
  queryKey: QUERY_KEYS.NOTIFICATIONS,
  queryFn: notificationService.getNotifications,
  staleTime: 30 * 1000,
  refetchInterval: 30 * 1000, // Poll every 30 seconds
});
```

## 5. Backend Response Caching Using Redis

```javascript
// server/middleware/cache.js
const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL });
client.connect();

exports.cacheResponse = (keyFn, ttlSeconds) => async (req, res, next) => {
  const key = keyFn(req);
  const cached = await client.get(key);
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  const originalJson = res.json.bind(res);
  res.json = async (data) => {
    await client.setEx(key, ttlSeconds, JSON.stringify(data));
    originalJson(data);
  };
  
  next();
};

// Usage in routes:
// router.get('/dashboard-stats', authenticate, cacheResponse(req => `dash:${req.user.userId}`, 60), handler);
```

## 6. Database Query Optimization

- Add compound index: `{ userId: 1, createdAt: -1 }` on Transaction (already added)
- Add index on `{ category: 1 }` on Transaction (add to Transaction.js)
- The N+1 team query in `/api/user/team` must be replaced with a single aggregation:

```javascript
// Optimized team query using $graphLookup (MongoDB native tree traversal):
const result = await User.aggregate([
  { $match: { _id: new mongoose.Types.ObjectId(req.user.userId) } },
  { $graphLookup: {
    from: 'users',
    startWith: '$_id',
    connectFromField: '_id',
    connectToField: 'sponsorId',
    as: 'allDownline',
    maxDepth: parseInt(level) - 1,
    depthField: 'depth',
  }},
]);
```

## 7. Pagination on All List APIs

All GET list endpoints include `page` and `limit` query parameters. Default limit is 20. Maximum limit is 100. Total count is returned with `totalPages` calculation.

## 8. Bundle Size Analysis and Reduction

```javascript
// vite.config.js additions:
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({ open: true, filename: 'bundle-analysis.html' }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':     ['react', 'react-dom', 'react-router-dom'],
          'vendor-query':     ['@tanstack/react-query'],
          'vendor-framer':    ['framer-motion'],
          'vendor-recharts':  ['recharts'],
          'vendor-lucide':    ['lucide-react'],
          'vendor-zustand':   ['zustand'],
        },
      },
    },
  },
});
```

## 9. Font Loading Optimization

```css
/* client/src/index.css — replace @import with preload tags */
```
```html
<!-- client/index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preconnect" href="https://api.fontshare.com" />
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap" rel="stylesheet" />
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@700,800,900&display=swap" rel="stylesheet" />
```

## 10. Lighthouse Score Targets and How to Hit Them

**Target scores:** Performance 90+, Accessibility 95+, SEO 95+, Best Practices 95+.

**To hit Performance 90+:**
- Code split all routes (saves ~600KB)
- Convert images to WebP (saves ~50%)
- Use font-display: swap (eliminates FOIT)
- Preload the logo image: `<link rel="preload" as="image" href="/logo.webp" />`
- Remove unused CSS (Tailwind purging is automatic with Vite)

**To hit Accessibility 95+:**
- All images have meaningful alt text
- All buttons have aria-label where text is not descriptive
- All form inputs have htmlFor/id pairs
- Color contrast ratio must be at least 4.5:1
- Focus-visible styles are applied to all interactive elements

**To hit SEO 95+:**
- Each page sets a unique document.title via PageMeta.jsx
- Each page has a unique meta description
- Semantic HTML5 structure: `<main>`, `<article>`, `<section>`, `<nav>`, `<footer>`
- Open Graph and Twitter Card meta tags on public pages

---

# SECTION 15 — COMPLETE TESTING STRATEGY

## Frontend Unit Tests

**File location:** `client/src/__tests__/utils/`
**Framework:** Vitest
**Run command:** `cd client && npx vitest`

Tests to write:
1. `formatCurrency.test.js` — test ₹0, ₹500, ₹12,200, ₹1,00,000, null, undefined
2. `formatDate.test.js` — test valid date string, null, undefined, invalid date
3. `validators.test.js` — test IFSC regex, PAN regex, Indian mobile regex
4. `tokenUtils.test.js` — test JWT expiry detection with mock timestamps

## Frontend Component Tests

**File location:** `client/src/__tests__/components/`
**Framework:** Vitest + React Testing Library
**Run command:** `cd client && npx vitest`

Tests to write:
1. `Login.test.jsx` — renders correctly, shows error on empty submit, calls login service on valid submit
2. `Register.test.jsx` — step 1 validation, step navigation, sponsor validation button
3. `StatCard.test.jsx` — renders value, label, and trend correctly
4. `Wallet.test.jsx` — renders balance, withdrawal modal opens on button click, validates min ₹500
5. `DataTable.test.jsx` — renders rows, shows empty state, handles pagination

## Backend Unit Tests

**File location:** `server/__tests__/services/`
**Framework:** Jest
**Run command:** `cd server && npx jest`

Tests to write:
1. `incomeEngine.test.js` — processActivationIncome: mock MongoDB session, verify direct income credited to sponsor, verify level income credited at each depth, verify sponsor's level is updated after activation
2. `authController.test.js` — register: validates required fields, rejects duplicate mobile/email, creates user with correct sponsor reference
3. `generateId.test.js` — verify RS ID format, verify transaction ID uniqueness pattern

## Backend Integration Tests

**File location:** `server/__tests__/routes/`
**Framework:** Jest + Supertest
**Run command:** `cd server && npx jest --testPathPattern=routes`

Tests to write:
1. `auth.test.js` — POST /api/auth/register success, duplicate mobile fail, invalid sponsor fail. POST /api/auth/login success with RS ID, email, mobile. POST /api/auth/refresh valid token, expired token, invalid token.
2. `epin.test.js` — POST /api/epin/activate success (full income distribution verified), double activation fail, invalid pin fail.
3. `withdrawal.test.js` — POST /api/withdrawals/request success, insufficient balance fail, inactive account fail, concurrent requests race condition test.
4. `admin.test.js` — admin user list returns only role:user, non-admin gets 403, block user works, withdrawal approval updates status.

## End-to-End Tests

**File location:** `client/e2e/`
**Framework:** Playwright
**Run command:** `cd client && npx playwright test`
**Install:** `npx playwright install`

User journeys to cover:
1. `registration.spec.js` — full 5-step registration with valid sponsor, verify success screen shows RS ID
2. `login.spec.js` — login with RS ID, verify dashboard overview loads
3. `login.spec.js` — login with wrong password, verify error message
4. `activation.spec.js` — login with inactive account, navigate to activation, enter valid E-Pin, verify active status badge changes
5. `wallet.spec.js` — login with active account, open withdrawal modal, enter valid amount, verify submission success message
6. `admin.spec.js` — login as admin, verify admin panel loads, search for user, block user, verify blocked status

## Minimum Code Coverage

**Target:** 70% line coverage for backend services and controllers, 50% for route files, 80% for utility functions.

**GitHub Actions test run:**
```yaml
# In frontend.yml:
- name: Run tests
  run: cd client && npx vitest run --coverage

# In backend.yml:
- name: Run tests
  run: cd server && npx jest --coverage --coverageThreshold='{"global":{"lines":70}}'
```

---

# SECTION 16 — DEPLOYMENT AND DEVOPS COMPLETE PLAN

## Frontend Deployment — Vercel

**Build command:** `cd client && npm run build`
**Output directory:** `client/dist`
**Framework preset:** Vite

```bash
# Manual deploy:
cd client
npm run build
npx vercel --prod

# Automatic deploy via GitHub Actions (see below)
```

The `client/vercel.json` file configures SPA routing:
```json
{
  "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }]
}
```

## Backend Deployment — Railway

```bash
# Initial setup:
# 1. Create a Railway account at https://railway.app
# 2. Create a new project, select GitHub repository
# 3. Railway auto-detects Node.js and runs npm start

# Set start command in railway.toml:
[build]
  builder = "nixpacks"

[deploy]
  startCommand = "node server.js"
  healthcheckPath = "/health"
  healthcheckTimeout = 30
```

## GitHub Actions — Frontend CI/CD Pipeline

```yaml
# .github/workflows/frontend.yml
name: Frontend CI/CD

on:
  push:
    branches: [main]
    paths: ['client/**']
  pull_request:
    branches: [main]
    paths: ['client/**']

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: client

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: client/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npx vitest run --coverage

      - name: Build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_SITE_URL: ${{ secrets.VITE_SITE_URL }}
          VITE_SENTRY_DSN: ${{ secrets.VITE_SENTRY_DSN }}
        run: npm run build

      - name: Deploy to Vercel
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: client
          vercel-args: '--prod'
```

## GitHub Actions — Backend CI/CD Pipeline

```yaml
# .github/workflows/backend.yml
name: Backend CI/CD

on:
  push:
    branches: [main]
    paths: ['server/**']
  pull_request:
    branches: [main]
    paths: ['server/**']

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: server

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: server/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Run security audit
        run: npm audit --audit-level=high

      - name: Run tests
        env:
          NODE_ENV: test
          MONGO_URI: ${{ secrets.MONGO_URI_TEST }}
          JWT_SECRET: test_jwt_secret_for_ci_only
          JWT_REFRESH_SECRET: test_refresh_secret_for_ci_only
        run: npx jest --coverage --forceExit

      - name: Deploy to Railway
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'
        run: |
          npm install -g @railway/cli
          railway up --service rs-trading-backend
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## Managing Environment Variables in Production

**Frontend (Vercel):**
1. Go to Vercel dashboard → Project → Settings → Environment Variables
2. Add each VITE_* variable for the Production environment
3. Vercel injects them at build time — they are embedded in the JavaScript bundle

**Backend (Railway):**
1. Go to Railway dashboard → Service → Variables
2. Add each server environment variable
3. Railway injects them as process.env at runtime

**NEVER store secrets in GitHub repository code or Actions secrets files directly** — use GitHub Encrypted Secrets for CI/CD variables.

## Database Migrations in Production

MongoDB with Mongoose does not have a traditional migration system. Use this approach:
1. All schema changes must be backward compatible (add fields with defaults, never remove fields immediately)
2. For destructive changes: (1) add new field alongside old, (2) deploy, (3) run a migration script, (4) remove old field in next deployment
3. Run seed scripts from the Railway CLI or a temporary deploy:

```bash
# In Railway CLI:
railway run --service rs-trading-backend node server/scripts/seed.js
```

## Zero Downtime Deployment

Railway and Vercel both support zero-downtime deployments by default:
- Railway: New instance starts, health check passes, old instance stops.
- Vercel: New build deploys atomically, instant switch.

For Railway, ensure the health check is configured: `healthcheckPath = "/health"` in railway.toml.

## Rollback Procedure

**Frontend (Vercel):**
1. Go to Vercel Dashboard → Deployments
2. Find the last working deployment
3. Click "..." → "Promote to Production"
4. Takes effect in under 10 seconds

**Backend (Railway):**
1. Go to Railway Dashboard → Service → Deployments
2. Find the last working deployment
3. Click "Rollback"
4. Or revert the Git commit and push — Railway will redeploy the reverted code

## Monitoring Setup

**Uptime Monitoring:** UptimeRobot (free plan) monitors `https://api.rstradingonline.co.in/health` every 5 minutes. Alerts via email and SMS on downtime.

**Error Alerting:** Sentry sends email alerts when error rates spike above 1% or a new error type is seen.

**Log Monitoring:** Better Stack (Logtail) aggregates all Winston logs and can alert on `level: 'error'` logs.

## SSL Configuration

Both Vercel and Railway automatically provision and renew Let's Encrypt SSL certificates for custom domains. No manual SSL configuration is needed.

## Domain and DNS Configuration

1. Purchase domain `rstradingonline.co.in` from GoDaddy or Namecheap.
2. Go to Vercel → Project → Settings → Domains. Add `rstradingonline.co.in` and `www.rstradingonline.co.in`.
3. Vercel provides DNS record values (A record or CNAME). Add them in GoDaddy DNS settings.
4. For backend, go to Railway → Service → Settings → Domain. Add `api.rstradingonline.co.in`. Railway provides a CNAME record. Add it in GoDaddy DNS.
5. DNS propagation takes 24-48 hours.
6. Test both domains are HTTPS once propagated.

---

# SECTION 17 — DAY ONE LOCAL SETUP GUIDE

A brand new developer follows these steps to go from zero to a fully running local development environment in under 30 minutes.

## Prerequisites Check

```bash
# Check Node.js version (must be >= 20)
node -v
# Expected output: v20.x.x or higher

# Check npm version (must be >= 10)
npm -v
# Expected output: 10.x.x or higher

# Check git
git --version

# If Node.js is not installed, install it via nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc  # or source ~/.zshrc
nvm install 20
nvm use 20
```

## Step 1: Clone and Navigate

```bash
# Clone the repository (replace with actual repo URL)
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
# Create the backend .env file
cp .env.example .env
```

Open `server/.env` in any text editor and fill in the values:

```bash
# Required values to set manually:
PORT=5000
NODE_ENV=development

# MongoDB Atlas — get from https://cloud.mongodb.com
# Click your cluster → Connect → Connect using MongoDB Driver → Copy the connection string
# Replace <username> and <password> with your Atlas credentials
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.abc123.mongodb.net/rstrading?retryWrites=true&w=majority

# Generate JWT secrets using this command (run it twice for two different secrets):
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=paste_first_64_char_hex_here
JWT_REFRESH_SECRET=paste_second_64_char_hex_here

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# Email — for development, use Gmail App Password:
# 1. Go to myaccount.google.com/security
# 2. Enable 2-Step Verification
# 3. Go to App Passwords, create one for "Mail"
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_app_password
EMAIL_FROM=RS Trading <noreply@rstradingonline.co.in>

# SMS — leave empty for development (OTPs will be logged to console)
MSG91_AUTH_KEY=
MSG91_SENDER_ID=
MSG91_OTP_TEMPLATE_ID=

# AWS S3 — leave empty for development (file uploads won't work)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-south-1
AWS_S3_BUCKET=

# Admin key for creating first admin user
ADMIN_SECRET_KEY=your_admin_secret_key_here
```

## Step 4: Set Up MongoDB Atlas

If you don't have a cluster:
1. Go to https://cloud.mongodb.com
2. Create a free M0 cluster
3. Create a database user under Security → Database Access
4. Allow all IPs under Security → Network Access (for development: 0.0.0.0/0)
5. Get the connection string from Connect → Compass or Driver

## Step 5: Seed the Database

```bash
# While in the server directory:
node scripts/seed.js
```

This creates:
1. The RS ID counter starting at 1000
2. Default system settings (income amounts, withdrawal limits)
3. A test admin user with credentials: rsId=ADMIN001, email=admin@rstrading.co.in, password=Admin@123
4. A test sponsor user with rsId=RS1000

## Step 6: Start the Backend Server

```bash
# In the server directory:
npm run dev
```

Expected output:
```
[INFO] ✅ MongoDB connected successfully
[INFO] 🚀 RS Trading API running on port 5000
[INFO] 📍 Environment: development
```

Open a new terminal tab. Keep the backend server running.

## Step 7: Install Frontend Dependencies

```bash
# Navigate to the client directory from the project root
cd ../client
npm install
```

## Step 8: Configure Frontend Environment

```bash
cp .env.example .env
```

Open `client/.env` and set:

```bash
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=RS Trading
VITE_SITE_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:5000
```

## Step 9: Start the Frontend Dev Server

```bash
# In the client directory:
npm run dev
```

Expected output:
```
  VITE v8.x.x  ready in xxx ms
  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## Step 10: Verify Everything Is Running

Open your browser and verify each of these URLs:

```
# Backend health check:
http://localhost:5000/health
Expected: {"status":"ok","timestamp":"2025-05-31T..."}

# Backend API info:
http://localhost:5000/
Expected: {"message":"RS Trading API v1.0","status":"running"}

# Public website homepage:
http://localhost:3000/
Expected: The RS Trading landing page with dark hero section

# Login page:
http://localhost:3000/login
Expected: The dark glassmorphism login form

# Register page:
http://localhost:3000/register
Expected: The 5-step registration wizard

# Admin login:
http://localhost:3000/admin/login
Expected: The admin login page

# Test login with seeded admin:
# Enter: admin@rstrading.co.in / Admin@123
# Expected: Redirect to /admin dashboard

# Test registration:
# 1. Go to /register
# 2. Enter Sponsor ID: RS1000
# 3. Click Validate — should show "Ramesh Kumar (Verified)"
# 4. Complete all steps with fake data
# 5. Submit — should show success screen with your RS ID

# Test login with new member:
# Enter your RS ID and password
# Expected: Redirect to /dashboard
```

## Step 11: Running Both Servers Simultaneously

For convenience, use two terminal tabs/windows:

Terminal 1 (Backend):
```bash
cd rstrading/server && npm run dev
```

Terminal 2 (Frontend):
```bash
cd rstrading/client && npm run dev
```

Alternatively, install `concurrently` at the root level to run both with one command:
```bash
# In project root:
npm init -y
npm install -D concurrently
# Add to root package.json scripts:
# "dev": "concurrently \"cd server && npm run dev\" \"cd client && npm run dev\""
npm run dev
```

## Step 12: Running Tests

```bash
# Frontend tests:
cd client && npx vitest

# Backend tests:
cd server && npx jest

# E2E tests (requires both servers running):
cd client && npx playwright test
```

## Troubleshooting Common Setup Issues

**Issue: MongoDB connection fails**
- Check the MONGO_URI format is correct
- Verify the IP whitelist in Atlas includes 0.0.0.0/0 for development
- Verify the username and password have no special characters that need URL encoding

**Issue: `npm install` fails**
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and package-lock.json, then re-run npm install

**Issue: Port 3000 or 5000 already in use**
- On Mac: `lsof -ti:5000 | xargs kill -9` to kill the process using that port

**Issue: Framer Motion warnings in console**
- These are usually harmless deprecation warnings. Ignore them for now.

**Issue: Tailwind CSS not working**
- Verify that `@import "tailwindcss"` is in index.css
- Verify that the Tailwind Vite plugin is in vite.config.js

---

*End of RS Trading Complete Implementation Plan*

*Document version: 1.0 — Generated from full codebase audit on 31 May 2026*
*Total sections: 17 | Total pages equivalent: ~200*
