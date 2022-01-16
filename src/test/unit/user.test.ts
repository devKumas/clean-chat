import { Request, Response } from 'express';
import httpMocks, { MockRequest, MockResponse } from 'node-mocks-http';

import * as controller from '../../controller/user';
import userModel from '../../models/user';
import { successResponse, failResponse } from '../../utils/returnResponse';
import user, { getUserById, getUserByEmail, createUser, updateUser } from '../data/user';

let req: MockRequest<Request>, res: MockResponse<Response>, next: any;

userModel.create = jest.fn();
userModel.findOne = jest.fn();
userModel.findAll = jest.fn();
userModel.update = jest.fn();

beforeEach(() => {
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('getUserById', () => {
  beforeEach(() => {
    req = httpMocks.createRequest({
      params: { userId: 1 },
    });
  });

  const { getUser } = getUserById;
  it('일치하는 정보가 없는 경우 404를 응답합니다.', async () => {
    (userModel.findOne as jest.Mock).mockReturnValue(null);
    await controller.getUserById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toStrictEqual(failResponse('일치하는 정보가 없습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('일치하는 정보가 있는 경우 200를 응답합니다.', async () => {
    (userModel.findOne as jest.Mock).mockReturnValue(getUser);
    await controller.getUserById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(successResponse(getUser, '조회 되었습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('오류 발생시 next(err)을 호출합니다.', async () => {
    const errorMessage = { message: 'error' };
    const rejectPromise = Promise.reject(errorMessage);
    (userModel.findOne as jest.Mock).mockReturnValue(rejectPromise);
    await controller.getUserById(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe('getUserEmail', () => {
  beforeEach(() => {
    req = httpMocks.createRequest({
      params: { userEmail: 'admin@kumas.dev' },
    });
  });

  const { getUser } = getUserByEmail;

  it('일치하는 정보가 없는 경우 404를 응답합니다.', async () => {
    (userModel.findOne as jest.Mock).mockReturnValue(null);
    await controller.getUserByEmail(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toStrictEqual(failResponse('일치하는 정보가 없습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('일치하는 정보가 있는 경우 200를 응답합니다.', async () => {
    (userModel.findOne as jest.Mock).mockReturnValue(getUser);
    await controller.getUserByEmail(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(successResponse(getUser, '조회 되었습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('오류 발생시 next(err)을 호출합니다.', async () => {
    const errorMessage = { message: 'error' };
    const rejectPromise = Promise.reject(errorMessage);
    (userModel.findOne as jest.Mock).mockReturnValue(rejectPromise);
    await controller.getUserByEmail(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe('createUser', () => {
  beforeEach(() => {
    req = httpMocks.createRequest({
      body: {
        email: 'admin@kumas.dev',
        password: 'password',
        name: '홍길동',
        gender: 'M',
      },
    });
  });

  const { exUser, newUser } = createUser;

  it('중복되는 아이디가 있는 경우 403을 응답합니다.', async () => {
    (userModel.findOne as jest.Mock).mockReturnValue(exUser);
    await controller.createUser(req, res, next);
    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toStrictEqual(failResponse('이미 사용중인 아이디 입니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('중복되는 아이디가 없는 경우 201을 응답합니다.', async () => {
    (userModel.findOne as jest.Mock).mockReturnValue(null);
    (userModel.create as jest.Mock).mockReturnValue(newUser);
    await controller.createUser(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toStrictEqual(successResponse(newUser, '등록 되었습니다.'));
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
      body: {
        email: 'admin@kumas.dev',
        password: 'password',
        name: '홍길동',
        gender: 'M',
      },
      user,
    });
  });

  const { exUser, changedUser } = updateUser;

  it('회원정보 수정 후 201을 응답합니다.', async () => {
    (userModel.findOne as jest.Mock).mockReturnValue(exUser);
    (userModel.update as jest.Mock).mockReturnValue(changedUser);
    await controller.updateUser(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toStrictEqual(successResponse(changedUser, '수정 되었습니다.'));
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
