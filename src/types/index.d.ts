import UserModel from '../models/user'; // <- User class

declare global {
  interface Error {
    status: number;
    info: object;
  }
  namespace Express {
    export interface User extends UserModel {}
  }
}
