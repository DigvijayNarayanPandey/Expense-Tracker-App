<p align="center">
  <img src="frontend/public/expense logo.png" alt="Expense Tracker Logo" width="80" height="80" />
</p>

<h1 align="center">💰 Expense Tracker</h1>

<p align="center">
  <strong>A full-stack personal finance management application to track income, expenses, and visualize your financial health — all in one place.</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-contributing">Contributing</a> •
  <a href="#-license">License</a>
</p>

<br/>

---

## 📋 Overview

**Expense Tracker** is a modern, full-stack web application built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It empowers users to manage their personal finances by tracking income and expenses, visualizing financial data through interactive charts, and exporting transaction records to Excel spreadsheets.

The application features a clean, responsive UI with a dashboard-centric design, secure JWT-based authentication, profile picture management, and real-time data visualizations powered by Recharts.

---

## ✨ Features

### 🔐 Authentication & User Management
- **User Registration** with full name, email, password, and optional profile picture upload
- **Secure Login** with JWT-based authentication (4-day token expiry)
- **Password Hashing** using bcrypt with salt rounds for maximum security
- **Profile Picture Upload/Update/Delete** — upload images (JPEG, PNG, JPG up to 5MB) and manage your avatar
- **Persistent Sessions** via localStorage token management
- **Protected Routes** — all dashboard and financial routes require authentication

### 📊 Dashboard & Analytics
- **Financial Summary Cards** — at-a-glance view of Total Balance, Total Income, and Total Expense
- **Recent Transactions** — the last 5 combined income & expense entries, sorted by date
- **Financial Overview Pie Chart** — donut chart showing balance, income, and expense distribution
- **Last 30 Days Expenses** — bar chart visualization of recent spending patterns
- **Last 60 Days Income** — line/area chart showing income trends with gradient fills
- **Recent Income with Chart** — combined list and pie chart of recent income sources

### 💵 Income Management
- **Add Income** with source label, amount, date, and emoji icon
- **View All Income** in a detailed, sortable list
- **Delete Income** entries with confirmation dialog
- **Income Overview** — line chart and statistics summary
- **Download Income Report** as an Excel spreadsheet (`.xlsx`)

### 💸 Expense Management
- **Add Expense** with category label, amount, date, and emoji icon
- **View All Expenses** in a detailed, sortable list
- **Delete Expenses** with confirmation dialog
- **Expense Overview** — bar chart and statistics summary
- **Download Expense Report** as an Excel spreadsheet (`.xlsx`)

### 🎨 User Interface
- **Responsive Design** — fully optimized for desktop, tablet, and mobile screens
- **Side Navigation Menu** with active state highlighting
- **Hamburger Menu** for mobile viewports
- **Reusable Modal System** for add/delete operations
- **Emoji Picker** for assigning icons to income and expense entries
- **Toast Notifications** for real-time user feedback
- **Character Avatar Fallback** — displays user initials when no profile image is set
- **Poppins Font** — clean, modern typography throughout

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **React 19** | UI component library |
| **Vite 7** | Next-gen build tool & dev server |
| **React Router DOM 7** | Client-side routing & navigation |
| **Tailwind CSS 4** | Utility-first CSS framework |
| **Recharts 3** | Data visualization (Bar, Line, Area, Pie charts) |
| **Axios** | HTTP client with interceptors |
| **React Hot Toast** | Toast notification system |
| **React Icons** | Icon library (Lucide, Heroicons, Ionicons) |
| **Emoji Picker React** | Emoji selector for transaction icons |
| **Moment.js** | Date formatting and manipulation |

### Backend

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express 5** | Web framework for REST API |
| **MongoDB** | NoSQL database (via MongoDB Atlas) |
| **Mongoose 8** | MongoDB ODM for data modeling |
| **JWT (jsonwebtoken)** | Stateless authentication |
| **bcryptjs** | Password hashing |
| **Multer 2** | File upload middleware (profile images) |
| **xlsx** | Excel spreadsheet generation |
| **CORS** | Cross-Origin Resource Sharing |
| **dotenv** | Environment variable management |
| **Nodemon** | Auto-restart during development |

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                     │
│  ┌─────────────────────────────────────────────────────┐ │
│  │            React + Vite + Tailwind CSS              │ │
│  │  ┌───────────┐  ┌───────────┐  ┌────────────────┐   │ │
│  │  │   Auth    │  │ Dashboard │  │ Income/Expense │   │ │
│  │  │  Pages    │  │   Page    │  │    Pages       │   │ │
│  │  └─────┬─────┘  └─────┬─────┘  └───────┬────────┘   │ │
│  │        └───────────────┼────────────────┘           │ │
│  │                        │                            │ │
│  │              ┌─────────▼──────────┐                 │ │
│  │              │  Axios Instance    │                 │ │
│  │              │  (Interceptors +   │                 │ │
│  │              │   JWT Bearer Auth) │                 │ │
│  │              └─────────┬──────────┘                 │ │
│  └────────────────────────┼────────────────────────────┘ │
└───────────────────────────┼──────────────────────────────┘
                            │ HTTP (REST API)
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   SERVER (Node.js)                      │
│  ┌────────────────────────────────────────────────────┐ │
│  │              Express.js Application                │ │
│  │  ┌─────────────┐ ┌──────────────┐ ┌─────────────┐  │ │
│  │  │  Auth       │ │   Income     │ │  Expense    │  │ │
│  │  │  Routes     │ │   Routes     │ │  Routes     │  │ │
│  │  └──────┬──────┘ └──────┬───────┘ └──────┬──────┘  │ │
│  │         │               │                │         │ │
│  │  ┌──────▼───────────────▼────────────────▼──────┐  │ │
│  │  │           Middleware Layer                   │  │ │
│  │  │  ┌────────────────┐  ┌────────────────────┐  │  │ │
│  │  │  │ JWT Auth Guard │  │ Multer File Upload │  │  │ │
│  │  │  └────────────────┘  └────────────────────┘  │  │ │
│  │  └──────────────────────┬───────────────────────┘  │ │
│  │                         │                          │ │
│  │              ┌──────────▼──────────┐               │ │
│  │              │  Mongoose Models    │               │ │
│  │              │  (User, Income,     │               │ │
│  │              │   Expense)          │               │ │
│  │              └──────────┬──────────┘               │ │
│  └─────────────────────────┼──────────────────────────┘ │
└────────────────────────────┼────────────────────────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │   MongoDB Atlas     │
                  │   (Cloud Database)  │
                  └─────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **MongoDB Atlas** account (or a local MongoDB instance)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/DigvijayNarayanPandey/Expense-Tracker-App.git
cd Expense-Tracker-App
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=your_super_secret_jwt_key_here
PORT=3000
```

> ⚠️ **Important:** Replace the placeholder values with your actual MongoDB connection string and a strong, randomly generated JWT secret.

Start the backend server:

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

> **Note:** The frontend is configured to connect to `http://localhost:8000` by default. To change this, update the `BASE_URL` in `src/utils/apiPaths.js`.

Start the frontend development server:

```bash
npm run dev
```

### 4. Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

---

## 📡 API Reference

All API endpoints are prefixed with `/api/v1`. Protected routes require a `Bearer <token>` in the `Authorization` header.

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register a new user | ❌ |
| `POST` | `/api/v1/auth/login` | Login and receive JWT token | ❌ |
| `GET` | `/api/v1/auth/getUser` | Get current user profile | ✅ |
| `PUT` | `/api/v1/auth/update-profile-image` | Update profile picture URL | ✅ |
| `DELETE` | `/api/v1/auth/delete-profile-image` | Remove profile picture | ✅ |
| `POST` | `/api/v1/auth/upload-image` | Upload an image file | ❌ |

### Dashboard

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/v1/dashboard` | Get aggregated dashboard data | ✅ |

### Income

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/v1/income/add` | Add a new income entry | ✅ |
| `GET` | `/api/v1/income/get` | Get all income records | ✅ |
| `DELETE` | `/api/v1/income/:id` | Delete an income entry | ✅ |
| `GET` | `/api/v1/income/downloadexcel` | Download income as Excel | ✅ |

### Expense

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/v1/expense/add` | Add a new expense entry | ✅ |
| `GET` | `/api/v1/expense/get` | Get all expense records | ✅ |
| `DELETE` | `/api/v1/expense/:id` | Delete an expense entry | ✅ |
| `GET` | `/api/v1/expense/downloadexcel` | Download expenses as Excel | ✅ |

### Sample Request — Add Income

```bash
curl -X POST http://localhost:8000/api/v1/income/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "source": "Freelance Work",
    "amount": 1500,
    "date": "2026-03-08",
    "icon": "💼"
  }'
```

---

## 📁 Project Structure

```
Expense-Tracker-App/
├── .gitignore                        # Root gitignore
├── READme.md                         # This file
│
├── backend/                          # Express.js REST API
│   ├── .env                          # Environment variables
│   ├── .gitignore                    # Backend gitignore
│   ├── package.json                  # Dependencies & scripts
│   ├── server.js                     # App entry point & middleware setup
│   ├── config/
│   │   └── db.js                     # MongoDB connection (Mongoose)
│   ├── controllers/
│   │   ├── authController.js         # Register, Login, Profile management
│   │   ├── dashboardController.js    # Aggregated dashboard data
│   │   ├── expenseController.js      # Expense CRUD + Excel export
│   │   └── incomeController.js       # Income CRUD + Excel export
│   ├── middleware/
│   │   ├── authMiddleware.js         # JWT verification guard
│   │   └── uploadMiddle.js           # Multer file upload config
│   ├── models/
│   │   ├── User.js                   # User schema (with password hashing)
│   │   ├── Expense.js                # Expense schema
│   │   └── Income.js                 # Income schema
│   ├── routes/
│   │   ├── authRoutes.js             # Auth endpoints
│   │   ├── dashboardRoutes.js        # Dashboard endpoint
│   │   ├── expenseRoutes.js          # Expense endpoints
│   │   └── incomeRoutes.js           # Income endpoints
│   └── uploads/                      # Uploaded profile images
│
└── frontend/                         # React SPA (Vite)
    ├── .gitignore                    # Frontend gitignore
    ├── index.html                    # HTML entry point
    ├── package.json                  # Dependencies & scripts
    ├── vite.config.js                # Vite + React + Tailwind config
    ├── eslint.config.js              # ESLint configuration
    ├── public/
    │   └── expense logo.png          # App favicon
    └── src/
        ├── main.jsx                  # React DOM render entry
        ├── App.jsx                   # Root component with routing
        ├── index.css                 # Global styles + Tailwind imports
        ├── assets/
        │   └── images/              # Static image assets
        ├── components/
        │   ├── Cards/
        │   │   ├── CharAvatar.jsx        # Initials-based avatar fallback
        │   │   ├── InfoCard.jsx          # Dashboard summary card
        │   │   └── TransactionInfoCard.jsx # Transaction list item
        │   ├── Charts/
        │   │   ├── CustomBarChart.jsx    # Recharts bar chart
        │   │   ├── CustomLineChart.jsx   # Recharts area/line chart
        │   │   ├── CustomPieChart.jsx    # Recharts donut/pie chart
        │   │   ├── CustomTooltip.jsx     # Chart tooltip component
        │   │   └── CustomLegend.jsx      # Chart legend component
        │   ├── Dashboard/
        │   │   ├── ExpenseTransactions.jsx    # Last 30d expense list
        │   │   ├── FinanceOverview.jsx        # Pie chart overview
        │   │   ├── Last30DaysExpenses.jsx     # Expense bar chart
        │   │   ├── RecentIncome.jsx           # Income transaction list
        │   │   ├── RecentIncomeWithChart.jsx  # Income + pie chart
        │   │   └── RecentTransactions.jsx     # Combined recent list
        │   ├── Expense/
        │   │   ├── AddExpenseForm.jsx     # Add expense modal form
        │   │   ├── ExpenseList.jsx        # Full expense list view
        │   │   └── ExpenseOverview.jsx    # Expense stats overview
        │   ├── Income/
        │   │   ├── AddIncomeForm.jsx      # Add income modal form
        │   │   ├── IncomeList.jsx         # Full income list view
        │   │   └── IncomeOverview.jsx     # Income stats overview
        │   ├── Inputs/
        │   │   ├── Input.jsx              # Reusable form input
        │   │   └── ProfilePhotoSelector.jsx # Profile photo picker
        │   ├── layouts/
        │   │   ├── AuthLayout.jsx         # Login/Signup page layout
        │   │   ├── DashboardLayout.jsx    # Dashboard page layout
        │   │   ├── Navbar.jsx             # Top navigation bar
        │   │   └── SideMenu.jsx           # Sidebar navigation
        │   ├── DeleteAlert.jsx           # Delete confirmation dialog
        │   ├── EmojiPickerPopup.jsx      # Emoji selector popup
        │   └── Modal.jsx                 # Reusable modal wrapper
        ├── context/
        │   └── UserContext.jsx           # React Context for user state
        ├── hooks/
        │   └── useUserAuth.jsx           # Auth hook (auto-fetch user)
        ├── pages/
        │   ├── Auth/
        │   │   ├── Login.jsx             # Login page
        │   │   └── SignUp.jsx            # Registration page
        │   └── Dashboard/
        │       ├── Home.jsx              # Dashboard home page
        │       ├── Income.jsx            # Income management page
        │       └── Expense.jsx           # Expense management page
        └── utils/
            ├── apiPaths.js               # API endpoint constants
            ├── axiosInstance.js           # Configured Axios with interceptors
            ├── data.js                   # Side menu data constants
            ├── helper.js                 # Utility functions
            └── uploadImage.js            # Image upload helper
```

---

## 🗄️ Database Schema

### User Model
```javascript
{
  fullName:        String    // Required
  email:           String    // Required, Unique
  password:        String    // Required, Hashed (bcrypt)
  profileImageUrl: String    // Optional (default: null)
  createdAt:       Date      // Auto-generated
  updatedAt:       Date      // Auto-generated
}
```

### Income Model
```javascript
{
  userId:    ObjectId   // Reference to User
  icon:      String     // Emoji icon (optional)
  source:    String     // Income source label
  amount:    Number     // Income amount
  date:      Date       // Transaction date
  createdAt: Date       // Auto-generated
  updatedAt: Date       // Auto-generated
}
```

### Expense Model
```javascript
{
  userId:    ObjectId   // Reference to User
  icon:      String     // Emoji icon
  category:  String     // Expense category label
  amount:    Number     // Expense amount
  date:      Date       // Transaction date
  createdAt: Date       // Auto-generated
  updatedAt: Date       // Auto-generated
}
```

---

## 🔒 Security

- **Password Hashing** — All passwords are hashed with `bcryptjs` (10 salt rounds) before storage
- **JWT Authentication** — Stateless token-based auth with 4-day expiration
- **Protected Routes** — Server-side middleware verifies JWT on every protected endpoint
- **Input Validation** — Server-side validation for all form inputs (email, amounts, required fields)
- **Input Sanitization** — Amounts are sanitized to positive numbers; text inputs are trimmed
- **CORS Protection** — Configurable cross-origin policy via environment variables
- **File Upload Restrictions** — Only JPEG/PNG/JPG files up to 5MB are accepted
- **Ownership Verification** — Income and expense records can only be deleted by their owner

---

## 📜 Available Scripts

### Backend (`/backend`)

| Script | Command | Description |
|---|---|---|
| `start` | `npm start` | Start the production server |
| `dev` | `npm run dev` | Start with Nodemon (auto-restart) |

### Frontend (`/frontend`)

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start Vite dev server |
| `build` | `npm run build` | Create production build |
| `preview` | `npm run preview` | Preview production build |
| `lint` | `npm run lint` | Run ESLint |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Guidelines
- Follow the existing code style and project structure
- Write meaningful commit messages
- Test your changes before submitting a PR
- Update documentation if adding new features

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Digvijay Narayan Pandey**

- GitHub: [@DigvijayNarayanPandey](https://github.com/DigvijayNarayanPandey)

---

<p align="center">
  Made with ❤️ using the MERN Stack
</p>