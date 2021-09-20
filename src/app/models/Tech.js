import Sequelize, { Model } from 'sequelize';

class Tech extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        year_created: Sequelize.INTEGER,
      },
      {
        sequelize,
        tableName: 'techs',
      },
    );
  }

  static associate(models) {
    this.belongsToMany(models.User, {
      foreignKey: 'tech_id',
      through: 'user_techs',
      as: 'users',
    });
  }
}

export default Tech;
