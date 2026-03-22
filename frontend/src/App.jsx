import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import UserProvider from "./context/UserContext";
import ThemeProvider from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";

const LandingPage = React.lazy(() => import("./pages/Landing Page/LandingPage"));
const Login = React.lazy(() => import("./pages/Auth/Login"));
const SignUp = React.lazy(() => import("./pages/Auth/SignUp"));
const Home = React.lazy(() => import("./pages/Dashboard/Home"));
const Income = React.lazy(() => import("./pages/Dashboard/Income"));
const Expense = React.lazy(() => import("./pages/Dashboard/Expense"));
const Transactions = React.lazy(() => import("./pages/Dashboard/Transactions"));

const App = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <div>
          <Router>
            <React.Suspense fallback={<div className="flex h-screen w-screen items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div></div>}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" exact element={<Login />} />
                <Route path="/signup" exact element={<SignUp />} />
                <Route path="/dashboard" exact element={<Home />} />
                <Route path="/income" exact element={<Income />} />
                <Route path="/expense" exact element={<Expense />} />
                <Route path="/transactions" exact element={<Transactions />} />
              </Routes>
            </React.Suspense>
          </Router>
        </div>

        <Toaster
          toastOptions={{
            className: "dark:bg-slate-800 dark:text-white",
            style: {
              fontSize: "13px",
            },
          }}
        />
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;

const Root = () => {
  // Check if token exists in Local Storage
  const isAuthenticated = !!localStorage.getItem("token");

  // Redirect to dashboard if authenticated, otherwise to Login page
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};
