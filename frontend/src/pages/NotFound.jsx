import { Link } from "react-router-dom";
import SeoMeta from "../components/SeoMeta";

const NotFound = () => {
  return (
    <>
      <SeoMeta
        title="Page Not Found | Expense Tracker"
        description="The page you requested could not be found."
        path="/404"
        robots="noindex, nofollow"
      />
      <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Error 404
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
            The page you are looking for does not exist or may have moved.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              to="/"
              className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Back to Home
            </Link>
            <Link
              to="/login"
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default NotFound;
