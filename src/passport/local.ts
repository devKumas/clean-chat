import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import User from '../models/user';
import { failResponse } from '../utils/response';

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
            return done(null, false, failResponse('일치하는 이메일이 없습니다.'));
          }
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          }

          return done(null, false, failResponse('비밀번호가 일치하지 않습니다.'));
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
