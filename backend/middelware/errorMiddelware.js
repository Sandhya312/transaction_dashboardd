const errorMiddelware = (err, req, res, next) => {
  res.status(err.status || 500).json({
    status: "FAILED",
    message: err.message,
  });
};

//page not found middelware
const pageNotFound = (req, res, next) => {
  const err = new Error("API path does not exist");
  err.status = 404;
  next(err);
};

module.exports = { errorMiddelware, pageNotFound };
