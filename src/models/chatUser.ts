import { Model, DataTypes } from 'sequelize';
import { dbType } from '.';
import { sequelize } from './sequelize';

class ChatUser extends Model {
  public readonly id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ChatUser.init(
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
  db.ChatUser.belongsTo(db.ChatList);
};

export default ChatUser;
