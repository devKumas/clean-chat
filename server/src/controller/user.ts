import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';

import User from '../models/user';
import { successResponse, failResponse } from '../utils/returnResponse';

export const getUser: RequestHandler = (req, res) => {
  const user = req.user;
  return res.status(200).json(successResponse(user!));
};

export const postUser: RequestHandler = async (req, res, next) => {
  const { email, password, name, gender }: User = req.body;

  try {
    const exUser = await User.findOne({
      where: {
        email,
      },
    });

    if (exUser) {
      return res.status(403).json(failResponse('이미 사용중인 아이디 입니다.'));
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      gender,
    });
    return res.status(200).json(successResponse(newUser, '정상적으로 등록 되었습니다.'));
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const postLogin: RequestHandler = (req, res, next) => {
  passport.authenticate('local', (err: Error, user: User, info: { message: string }) => {
    if (err) {
      console.error(err);
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
        console.error(err);
        next(err);
      }
    });
  })(req, res, next);
};

export const postLogout: RequestHandler = (req, res, next) => {
  req.logout();
  req.session.destroy(() => {
    res.status(200).json(successResponse({}, '로그아웃 되었습니다.'));
  });
};
