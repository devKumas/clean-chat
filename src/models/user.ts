import {
  Model,
  DataTypes,
  BelongsToManyAddAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  HasManyHasAssociationMixin,
} from 'sequelize';
import { dbType } from '.';
import { sequelize } from './sequelize';

type gender = 'M' | 'F' | 'X';
class User extends Model {
  public readonly id!: number;
  public email!: string;
  public password!: string;
  public name!: string;
  public gender!: gender;
  public imagePath!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  public addFriend!: BelongsToManyAddAssociationMixin<User, number>;
  public getFriends!: BelongsToManyGetAssociationsMixin<User>;
  public removeFriend!: BelongsToManyRemoveAssociationMixin<User, number>;
  public hasFriend!: HasManyHasAssociationMixin<User, number>;
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
      type: DataTypes.ENUM('M', 'F', 'X'),
      defaultValue: 'M',
      allowNull: false,
    },
    imagePath: {
      type: DataTypes.STRING(30),
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
  db.User.belongsToMany(db.User, {
    through: 'friends',
    as: 'Friends',
    foreignKey: 'userId',
  });
  db.User.belongsToMany(db.User, {
    through: 'friends',
    as: 'Users',
    foreignKey: 'friendId',
  });
  db.User.hasMany(db.ChatUser);
  db.User.hasMany(db.ChatContent);
};

export default User;
