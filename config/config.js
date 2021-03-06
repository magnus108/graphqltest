module.exports = {
  "development": {
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_NAME,
    "host": process.env.POSTGRES_ADDR,
    "dialect": "postgres",
    "use_env_variable": false
  }
};
