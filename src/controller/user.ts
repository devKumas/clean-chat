import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';

import User from '../models/user';
import { addSocket } from '../utils/socket';
import { successResponse, failResponse } from '../utils/response';

export const getUserById: RequestHandler = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const getUser = await User.findOne({
      where: {
        id: parseInt(userId, 10),
      },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'],
      },
    });

    if (!getUser) return res.status(404).json(failResponse('일치하는 정보가 없습니다.'));

    return res.status(200).json(successResponse(getUser, '조회 되었습니다.'));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getUserByEmail: RequestHandler = async (req, res, next) => {
  const { userEmail } = req.params;
  try {
    const getUser = await User.findOne({
      where: {
        email: userEmail,
      },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'],
      },
    });

    if (!getUser) return res.status(404).json(failResponse('일치하는 정보가 없습니다.'));

    return res.status(200).json(successResponse(getUser, '조회 되었습니다.'));
  } catch (error) {
    console.error(error);
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
      attributes: ['id'],
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
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateUser: RequestHandler = async (req, res, next) => {
  const { email, password, name, gender, imagePath }: User = req.body;

  try {
    const exUser = await User.findOne({
      where: {
        id: req.user!.id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt'],
      },
    });

    const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;
    await User.update(
      {
        email: email || exUser?.email,
        password: hashedPassword || exUser?.password,
        name: name || exUser?.name,
        gender: gender || exUser?.gender,
        imagePath: imagePath || exUser?.imagePath,
      },
      { where: { id: req.user!.id } }
    );

    const getUser = await User.findOne({
      where: {
        id: req.user!.id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt'],
      },
    });
    return res.status(201).json(successResponse(getUser!, '수정 되었습니다.'));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const multerUpload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext).toLowerCase() + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadImage: RequestHandler = async (req, res, next) => {
  try {
    return res
      .status(201)
      .json(successResponse({ imagePath: `/img/${req.file?.filename}` }, '등록 되었습니다.'));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createSocket: RequestHandler = async (req, res, next) => {
  const { socketId } = req.body;

  const result = addSocket(req.user!.id, socketId);
  if (!result) {
    return res.status(201).json(failResponse('이미 등록되어 있습니다.'));
  }
  return res.status(201).json(successResponse(result, '등록 되었습니다.'));
};
