import { Link } from "react-router-dom";
import SeoMeta from "../components/SeoMeta";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-stone-50 px-6 py-16 text-stone-900 sm:px-10">
      <SeoMeta
        title="Terms of Service - Expense Tracker India"
        description="Terms and conditions for using the Expense Tracker web application."
        path="/terms"
      />

      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="text-sm font-semibold text-teal-700 no-underline hover:text-teal-800"
        >
          ← Back to Home
        </Link>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          Last updated: May 4, 2026
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-stone-700">
          <section>
            <p>
              By accessing or using the Expense Tracker application at{" "}
              <a href="https://expense-tracker-app-digvijay.vercel.app" className="text-teal-700 underline hover:text-teal-800">
                https://expense-tracker-app-digvijay.vercel.app
              </a>, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900">1. Account Registration</h2>
            <p className="mt-2">
              You must create an account to use the core features of Expense Tracker. You agree to provide accurate and complete information during registration and to keep your account credentials secure. You are responsible for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900">2. Acceptable Use</h2>
            <p className="mt-2">You agree not to:</p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Use the application for any illegal or unauthorized purpose</li>
              <li>Attempt to gain unauthorized access to other users' accounts or data</li>
              <li>Interfere with or disrupt the application's functionality or servers</li>
              <li>Use automated systems to access the application without prior permission</li>
              <li>Upload malicious files, viruses, or harmful content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900">3. Financial Data Accuracy</h2>
            <p className="mt-2">
              Expense Tracker is a personal tool for tracking income and expenses. The accuracy of the data you enter is your responsibility. This application is not a substitute for professional financial, accounting, or tax advice. Always consult qualified professionals for important financial decisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900">4. Intellectual Property</h2>
            <p className="mt-2">
              The application's design, code, content, and branding are the intellectual property of the developer. You may not reproduce, distribute, or create derivative works without explicit permission. This project is available as open source under the MIT License on GitHub.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900">5. Service Availability</h2>
            <p className="mt-2">
              We strive to maintain uninterrupted service but do not guarantee that the application will always be available. Scheduled maintenance, technical issues, or unforeseen circumstances may cause temporary downtime. We will make reasonable efforts to minimize disruptions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900">6. Data Retention and Deletion</h2>
            <p className="mt-2">
              Your data is retained as long as your account is active. If you choose to delete your account, all associated financial records will be permanently removed from our servers. We recommend exporting your data before account deletion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900">7. Disclaimer of Warranties</h2>
            <p className="mt-2">
              The application is provided "as is" without warranties of any kind, either express or implied. We do not warrant that the service will be error-free, secure, or available at all times. Use of the application is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900">8. Limitation of Liability</h2>
            <p className="mt-2">
              In no event shall the developer be liable for any indirect, incidental, special, or consequential damages arising from your use of or inability to use the application, including but not limited to financial losses or data loss.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900">9. Changes to Terms</h2>
            <p className="mt-2">
              We reserve the right to modify these terms at any time. Updated terms will be posted on this page with a new revision date. Continued use of the application after changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900">10. Contact</h2>
            <p className="mt-2">
              For questions regarding these terms, please reach out via the{" "}
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
