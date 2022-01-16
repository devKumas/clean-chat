import { RequestHandler } from 'express';
import { Op } from 'sequelize';

import { sequelize } from '../models';
import ChatList from '../models/chatList';
import ChatUser from '../models/chatUser';
import User from '../models/user';
import { successResponse, failResponse } from '../utils/returnResponse';

export const getChatLists: RequestHandler = async (req, res, next) => {
  try {
    // 유저의 모든 채팅방을 호출.
    const chatLists = await ChatList.findAll({
      include: [
        {
          model: ChatUser,
          attributes: ['chatTitle'],
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
      attributes: ['id'],
    });

    // 채팅방에 존재하는 유저들의 id를 호출하여 Map 형식으로 변환
    const chatUsers = (
      await ChatList.findAll({
        where: { id: { [Op.in]: chatLists.map(({ id }) => id) } },
        include: [
          {
            model: ChatUser,
            attributes: ['id'],
            required: true,
            include: [
              {
                model: User,
                where: { id: { [Op.not]: req.user!.id } },
                attributes: ['id', 'name'],
              },
            ],
          },
        ],
        attributes: ['id'],
      })
    )
      .map(({ id, ChatUsers }) => {
        const users = ChatUsers!.map(({ User }) => {
          return { id: User!.id, name: User!.name };
        });
        return { key: id, value: users };
      })
      .reduce((map, obj) => {
        map.set(obj.key, obj.value);
        return map;
      }, new Map());

    // 전달할 값을 가공.
    const result = chatLists.map(({ id, ChatUsers }) => {
      const { chatTitle } = ChatUsers![0];
      return { id, chatTitle, chatUsers: chatUsers.get(id) };
    });

    return res.status(200).json(successResponse(result, '조회 되었습니다.'));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const createChatList: RequestHandler = async (req, res, next) => {
  const { userId } = req.body;
  const t = await sequelize.transaction();

  try {
    if (req.user!.id === parseInt(userId)) {
      return res.status(403).json(failResponse('자신과 채팅 할 수 없습니다.'));
    }

    const getTagetUser = await User.findOne({
      where: {
        id: parseInt(userId, 10),
      },
      attributes: {
        include: ['id'],
      },
    });

    if (!getTagetUser) {
      return res.status(404).json(failResponse('일치하는 회원이 없습니다.'));
    }

    const userChatLists = await ChatList.findAll({
      where: { group: false },
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
      attributes: ['id'],
    });

    const targetChatLists = await ChatList.findAll({
      where: { group: false, id: { [Op.in]: userChatLists.map(({ id }) => id) } },
      include: [
        {
          model: ChatUser,
          attributes: [],
          required: true,
          include: [
            {
              model: User,
              where: { id: getTagetUser.id },
              attributes: [],
            },
          ],
        },
      ],
      attributes: ['id'],
    });

    if (targetChatLists.length) {
      return res.status(200).json(successResponse(targetChatLists, '이미 채팅방이 존재합니다.'));
    }
    const newChatList = await ChatList.create({}, { transaction: t });

    await ChatUser.create(
      {
        ChatListId: newChatList.id,
        UserId: req.user!.id,
      },
      { transaction: t }
    );

    await ChatUser.create(
      {
        ChatListId: newChatList.id,
        UserId: getTagetUser.id,
      },
      { transaction: t }
    );

    t.commit();

    return res.status(201).json(successResponse(newChatList, '채팅이 생성 되었습니다.'));
  } catch (error) {
    await t.rollback();
    console.log(error);
    next(error);
  }
};

export const updateChatList: RequestHandler = async (req, res, next) => {
  const { id: chatId } = req.params;
  const { title: chatTitle } = req.body;
  try {
    const accessChat = await ChatUser.findOne({
      attributes: ['id'],
      include: [
        {
          model: ChatList,
          where: { id: parseInt(chatId, 10) },
          attributes: [],
        },
        {
          model: User,
          where: { id: req.user!.id },
          attributes: [],
        },
      ],
    });

    if (!accessChat) {
      return res.status(403).json(failResponse('수정 권한이 없습니다.'));
    }

    await ChatUser.update(
      {
        chatTitle,
      },
      {
        where: { id: accessChat.id },
      }
    );
    return res.status(201).json(successResponse({}, '수정 되었습니다.'));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const removeChatList: RequestHandler = async (req, res, next) => {
  const { id: chatId } = req.params;
  try {
    const accessChat = await ChatUser.findOne({
      attributes: ['id'],
      include: [
        {
          model: ChatList,
          where: { id: parseInt(chatId, 10) },
          attributes: [],
        },
        {
          model: User,
          where: { id: req.user!.id },
          attributes: [],
        },
      ],
    });

    if (!accessChat) {
      return res.status(403).json(failResponse('삭제 권한이 없습니다.'));
    }

    await ChatUser.destroy({
      where: { id: accessChat.id },
    });
    return res.status(201).json(successResponse({}, '삭제 되었습니다.'));
  } catch (error) {
    console.log(error);
    next(error);
  }
};
