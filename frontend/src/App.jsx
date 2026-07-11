import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import UserProvider from "./context/UserContext";
import ThemeProvider from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";

const LandingPage = React.lazy(
  () => import("./pages/Landing Page/LandingPage"),
);
const Login = React.lazy(() => import("./pages/Auth/Login"));
const SignUp = React.lazy(() => import("./pages/Auth/SignUp"));
const Home = React.lazy(() => import("./pages/Dashboard/Home"));
const Income = React.lazy(() => import("./pages/Dashboard/Income"));
const Expense = React.lazy(() => import("./pages/Dashboard/Expense"));
const Transactions = React.lazy(() => import("./pages/Dashboard/Transactions"));
const GuidesHome = React.lazy(() => import("./pages/Guides/GuidesHome"));
const ExpenseTrackingIndia = React.lazy(
  () => import("./pages/Guides/ExpenseTrackingIndia"),
);
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = React.lazy(() => import("./pages/TermsOfService"));
const About = React.lazy(() => import("./pages/About"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const App = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <div>
          <Router>
            <React.Suspense
              fallback={
                <div className="flex h-screen w-screen items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/dashboard" element={<Home />} />
                <Route path="/income" element={<Income />} />
                <Route path="/expense" element={<Expense />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/guides" element={<GuidesHome />} />
                <Route
                  path="/guides/expense-tracking-india"
                  element={<ExpenseTrackingIndia />}
                />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} />
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
