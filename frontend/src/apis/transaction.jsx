import axios from "axios";
const backendURL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

export const getTransactionsData = async (month, search, page) => {
  try {
    const requrl = `${backendURL}/transaction-data/${month}`;
    const response = await axios.get(requrl, {
      params: {
        page: page || 1,
        search: search || "",
      },
    });
    return response.data;
  } catch (error) {
    if (error) {
      return error.response.data;
    }
  }
};

// export const getStatistics = async (month) => {
//   try {
//     const requrl = `${backendURL}/statistics/${month}`;
//     const response = await axios.get(requrl);
//     return response.data;
//   } catch (error) {
//     if (error) {
//       return error.response.data;
//     }
//   }
// };

// export const getPieChart = async (month) => {
//   try {
//     const requrl = `${backendURL}/pie-chart/${month}`;
//     const response = await axios.get(requrl);
//     return response.data;
//   } catch (error) {
//     if (error) {
//       return error.response.data;
//     }
//   }
// };

// export const getBarChart = async (month) => {
//   try {
//     const requrl = `${backendURL}/bar-chart/${month}`;
//     const response = await axios.get(requrl);
//     return response.data;
//   } catch (error) {
//     if (error) {
//       return error.response.data;
//     }
//   }
// };
