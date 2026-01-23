
// const successResponse = (
//   res: Response,
//   { status = 200, message = "Success", data = null } = {},
// ) => {
//   return res.status(status).json({
//     status: true,
//     message,
//     data,
//   });
// };

// const errorResponse = (
//   res: Response,
//   { status = 500, message = "Something went wrong", error = null } = {},
// ) => {
//   return res.status(status).json({
//     status: false,
//     message,
//     error,
//   });
// };

export const formatSuccessResponse = (data: any, message?: string) => {
  return {
    status: true,
    message,
    data,
  };
};

export const formaterrorResponse = (error: any, message?: string) => {
  return {
    status: false,
    message,
    error,
  };
};

