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

const router = express.Router();
/**
 * @swagger
 * paths:
 *  /users/id/{userId}:
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
router.get('/id/:id', getUserId);
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
 *        "200":
 *          schema:
 *            $ref: "#/definitions/SuccessResponse"
 *        "401":
 *          schema:
 *            $ref: "#/definitions/FailResponse"
 */
router.post('/images', isLoggedIn, multerUpload.single('img'), uploadImage);

export default router;
