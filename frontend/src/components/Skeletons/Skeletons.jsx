import React from "react";

export const InfoCardSkeleton = () => {
    return (
        <div className="flex gap-6 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-md shadow-grey-100 dark:shadow-none border border-gray-200/50 dark:border-slate-800 animate-pulse">
            <div className="w-14 h-14 bg-gray-200 dark:bg-slate-700 rounded-full shrink-0"></div>
            <div className="flex flex-col gap-2 w-full mt-1">
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mt-1"></div>
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mt-1"></div>
            </div>
        </div>
    );
};

export const TransactionSkeleton = () => {
    return (
        <div className="group relative flex items-center gap-4 mt-2 p-3 rounded-lg border border-gray-100 dark:border-slate-800 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-full shrink-0"></div>

            <div className="flex-1 flex flex-col gap-2">
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
            </div>

            <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-16"></div>
        </div>
    );
};
