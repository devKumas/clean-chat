import express, { Request, Response, NextFunction } from 'express';
import expressSession from 'express-session';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import passport from 'passport';
import dotenv from 'dotenv';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';

import passportConfig from './passport';
import { sequelize } from './models';
const { PORT, NODE_ENV } = process.env;
import userAPIRouter from './routes/user';
import { swaggerUi, specs } from './utils/swagger';

dotenv.config();
const app = express();

sequelize
  .sync()
  .then(() => console.log('데이터베이스 연결'))
  .catch(console.error);
passportConfig();

if (NODE_ENV === 'production') {
  app.enable('trust proxy');
  app.use(morgan('combined'));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(hpp());
} else {
  app.use(morgan('dev'));
}

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.set('port', PORT || 8000);
app.set('sslPort', parseInt(app.get('port')) + 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET!,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: NODE_ENV ? true : false,
      sameSite: 'none',
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', userAPIRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use((req, res, next) => {
  return res.status(404).json({ message: '존재하지 않는 라우터 입니다.' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (!err.status) console.error(err);
  res.status(err.status || 500).json(err.info);
});

http.createServer(app).listen(app.get('port'), () => {
  console.log(`http Server is started on port ${app.get('port')}`);
});

try {
  const option = {
    ca: fs.readFileSync('/etc/letsencrypt/live/kumas.dev/fullchain.pem'),
    key: fs
      .readFileSync(
        path.resolve(process.cwd(), '/etc/letsencrypt/live/kumas.dev/privkey.pem'),
        'utf8'
      )
      .toString(),
    cert: fs
      .readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/kumas.dev/cert.pem'), 'utf8')
      .toString(),
  };
  https.createServer(option, app).listen(app.get('sslPort'), () => {
    console.log(`https Server is started on port ${app.get('sslPort')}`);
  });
} catch (error) {
  console.error('https 오류가 발생하였습니다. https 서버는 실행되지 않습니다.');
}
