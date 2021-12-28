import express from 'express';
import { isLoggedIn, isNotLoggedIn } from '../passport/middleware';
import { getUser, postUser, postLogin, postLogout } from '../controller/user';

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */
const router = express.Router();

/**
 * @swagger
 * paths:
 *  /user:
 *    get:
 *      summary: Select User
 *      tags: [user]
 *      responses:
 *        "201":
 *          schema:
 *            $ref: '#/definitions/SuccessResponse'
 *        "404":
 *          description: not is loggedIn
 *          schema:
 *            $ref: '#/definitions/FailResponse'
 */
router.get('/', isLoggedIn, getUser);

/**
 * @swagger
 * paths:
 *  /user:
 *    post:
 *      summary: Create User
 *      tags: [user]
 *      parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          $ref: '#/definitions/User'
 *      responses:
 *        "201":
 *          schema:
 *            $ref: '#/definitions/SuccessResponse'
 *        "404":
 *          description: is loggedIn
 *          schema:
 *            $ref: '#/definitions/FailResponse'
 */
router.post('/', isNotLoggedIn, postUser);

/**
 * @swagger
 * paths:
 *  /user/login:
 *    post:
 *      summary: Login User
 *      tags: [user]
 *      parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          $ref: '#/definitions/Login'
 *      responses:
 *        "201":
 *          schema:
 *            $ref: '#/definitions/SuccessResponse'
 *        "404":
 *          description:
 *          schema:
 *            $ref: '#/definitions/FailResponse'
 */
router.post('/login', isNotLoggedIn, postLogin);

/**
 * @swagger
 * paths:
 *  /user/logout:
 *    get:
 *      summary: Logout User
 *      tags: [user]
 *      responses:
 *        "201":
 *          schema:
 *            $ref: '#/definitions/SuccessResponse'
 *        "404":
 *          description:
 *          schema:
 *            $ref: '#/definitions/FailResponse'
 */
router.get('/logout', isLoggedIn, postLogout);

export default router;
