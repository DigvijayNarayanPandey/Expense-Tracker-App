import React from "react";

const InfoCard = ({ icon, label, value, color, details }) => {
  return (
    <div className="flex gap-6 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-md shadow-grey-100 dark:shadow-none border border-gray-200/50 dark:border-slate-800 transition-colors duration-200">
      <div
        className={`w-14 h-14 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}
      >
        {icon}
      </div>
      <div>
        <h6 className="text-sm text-gray-700 dark:text-slate-400 mb-1">{label}</h6>
        <span className="text-[22px] dark:text-white">₹{value}</span>
        {details && <p className="text-xs text-gray-700 dark:text-slate-500 mt-1">{details}</p>}
      </div>
    </div>
  );
};

export default InfoCard;
