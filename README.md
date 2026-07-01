# MindFlow AI - Mental Stress Detector & Advisor

A comprehensive mini-project for college engineering built by **Team CSE 3rd Year**. MindFlow AI helps students track their daily habits and evaluates their mental stress levels using rule-based metrics combined with Google's Gemini AI to provide personalized wellness advice.

## 🚀 Features

- **Secure User Authentication**: Encrypted passwords (Bcrypt) and stateless sessions (JWT).
- **AI-Powered Advice**: Integrates `gemini-1.5-flash` to act as an empathetic college counselor.
- **Data Analytics Dashboard**: Visualize your personal stress factors and global student stress statistics.
- **Enterprise-Grade Security**: Protected by `helmet` headers and rate limiters against brute-force attacks.
- **PDF Export**: Instantly download your stress analysis reports.
- **Modern UI Architecture**: Clean, component-driven dashboard design without typical AI-generated artifacts.

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla JavaScript, CSS3, Chart.js, jsPDF.
- **Backend**: Node.js, Express.js.
- **Database**: TiDB Cloud (MySQL).
- **Security**: jsonwebtoken, bcrypt, helmet, express-rate-limit.
- **AI Integration**: `@google/generative-ai`.

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sannith-Hack/Mini-Project.git
   cd Mini-Project
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the root directory and add the following keys:
   ```env
   PORT=3001
   GEMINI_API_KEY=your_gemini_api_key
   DB_HOST=your_tidb_host
   DB_USER=your_tidb_user
   DB_PASS=your_tidb_password
   DB_NAME=mini_project
   DB_PORT=4000
   DB_SSL=true
   JWT_SECRET=super_secret_key
   ```

4. **Seed the Database (Optional):**
   To populate the database with dummy student records for demo purposes, run:
   ```bash
   node seed.js
   ```

5. **Start the Server:**
   ```bash
   npm start
   # or
   node server.js
   ```

6. **Access the Application:**
   Open your browser and navigate to `http://localhost:3001`.

## 👨‍💻 Team

- **P.Sannith** (Leader) - 23567T0942
- **R.Jayathusri** - 23567T0951
- **K.Akshitha** - 23567T0931

---
*Built with ❤️ for a healthier student community.*
