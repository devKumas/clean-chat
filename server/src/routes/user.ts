import express from 'express';
import { isLoggedIn, isNotLoggedIn } from './middleware';
import { getMyInfo, createUser, userLogin, userLogout } from '../controller/user';

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
 *      summary: Select My Info
 *      tags: [user]
 *      responses:
 *        "200":
 *          schema:
 *            $ref: '#/definitions/Response'
 */
router.get('/', isLoggedIn, getMyInfo);

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
 *            $ref: '#/definitions/Response'
 */
router.post('/', isNotLoggedIn, createUser);

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
 *        "200":
 *          schema:
 *            $ref: '#/definitions/Response'
 */
router.post('/login', isNotLoggedIn, userLogin);

/**
 * @swagger
 * paths:
 *  /user/logout:
 *    get:
 *      summary: Logout User
 *      tags: [user]
 *      responses:
 *        "200":
 *          schema:
 *            $ref: '#/definitions/Response'
 */
router.get('/logout', isLoggedIn, userLogout);

export default router;
