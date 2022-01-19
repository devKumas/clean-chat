import { RequestHandler } from 'express';
import ChatContent from '../models/chatContent';
import ChatList from '../models/chatList';
import ChatUser from '../models/chatUser';
import User from '../models/user';

import { successResponse, failResponse } from '../utils/returnResponse';

export const getMessages: RequestHandler = async (req, res, next) => {
  const { chatId } = req.params;
  try {
    // 채팅에 참여 중인지 체크.
    const chatList = await ChatList.findAll({
      where: { id: chatId },
      attributes: ['id'],
      order: [[ChatContent, 'createdAt', 'desc']],
      include: [
        {
          model: ChatUser,
          attributes: [],
          required: true,
          include: [
            {
              model: User,
              where: { id: req.user!.id },
              attributes: [],
            },
          ],
        },
        {
          model: ChatContent,
          attributes: ['id', 'content', 'imagePath'],
          include: [
            {
              model: User,
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });
    if (!chatList.length) {
      res.status(403).json(failResponse('채팅에 참여 중이 아닙니다.'));
    }

    res.status(200).json(successResponse(chatList, '조회 되었습니다.'));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createMessage: RequestHandler = async (req, res, next) => {
  const { chatId } = req.params;
  const { message } = req.body;

  try {
    // 채팅에 참여 중인지 체크.
    const chatList = await ChatList.findAll({
      where: { id: chatId },
      attributes: ['id'],
      include: [
        {
          model: ChatUser,
          attributes: [],
          required: true,
          include: [
            {
              model: User,
              where: { id: req.user!.id },
              attributes: [],
            },
          ],
        },
      ],
    });
    if (!chatList.length) {
      res.status(403).json(failResponse('채팅에 참여 중이 아닙니다.'));
    }

    await ChatContent.create({
      content: message,
      ChatListId: chatId,
      UserId: req.user!.id,
    });

    res.status(201).json(successResponse({}, '등록 되었습니다.'));
  } catch (error) {
    console.error(error);
    next(error);
  }
};
