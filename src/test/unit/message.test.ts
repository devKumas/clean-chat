import { Request, Response } from 'express';
import httpMocks, { MockRequest, MockResponse } from 'node-mocks-http';
import * as controller from '../../controller/message';

import userModel from '../../models/user';
import chatListModel from '../../models/chatList';
import chatContentModel from '../../models/chatContent';
import { successResponse, failResponse } from '../../utils/response';

import user from '../data/user';

import { sendSocket } from '../../utils/socket';
import { getMessages, createMessage } from '../data/message';

let req: MockRequest<Request>, res: MockResponse<Response>, next: any;

jest.mock('../../utils/socket');
chatListModel.findAll = jest.fn();
chatContentModel.create = jest.fn();
userModel.findAll = jest.fn();

beforeEach(() => {
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('getMessages', () => {
  beforeEach(() => {
    req = httpMocks.createRequest({
      user,
      params: {
        chatId: 1,
      },
      query: {
        messageId: 1,
      },
    });
  });

  const { chatList } = getMessages;
  it('채팅방에 참여하지 않았다면, 403을 호출합니다.', async () => {
    (chatListModel.findAll as jest.Mock).mockReturnValue([]);
    await controller.getMessages(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toStrictEqual(failResponse('권한이 없습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('채팅방에 참여하였다면 200을 반환합니다', async () => {
    (chatListModel.findAll as jest.Mock).mockReturnValue(chatList);
    await controller.getMessages(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(successResponse(chatList, '조회 되었습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe('createMessage', () => {
  beforeEach(() => {
    req = httpMocks.createRequest({
      user,
      params: {
        chatId: 1,
      },
      body: {
        message: '안녕하세요',
      },
      app: {
        get: () => {},
      },
    });
  });

  const { chatList, chatUser } = createMessage;
  it('채팅방에 참여하지 않았다면, 403을 호출합니다.', async () => {
    (chatListModel.findAll as jest.Mock).mockReturnValue([]);
    await controller.createMessage(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toStrictEqual(failResponse('권한이 없습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('채팅방에 참여하였다면 200을 반환합니다', async () => {
    (chatListModel.findAll as jest.Mock).mockReturnValue(chatList);
    (chatContentModel.create as jest.Mock).mockReturnValue({});
    (userModel.findAll as jest.Mock).mockReturnValue(chatUser);
    await controller.createMessage(req, res, next);

    expect(sendSocket).toBeCalled();
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toStrictEqual(successResponse({}, '등록 되었습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });
});
