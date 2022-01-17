import express from 'express';
import { isLoggedIn } from '../controller/middleware';
import { getFriends, addFriend, removeFriend } from '../controller/friend';

/**
 * @swagger
 *  definitions:
 *    CreateFriend:
 *      type: object
 *      example:
 *        userId: 2
 */

const router = express.Router();
/**
 * @swagger
 * paths:
 *  /friends:
 *    get:
 *      summary: "친구를 조회 합니다."
 *      tags: [friend]
 *      responses:
 *        "200":
 *          description: "성공"
 */
router.get('/', isLoggedIn, getFriends);

/**
 * @swagger
 * paths:
 *  /friends:
 *    post:
 *      summary: "친구를 추가 합니다."
 *      tags: [friend]
 *      parameters:
 *      - in: "body"
 *        name: "body"
 *        required: true
 *        schema:
 *          $ref: "#/definitions/CreateFriend"
 *      responses:
 *        "201":
 *          description: "성공"
 *        "403":
 *          description: "입력 오류"
 *        "404":
 *          description: "입력 오류"
 */
router.post('/', isLoggedIn, addFriend);

/**
 * @swagger
 * paths:
 *  /friends/{userId}:
 *    delete:
 *      summary: "친구를 삭제 합니다."
 *      tags: [friend]
 *      parameters:
 *      - name: "userId"
 *        in: "path"
 *        required: true
 *        type: "integer"
 *      responses:
 *        "201":
 *          description: "성공"
 *        "403":
 *          description: "입력 오류"
 *        "404":
 *          description: "입력 오류"
 */
router.delete('/:id', isLoggedIn, removeFriend);

export default router;
