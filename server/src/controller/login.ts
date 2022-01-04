import { RequestHandler } from 'express';
import passport from 'passport';

import User from '../models/user';
import { successResponse } from '../utils/returnResponse';

export const loginUser: RequestHandler = (req, res, next) => {
  passport.authenticate('local', (err: Error, user: User, info: { message: string }) => {
    if (err) {
      return next(err);
    }

    if (info) {
      return res.status(401).json(info.message);
    }

    return req.login(user, async (loginErr: Error) => {
      try {
        if (loginErr) {
          return next(loginErr);
        }

        const fullUser = await User.findOne({
          where: { id: user.id },
          attributes: {
            exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'],
          },
        });
        return res.status(200).json(successResponse(fullUser!, '로그인 되었습니다.'));
      } catch (err) {
        next(err);
      }
    });
  })(req, res, next);
};

export const logoutUser: RequestHandler = (req, res, next) => {
  req.logout();
  req.session.destroy(() => {
    res.status(200).json(successResponse({}, '로그아웃 되었습니다.'));
  });
};
