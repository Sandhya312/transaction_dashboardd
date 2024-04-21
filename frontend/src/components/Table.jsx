import React from "react";

const Table = ({ transactionData, page, setPageValue }) => {
  return (
    <>
      <div className="mt-10 px-5">
        <table className="min-w-full table-auto  bg-yellow-200 border-black border-2 border-collapse mt-5">
          <thead>
            <tr className="bg-yellow-400 text-black uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left border-2 border-black">ID</th>
              <th className="py-3 px-6 text-left border-2 border-black">
                Title
              </th>
              <th className="py-3 px-6 text-left border-2 border-black">
                Description
              </th>
              <th className="py-3 px-6 text-left border-2 border-black">
                Price
              </th>
              <th className="py-3 px-6 text-left border-2 border-black">
                Sold
              </th>
              <th className="py-3 px-6 text-left border-2 border-black">
                Category
              </th>
              <th className="py-3 px-6 text-left border-2 border-black">
                Image
              </th>
            </tr>
          </thead>
          {transactionData.length ? (
            <tbody className="text-black text-sm font-light">
              {transactionData.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="py-3 px-6 text-left border-2 border-black">
                    {transaction.id}
                  </td>
                  <td className="py-3 px-6 text-left border-2 border-black">
                    {transaction.title}
                  </td>
                  <td className="py-3 px-6 text-left border-2 border-black">
                    {transaction.description}
                  </td>
                  <td className="py-3 px-6 text-left border-2 border-black">
                    {Math.round(transaction.price)}
                  </td>
                  <td className="py-3 px-6 text-left border-2 border-black">
                    {transaction.sold ? "Yes" : "No"}
                  </td>
                  <td className="py-3 px-6 text-left border-2 border-black">
                    {transaction.category}
                  </td>
                  <td className="py-3 px-6 text-left border-2 border-black">
                    <img
                      src={transaction.image}
                      alt={transaction.title}
                      className="h-10 w-10"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody className="text-center w-full text-2xl font-semibold mt-5">
              <tr>
                <td colSpan="6" className="border border-black">
                  No Transaction Found
                </td>
              </tr>
            </tbody>
          )}
        </table>
        <div className="flex justify-between mt-2">
          <h1 className="text-md">Page No: {page}</h1>
          <div className="flex gap-5">
            <button
              onClick={() => {
                setPageValue("prev");
              }}
            >
              Previous
            </button>
            <h1>-</h1>
            <button
              onClick={() => {
                setPageValue("next");
              }}
            >
              Next
            </button>
          </div>
          <h1>Per Page: 10</h1>
        </div>
      </div>
    </>
  );
};

export default Table;
