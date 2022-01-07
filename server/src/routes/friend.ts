import express from 'express';
import { isLoggedIn } from '../controller/middleware';
import { getFriends, addFriend, removeFriend } from '../controller/friend';

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
 *  /friends/{userId}:
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
 *        "200":
 *          schema:
 *            $ref: "#/definitions/SuccessResponse"
 *        "403":
 *          schema:
 *            $ref: "#/definitions/FailResponse"
 */
router.delete('/friends/:id', isLoggedIn, removeFriend);

export default router;
