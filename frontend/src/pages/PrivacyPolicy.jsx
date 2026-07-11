import { Link } from "react-router-dom";
import SeoMeta from "../components/SeoMeta";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-stone-50 px-6 py-16 text-stone-900 sm:px-10">
      <SeoMeta
        title="Privacy Policy - Expense Tracker India"
        description="Learn how Expense Tracker collects, uses, and protects your personal data and financial information."
        path="/privacy-policy"
      />

      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="text-sm font-semibold text-teal-700 no-underline hover:text-teal-800"
        >
          ← Back to Home
        </Link>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          Last updated: May 4, 2026
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-stone-700">
          <section>
            <p>
              Expense Tracker ("we", "our", or "us") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our web application at{" "}
              <a href="https://expense-tracker-app-digvijay.vercel.app" className="text-teal-700 underline hover:text-teal-800">
                https://expense-tracker-app-digvijay.vercel.app
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900">1. Information We Collect</h2>
            <p className="mt-2">
              <strong>Account Information:</strong> When you register, we collect your full name, email address, and a securely hashed password. You may optionally upload a profile image.
            </p>
            <p className="mt-2">
              <strong>Financial Data:</strong> Income and expense records you create, including amounts, dates, categories, sources, and optional emoji icons. This data is stored securely and linked only to your account.
            </p>
            <p className="mt-2">
              <strong>Usage Data:</strong> Standard server logs such as IP address, browser type, device information, and pages visited are collected automatically for analytics and security purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900">2. How We Use Your Information</h2>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Create and manage your account securely</li>
              <li>Store and display your income and expense records</li>
              <li>Generate financial charts, summaries, and analytics</li>
              <li>Export your data to Excel spreadsheets upon request</li>
              <li>Improve the application's performance and user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900">3. Data Storage and Security</h2>
            <p className="mt-2">
              Your financial data is stored in MongoDB Atlas, a secure cloud database provider. Passwords are hashed using bcrypt before storage — we never store plain-text passwords. Authentication is handled via JWT (JSON Web Tokens) stored in your browser's localStorage.
            </p>
            <p className="mt-2">
              While we implement industry-standard security measures, no system is completely immune to threats. We continuously monitor and update our security practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900">4. Data Sharing</h2>
            <p className="mt-2">
              We do not sell, trade, or rent your personal information to third parties. Your financial data is private and accessible only to you. We may share anonymized, aggregated data for analytical purposes that cannot identify you personally.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900">5. Your Rights</h2>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Access, update, or delete your account information at any time</li>
              <li>Delete individual income or expense entries</li>
              <li>Remove your profile image</li>
              <li>Request a full export of your data in Excel format</li>
              <li>Close your account entirely, which will permanently delete all associated data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900">6. Cookies and Tracking</h2>
            <p className="mt-2">
              We use localStorage to store your authentication token and theme preference (dark/light mode). No third-party tracking cookies or analytics are currently used.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900">7. Children's Privacy</h2>
            <p className="mt-2">
              This application is not intended for children under the age of 13. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900">8. Changes to This Policy</h2>
            <p className="mt-2">
              We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900">9. Contact Us</h2>
            <p className="mt-2">
              If you have any questions about this privacy policy or how your data is handled, please contact us through the{" "}
              <a href="https://github.com/DigvijayNarayanPandey" className="text-teal-700 underline hover:text-teal-800">
                developer's GitHub profile
              </a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
