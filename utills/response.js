 const successResponse = (
  res,
  { status = 200, message = "Success", data = null } = {}
) => {
  return res.status(status).json({
    status: true,
    message,
    data,
  });
};

 const errorResponse = (
  res,
  { status = 500, message = "Something went wrong", error = null } = {}
) => {
  return res.status(status).json({
    status: false,
    message,
    error,
  });
};
module.exports={successResponse,errorResponse}