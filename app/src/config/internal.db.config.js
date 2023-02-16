module.exports = {
    HOST: process.env.commonHostDatabase,
    USER: process.env.commonUserDatabase,
    PASSWORD: process.env.commonPasswordDatabase,
    DB: process.env.commonDatabase,
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
  