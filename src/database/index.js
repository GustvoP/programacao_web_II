// npx sequelize db:migrate
import Sequelize from 'sequelize';

import User from '../app/models/User';
import Tech from '../app/models/Tech';

import databaseConfig from '../config/database';

const models = [User, Tech];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
    User.associate(this.connection.models);
    Tech.associate(this.connection.models);
  }
}

export default new Database();
