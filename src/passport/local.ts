import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import User from '../models/user';
import { failResponse } from '../utils/returnResponse';

export default () => {
  passport.use(
    'local',
    new Strategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ where: { email } });

          if (!user) {
            const err = new Error();
            err.status = 404;
            err.info = failResponse('일치하는 이메일이 없습니다.');

            return done(err);
          }
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          }
          const err = new Error();
          err.status = 403;
          err.info = failResponse('비밀번호가 일치하지 않습니다.');

          return done(err);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};
