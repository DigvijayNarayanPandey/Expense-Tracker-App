import React from "react";
import { formatDateDoMMMYYYY } from "../../utils/helper";
import { LuArrowRight } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import { TransactionSkeleton } from "../Skeletons/Skeletons";

const ExpenseTransactions = ({ transactions, onSeeMore, loading }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Expanses</h5>

        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6">
        {loading ? (
          [...Array(4)].map((_, index) => <TransactionSkeleton key={index} />)
        ) : (
          transactions?.slice(0, 4)?.map((expense) => (
            <TransactionInfoCard
              key={expense._id}
              title={expense.category}
              icon={expense.icon}
              date={formatDateDoMMMYYYY(expense.date)}
              amount={expense.amount}
              type="expense"
              hideDeleteBtn
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseTransactions;
