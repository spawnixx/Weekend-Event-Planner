function errorHandler(err, req, res, next) {
  const status = err.status || 500;

  return res.status(status).json({
    error: {
      message: err.message || "Internal Server Error",
      status,
    },
  });
}

module.exports = errorHandler;
