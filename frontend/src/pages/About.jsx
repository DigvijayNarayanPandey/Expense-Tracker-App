import { Link } from "react-router-dom";
import SeoMeta from "../../components/SeoMeta";

export default function About() {
  const techStack = [
    { category: "Frontend", items: ["React 19", "Vite 7", "Tailwind CSS 4", "Recharts", "React Router v7"] },
    { category: "Backend", items: ["Node.js", "Express 5", "MongoDB Atlas", "Mongoose", "JWT Auth"] },
    { category: "Tools", items: ["bcryptjs", "Multer", "xlsx", "Axios", "react-hot-toast"] },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Expense Tracker",
    description: "A free personal finance tracker built with the MERN stack to help users across India manage income and expenses.",
    url: "https://expense-tracker-app-digvijay.vercel.app/about",
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "Expense Tracker",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
      },
      creator: {
        "@type": "Person",
        name: "Digvijay Narayan Pandey",
        url: "https://github.com/DigvijayNarayanPandey",
      },
    },
  };

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-16 text-stone-900 sm:px-10">
      <SeoMeta
        title="About Expense Tracker - Free Personal Finance App for India"
        description="Learn about the Expense Tracker app — a free MERN-stack personal finance tool built to help Indians manage money better."
        path="/about"
        structuredData={structuredData}
      />

      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="text-sm font-semibold text-teal-700 no-underline hover:text-teal-800"
        >
          ← Back to Home
        </Link>

        <div className="mt-6 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center text-white font-bold text-lg">
            ₹
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            About Expense Tracker
          </h1>
        </div>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-stone-700">
          <section>
            <h2 className="text-xl font-bold text-stone-900">Our Story</h2>
            <p className="mt-3">
              Expense Tracker was born from a simple frustration — managing personal finances in India shouldn't require a complicated app or a spreadsheet full of formulas. We wanted something clean, fast, and purpose-built for how people actually spend money here.
            </p>
            <p className="mt-3">
              Whether you are a salaried professional in Delhi, a freelancer in Bangalore, or a student in Mumbai, tracking your rupees shouldn't feel like a chore. This app is designed to make logging income and expenses take just seconds — so you can focus on what matters: building better money habits.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900">What It Does</h2>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Track income sources and expense categories with emojis and notes</li>
              <li>View your financial health through interactive charts and summaries</li>
              <li>Export transaction history to Excel for tax filing or personal review</li>
              <li>Access your data securely from any device with JWT authentication</li>
              <li>Switch between light and dark mode for comfortable viewing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900">Why It's Free</h2>
            <p className="mt-3">
              Personal finance tools should be accessible to everyone. Expense Tracker is completely free to use — no hidden fees, no premium tiers, no credit card required. We believe that good financial habits start with good tools, and everyone deserves access to them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900">Built With</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {techStack.map((tech) => (
                <div key={tech.category} className="rounded-xl border border-stone-200 bg-white p-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-teal-700 mb-2">
                    {tech.category}
                  </h3>
                  <ul className="space-y-1">
                    {tech.items.map((item) => (
                      <li key={item} className="text-xs text-stone-600">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900">Open Source</h2>
            <p className="mt-3">
              The source code for Expense Tracker is available on GitHub under the MIT License. Developers are welcome to explore, fork, and contribute.
            </p>
            <a
              href="https://github.com/DigvijayNarayanPandey/Expense-Tracker-App"
              className="mt-3 inline-flex items-center rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white no-underline transition hover:bg-teal-800"
            >
              View on GitHub →
            </a>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900">The Developer</h2>
            <p className="mt-3">
              Expense Tracker is built and maintained by{" "}
              <a href="https://github.com/DigvijayNarayanPandey" className="text-teal-700 underline hover:text-teal-800">
                Digvijay Narayan Pandey
              </a>, a full-stack developer passionate about building tools that solve real problems. The app was created with the MERN stack and designed for users across India.
            </p>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="text-xl font-bold text-stone-900">Get in Touch</h2>
            <p className="mt-2">
              Have feedback, a bug report, or a feature suggestion? Reach out through the{" "}
              <a href="https://github.com/DigvijayNarayanPandey/Expense-Tracker-App/issues" className="text-teal-700 underline hover:text-teal-800">
                GitHub issues page
              </a>{" "}
              or connect via the{" "}
              <a href="https://github.com/DigvijayNarayanPandey" className="text-teal-700 underline hover:text-teal-800">
                developer's profile
              </a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
