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
    if (exUser) {
      return res.status(403).json(failResponse('이미 사용중인 아이디 입니다.'));
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      gender,
      imagePath: '',
    });
    return res.status(201).json(successResponse(newUser, '등록 되었습니다.'));
  } catch (err) {
    next(err);
  }
};
