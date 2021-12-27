import express from 'express';
import { isLoggedIn, isNotLoggedIn } from '../passport/middleware';
import { getUser, postUser, postLogin, postLogout } from '../controller/user';

const router = express.Router();

router.get('/', isLoggedIn, getUser);

router.post('/', isNotLoggedIn, postUser);

router.post('/login', isNotLoggedIn, postLogin);

router.post('/logout', isLoggedIn, postLogout);

export default router;
