import { RequestHandler } from 'express';
import { Op } from 'sequelize';
import ChatContent from '../models/chatContent';
import ChatList from '../models/chatList';
import ChatUser from '../models/chatUser';
import User from '../models/user';

import { successResponse, failResponse } from '../utils/returnResponse';

export const getMessages: RequestHandler = async (req, res, next) => {
  const { chatId } = req.params;
  const { messageId } = req.query;

  const where = messageId ? { id: { [Op.lt]: messageId } } : {};

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
        {
          model: ChatContent,
          attributes: ['id', 'content', 'imagePath', 'deleted'],
          where,
          include: [
            {
              model: User,
              attributes: ['id', 'name'],
            },
          ],
          limit: 100,
          order: [['id', 'desc']],
        },
      ],
    });
    if (!chatList.length) {
      return res.status(403).json(failResponse('권한이 없습니다.'));
    }
    return res.status(200).json(successResponse(chatList, '조회 되었습니다.'));
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
      return res.status(403).json(failResponse('권한이 없습니다.'));
    }

    await ChatContent.create({
      content: message,
      ChatListId: chatId,
      UserId: req.user!.id,
    });

    return res.status(201).json(successResponse({}, '등록 되었습니다.'));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const removeMessage: RequestHandler = async (req, res, next) => {
  const { messageId } = req.params;
  try {
    // 메시지 삭제 권한 체크
    const message = await ChatContent.findOne({
      where: { id: messageId },
      include: [
        {
          model: User,
          attributes: ['id'],
          where: { id: req.user!.id },
        },
      ],
    });

    if (!message || message.deleted) {
      return res.status(403).json(failResponse('권한이 없습니다.'));
    }

    await ChatContent.update(
      {
        content: null,
        imagePath: null,
        delete: true,
      },
      {
        where: { id: message!.id },
      }
    );

    return res.status(201).json(successResponse({}, '삭제 되었습니다.'));
  } catch (error) {
    console.log(error);
    next(error);
  }
};
