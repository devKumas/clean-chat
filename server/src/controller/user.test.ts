import { Request, Response } from 'express';
import * as controller from './user';

import userModel from '../models/user';
import httpMocks, { MockRequest, MockResponse } from 'node-mocks-http';
import { successResponse, failResponse } from '../utils/returnResponse';

let req: MockRequest<Request>, res: MockResponse<Response>, next: any;

userModel.create = jest.fn();
userModel.findOne = jest.fn();
userModel.update = jest.fn();

const user = {
  email: 'admin@kumas.dev',
  password: 'password',
  name: '홍길동',
  gender: 1,
};

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('getUser', () => {
  beforeEach(() => {
    req.params.id = '1';
  });

  it('getUser 함수가 있어야 합니다.', () => {
    expect(typeof controller.getUser).toBe('function');
  });

  it('userModel의 findOne을 호출해야 합니다.', async () => {
    await controller.getUser(req, res, next);
    expect(userModel.findOne).toBeCalled();
  });

  it('일치하는 정보가 없는경우 JSON Data와 상태코드 404를 응답합니다.', async () => {
    (userModel.findOne as jest.Mock).mockReturnValue(null);
    await controller.getUser(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toStrictEqual(failResponse('일치하는 정보가 없습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('회원정보를 조회해 JSON Data와 상태코드 200를 응답합니다.', async () => {
    (userModel.findOne as jest.Mock).mockReturnValue(user);
    await controller.getUser(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(successResponse(user, '조회 되었습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('오류를 처리 합니다.', async () => {
    const errorMessage = { message: 'error' };
    const rejectPromise = Promise.reject(errorMessage);
    (userModel.findOne as jest.Mock).mockReturnValue(rejectPromise);
    await controller.getUser(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe('createUser', () => {
  beforeEach(() => {
    req.body = user;
  });

  it('creatUser 함수가 있어야 합니다.', () => {
    expect(typeof controller.createUser).toBe('function');
  });

  it('userModel의 findOne, create을 호출해야 합니다.', async () => {
    await controller.createUser(req, res, next);
    expect(userModel.findOne).toBeCalled();
    expect(userModel.create).toBeCalled();
  });

  it('중복되는 아이디가 있는 경우 JSON Data와 상태코드 403을 응답합니다.', async () => {
    (userModel.findOne as jest.Mock).mockReturnValue(user);
    await controller.createUser(req, res, next);
    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toStrictEqual(failResponse('이미 사용중인 아이디 입니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('등록시 JSON Data와 상태코드 201을 응답합니다.', async () => {
    (userModel.findOne as jest.Mock).mockReturnValue(null);
    (userModel.create as jest.Mock).mockReturnValue(user);
    await controller.createUser(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toStrictEqual(successResponse(user, '등록 되었습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('오류를 처리 합니다.', async () => {
    const errorMessage = { message: 'error' };
    const rejectPromise = Promise.reject(errorMessage);
    (userModel.findOne as jest.Mock).mockReturnValue(rejectPromise);
    await controller.createUser(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
