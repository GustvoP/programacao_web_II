// npx sequelize db:migrate
import Sequelize from 'sequelize';

import User from '../app/models/User';
import Tech from '../app/models/Tech';
import UserTech from '../app/models/UserTech';

import databaseConfig from '../config/database';

const models = [User, Tech, UserTech];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
    UserTech.associate(this.connection.models);
  }
}

export default new Database();
