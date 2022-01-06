import express from 'express';
import { isLoggedIn, isNotLoggedIn } from '../controller/middleware';
import {
  getUserId,
  getUserEmail,
  createUser,
  updateUser,
  multerUpload,
  uploadImage,
} from '../controller/user';
import { loginUser, logoutUser } from '../controller/login';
import { getFriends, addFriend, removeFriend } from '../controller/friend';

/**
 * @swagger
 * tags:
 *    - name: user
 *    - name: login
 *    - name: friend
 */
const router = express.Router();

/**
 * @swagger
 * paths:
 *  /users/friends:
 *    get:
 *      summary: "친구를 조회 합니다."
 *      tags: [friend]
 *      responses:
 *        "200":
 *          schema:
 *            $ref: "#/definitions/SuccessResponse"
 *        "404":
 *          schema:
 *            $ref: "#/definitions/FailResponse"
 */
router.get('/friends', isLoggedIn, getFriends);

/**
 * @swagger
 * paths:
 *  /users/friends/{userId}:
 *    post:
 *      summary: "친구를 추가 합니다."
 *      tags: [friend]
 *      parameters:
 *      - name: "userId"
 *        in: "path"
 *        required: true
 *        type: "integer"
 *      responses:
 *        "200":
 *          schema:
 *            $ref: "#/definitions/SuccessResponse"
 *        "403":
 *          schema:
 *            $ref: "#/definitions/FailResponse"
 */
router.post('/friends/:id', isLoggedIn, addFriend);

/**
 * @swagger
 * paths:
 *  /users/friends/{userId}:
 *    delete:
 *      summary: "친구를 삭제 합니다."
 *      tags: [friend]
 *      parameters:
 *      - name: "userId"
 *        in: "path"
 *        required: true
 *        type: "integer"
 *      responses:
 *        "200":
 *          schema:
 *            $ref: "#/definitions/SuccessResponse"
 *        "403":
 *          schema:
 *            $ref: "#/definitions/FailResponse"
 */
router.delete('/friends/:id', isLoggedIn, removeFriend);

/**
 * @swagger
 * paths:
 *  /users/login:
 *    post:
 *      summary: "로그인 합니다."
 *      tags: [login]
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
 *      tags: [login]
 *      responses:
 *        "200":
 *          schema:
 *            $ref: "#/definitions/SuccessResponse"
 *        "401":
 *          schema:
 *            $ref: "#/definitions/FailResponse"
 */
router.get('/logout', isLoggedIn, logoutUser);

/**
 * @swagger
 * paths:
 *  /users/images:
 *    post:
 *      summary: "이미지를 업로드 합니다."
 *      tags: [user]
 *      consumes:
 *        - multipart/form-dat
 *      parameters:
 *        - name: img
 *          in: formData
 *          required: true
 *          type: file
 *      responses:
 *        "200":
 *          schema:
 *            $ref: "#/definitions/SuccessResponse"
 *        "401":
 *          schema:
 *            $ref: "#/definitions/FailResponse"
 */
router.post('/images', isLoggedIn, multerUpload.single('img'), uploadImage);

/**
 * @swagger
 * paths:
 *  /users/email/{userEmail}:
 *    get:
 *      summary: "userEmail을 조회합니다."
 *      tags: [user]
 *      parameters:
 *      - name: "userEmail"
 *        in: "path"
 *        required: true
 *        type: "string"
 *      responses:
 *        "200":
 *          schema:
 *            $ref: "#/definitions/SuccessResponse"
 *        "404":
 *          schema:
 *            $ref: "#/definitions/FailResponse"
 */
router.get('/email/:email', getUserEmail);

/**
 * @swagger
 * paths:
 *  /users/{userId}:
 *    get:
 *      summary: "유저를 조회합니다."
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
router.get('/:id', getUserId);

/**
 * @swagger
 * paths:
 *  /users:
 *    post:
 *      summary: "유저를 생성합니다."
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
 *  /users:
 *    patch:
 *      summary: "유저를 업데이트 합니다."
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
router.patch('/', isLoggedIn, updateUser);

export default router;
