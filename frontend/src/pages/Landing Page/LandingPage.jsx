import { Link } from "react-router-dom";

// ── tiny reusable pieces ──────────────────────────────────────────────
const NavLink = ({ href, children }) => (
    <a
        href={href}
        className="text-stone-500 hover:text-stone-800 text-sm font-medium transition-colors duration-150"
    >
        {children}
    </a>
);

const Tag = ({ children }) => (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 tracking-wide">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-600 inline-block" />
        {children}
    </span>
);

const SectionLabel = ({ children, center }) => (
    <div className={`flex items-center gap-2 mb-3 ${center ? "justify-center" : ""}`}>
        <span className="w-5 h-0.5 bg-teal-600 rounded-full inline-block" />
        <span className="text-xs font-bold uppercase tracking-widest text-teal-700">
            {children}
        </span>
    </div>
);

// ── dashboard mock data ───────────────────────────────────────────────
const bars = [
    { month: "Oct", income: 55, expense: 38 },
    { month: "Nov", income: 70, expense: 45 },
    { month: "Dec", income: 60, expense: 55 },
    { month: "Jan", income: 80, expense: 40 },
    { month: "Feb", income: 65, expense: 35 },
    { month: "Mar", income: 90, expense: 42 },
];

const transactions = [
    { icon: "🛒", name: "Grocery Shopping", cat: "Food & Dining", date: "Mar 15", amt: "−₹2,340", neg: true },
    { icon: "💼", name: "Freelance Payment", cat: "Income", date: "Mar 14", amt: "+₹15,000", neg: false },
    { icon: "🎬", name: "Netflix", cat: "Entertainment", date: "Mar 12", amt: "−₹649", neg: true },
];

const features = [
    { icon: "📊", title: "Smart Dashboard", bg: "bg-teal-50", desc: "Real-time overview of income, expenses, and net balance — all in one clean, focused view." },
    { icon: "💸", title: "Expense Tracking", bg: "bg-amber-50", desc: "Log every expense with categories, icons, and notes. Filter by date, type, or amount instantly." },
    { icon: "💰", title: "Income Management", bg: "bg-green-50", desc: "Track salary, freelance, and side hustles separately. Understand your total earning capacity." },
    { icon: "📈", title: "Visual Analytics", bg: "bg-sky-50", desc: "Recharts-powered graphs showing spending trends, category breakdowns, and monthly comparisons." },
    { icon: "🔐", title: "Secure Auth", bg: "bg-stone-100", desc: "JWT-based login with encrypted passwords. Your private data stays private — no exceptions." },
    { icon: "📥", title: "Export to Excel", bg: "bg-rose-50", desc: "Download your full history as a spreadsheet. Perfect for tax filing, audits, or personal review." },
];

const steps = [
    { n: "1", title: "Create your account", body: "Sign up with your name and email. JWT authentication keeps your session and data secure from day one." },
    { n: "2", title: "Log income & expenses", body: "Add transactions with categories and notes. Upload a profile picture too — it only takes a moment." },
    { n: "3", title: "Analyse and improve", body: "Let the dashboard do the thinking. Spot patterns, trim waste, and watch your savings grow month by month." },
];

const progressItems = [
    { label: "🛒 Food & Groceries", pct: 34, color: "bg-teal-600" },
    { label: "🏠 Rent & Housing", pct: 28, color: "bg-amber-500" },
    { label: "🚗 Transport", pct: 18, color: "bg-blue-500" },
    { label: "🎬 Entertainment", pct: 12, color: "bg-red-400" },
    { label: "📦 Others", pct: 8, color: "bg-teal-300" },
];

export default function LandingPage() {
    return (
        <div className="bg-stone-50 text-stone-900 font-sans overflow-x-hidden">

            {/* ══ NAV ══════════════════════════════════════════════════════ */}
            <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between
                      px-6 sm:px-10 bg-stone-50/90 backdrop-blur-md
                      border-b border-stone-200">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 font-bold text-lg text-stone-900 no-underline">
                    <span className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-sm text-white">
                        ₹
                    </span>
                    Expense Tracker
                </Link>

                {/* Desktop links */}
                <ul className="hidden md:flex items-center gap-8 list-none">
                    <li><NavLink href="#features">Features</NavLink></li>
                    <li><NavLink href="#how">How it works</NavLink></li>
                </ul>

                {/* CTA buttons */}
                <div className="flex items-center gap-2">
                    <Link
                        to="/login"
                        className="hidden sm:inline-block px-4 py-2 rounded-lg text-sm font-medium
                       border border-stone-300 text-stone-700 hover:bg-teal-700
                       hover:text-white transition-colors duration-150 no-underline"
                    >
                        Log in
                    </Link>
                    <Link
                        to="/signup"
                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-teal-700 text-white
                       hover:bg-teal-800 transition-all duration-150 no-underline
                       shadow-sm"
                    >
                        Get started free
                    </Link>
                </div>
            </nav>

            {/* ══ HERO ═════════════════════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-6 sm:px-10">
                <div className="pt-28 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                    {/* Left */}
                    <div className="animate-[fadeUp_.6s_.1s_ease_both]">
                        <Tag>Personal Finance Tracker</Tag>

                        <h1 className="mt-5 text-4xl sm:text-5xl xl:text-6xl font-extrabold
                           leading-[1.1] tracking-tight text-stone-900">
                            Know where every{" "}
                            <span className="text-teal-700 relative inline-block">
                                rupee
                                <span className="absolute bottom-0.5 left-0 right-0 h-0.5 bg-teal-700/30 rounded-full" />
                            </span>{" "}goes.
                        </h1>

                        <p className="mt-5 text-base leading-relaxed text-stone-600 max-w-md">
                            Expense Tracker helps you log income, track expenses, and see your
                            financial health through clean, beautiful charts all in one place.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <Link
                                to="/signup"
                                className="px-6 py-3 rounded-xl text-base font-semibold bg-teal-700 text-white
                           hover:bg-teal-800 shadow-md shadow-teal-700/25
                           hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-700/30
                           transition-all duration-150 no-underline"
                            >
                                Start for free →
                            </Link>
                            <a
                                href="#how"
                                className=" px-6 py-3 group flex items-center gap-1.5 text-sm font-medium
                           text-stone-500 hover:text-stone-800 transition-colors no-underline"
                            >
                                <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">See how it works →</span>
                            </a>
                        </div>

                        {/* Trust bar */}
                        <div className="mt-10 flex items-center gap-3">
                            <div className="flex">
                                {["RA", "PS", "AK"].map((i, idx) => (
                                    <span
                                        key={idx}
                                        className={`w-7 h-7 rounded-full border-2 border-stone-50 flex items-center
                                justify-content-center text-xs font-bold text-white
                                ${idx === 0 ? "bg-teal-400" : idx === 1 ? "bg-amber-400" : "bg-sky-500"}
                                ${idx !== 2 ? "-mr-2" : ""} flex items-center justify-center`}
                                        style={{ fontSize: "10px" }}
                                    >
                                        {i}
                                    </span>
                                ))}
                            </div>
                            <p className="text-xs text-stone-400 font-medium pl-2">
                                <strong className="text-stone-500">10,000+</strong> people already tracking smarter
                            </p>
                        </div>
                    </div>

                    {/* Right – Dashboard mockup */}
                    <div className="hidden lg:block animate-[fadeUp_.6s_.25s_ease_both]">
                        <div className="bg-white rounded-2xl border border-stone-400 shadow-2xl shadow-stone-900/10 overflow-hidden">
                            {/* Browser bar */}
                            <div className="bg-stone-200 border-b border-stone-300 px-4 py-2.5 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-600" />
                                <span className="w-2.5 h-2.5 rounded-full bg-green-600" />
                                <span className="flex-1 mx-3 bg-white border border-stone-200 rounded-md px-3 py-1
                                 text-xs text-stone-600 font-mono">
                                    expense-tracker.app/dashboard
                                </span>
                            </div>

                            <div className="p-5">
                                {/* Summary cards */}
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    {[
                                        { label: "Income", val: "₹85,000", cls: "text-emerald-600", bg: "bg-emerald-50", delta: "▲ 12% this month", dc: "text-emerald-600" },
                                        { label: "Expenses", val: "₹31,450", cls: "text-red-500", bg: "bg-red-50", delta: "▼ 5% this month", dc: "text-red-500" },
                                        { label: "Balance", val: "₹53,550", cls: "text-teal-700", bg: "bg-teal-50", delta: "Surplus", dc: "text-teal-600" },
                                    ].map((c) => (
                                        <div key={c.label} className={`${c.bg} rounded-xl p-3 border border-stone-200`}>
                                            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-700 mb-1">
                                                {c.label}
                                            </p>
                                            <p className={`text-base font-bold ${c.cls}`}>{c.val}</p>
                                            <p className={`text-[10px] mt-0.5 ${c.dc}`}>{c.delta}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Bar chart */}
                                <div className="border border-stone-200 rounded-xl p-3 mb-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-semibold text-stone-700">6-Month Overview</span>
                                        <div className="flex gap-2">
                                            <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded">Income</span>
                                            <span className="text-[10px] font-semibold bg-red-100 text-red-500 px-2 py-0.5 rounded">Expense</span>
                                        </div>
                                    </div>
                                    <div className="flex items-end gap-2 h-16">
                                        {bars.map((b) => (
                                            <div key={b.month} className="flex-1 flex gap-0.5 items-end">
                                                <div
                                                    className="flex-1 bg-teal-500 rounded-t"
                                                    style={{ height: `${b.income}%` }}
                                                />
                                                <div
                                                    className="flex-1 bg-red-500 rounded-t"
                                                    style={{ height: `${b.expense}%` }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2 mt-1.5">
                                        {bars.map((b) => (
                                            <span key={b.month} className="flex-1 text-center text-[9px] text-stone-600">
                                                {b.month}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Transactions */}
                                <p className="text-xs font-semibold text-stone-700 mb-2">Recent Transactions</p>
                                <div className="flex flex-col gap-1.5">
                                    {transactions.map((t) => (
                                        <div
                                            key={t.name}
                                            className="flex items-center justify-between bg-white border
                                 border-stone-100 rounded-lg px-3 py-2"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="w-7 h-7 rounded-lg bg-stone-50 flex items-center
                                         justify-center text-sm border border-stone-100">
                                                    {t.icon}
                                                </span>
                                                <div>
                                                    <p className="text-xs font-semibold text-stone-800">{t.name}</p>
                                                    <p className="text-[10px] text-stone-400">{t.date} · {t.cat}</p>
                                                </div>
                                            </div>
                                            <span className={`text-xs font-bold ${t.neg ? "text-red-500" : "text-emerald-600"}`}>
                                                {t.amt}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══ STATS STRIP ══════════════════════════════════════════════ */}
            <div className="bg-white border-y border-stone-200">
                <div className="max-w-7xl mx-auto px-6 sm:px-10
                        grid grid-cols-2 md:grid-cols-4">
                    {[
                        { n: "10K+", l: "Active Users" },
                        { n: "₹2.4M+", l: "Tracked Monthly" },
                        { n: "50K+", l: "Expenses Logged" },
                        { n: "98%", l: "User Satisfaction" },
                    ].map((s, i) => (
                        <div
                            key={s.l}
                            className={`py-8 px-4 text-center
                ${i < 3 ? "border-r border-stone-100" : ""}
                ${i === 1 ? "border-r-0 md:border-r border-stone-100" : ""}`}
                        >
                            <p className="text-3xl font-extrabold text-stone-900 tracking-tight">
                                <span className="text-teal-700">{s.n}</span>
                            </p>
                            <p className="text-xs text-stone-400 font-medium mt-1">{s.l}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ══ FEATURES ═════════════════════════════════════════════════ */}
            <section id="features" className="bg-white py-20 px-6 sm:px-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                        <div>
                            <SectionLabel>Features</SectionLabel>
                            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                                Everything your wallet<br className="hidden sm:block" /> has been waiting for.
                            </h2>
                        </div>
                        <p className="text-sm leading-relaxed text-stone-500 max-w-xs md:max-w-sm md:text-right">
                            Built with the MERN stack fast, secure, and designed to make personal finance effortless.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {features.map((f) => (
                            <div
                                key={f.title}
                                className="group border border-stone-300 rounded-2xl p-6 bg-stone-50
                           hover:-translate-y-1 hover:shadow-lg hover:shadow-stone-900/8
                           hover:border-teal-200 transition-all duration-200 cursor-default"
                            >
                                <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center
                                 justify-center text-xl mb-4 border border-stone-100`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-sm font-bold text-stone-900 mb-1.5">{f.title}</h3>
                                <p className="text-xs leading-relaxed text-stone-600">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ HOW IT WORKS ═════════════════════════════════════════════ */}
            <section id="how" className="bg-stone-50 py-20 px-6 sm:px-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* Steps */}
                        <div>
                            <SectionLabel>How it works</SectionLabel>
                            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-8">
                                Up and running<br className="hidden sm:block" /> in three steps.
                            </h2>
                            <div className="flex flex-col gap-6">
                                {steps.map((s) => (
                                    <div key={s.n} className="flex gap-4 items-start">
                                        <div className="w-9 h-9 rounded-xl border-2 border-teal-600 text-teal-700
                                    flex items-center justify-center font-extrabold text-sm shrink-0">
                                            {s.n}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-stone-900 mb-1">{s.title}</h4>
                                            <p className="text-xs leading-relaxed text-stone-500">{s.body}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Visual panel */}
                        <div className="bg-white border border-stone-200 rounded-2xl p-6
                            shadow-md shadow-stone-900/8">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-5">
                                Spending Breakdown · March 2025
                            </p>
                            <div className="flex flex-col gap-4 mb-6">
                                {progressItems.map((p) => (
                                    <div key={p.label}>
                                        <div className="flex justify-between mb-1.5">
                                            <span className="text-xs font-semibold text-stone-700">{p.label}</span>
                                            <span className="text-xs font-semibold text-stone-400">{p.pct}%</span>
                                        </div>
                                        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${p.color} rounded-full`}
                                                style={{ width: `${p.pct}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-stone-100 pt-5">
                                <div className="grid grid-cols-3 text-center gap-2">
                                    {[
                                        { val: "₹85,000", lbl: "Total Income", cls: "text-emerald-600" },
                                        { val: "₹31,450", lbl: "Total Spent", cls: "text-red-500" },
                                        { val: "₹53,550", lbl: "Net Saved", cls: "text-teal-700" },
                                    ].map((m) => (
                                        <div key={m.lbl}>
                                            <p className={`text-lg font-extrabold ${m.cls}`}>{m.val}</p>
                                            <p className="text-[10px] text-stone-400 font-medium mt-0.5">{m.lbl}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ CTA ══════════════════════════════════════════════════════ */}
            <section id="cta" className="bg-stone-900 py-20 px-6 sm:px-10 text-center">
                <div className="max-w-xl mx-auto">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="w-5 h-0.5 bg-teal-400 rounded-full inline-block" />
                        <span className="text-xs font-bold uppercase tracking-widest text-teal-400">
                            Get started today
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                        Stop guessing.
                        Start <span className="text-teal-400">knowing.</span>
                    </h2>
                    <div className="mt-8 flex flex-wrap gap-3 justify-center">
                        <Link
                            to="/signup"
                            className="px-6 py-3 rounded-xl text-sm font-semibold bg-white text-stone-900 
                            border border-transparent hover:border-white hover:text-white hover:bg-stone-900
                            transition-all duration-200 no-underline"
                        >
                            Create free account →
                        </Link>
                        <Link
                            to="/login"
                            className="px-6 py-3 rounded-xl text-sm font-semibold text-white
                         border border-white hover:bg-white hover:text-stone-900
                         transition-colors no-underline"
                        >
                            Already have an account
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══ FOOTER ═══════════════════════════════════════════════════ */}
            <footer className="bg-stone-900 border-t border-white/5 px-6 sm:px-10 pt-12 pb-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                        {/* Brand */}
                        <div className="col-span-2 md:col-span-1">
                            <Link to="/" className="flex items-center gap-2 font-bold text-base
                                       text-white no-underline mb-3">
                                <span className="w-8 h-8 rounded-xl bg-teal-700 flex items-center
                                  justify-center text-sm text-white">
                                    ₹
                                </span>
                                Expense Tracker
                            </Link>
                            <p className="text-xs leading-relaxed text-stone-500 max-w-[200px]">
                                A modern expense tracker. Built to help you spend smarter and save more every month.
                            </p>
                        </div>

                        {/* Links */}
                        {[
                            {
                                title: "Account",
                                links: [["/login", "Login"], ["/signup", "Sign Up"], ["#", "Dashboard"], ["#", "Settings"]]
                            },
                            {
                                title: "Legal",
                                links: [["#", "Privacy Policy"], ["#", "Terms of Service"], ["#", "Cookie Policy"]]
                            },
                        ].map((col) => (
                            <div key={col.title}>
                                <h5 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-4">
                                    {col.title}
                                </h5>
                                <div className="flex flex-col gap-2">
                                    {col.links.map(([href, label]) => (
                                        <a
                                            key={label}
                                            href={href}
                                            className="text-xs text-stone-500 hover:text-white
                                 transition-colors no-underline"
                                        >
                                            {label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row
                          items-center justify-between gap-3">
                        <p className="text-xs text-stone-600">© 2026 Expense Tracker. All rights reserved.</p>
                        <p className="text-xs text-stone-600">
                            Built with{" "}
                            <span className="text-teal-400 font-semibold">
                                MongoDB · Express · React · Node.js
                            </span>
                        </p>
                    </div>
                </div>
            </footer>

        </div>
    );
}