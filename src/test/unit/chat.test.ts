import { Request, Response } from 'express';
import httpMocks, { MockRequest, MockResponse } from 'node-mocks-http';

import * as controller from '../../controller/chat';
import userModel from '../../models/user';
import { sequelize as sequelizeModel } from '../../models';
import chatListModel from '../../models/chatList';
import chatUserModel from '../../models/chatUser';
import { successResponse, failResponse } from '../../utils/returnResponse';

import user from '../data/user';
import { getChatLists, createChatList, updateChatList } from '../data/chat';

let req: MockRequest<Request>, res: MockResponse<Response>, next: any;

userModel.findOne = jest.fn();
chatListModel.findAll = jest.fn();
chatListModel.create = jest.fn();
chatUserModel.findOne = jest.fn();
chatUserModel.create = jest.fn();
chatUserModel.update = jest.fn();
chatUserModel.destroy = jest.fn();
sequelizeModel.transaction = jest.fn();

beforeEach(() => {
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('getChatLists', () => {
  beforeEach(() => {
    req = httpMocks.createRequest({
      user,
    });
  });
  const { chatLists, chatUsers, chatResult } = getChatLists;
  it('유저의 모든 채팅방을 조회하고 200을 반환합니다.', async () => {
    (chatListModel.findAll as jest.Mock)
      .mockReturnValueOnce(chatLists)
      .mockReturnValueOnce(chatUsers);

    await controller.getChats(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(successResponse(chatResult, '조회 되었습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('오류 발생시 next(err)을 호출합니다.', async () => {
    const errorMessage = { message: 'error' };
    const rejectPromise = Promise.reject(errorMessage);
    (chatListModel.findAll as jest.Mock).mockReturnValue(rejectPromise);
    await controller.getChats(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe('createChatList', () => {
  const { userChatLists, targetChatLists, newChatList } = createChatList;
  it('자신의 아이디를 입력할 경우 403을 반환합니다.', async () => {
    req = httpMocks.createRequest({
      user,
      body: {
        userId: 1,
      },
    });

    await controller.createChat(req, res, next);
    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toStrictEqual(failResponse('자신과 채팅 할 수 없습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('일치하는 회원이 없는경우 404을 반환합니다.', async () => {
    req = httpMocks.createRequest({
      user,
      body: {
        userId: 2,
      },
    });
    (userModel.findOne as jest.Mock).mockReturnValue(null);

    await controller.createChat(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toStrictEqual(failResponse('일치하는 회원이 없습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('이미 채팅방이 존재하는 경우 200을 반환합니다.', async () => {
    req = httpMocks.createRequest({
      user,
      body: {
        userId: 2,
      },
    });
    (userModel.findOne as jest.Mock).mockReturnValue(user);
    (chatListModel.findAll as jest.Mock)
      .mockReturnValueOnce(userChatLists)
      .mockReturnValueOnce(targetChatLists);
    await controller.createChat(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(
      successResponse(targetChatLists, '이미 채팅방이 존재합니다.')
    );
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('채팅을 생성하고 201을 반환합니다.', async () => {
    req = httpMocks.createRequest({
      user,
      body: {
        userId: 2,
      },
    });
    (sequelizeModel.transaction as jest.Mock).mockReturnValue({
      commit: () => {},
    });
    (userModel.findOne as jest.Mock).mockReturnValue(user);
    (chatListModel.findAll as jest.Mock).mockReturnValueOnce(userChatLists).mockReturnValueOnce([]);
    (chatListModel.create as jest.Mock).mockReturnValue(newChatList);

    await controller.createChat(req, res, next);

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toStrictEqual(
      successResponse(newChatList, '채팅이 생성 되었습니다.')
    );
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('오류 발생시 next(err)을 호출합니다.', async () => {
    req = httpMocks.createRequest({
      user,
      body: {
        userId: 2,
      },
    });
    const errorMessage = { message: 'error' };
    const rejectPromise = Promise.reject(errorMessage);

    (sequelizeModel.transaction as jest.Mock).mockReturnValue({
      rollback: () => {},
    });
    (userModel.findOne as jest.Mock).mockReturnValue(rejectPromise);
    await controller.createChat(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe('updateChatList', () => {
  beforeEach(() => {
    req = httpMocks.createRequest({
      user,
      prams: {
        id: 1,
      },
      body: {
        title: '놀부와의 대화',
      },
    });
  });
  const { accessChat } = updateChatList;

  it('채팅이 없거나 수정 권한이 없는 경우 403을 호출합니다.', async () => {
    (chatUserModel.findOne as jest.Mock).mockReturnValue(null);

    await controller.updateChat(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toStrictEqual(failResponse('수정 권한이 없습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('수정에 성공하는 경우 201을 호출합니다', async () => {
    (chatUserModel.findOne as jest.Mock).mockReturnValue(accessChat);

    await controller.updateChat(req, res, next);

    expect(chatUserModel.update).toBeCalled();
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toStrictEqual(successResponse({}, '수정 되었습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('오류 발생시 next(err)을 호출합니다.', async () => {
    const errorMessage = { message: 'error' };
    const rejectPromise = Promise.reject(errorMessage);

    (chatUserModel.findOne as jest.Mock).mockReturnValue(rejectPromise);
    await controller.updateChat(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe('updateChatList', () => {
  beforeEach(() => {
    req = httpMocks.createRequest({
      user,
      prams: {
        id: 1,
      },
    });
  });
  const { accessChat } = updateChatList;

  it('채팅이 없거나 삭제 권한이 없는 경우 403을 호출합니다.', async () => {
    (chatUserModel.findOne as jest.Mock).mockReturnValue(null);

    await controller.removeChat(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toStrictEqual(failResponse('삭제 권한이 없습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('삭제에 성공하는 경우 201을 호출합니다', async () => {
    (chatUserModel.findOne as jest.Mock).mockReturnValue(accessChat);

    await controller.removeChat(req, res, next);

    expect(chatUserModel.destroy).toBeCalled();
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toStrictEqual(successResponse({}, '삭제 되었습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('오류 발생시 next(err)을 호출합니다.', async () => {
    const errorMessage = { message: 'error' };
    const rejectPromise = Promise.reject(errorMessage);

    (chatUserModel.findOne as jest.Mock).mockReturnValue(rejectPromise);
    await controller.removeChat(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
