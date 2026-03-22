import React from "react";
import { LuDownload } from "react-icons/lu";
import { formatDateDoMMMYYYY } from "../../utils/helper";
import TransactionInfoCard from "../Cards/TransactionInfoCard"
import { TransactionSkeleton } from "../Skeletons/Skeletons";

const ExpenseList = ({ transactions, onDelete, onDownload, loading }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">All Expenses</h5>

        <button className="card-btn" onClick={onDownload}>
          <LuDownload className="text-base" /> Download
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        {loading ? (
          [...Array(6)].map((_, index) => <TransactionSkeleton key={index} />)
        ) : transactions?.length > 0 ? (
          transactions?.map((expense, index) => (
            <TransactionInfoCard
              key={index}
              title={expense.category}
              icon={expense.icon}
              date={formatDateDoMMMYYYY(expense.date)}
              amount={expense.amount}
              type="expense"
              onDelete={() => onDelete(expense._id)}
            />
          ))
        ) : (
          <div className="text-center py-10 text-gray-400 text-sm col-span-full">
            No Expense found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
