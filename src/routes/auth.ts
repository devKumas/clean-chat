import express from 'express';
import { isLoggedIn, isNotLoggedIn } from '../controller/middleware';
import { loginUser, logoutUser } from '../controller/login';

const router = express.Router();

/**
 * @swagger
 * paths:
 *  /auth/login:
 *    post:
 *      summary: "로그인 합니다."
 *      tags: [auth]
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
 *  /auth/logout:
 *    post:
 *      summary: "로그아웃 합니다."
 *      tags: [auth]
 *      responses:
 *        "200":
 *          schema:
 *            $ref: "#/definitions/SuccessResponse"
 *        "401":
 *          schema:
 *            $ref: "#/definitions/FailResponse"
 */
router.post('/logout', isLoggedIn, logoutUser);

export default router;
