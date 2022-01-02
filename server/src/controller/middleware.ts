import { RequestHandler } from 'express';
import { failResponse } from '../utils/returnResponse';

export const isLoggedIn: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json(failResponse('로그인이 필요합니다.'));
  }
};

export const isNotLoggedIn: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json(failResponse('로그인 되어 있습니다.'));
  }
};
