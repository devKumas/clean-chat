import { Request, Response } from 'express';
import httpMocks, { MockRequest, MockResponse } from 'node-mocks-http';

import * as controller from '../../controller/friend';
import userModel from '../../models/user';
import { successResponse, failResponse } from '../../utils/response';
import user from '../data/user';
import { getFriends } from '../data/friend';

let req: MockRequest<Request>, res: MockResponse<Response>, next: any;

userModel.findOne = jest.fn();

beforeEach(() => {
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('getFriends', () => {
  beforeEach(() => {
    req = httpMocks.createRequest({
      user,
    });
  });
  const { friends } = getFriends;
  it('나의 친구를 조회하고 200을 응답합니다.', async () => {
    (userModel.findOne as jest.Mock).mockReturnValue({
      getFriends: () => friends,
    });

    await controller.getFriends(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(successResponse(friends, '조회 되었습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('오류 발생시 next(err)을 호출합니다.', async () => {
    const errorMessage = { message: 'error' };
    const rejectPromise = Promise.reject(errorMessage);
    (userModel.findOne as jest.Mock).mockReturnValue(rejectPromise);
    await controller.getFriends(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe('addFriend', () => {
  it('자신의 아이디를 추가하는 경우 403을 호출합니다.', async () => {
    req = httpMocks.createRequest({
      user,
      body: { userId: 1 },
    });
    await controller.addFriend(req, res, next);
    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toStrictEqual(failResponse('자신의 아이디를 추가할 수 없습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('없는 아이디를 추가하는 경우 404을 호출합니다.', async () => {
    req = httpMocks.createRequest({
      user,
      params: { id: 2 },
    });
    (userModel.findOne as jest.Mock).mockReturnValue(null);
    await controller.addFriend(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toStrictEqual(failResponse('존재하지 않는 아이디 입니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('친구 등록시 201을 호출합니다.', async () => {
    req = httpMocks.createRequest({
      user,
      params: { id: 2 },
    });
    (userModel.findOne as jest.Mock)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce({ addFriend: () => {} });

    await controller.addFriend(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toStrictEqual(successResponse({}, '등록 되었습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('오류 발생시 next(err)을 호출합니다.', async () => {
    const errorMessage = { message: 'error' };
    const rejectPromise = Promise.reject(errorMessage);
    (userModel.findOne as jest.Mock).mockReturnValue(rejectPromise);
    await controller.addFriend(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe('removeFriend', () => {
  it('없는 아이디를 삭제하는 경우 404을 호출합니다.', async () => {
    req = httpMocks.createRequest({
      user,
      params: { id: 2 },
    });
    (userModel.findOne as jest.Mock).mockReturnValue({
      hasFriend: () => false,
    });
    await controller.removeFriend(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toStrictEqual(failResponse('존재하지 않는 아이디 입니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('친구 삭제시 201을 호출합니다.', async () => {
    req = httpMocks.createRequest({
      user,
      params: { id: 2 },
    });
    (userModel.findOne as jest.Mock).mockReturnValue({
      hasFriend: () => true,
      removeFriend: () => {},
    });

    await controller.removeFriend(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toStrictEqual(successResponse({}, '삭제 되었습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('오류 발생시 next(err)을 호출합니다.', async () => {
    const errorMessage = { message: 'error' };
    const rejectPromise = Promise.reject(errorMessage);
    (userModel.findOne as jest.Mock).mockReturnValue(rejectPromise);
    await controller.removeFriend(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
