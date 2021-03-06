import { Model, DataTypes } from 'sequelize';
import { dbType } from '.';
import { sequelize } from './sequelize';
import User from './user';

class ChatContent extends Model {
  public readonly id!: number;
  public content: string | undefined;
  public imagePath: string | undefined;
  public deleted!: boolean | undefined;
  public User!: User | undefined;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ChatContent.init(
  {
    content: {
      type: DataTypes.TEXT(),
      allowNull: true,
    },
    imagePath: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
    timestamps: true,
    underscored: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  }
);

export const associate = (db: dbType) => {
  db.ChatContent.belongsTo(db.ChatList);
  db.ChatContent.belongsTo(db.User);
};

export default ChatContent;
