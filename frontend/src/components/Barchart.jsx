import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Barchart = ({ stats, month }) => {
  const getRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  };

  return (
    <div className="px-5 mt-5 flex flex-col items-center">
      <h1 className="text-xl inline-block font-bold ">
        Bar Chart Stats- {month}{" "}
      </h1>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={stats}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill={getRandomColor()} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Barchart;
