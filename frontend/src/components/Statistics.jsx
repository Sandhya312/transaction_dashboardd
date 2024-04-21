import React, { useEffect, useState } from "react";

const Statistics = ({ stats, month }) => {
  return (
    <div className="mt-10 flex items-center flex-col">
      <h1 className="text-2xl font-bold">Statistics - {month} </h1>
      <div className="bg-yellow-200 w-max p-5 rounded-xl mt-5 text-left">
        <div className="flex justify-between ">
          <p className="font-semibold w-40">Total Sale</p>
          <p className="w-20">{Math.round(stats.totalSaleAmount)}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-semibold w-40">Total Sold item</p>
          <p className="w-20">{stats.totalSoldItems}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-semibold w-40">Total not sold item</p>
          <p className="w-20">{stats.totalNotSoldItems}</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
