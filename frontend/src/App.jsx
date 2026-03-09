import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import Transactions from "./pages/Dashboard/Transactions";
import UserProvider from "./context/UserContext";
import ThemeProvider from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <div>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/signup" exact element={<SignUp />} />
            <Route path="/dashboard" exact element={<Home />} />
            <Route path="/income" exact element={<Income />} />
            <Route path="/expense" exact element={<Expense />} />
            <Route path="/transactions" exact element={<Transactions />} />
          </Routes>
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
