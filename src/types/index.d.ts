import UserModel from '../models/user'; // <- User class

declare global {
  interface Error {
    status: number;
  }
  namespace Express {
    export interface User extends UserModel {}
  }
}
