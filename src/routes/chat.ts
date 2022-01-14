import express from 'express';
import { isLoggedIn } from '../controller/middleware';
import { getChatLists, createChatList } from '../controller/chat';

const router = express.Router();

router.get('/', isLoggedIn, getChatLists);

router.post('/', isLoggedIn, createChatList);

export default router;
