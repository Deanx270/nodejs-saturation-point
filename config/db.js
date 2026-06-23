const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS || '';
const DB_HOST = process.env.DB_HOST;
const DB_DIALECT = process.env.DB_DIALECT || 'mysql';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  logging: false,
});

const initializeDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    console.log(`Database '${DB_NAME}' created or successfully verified.`);

    await connection.end();

    await sequelize.authenticate();
    console.log('Connection to MySQL via Sequelize has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database or create it:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, initializeDatabase };
