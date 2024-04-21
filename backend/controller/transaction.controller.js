const Transaction = require("../models/transactions.model");
const axios = require("axios");

const transactionsController = async (req, res, next) => {
  try {
    // Month filter
    const selectedMonth = parseInt(req.params.month);

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;

    // Search parameter
    const search = req.query.search;

    // MongoDB aggregation pipeline stages
    const pipeline = [
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, selectedMonth] },
        },
      },
    ];

    // Optional: Add search stage if search parameter is provided
    if (search?.search.length >= 1) {
      pipeline.push({
        $match: {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { price: { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    // Count total documents matching the search criteria
    const totalTransactions = await Transaction.aggregate([
      ...pipeline,
      { $count: "total" },
    ]);

    // Fetch transactions based on pagination and aggregation pipeline
    const transactions = await Transaction.aggregate([
      ...pipeline,
      { $skip: (page - 1) * perPage },
      { $limit: perPage },
    ]);

    res.status(200).json({
      status: "SUCCESS",
      transactions: {
        totalTransactions:
          totalTransactions.length > 0 ? totalTransactions[0].total : 0,
        currentPage: page,
        totalPages: Math.ceil((totalTransactions[0]?.total || 0) / perPage),
        transactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

const statisticsController = async (req, res, next) => {
  try {
    const selectedMonth = parseInt(req.params.month);

    // Calculate total sale amount of selected month
    const totalSaleAmount = await Transaction.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, selectedMonth],
          },
          sold: true,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$price" },
        },
      },
    ]);

    // Calculate total number of sold items of selected month
    const totalSoldItems = await Transaction.countDocuments({
      $expr: {
        $eq: [{ $month: "$dateOfSale" }, selectedMonth],
      },
      sold: true,
    });

    // Calculate total number of not sold items of selected month
    const totalNotSoldItems = await Transaction.countDocuments({
      $expr: {
        $eq: [{ $month: "$dateOfSale" }, selectedMonth],
      },
      sold: false,
    });

    // Send the statistics as JSON response
    res.status(200).json({
      status: "SUCCESS",
      statistics: {
        totalSaleAmount:
          totalSaleAmount.length > 0 ? totalSaleAmount[0].total : 0,
        totalSoldItems,
        totalNotSoldItems,
      },
    });
  } catch (error) {
    next(error);
  }
};

const barChartController = async (req, res, next) => {
  try {
    const selectedMonth = parseInt(req.params.month);

    // Define price ranges
    const priceRanges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Number.MAX_SAFE_INTEGER }, // Anything above 901
    ];

    // Aggregate data based on price ranges for the selected month
    const priceRangeData = await Transaction.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, selectedMonth],
          },
        },
      },
      {
        $group: {
          _id: null,
          data: {
            $push: {
              $switch: {
                branches: priceRanges.map((range, index) => ({
                  case: {
                    $and: [
                      { $gte: ["$price", range.min] },
                      { $lte: ["$price", range.max] },
                    ],
                  },
                  then: `${range.min}-${range.max}`,
                })),
                default: "901-above",
              },
            },
          },
        },
      },
      {
        $unwind: "$data",
      },
      {
        $group: {
          _id: "$data",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Map the results to a format suitable for the bar chart
    const formattedData = priceRanges.map((range) => {
      const label = `${range.min}-${range.max}`;
      const countData = priceRangeData.find((data) => data._id === label);
      return {
        range: label,
        count: countData ? countData.count : 0,
      };
    });

    res.status(200).json({ status: "SUCCESS", barChartStats: formattedData });
  } catch (error) {
    next(error);
  }
};

const pieChartController = async (req, res, next) => {
  try {
    const selectedMonth = parseInt(req.params.month);

    // Aggregate data based on categories for the selected month
    const categoryData = await Transaction.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, selectedMonth],
          },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format the data for the pie chart
    const formattedData = categoryData.map((entry) => ({
      category: entry._id,
      count: entry.count,
    }));

    res.status(200).json({ status: "SUCCESS", pieChartStats: formattedData });
  } catch (error) {
    next(error);
  }
};

const transactionDatController = async (req, res, next) => {
  try {
    const month = parseInt(req.params.month);
    const backendURL = process.env.BACKEND_URL;

    const allData = {};

    const page = req.query.page;
    const search = req.query.search;

    //Transactions
    const reqURL1 = `${backendURL}/transactions/${month}`;
    const result1 = await axios.get(reqURL1, {
      params: {
        page: page || 1,
        search: search || "",
      },
    });
    allData.transactions = result1.data.transactions;

    //Bar chart
    const reqURL4 = `${backendURL}/bar-chart/${month}`;
    const result4 = await axios.get(reqURL4);
    allData.barChartStats = result4.data.barChartStats;

    //Pie chart
    const reqURL2 = `${backendURL}/pie-chart/${month}`;
    const result2 = await axios.get(reqURL2);
    allData.pieChartStats = result2.data.pieChartStats;

    //Statistics
    const reqURL3 = `${backendURL}/statistics/${month}`;
    const result3 = await axios.get(reqURL3);
    allData.statistics = result3.data.statistics;

    res.status(200).json({
      status: "SUCCESS",
      allData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  transactionsController,
  statisticsController,
  barChartController,
  pieChartController,
  transactionDatController,
};
