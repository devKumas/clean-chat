import { Request, Response } from 'express';
import httpMocks, { MockRequest, MockResponse } from 'node-mocks-http';

import * as controller from '../../controller/middleware';
import { failResponse } from '../../utils/returnResponse';

let req: MockRequest<Request>, res: MockResponse<Response>, next: any;

beforeEach(() => {
  req = httpMocks.createRequest({
    isAuthenticated: jest.fn(),
  });
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('isLoggeIn', () => {
  it('로그인 되지 않은 경우 401을 응답합니다.', () => {
    (req.isAuthenticated as jest.Mock).mockReturnValue(false);
    controller.isLoggedIn(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toStrictEqual(failResponse('로그인이 필요합니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('로그인 되어 있는 경우 next를 호출합니다.', async () => {
    (req.isAuthenticated as jest.Mock).mockReturnValue(true);
    controller.isLoggedIn(req, res, next);
    expect(next).toBeCalled();
  });
});

describe('isNotLoggedIn', () => {
  it('로그인 되어 있는 경우 401을 응답합니다.', () => {
    (req.isAuthenticated as jest.Mock).mockReturnValue(true);
    controller.isNotLoggedIn(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toStrictEqual(failResponse('로그인 되어 있습니다.'));
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('로그인 되어 있지 않는 경우 next를 호출합니다.', async () => {
    (req.isAuthenticated as jest.Mock).mockReturnValue(false);
    controller.isNotLoggedIn(req, res, next);
    expect(next).toBeCalled();
  });
});
