import express from 'express';
import { isLoggedIn, isNotLoggedIn } from '../controller/middleware';
import {
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  multerUpload,
  uploadImage,
} from '../controller/user';

/**
 * @swagger
 *  definitions:
 *    CreateUser:
 *      type: object
 *      required:
 *        - email
 *        - password
 *        - name
 *        - gender
 *      example:
 *        email: "admin@kumas.dev"
 *        password: "password"
 *        name: "홍길동"
 *        gender: "M"
 *    UpdateUser
 *      type: object
 *      required:
 *      example:
 *        email: "admin@kumas.dev"
 *        password: "password"
 *        name: "홍길동"
 *        gender: "M"
 *        imagePath: "img/profile.png"
 */

const router = express.Router();
/**
 * @swagger
 * paths:
 *  /users/id/{userId}:
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
 *          description: "성공"
 *        "404":
 *          description: "입력 오류"
 */
router.get('/id/:userId', getUserById);
/**
 * @swagger
 * paths:
 *  /users/email/{userEmail}:
 *    get:
 *      summary: "회원을 조회합니다."
 *      tags: [user]
 *      parameters:
 *      - name: "userEmail"
 *        in: "path"
 *        required: true
 *        type: "string"
 *      responses:
 *        "200":
 *          description: "성공"
 *        "404":
 *          description: "입력 오류"
 */
router.get('/email/:userEmail', getUserByEmail);

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
 *          $ref: "#/definitions/CreateUser"
 *      responses:
 *        "201":
 *          description: "성공"
 *        "404":
 *          description: "입력 오류"
 */
router.post('/', isNotLoggedIn, createUser);

/**
 * @swagger
 * paths:
 *  /users:
 *    patch:
 *      summary: "회원 정보를 수정 합니다."
 *      tags: [user]
 *      parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          $ref: "#/definitions/UpdateUser"
 *      responses:
 *        "201":
 *          description: "성공"
 */
router.patch('/', isLoggedIn, updateUser);

/**
 * @swagger
 * paths:
 *  /users/images:
 *    post:
 *      summary: "유저 이미지를 업로드 합니다."
 *      tags: [user]
 *      consumes:
 *        - multipart/form-dat
 *      parameters:
 *        - name: img
 *          in: formData
 *          required: true
 *          type: file
 *      responses:
 *        "201":
 *          description: "성공"
 */
router.post('/images', isLoggedIn, multerUpload.single('img'), uploadImage);

export default router;
