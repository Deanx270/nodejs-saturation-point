const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS || '';
const DB_HOST = process.env.DB_HOST;
const DB_DIALECT = process.env.DB_DIALECT || 'mysql';

// Initialize the Sequelize instance (without syncing immediately)
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  logging: false, // Set to console.log to see SQL queries
});

const initializeDatabase = async () => {
  try {
    // Connect to MySQL server without selecting a specific database
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
    });
    
    // Automatically create the database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    console.log(`Database '${DB_NAME}' created or successfully verified.`);
    
    // Close the raw connection
    await connection.end();
    
    // Authenticate Sequelize instance
    await sequelize.authenticate();
    console.log('Connection to MySQL via Sequelize has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database or create it:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, initializeDatabase };
