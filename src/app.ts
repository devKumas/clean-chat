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
import authAPIRouter from './routes/auth';
import userAPIRouter from './routes/user';
import friendAPIRouter from './routes/friend';
import chatAPIRouter from './routes/chat';
import { swaggerUi, specs } from './utils/swagger';
import { logger, stream } from './utils/winston';

dotenv.config();

const { PORT, NODE_ENV } = process.env;
const app = express();

try {
  fs.readdirSync('uploads');
} catch (error) {
  logger.error('uploads 폴더를 생성합니다');
  fs.mkdirSync('uploads');
}

sequelize
  .sync()
  .then(() => logger.info('데이터 베이스가 연결 되었습니다.'))
  .catch(logger.error);

passportConfig();

if (NODE_ENV === 'production') {
  app.enable('trust proxy');
  app.use(morgan('combined', { stream }));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(hpp());
} else {
  app.use(morgan('dev', { stream }));
}

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.set('port', PORT || 8000);
app.set('sslPort', parseInt(app.get('port')) + 1);
app.use('/img', express.static(path.join(__dirname, '..', 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  expressSession({
    resave: true,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET!,
    proxy: true,
    cookie: NODE_ENV
      ? {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        }
      : {},
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authAPIRouter);
app.use('/api/users', userAPIRouter);
app.use('/api/friends', friendAPIRouter);
app.use('/api/chats', chatAPIRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use((req, res, next) => {
  return res.status(404).json({ message: '존재하지 않는 라우터 입니다.' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (!err.status) logger.error(err);
  res.status(err.status || 500).json(err.message);
});

http.createServer(app).listen(app.get('port'), () => {
  logger.info(`http Server is started on port ${app.get('port')}`);
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
    logger.info(`https Server is started on port ${app.get('sslPort')}`);
  });
} catch (error) {
  logger.error('https 오류가 발생하였습니다. https 서버는 실행되지 않습니다.');
}
