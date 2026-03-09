import React from "react";
import {
  LuUtensils,
  LuTrendingUp,
  LuTrendingDown,
  LuTrash2,
} from "react-icons/lu";
import { addThousandSeparator } from "../../utils/helper";

const TransactionInfoCard = ({
  title,
  icon,
  date,
  amount,
  type,
  hideDeleteBtn,
  onDelete,
}) => {
  const getAmountStyles = () =>
    type === "income" ? "bg-green-50 dark:bg-green-900/40 text-green-500" : "bg-red-50 dark:bg-red-900/40 text-red-500";

  return (
    <div className="group relative flex items-center gap-4 mt-2 p-3 rounded-bg hover:bg-gray-100/60 dark:hover:bg-slate-800 transition-colors">
      <div className="w-12 h-12 flex items-center justify-center text-xl text-gray-800 dark:text-slate-200 bg-gray-100 dark:bg-slate-800 rounded-full">
        {icon ? (
          icon.length <= 10 ? (
            <span className="text-2xl">{icon}</span>
          ) : (
            <img src={icon} alt={title} className="w-6 h-6" />
          )
        ) : (
          <LuUtensils />
        )}
      </div>
      <div className="flex-1 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-700 dark:text-slate-200 font-medium">{title}</p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{date}</p>
        </div>
        <div className="flex items-center gap-2">
          {!hideDeleteBtn && (
            <button
              className="text-gray-400 hover:text-red-500 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={onDelete}
            >
              <LuTrash2 size={18} />
            </button>
          )}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getAmountStyles()}`}
          >
            <h6 className="text-xs font-medium">
              {type === "income" ? "+" : "-"} ₹{addThousandSeparator(amount)}
            </h6>
            {type === "income" ? <LuTrendingUp /> : <LuTrendingDown />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionInfoCard;
