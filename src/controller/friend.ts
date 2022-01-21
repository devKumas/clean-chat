import { RequestHandler } from 'express';

import User from '../models/user';
import { successResponse, failResponse } from '../utils/returnResponse';

export const getFriends: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user!.id },
    });

    const friends = (await user!.getFriends({ attributes: ['id', 'name', 'imagePath'] })).map(
      ({ id, name, imagePath }) => {
        return { id, name, imagePath };
      }
    );

    return res.status(200).json(successResponse(friends, '조회 되었습니다.'));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const addFriend: RequestHandler = async (req, res, next) => {
  const { userId } = req.body;
  try {
    if (req.user!.id === parseInt(userId)) {
      return res.status(403).json(failResponse('자신의 아이디를 추가할 수 없습니다.'));
    }

    const exUser = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!exUser) {
      return res.status(404).json(failResponse('존재하지 않는 아이디 입니다.'));
    }

    const user = await User.findOne({
      where: { id: req.user!.id },
    });

    await user!.addFriend(parseInt(userId, 10));
    return res.status(201).json(successResponse({}, '등록 되었습니다.'));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const removeFriend: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user!.id },
    });

    const hasUser = await user!.hasFriend(parseInt(req.params.id, 10));

    if (!hasUser) {
      return res.status(404).json(failResponse('존재하지 않는 아이디 입니다.'));
    }

    await user!.removeFriend(parseInt(req.params.id, 10));
    return res.status(201).json(successResponse({}, '삭제 되었습니다.'));
  } catch (error) {
    console.error(error);
    next(error);
  }
};
