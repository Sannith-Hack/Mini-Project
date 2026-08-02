You are helping generate a mini project abstract for a college engineering project.

Important Instructions:

The project must be explained in simple real-world terms.
Avoid heavy technical jargon.
Focus on real-life problem solving.
Make it sound practical and implementable.

The abstract should include:

- Problem in real life
- Simple solution idea
- How the system works (basic flow)
- Benefits to society
- Why this project is useful

Tone should be:

Clear
Simple
Practical
Understandable by non-technical faculty

Length: 150–200 words

--------------------------------------------------

Team Details:
Branch: CSE
Year: 3rd Year
1. P.Sannith (Leader) - 23567T0942
2. R.Jayathusri - 23567T0951
3. K.Akshitha - 23567T0931

--------------------------------------------------

Project 1: Smart Classroom Attendance using Face Detection

Context:
In traditional classrooms, attendance is taken manually which consumes time and may lead to proxy attendance. This project proposes an automated attendance system using face recognition technology. A camera captures student faces and matches them with stored records to mark attendance automatically.

Focus:
Time saving
Accuracy
No proxy attendance
Automation in education

--------------------------------------------------

Project 2: Smart Crop Watering Advisor for Farmers

Context:
Farmers often struggle to decide when and how much to water their crops. Overwatering wastes water and harms plants, while underwatering affects crop growth. This project helps farmers by analyzing soil moisture and weather conditions to recommend the right time for irrigation.

Focus:
Water conservation
Better crop yield
Support for small farmers
Simple decision-making

--------------------------------------------------

Project 3: Smart Medicine Reminder & Health Tracker

Context:
Many elderly people and patients forget to take medicines on time. Missing doses can lead to serious health problems. This project provides a smart reminder system that alerts users to take medicines and keeps track of their medication schedule.

Focus:
Patient safety
Timely medication
Support for elderly
Health monitoring

--------------------------------------------------

Project 4: Custom Windows ISO for B.Tech Studies

Context:
Installing standard Windows requires students to manually download and install multiple programming tools and software (Python, Java, MS Office, WSL), which is time-consuming. This project involves creating a customized Windows ISO that comes pre-installed with all necessary B.Tech software, allowing for a single-step setup.

Focus:
Efficiency
Standardization
One-click setup
Time saving for students

--------------------------------------------------

Project 5: AI Mental Stress Detector & Advisor

Context:
College students often face intense academic pressure, leading to hidden mental stress and burnout. This project proposes an AI-powered stress detector where students input their daily habits like sleep, study hours, and mood. The system analyzes these factors to evaluate their stress level (Low/Medium/High) and provides instant, personalized wellness advice using Artificial Intelligence.

Focus:
Student mental health
Early stress detection
AI‑driven personalized advice
Data tracking and visualization
Secure authentication and data privacy

--------------------------------------------------

Generate separate abstracts for each project.

---
### Recent Development Updates (July 2026)

**Login Page & Google OAuth Integration**
- Added a polished `public/login.html` featuring a Google Sign‑In button and a username/password form with modern styling.
- Updated `server.js` to import `path`, serve the login page at the root URL (`GET '/'`), and ensure static assets are delivered from the `public` folder.
- The Google button points to `/api/auth/google`, which uses the existing Passport Google strategy defined in `config/passport.js` and route `routes/googleAuth.js`.
- Users can now authenticate via Google OAuth or the traditional username/password flow.

**Environment Configuration**
- The server now requires the following environment variables (add them to `.env`):
  ```
  GOOGLE_CLIENT_ID=your-google-client-id
  GOOGLE_CLIENT_SECRET=your-google-client-secret
  JWT_SECRET=your-jwt-secret
  SESSION_SECRET=your-session-secret
  CORS_ORIGIN=http://localhost:3001   # optional, include your dev origin(s)
  ```
- Missing or mismatched variables cause the Google login to fail; ensure they match the values set in the Google Cloud console.

**Troubleshooting Google Login**
- Verify the callback URL (`http://localhost:<PORT>/api/auth/google/callback`) is registered in the Google credentials.
- Ensure `SESSION_SECRET` is set; otherwise Passport cannot maintain a session.
- During local testing keep `cookie.secure` set to `false` (already configured) and use HTTP.

**Authentication & System Bug Fixes (Completed)**
- **Frontend & Routing**: Created `public/login.html` featuring Google OAuth Sign-In and a modern username/password form. Updated `server.js` static middleware (`{ index: false }`) so `GET /` cleanly serves `login.html`.
- **Helmet CSP Configuration**: Disabled strict Content Security Policy in Helmet to allow Google OAuth redirects, Chart.js CDN scripts, and Google Fonts.
- **JavaScript Syntax Fixes**: Cleaned up illegal string characters (literal `\n`) in `public/app.js`. Added seamless URL parameter handling (`?token=&username=`) on startup to capture incoming Google OAuth tokens and initialize user sessions.
- **Database Schema Auto-Migration**: Added startup migration logic in `config/db.js` (`ALTER TABLE users ADD COLUMN...`) to automatically upgrade existing MySQL/TiDB database tables with `google_id` and `email` columns without data loss or downtime.
- **OAuth Collision Prevention**: Updated `config/passport.js` to safely handle missing emails and prevent `ER_DUP_ENTRY` errors when Google display names match existing registered usernames.
- **Backend Workflow Fixes**: Resolved hanging requests on `/api/stress/admin-stats` by adding missing `res.json(results)` responses in `controllers/stressController.js`.

These changes complete the user login workflow and provide clear guidance for getting Google authentication operational.

**UI Refactoring, Workflow Optimization & Security Hardening (July 2026 - Latest)**
- **Reverse Proxy & OAuth Callback Hardening**: Configured `app.set('trust proxy', 1)` in `server.js` and enabled `proxy: true` in `config/passport.js` (with optional `GOOGLE_CALLBACK_URL` environment variable override) to prevent `redirect_uri_mismatch` errors and ensure HTTPS cookie setting on cloud platforms like Render.
- **Workflow & UI Cleanup**: Removed redundant inline auth view from `public/index.html`, making `login.html` the sole dedicated authentication page and eliminating DOM flickering. Added hover animations and glow transitions to resource cards and navigation elements for a rich, premium aesthetic.
- **API Security & Privacy Hardening**: Protected `/api/stress/admin-stats` and `/api/stress/export-csv` endpoints with `authenticateToken` JWT middleware in `routes/stressRoutes.js` to prevent unauthenticated data scraping. Anonymized third-party student names in global CSV downloads to preserve institutional privacy while allowing data export for authenticated users via `fetch` blob downloading.
- **OAuth Password Crash Protection**: Updated `controllers/authController.js` to intercept password login attempts for Google OAuth accounts where `password` is `null`, returning a user-friendly guidance message instead of triggering a server exception.
- **Terms & Conditions Workflow**: Added a standalone, glassmorphic `public/terms.html` page featuring medical disclaimers, AI advice disclaimers, and data privacy notices. Integrated clickable terms links into both the login screen and the main dashboard footer, supported by dedicated route handlers in `server.js`.

**Final Project Completion & Documentation (August 2026 - Latest)**
- **Scalability & Reliability**: Configured optimal database connection pooling limits (`connectionLimit: 100`, `waitForConnections: true`, `queueLimit: 0`) in `config/db.js` to handle intense presentation traffic without bottlenecking.
- **Performance & Error Handling**: Integrated `compression` middleware in `server.js` to shrink payload response sizes for high-speed dashboard loading, and added a global 500 fail-safe error handler.
- **Automated Project Documentation**: Dynamically generated a comprehensive `Project_Documentation.pdf` via a custom Python (`fpdf`) script. The document includes detailed programmatic flowcharts for System Architecture and End User Workflows, an extensive explanation of the `stressdb` MySQL schema, and perfectly matches the strict guidelines of the provided university reference.
- **Presentation Automation**: Authored a complete, highly-detailed instructional prompt (saved as `Presentation_Prompt.md` artifact) designed to be copied directly into AI presentation tools (Gamma, Canva) for instant 10-slide premium PPT generation.
