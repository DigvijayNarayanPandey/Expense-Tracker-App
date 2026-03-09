import React from "react";
import CARD_2 from "../../assets/images/card.png";
import { LuTrendingUpDown } from "react-icons/lu";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12 ">
        <h2 className="text-lg font-medium text-black dark:text-white">Expense Tracker</h2>
        {children}
      </div>
      <div className="hidden md:block w-[40vw] h-screen bg-violet-100 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative">
        <div className="w-48 h-48 rounded-[40px] bg-purple-800 absolute -top-7 -left-5" />
        <div className="w-48 h-56 rounded-[40px] border-[20px] border-fuchsia-700 absolute top-[30%] -right-10" />
        <div className="w-48 h-56 rounded-[40px] bg-violet-600 absolute -bottom-7 -left-5" />

        <div className="grid grid-cols-1 z-20">
          <StatsInfoCard
            icon={<LuTrendingUpDown />}
            label="Track your Income & Expenses"
            value="430,000"
            color="bg-primary"
          />
        </div>

        <img
          src={CARD_2}
          className="w-64 lg:w-[90%] absolute bottom-10 shadow-lg shadow-blue-400/15 rounded-2xl"
        />
      </div>
    </div>
  );
};

export default AuthLayout;

const StatsInfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex gap-6 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-md shadow-purple-400/10 dark:shadow-none border border-grey-200/50 dark:border-slate-800 z-10">
      <div
        className={`w-12 h-12 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl dark:drop-shadow-none`}
      >
        {icon}
      </div>
      <div>
        <h6 className="text-xs text-gray-500 dark:text-slate-400 mb-1">{label}</h6>
        <span className="text-[20px] dark:text-white">₹{value}</span>
      </div>
    </div>
  );
};
