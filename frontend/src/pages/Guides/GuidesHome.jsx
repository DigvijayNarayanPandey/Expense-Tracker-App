import { Link } from "react-router-dom";
import SeoMeta from "../../components/SeoMeta";

const guides = [
  {
    title: "Expense Tracking in India: A Simple Weekly System",
    description:
      "A practical system to track expenses weekly using categories that match real Indian household spending patterns.",
    to: "/guides/expense-tracking-india",
  },
];

const GuidesHome = () => {
  return (
    <main className="min-h-screen bg-stone-50 px-6 py-16 text-stone-900 sm:px-10">
      <SeoMeta
        title="Personal Finance Guides India | Expense Tracker"
        description="Free personal finance and budgeting guides for users in India. Learn practical methods to track expenses and save more each month."
        path="/guides"
      />

      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-widest text-teal-800">
          Resource Hub
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Personal Finance Guides for India
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-700">
          Actionable guides built for real income and spending behavior across
          India. Use these playbooks to build a sustainable tracking habit and
          improve your monthly savings.
        </p>

        <section className="mt-10 grid grid-cols-1 gap-4">
          {guides.map((guide) => (
            <article
              key={guide.to}
              className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold tracking-tight">
                {guide.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-stone-700">
                {guide.description}
              </p>
              <Link
                to={guide.to}
                className="mt-4 inline-flex items-center rounded-lg bg-teal-800 px-4 py-2 text-sm font-semibold text-white no-underline transition hover:bg-teal-800"
              >
                Read guide
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
};

export default GuidesHome;
