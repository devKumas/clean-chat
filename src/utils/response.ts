import { logger } from './winston';

export const successResponse = (result: object, message: string = '') => {
  logger.info(JSON.stringify(result));
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
  };
};
