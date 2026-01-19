import type { Response } from "express";

const successResponse = (
  res: Response,
  { status = 200, message = "Success", data = null } = {}
) => {
  return res.status(status).json({
    status: true,
    message,
    data,
  });
};

export const formatApiResponse = (data: any, message?: string) => {
  return {
    data,
    message
  }
}

const errorResponse = (
  res: Response,
  { status = 500, message = "Something went wrong", error = null } = {}
) => {
  return res.status(status).json({
    status: false,
    message,
    error,
  });
};
module.exports = { successResponse, errorResponse };
