import knex from 'knex';

import config from '../config.js';
import knexConfig from '../knexfile.js';

const dbConfig = knexConfig[config.dev ? 'development' : 'production'];
const db = knex(dbConfig);

export default db;
