import React from "react";
import { LuArrowRight } from "react-icons/lu";
import { formatDateDoMMMYYYY } from "../../utils/helper";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import { TransactionSkeleton } from "../Skeletons/Skeletons";

const RecentTransactions = ({ transactions, onSeeMore, loading }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between ">
        <h5 className="text-lg">Recent Transactions</h5>
        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>
      <div className="mt-6">
        {loading ? (
          [...Array(5)].map((_, index) => <TransactionSkeleton key={index} />)
        ) : transactions?.length > 0 ? (
          transactions?.slice(0, 5)?.map((item) => (
            <TransactionInfoCard
              key={item._id}
              title={item.type === "income" ? item.source : item.category}
              icon={item.icon}
              date={formatDateDoMMMYYYY(item.date)}
              amount={item.amount}
              type={item.type}
              hideDeleteBtn
            />
          ))
        ) : (
          <div className="text-center py-10 text-gray-400 text-sm">
            No transactions found.
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
