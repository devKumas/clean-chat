export const successResponse = (data: object, message: string = '') => {
  return {
    data,
    message,
  };
};

export const failResponse = (message: string) => {
  return {
    data: {},
    message,
  };
};
