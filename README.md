# Stable Money 💰

A modern, full-stack application for tracking Currency Exchange Rates and Gold/Silver prices. Built with React (Vite) and Node.js.

## 🚀 Features

- **Currency Converter**: Real-time exchange rate conversion with support for multiple base currencies.
- **Gold & Silver Rates**: Live market rates for precious metals.
- **Historical Trends**: interactive charts showing 30-day price history.
- **Mobile Responsive**: Fully optimized UI for desktop and mobile devices.

## 🛠️ Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (Icons)
- Recharts (Data Visualization)

**Backend:**
- Node.js & Express
- TypeScript
- Prisma ORM (SQLite for Dev)
- Axios (External API handling)

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Hariharan-98/stable-money.git
   cd stable-money
   ```

2. **Install Dependencies:**
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup:**
   - The backend uses MetalpriceAPI (Key is currently hardcoded for demo purposes, but should be in .env in production).
   - Database is SQLite by default (`dev.db`).

4. **Run the Application:**

   **Backend (Terminal 1):**
   ```bash
   cd server
   npm run dev
   ```

   **Frontend (Terminal 2):**
   ```bash
   cd client
   npm run dev
   ```

## 📝 License

MIT
