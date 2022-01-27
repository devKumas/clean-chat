import express from 'express';
import { isLoggedIn, isNotLoggedIn } from '../controller/middleware';
import { loginUser, logoutUser } from '../controller/login';

/**
 * @swagger
 *  definitions:
 *    Login:
 *      type: object
 *      example:
 *        email: 'admin@kumas.dev'
 *        password: 'password'
 *        socketId: 'CjBdkJ2gYQBiToZ4AAAB'
 */

const router = express.Router();

/**
 * @swagger
 * paths:
 *  /auth/login:
 *    post:
 *      summary: "로그인 합니다."
 *      tags: [auth]
 *      parameters:
 *      - in: "body"
 *        name: "body"
 *        required: true
 *        schema:
 *          $ref: "#/definitions/Login"
 *      responses:
 *        "200":
 *          description: "성공"
 *        "401":
 *          description: "실패"
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
 *          description: "성공"
 */
router.post('/logout', isLoggedIn, logoutUser);

export default router;
