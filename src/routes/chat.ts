import express from 'express';
import { isLoggedIn } from '../controller/middleware';
import { getChatLists, createChatList, updateChatList, removeChatList } from '../controller/chat';

const router = express.Router();

router.get('/', isLoggedIn, getChatLists);

router.post('/', isLoggedIn, createChatList);

router.put('/:id', isLoggedIn, updateChatList);

router.delete('/:id', isLoggedIn, removeChatList);

export default router;
