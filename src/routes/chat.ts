import express from 'express';
import { isLoggedIn } from '../controller/middleware';
import { getChats, createChat, updateChat, removeChat } from '../controller/chat';

/**
 * @swagger
 *  definitions:
 *    CreateChat:
 *      type: object
 *      example:
 *        userId: 2
 *    UpdateChat:
 *      type: object
 *      example:
 *        chatTitle: "놀부와의 대화"
 */

const router = express.Router();

/**
 * @swagger
 * paths:
 *  /chats:
 *    get:
 *      summary: "채팅을 조회합니다."
 *      tags: [chat]
 *      responses:
 *        "200":
 *          description: "성공"
 */
router.get('/', isLoggedIn, getChats);

/**
 * @swagger
 * paths:
 *  /chats:
 *    post:
 *      summary: "채팅을 등록합니다."
 *      tags: [chat]
 *      parameters:
 *      - in: "body"
 *        name: "body"
 *        required: true
 *        schema:
 *          $ref: "#/definitions/CreateChat"
 *      responses:
 *        "201":
 *          description: "성공"
 *        "403":
 *          description: "입력 오류"
 *        "404":
 *          description: "입력 오류"
 */
router.post('/', isLoggedIn, createChat);

/**
 * @swagger
 * paths:
 *  /chats/{chatId}:
 *    put:
 *      summary: "채팅 이름을 변경 합니다."
 *      tags: [chat]
 *      parameters:
 *      - name: "chatId"
 *        in: "path"
 *        required: true
 *        type: "string"
 *      - in: "body"
 *        name: "body"
 *        required: true
 *        schema:
 *          $ref: "#/definitions/UpdateChat"
 *      responses:
 *        "201":
 *          description: "성공"
 *        "403":
 *          description: "권한 부족"
 */
router.put('/:chatId', isLoggedIn, updateChat);

/**
 * @swagger
 * paths:
 *  /chats/{chatId}:
 *    delete:
 *      summary: "채팅을 삭제 합니다."
 *      tags: [chat]
 *      parameters:
 *      - name: "chatId"
 *        in: "path"
 *        required: true
 *        type: "string"
 *      responses:
 *        "201":
 *          description: "성공"
 *        "403":
 *          description: "권한 부족"
 */
router.delete('/:chatId', isLoggedIn, removeChat);

export default router;
