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

