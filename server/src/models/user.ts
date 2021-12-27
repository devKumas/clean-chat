import { Model, DataTypes } from 'sequelize';
import { dbType } from '.';
import { sequelize } from './sequelize';

class User extends Model {
  public readonly id!: number;
  public email!: string;
  public password!: string;
  public name!: string;
  public gender!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

User.init(
  {
    email: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    gender: {
      type: DataTypes.TINYINT(),
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

export const associate = (db: dbType) => {};

export default User;
