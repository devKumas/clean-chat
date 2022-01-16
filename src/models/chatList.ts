import { Model, DataTypes } from 'sequelize';
import { dbType } from '.';
import { sequelize } from './sequelize';

import ChatUser from './chatUser';

/**
 * @swagger
 *  definitions:
 *    ChatList:
 *      type: object
 *      required:
 *        - group
 *      properties:
 *        group:
 *          type: string
 *        chatUser:
 *          $ref: "#/definitions/ChatUser"
 */

class ChatList extends Model {
  public readonly id!: number;
  public group!: boolean;
  public ChatUsers: ChatUser[] | undefined;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

ChatList.init(
  {
    group: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
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
  db.ChatList.hasMany(db.ChatContent);
  db.ChatList.hasMany(db.ChatUser);
};

export default ChatList;
