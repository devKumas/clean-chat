import { Model, DataTypes } from 'sequelize';
import { dbType } from '.';
import { sequelize } from './sequelize';

class ChatList extends Model {
  public readonly id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

ChatList.init(
  {},
  {
    sequelize,
    timestamps: true,
    underscored: true,
    paranoid: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);

export const associate = (db: dbType) => {
  db.ChatList.hasMany(db.ChatContent);
  db.ChatList.hasMany(db.ChatUser);
};

export default ChatList;
