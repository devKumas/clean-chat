import passport from 'passport';
import User from '../models/user';

import local from './local';

export default () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await User.findOne({
        where: { id },
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'],
        },
      });

      if (!user) {
        return done(new Error('no user'));
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  });

  local();
};
