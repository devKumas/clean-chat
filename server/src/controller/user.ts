import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';

import User from '../models/user';
import { successResponse, failResponse } from '../utils/returnResponse';

export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const getUser = await User.findOne({
      where: {
        id: parseInt(req.params.id, 10),
      },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'],
      },
    });

    if (!getUser) return res.status(404).json(failResponse('일치하는 정보가 없습니다.'));

    return res.status(200).json(successResponse(getUser, '조회 되었습니다.'));
  } catch (error) {
    next(error);
  }
};

export const createUser: RequestHandler = async (req, res, next) => {
  const { email, password, name, gender }: User = req.body;

  try {
    const exUser = await User.findOne({
      where: {
        email,
      },
    });
    if (exUser) return res.status(403).json(failResponse('이미 사용중인 아이디 입니다.'));

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      gender,
    });
    return res.status(201).json(successResponse(newUser, '등록 되었습니다.'));
  } catch (err) {
    next(err);
  }
};

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
