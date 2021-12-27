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
            return done(null, false, failResponse('존재하지 않는 사용자입니다.'));
          }
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          }
          return done(null, false, failResponse('비밀번호가 틀립니다.'));
        } catch (e) {
          console.error(e);
          return done(e);
        }
      }
    )
  );
};
