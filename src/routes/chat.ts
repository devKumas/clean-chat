import express from 'express';
import { isLoggedIn } from '../controller/middleware';
import { getChatLists, createChatList, updateChatList } from '../controller/chat';

const router = express.Router();

router.get('/', isLoggedIn, getChatLists);

router.post('/', isLoggedIn, createChatList);

router.put('/:id', isLoggedIn, updateChatList);

export default router;
