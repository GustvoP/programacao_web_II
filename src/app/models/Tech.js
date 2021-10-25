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
}

export default Tech;
