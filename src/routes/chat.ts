import express from 'express';
import { isLoggedIn } from '../controller/middleware';
import { getChats, createChat, updateChat, removeChat } from '../controller/chat';
import { getMessages, createMessage, removeMessage } from '../controller/message';

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
 *    CreateMessage:
 *      type: object
 *      example:
 *        message: "안녕하세요"
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

/**
 * @swagger
 * paths:
 *  /chats/{chatId}/messages:
 *    get:
 *      summary: "메시지를 조회합니다."
 *      tags: [chat]
 *      parameters:
 *      - name: "chatId"
 *        in: "path"
 *        required: true
 *        type: "string"
 *      - name: "messageId"
 *        in: "query"
 *        required: false
 *        type: "string"
 *      responses:
 *        "200":
 *          description: "성공"
 *        "403":
 *          description: "권한 부족"
 */
router.get('/:chatId/messages', isLoggedIn, getMessages);

/**
 * @swagger
 * paths:
 *  /chats/{chatId}/messages:
 *    post:
 *      summary: "메시지를 등록합니다."
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
 *          $ref: "#/definitions/CreateMessage"
 *      responses:
 *        "201":
 *          description: "성공"
 *        "403":
 *          description: "권한 부족"
 */
router.post('/:chatId/messages', isLoggedIn, createMessage);

/**
 * @swagger
 * paths:
 *  /chats/{chatId}/messages/{messageId}:
 *    delete:
 *      summary: "메시지를 삭제 합니다."
 *      tags: [chat]
 *      parameters:
 *      - name: "chatId"
 *        in: "path"
 *        required: true
 *        type: "string"
 *      - name: "messageId"
 *        in: "path"
 *        required: true
 *        type: "string"
 *      responses:
 *        "201":
 *          description: "성공"
 *        "403":
 *          description: "권한 부족"
 */
router.delete('/:chatId/messages/:messageId', isLoggedIn, removeMessage);

export default router;
