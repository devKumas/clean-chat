import User, { associate as associateUser } from './user';
import ChatList, { associate as associateChatList } from './chatList';
import ChatContent, { associate as associateChatContent } from './chatContent';
import ChatUser, { associate as associateChatUser } from './chatUser';
export * from './sequelize';

const db = {
  User,
  ChatList,
  ChatContent,
  ChatUser,
};

export type dbType = typeof db;

associateUser(db);
associateChatList(db);
associateChatContent(db);
associateChatUser(db);
