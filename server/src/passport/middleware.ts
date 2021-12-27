import { Request, Response, NextFunction } from 'express';
import { failResponse } from '../utils/returnResponse';

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json(failResponse('로그인이 필요합니다.'));
  }
};

export const isNotLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json(failResponse('이미 로그인 되어 있습니다.'));
  }
};
