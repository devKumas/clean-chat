import { Request, Response } from 'express';
import * as controller from '../../controller/user';

import userModel from '../../models/user';
import httpMocks, { MockRequest, MockResponse } from 'node-mocks-http';
import { successResponse, failResponse } from '../../utils/returnResponse';
import user from '../data/user.json';

let req: MockRequest<Request>, res: MockResponse<Response>, next: any;

userModel.create = jest.fn();
userModel.findOne = jest.fn();
userModel.findAll = jest.fn();
userModel.update = jest.fn();

beforeEach(() => {
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('getUserId', () => {
  beforeEach(() => {
    req = httpMocks.createRequest({
      params: { id: 1 },
    });
  });

  it('일치하는 정보가 없는 경우 404를 응답합니다.', async () => {
    (userModel.findOne as jest.Mock).mockReturnValue(null);
    await controller.getUserId(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toStrictEqual(failResponse('일치하는 정보가 없습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('일치하는 정보가 있는 경우 200를 응답합니다.', async () => {
    (userModel.findOne as jest.Mock).mockReturnValue(user);
    await controller.getUserId(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(successResponse(user, '조회 되었습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('오류 발생시 next(err)을 호출합니다.', async () => {
    const errorMessage = { message: 'error' };
    const rejectPromise = Promise.reject(errorMessage);
    (userModel.findOne as jest.Mock).mockReturnValue(rejectPromise);
    await controller.getUserId(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe('getUserEmail', () => {
  beforeEach(() => {
    req = httpMocks.createRequest({
      params: { email: 'admin@kumas.dev' },
    });
  });

  it('일치하는 정보가 없는 경우 404를 응답합니다.', async () => {
    (userModel.findOne as jest.Mock).mockReturnValue(null);
    await controller.getUserEmail(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toStrictEqual(failResponse('일치하는 정보가 없습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('일치하는 정보가 있는 경우 200를 응답합니다.', async () => {
    (userModel.findOne as jest.Mock).mockReturnValue(user);
    await controller.getUserEmail(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(successResponse(user, '조회 되었습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('오류 발생시 next(err)을 호출합니다.', async () => {
    const errorMessage = { message: 'error' };
    const rejectPromise = Promise.reject(errorMessage);
    (userModel.findOne as jest.Mock).mockReturnValue(rejectPromise);
    await controller.getUserEmail(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe('createUser', () => {
  beforeEach(() => {
    req = httpMocks.createRequest({
      body: user,
    });
  });

  it('중복되는 아이디가 있는 경우 403을 응답합니다.', async () => {
    (userModel.findOne as jest.Mock).mockReturnValue(user);
    await controller.createUser(req, res, next);
    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toStrictEqual(failResponse('이미 사용중인 아이디 입니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('중복되는 아이디가 없는 경우 201을 응답합니다.', async () => {
    (userModel.findOne as jest.Mock).mockReturnValue(null);
    (userModel.create as jest.Mock).mockReturnValue(user);
    await controller.createUser(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toStrictEqual(successResponse(user, '등록 되었습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('오류 발생시 next(err)을 호출합니다.', async () => {
    const errorMessage = { message: 'error' };
    const rejectPromise = Promise.reject(errorMessage);
    (userModel.findOne as jest.Mock).mockReturnValue(rejectPromise);
    await controller.createUser(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe('updateUser', () => {
  beforeEach(() => {
    req = httpMocks.createRequest({
      body: user,
      user: user,
    });
  });

  it('회원정보 수정 후 201을 응답합니다.', async () => {
    (userModel.findOne as jest.Mock).mockReturnValue(user);
    (userModel.update as jest.Mock).mockReturnValue(user);
    await controller.updateUser(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toStrictEqual(successResponse({}, '수정 되었습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('오류 발생시 next(err)을 호출합니다.', async () => {
    const errorMessage = { message: 'error' };
    const rejectPromise = Promise.reject(errorMessage);
    (userModel.findOne as jest.Mock).mockReturnValue(rejectPromise);
    await controller.updateUser(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe('uploadImage', () => {
  it('이미지 등록후 201을 응답합니다.', async () => {
    await controller.uploadImage(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toStrictEqual(
      successResponse({ imagePath: `/img/${req.file?.filename}` }, '등록 되었습니다.')
    );
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('오류 발생시 next(err)을 호출합니다.', async () => {
    const errorMessage = { message: 'error' };
    const rejectPromise = Promise.reject(errorMessage);
    (userModel.findOne as jest.Mock).mockReturnValue(rejectPromise);
    await controller.updateUser(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
