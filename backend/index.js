const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");
const {
  errorMiddelware,
  pageNotFound,
} = require("./middelware/errorMiddelware");

//Models
const Transaction = require("./models/transactions.model");

//routes
const transactionsRoutes = require("./routes/transcation.routes");

const app = express();
dotenv.config();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ status: "ACTIVE", message: "Server is running" });
});

//routings
app.use(transactionsRoutes);

//error handler middleware
app.use(pageNotFound);
app.use(errorMiddelware);

//saving the products through api
const saveProducts = async () => {
  try {
    const count = await Transaction.countDocuments();
    if (count > 0) {
      console.log(
        "Product collection already contains data. Skipping insertion."
      );
      return;
    }

    const result1 = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );

    const result2 = await Transaction.insertMany(result1.data);
    console.log(`${result2.length} products saved to the database.`);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

app.listen(process.env.PORT, async (error) => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    await saveProducts();
    console.log(`server is running on http://localhost:${process.env.PORT}`);
  } catch (err) {
    console.log(err);
  }
});
