import { Link } from "react-router-dom";
import SeoMeta from "../../components/SeoMeta";

const ExpenseTrackingIndia = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How often should I track expenses in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A weekly review works best for most people. It is frequent enough to catch overspending early and simple enough to maintain long-term.",
        },
      },
      {
        "@type": "Question",
        name: "Which categories should I use first?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Start with Food, Rent, Transport, Utilities, Shopping, Health, and Entertainment. Add custom categories only after your first month of tracking.",
        },
      },
    ],
  };

  return (
    <article className="min-h-screen bg-white px-6 py-16 text-stone-900 sm:px-10">
      <SeoMeta
        title="Expense Tracking in India: A Simple Weekly System"
        description="Learn a practical weekly expense tracking system for India, with clear categories and a 20-minute review routine."
        path="/guides/expense-tracking-india"
        structuredData={faqSchema}
      />

      <div className="mx-auto max-w-3xl">
        <Link
          to="/guides"
          className="text-sm font-semibold text-teal-800 no-underline hover:text-teal-900"
        >
          ← Back to Guides
        </Link>

        <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Expense Tracking: A Simple Weekly System
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-stone-800">
          If tracking money feels difficult, simplify it: use fixed categories
          and review once a week. This method is designed for salaried
          professionals, students, and freelancers in India.
        </p>

        <section className="mt-8 space-y-6 text-sm leading-relaxed text-stone-800">
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              1. Use 7 Core Categories
            </h2>
            <p className="mt-2">
              Start with Food, Rent, Transport, Utilities, Health, Shopping, and
              Entertainment. These categories cover most monthly spending and
              make trends easier to identify.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-stone-900">
              2. Track Daily, Review Weekly
            </h2>
            <p className="mt-2">
              Add transactions quickly each day, then spend 20 minutes every
              Sunday checking totals, unusual spikes, and avoidable costs.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-stone-900">
              3. Follow the 50-30-20 Baseline
            </h2>
            <p className="mt-2">
              Try keeping needs around 50%, wants around 30%, and savings around
              20% of your income. Adjust based on city and personal obligations.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-stone-900">
              4. Keep One Monthly Correction Rule
            </h2>
            <p className="mt-2">
              Pick one overspending category and reduce it by 10% next month.
              Small, consistent corrections are more sustainable than aggressive
              cuts.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-stone-200 bg-stone-50 p-6">
          <h2 className="text-xl font-bold">Quick FAQ</h2>
          <div className="mt-4 space-y-4 text-sm text-stone-800">
            <div>
              <h3 className="font-semibold text-stone-900">
                How often should I track expenses in India?
              </h3>
              <p className="mt-1">
                Weekly reviews are ideal for consistency and fast corrections.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-stone-900">
                Which categories should I use first?
              </h3>
              <p className="mt-1">
                Start with 7 core categories and expand only after your first
                full month.
              </p>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
};

export default ExpenseTrackingIndia;
