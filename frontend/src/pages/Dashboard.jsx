import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import Statistics from "../components/Statistics";
import Piechart from "../components/Piechart";
import Barchart from "../components/Barchart";
import { getTransactionsData } from "../apis/transaction";
import { ToastContainer, toast } from "react-toastify";
import { monthNames } from "../constants/monthname";

const Dashboard = () => {
  const [transactionData, setTransactionData] = useState(null);
  const [month, setMonth] = useState(3);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const fetchData = async (month, search, page) => {
    const result = await getTransactionsData(month, search, page);
    if (result.status === "SUCCESS") {
      setTransactionData(result.allData);
      setTotalPage(result.allData.transactions.totalPages);
    }
  };

  useEffect(() => {
    if (search.length) {
      fetchData(month, search);
    } else {
      fetchData(month, search, page);
    }
  }, [month, search, page]);

  const handlePage = (operation) => {
    console.log(page, totalPage);
    if (operation === "next") {
      if (page < totalPage) {
        setPage((prev) => prev + 1);
      } else {
        toast.warning("You are on the last page");
      }
    } else {
      if (page > 1) {
        setPage((prev) => prev - 1);
      } else {
        toast.warning("You are on the first page");
      }
    }
  };

  return (
    transactionData && (
      <>
        <div className="mt-5 pb-10">
          <h1 className="font-bold text-center text-2xl font-serif underline">
            Transaction Dashboard
          </h1>
          <div className="flex justify-between items-center px-10 mt-5">
            <input
              type="text"
              className="bg-yellow-500 rounded-full px-2 py-2 font-semibold text-lg text-black h-[8vh] w-max placeholder-black text-center"
              placeholder="Search Transcations"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <select
              name="month"
              className="bg-yellow-500 text-lg h-[8vh] rounded-full w-max px-5 font-semibold cursor-pointer"
              value={month}
              onChange={(e) => {
                setPage(1);
                setMonth(e.target.value);
              }}
            >
              <option disabled selected hidden>
                Select Month
              </option>
              <option value="1">January</option>
              <option value="2">Febraury</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
          <Table
            transactionData={transactionData.transactions.transactions}
            page={page}
            setPageValue={handlePage}
          />

          <Statistics
            stats={transactionData.statistics}
            month={monthNames[month - 1]}
          />
          <Piechart
            stats={transactionData.pieChartStats}
            month={monthNames[month - 1]}
          />
          <Barchart
            stats={transactionData.barChartStats}
            month={monthNames[month - 1]}
          />
        </div>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </>
    )
  );
};

export default Dashboard;
