import express from 'express';
import expressSession from 'express-session';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import passport from 'passport';
import dotenv from 'dotenv';

import passportConfig from './passport';
import { sequelize } from './models';
const { PORT } = process.env;
import userAPIRouter from './routes/user';
import User from './models/user';

dotenv.config();
const app = express();

sequelize
  .sync()
  .then(() => console.log('데이터베이스 연결'))
  .catch(console.error);
passportConfig();

app.set('port', PORT || 8000);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET!,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/user', userAPIRouter);

app.use('/', (req, res, next) => {
  return res.status(404).json({ message: '존재하지 않는 라우터 입니다.' });
});

app.listen(app.get('port'), () => {
  console.log(`HTTP Server Started Port ${app.get('port')}`);
});
