// Renders structured transaction preview inside an AI message bubble.
// The two action buttons live here — not in the parent — because they're
// tightly coupled to the transaction data displayed.

import { LuCalendar } from "react-icons/lu";
import { formatDisplayDate } from "../../utils/aiConstants";

const ConfirmationCard = ({ transaction, onConfirm, onCancel, isSaving }) => {
  if (!transaction) return null;

  const isExpense = transaction.type === "expense";
  const label = isExpense ? transaction.category : transaction.source;
  const amount = Number(transaction.amount).toLocaleString("en-IN");

  return (
    <div
      className={`mt-2 p-4 rounded-xl border-l-4 ${
        isExpense
          ? "bg-red-50 border-red-400 dark:bg-red-900/20 dark:border-red-500"
          : "bg-green-50 border-green-400 dark:bg-green-900/20 dark:border-green-500"
      }`}
    >
      {/* Type label */}
      <p
        className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${
          isExpense
            ? "text-red-600 dark:text-red-400"
            : "text-green-600 dark:text-green-400"
        }`}
      >
        {transaction.icon} {transaction.type}
      </p>

      {/* Amount */}
      <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none mb-1">
        ₹{amount}
      </p>

      {/* Category / Source */}
      {label && (
        <p className="text-sm text-gray-600 dark:text-slate-300 font-medium">
          {label}
        </p>
      )}

      {/* Notes */}
      {transaction.notes && (
        <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 italic">
          &ldquo;{transaction.notes}&rdquo;
        </p>
      )}

      {/* Date */}
      {transaction.date && (
        <p className="flex items-center gap-1 text-xs text-gray-400 dark:text-slate-500 mt-1">
          <LuCalendar size={11} />
          {formatDisplayDate(transaction.date)}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={onConfirm}
          disabled={isSaving}
          className="flex-1 py-2 text-xs font-semibold bg-primary text-white rounded-lg hover:brightness-110 disabled:opacity-60 transition-all cursor-pointer"
        >
          {isSaving ? "Adding…" : "Confirm ✓"}
        </button>
        <button
          onClick={onCancel}
          disabled={isSaving}
          className="flex-1 py-2 text-xs font-semibold bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-60 transition-all cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConfirmationCard;
