// Pure presentational — three animated dots.
// CSS animation uses Tailwind's built-in animate-bounce with staggered delays.

const TypingIndicator = () => (
  <div className="flex items-start gap-2">
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-gray-400 dark:bg-slate-500 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  </div>
);

export default TypingIndicator;
