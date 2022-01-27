import { RequestHandler } from 'express';
import passport from 'passport';

import User from '../models/user';
import { successResponse } from '../utils/response';
import { addSocket } from '../utils/socket';

export const loginUser: RequestHandler = (req, res, next) => {
  passport.authenticate('local', (err: Error, user: User, info: object) => {
    if (err) {
      return next(err);
    }

    if (info) {
      return res.status(401).json(info);
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

        const { socketId } = req.body;
        if (socketId) {
          addSocket(user.id, socketId);
        }

        return res.status(200).json(successResponse(fullUser!, '로그인 되었습니다.'));
      } catch (error) {
        console.error(error);
        next(error);
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
