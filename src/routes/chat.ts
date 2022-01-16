import express from 'express';
import { isLoggedIn } from '../controller/middleware';
import { getChatLists, createChatList, updateChatList, removeChatList } from '../controller/chat';

const router = express.Router();

/**
 * @swagger
 *  definitions:
 *    CreateChat:
 *      type: object
 *      required:
 *        - userId
 *      example:
 *        userId: 2
 *    UpdateChat:
 *      type: object
 *      required:
 *        - title
 *      example:
 *        title: "놀부와의 대화"
 */

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
router.get('/', isLoggedIn, getChatLists);

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
router.post('/', isLoggedIn, createChatList);

/**
 * @swagger
 * paths:
 *  /chats/{chatId}:
 *    put:
 *      summary: "채팅방 이름을 변경 합니다."
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
router.put('/:id', isLoggedIn, updateChatList);

/**
 * @swagger
 * paths:
 *  /chats/{chatId}:
 *    delete:
 *      summary: "채팅방 삭제 합니다."
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
router.delete('/:id', isLoggedIn, removeChatList);

export default router;
