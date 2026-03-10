import React from "react";
import { LuArrowRight } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import { formatDateDoMMMYYYY } from "../../utils/helper";
import { TransactionSkeleton } from "../Skeletons/Skeletons";

const RecentIncome = ({ transactions, onSeeMore, loading }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Income</h5>
        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6">
        {loading ? (
          [...Array(5)].map((_, index) => <TransactionSkeleton key={index} />)
        ) : (
          transactions?.slice(0, 5)?.map((item) => (
            <TransactionInfoCard
              key={item._id}
              title={item.source}
              icon={item.icon}
              date={formatDateDoMMMYYYY(item.date)}
              amount={item.amount}
              type="income"
              hideDeleteBtn
            />
          ))
        )}
      </div>
    </div>
  );
};

export default RecentIncome;
