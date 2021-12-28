export const successResponse = (result: object, message: string = '') => {
  return {
    success: true,
    message,
    result,
  };
};

export const failResponse = (message: string) => {
  return {
    success: false,
    message,
    result: {},
  };
};
