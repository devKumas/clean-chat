import express from 'express';
import { isLoggedIn, isNotLoggedIn } from '../controller/middleware';
import { getUser, createUser, loginUser, logoutUser } from '../controller/user';

/**
 * @swagger
 * tags:
 *   name: user
 */
const router = express.Router();

/**
 * @swagger
 * paths:
 *  /users/{userId}:
 *    get:
 *      summary: "회원을 조회합니다."
 *      tags: [user]
 *      parameters:
 *      - name: "userId"
 *        in: "path"
 *        required: true
 *        type: "integer"
 *      responses:
 *        "200":
 *          schema:
 *            $ref: "#/definitions/SuccessResponse"
 *        "404":
 *          schema:
 *            $ref: "#/definitions/FailResponse"
 */
router.get('/:id', getUser);

/**
 * @swagger
 * paths:
 *  /users:
 *    post:
 *      summary: "회원을 생성합니다."
 *      tags: [user]
 *      parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          $ref: "#/definitions/User"
 *      responses:
 *        "201":
 *          schema:
 *            $ref: "#/definitions/SuccessResponse"
 *        "403":
 *          schema:
 *            $ref: "#/definitions/FailResponse"
 */
router.post('/', isNotLoggedIn, createUser);

/**
 * @swagger
 * paths:
 *  /users/login:
 *    post:
 *      summary: "로그인 합니다."
 *      tags: [user]
 *      parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          $ref: "#/definitions/Login"
 *      responses:
 *        "200":
 *          schema:
 *            $ref: "#/definitions/SuccessResponse"
 *        "401":
 *          schema:
 *            $ref: "#/definitions/FailResponse"
 */
router.post('/login', isNotLoggedIn, loginUser);

/**
 * @swagger
 * paths:
 *  /users/logout:
 *    get:
 *      summary: "로그아웃 합니다."
 *      tags: [user]
 *      responses:
 *        "200":
 *          schema:
 *            $ref: "#/definitions/SuccessResponse"
 *        "401":
 *          schema:
 *            $ref: "#/definitions/FailResponse"
 */
router.get('/logout', isLoggedIn, logoutUser);

export default router;
