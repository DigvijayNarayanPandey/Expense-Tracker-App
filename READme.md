# Expense Tracker

A lightweight app to record, categorize, and analyze personal or small‑business expenses.

## Project overview
- Track incomes and expenses with date, amount, currency, category, and tags.
- View summarized totals and simple charts by period and category.
- Search and filter transactions by date range, category, amount, and tags.
- Export and import transaction data (CSV/JSON).

## Features
- Add, edit, and delete transactions
- Categories and tags with custom labels
- Recurring transactions with basic schedule options
- Monthly and yearly summaries (totals and category breakdowns)
- CSV/JSON export and import
- Optional user authentication and role-based access
- Lightweight local dev with SQLite (switchable to Postgres in production)
- API endpoints for CRUD and reporting (HTTP/JSON)
- Simple UI for listing, filtering, and visualizing transactions
- Extensible plugin points for custom reports or integrations
- Basic data validation and optional seed data for demo mode

## Tech Stack

### Frontend
- React.js
- React Router DOM for navigation
- TailwindCSS for styling
- Axios for API requests
- Recharts for data visualization
- React Icons
- Vite as build tool

### Backend
- Node.js
- Express.js
- MongoDB
- JWT for authentication

## Full project folder structure

```
Expense Tracker
├── README.md
├── .gitignore
├── package.json
├── backend/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── expenseController.js
│   │   └── incomeController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddle.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Expense.js
│   │   └── Income.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── expenseRoutes.js
│   │   └── incomeRoutes.js
│   └── uploads/
└── frontend/
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── README.md
    ├── vite.config.js
    ├── public/
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── assets/
        │   └── images/
        │       └── (images such as auth-bg.png, card2.png, ...)
        ├── components/
        │   ├── Cards/
        │   │   ├── CharAvatar.jsx
        │   │   ├── InfoCard.jsx
        │   │   └── TransactionInfoCard.jsx
        │   ├── Dashboard/
        │   │   └── RecentTransactions.jsx
        │   ├── Inputs/
        │   │   ├── Input.jsx
        │   │   └── ProfilePhotoSelector.jsx
        │   └── layouts/
        │       ├── AuthLayout.jsx
        │       ├── DashboardLayout.jsx
        │       ├── Navbar.jsx
        │       └── SideMenu.jsx
        ├── context/
        │   └── UserContext.jsx
        ├── hooks/
        │   └── useUserAuth.jsx
        ├── pages/
        │   ├── Auth/
        │   │   ├── Login.jsx
        │   │   └── SignUp.jsx
        │   └── Dashboard/
        │       ├── Home.jsx
        │       ├── Income.jsx
        │       └── Expense.jsx
        └── utils/
            ├── apiPaths.js
            ├── axiosInstance.js
            ├── data.js
            ├── helper.js
            └── uploadImage.js
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/expense-tracker.git
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

## Running the Application

1. Start the frontend development server:
```bash
cd frontend
npm run dev
```

2. Start the backend server:
```bash
cd backend
npm start
```