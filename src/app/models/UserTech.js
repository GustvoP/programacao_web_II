import Sequelize, { Model } from 'sequelize';

class UserTech extends Model {
  static init(sequelize) {
    super.init(
      {
        tech_id: Sequelize.INTEGER,
        user_id: Sequelize.INTEGER
      },
      {
        sequelize,
        tableName: 'user_techs',
      },
    );
  }

  static associate(models) {
    models.User.belongsToMany(models.Tech, {
      foreignKey: 'user_id',
      through: 'user_techs',
      as: 'techs',
      otherKey: 'tech_id'
    });

    models.Tech.belongsToMany(models.User, {
      foreignKey: 'tech_id',
      through: 'user_techs',
      as: 'users',
      otherKey: 'user_id'
    });
  }
}

export default UserTech;
