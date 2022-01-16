import { Model, DataTypes } from 'sequelize';
import { dbType } from '.';
import { sequelize } from './sequelize';

import User from './user';

class ChatUser extends Model {
  public readonly id!: number;
  public chatTitle: string | undefined;
  public User: User | undefined;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ChatUser.init(
  {
    chatTitle: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
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
  db.ChatUser.belongsTo(db.User);
};

export default ChatUser;
