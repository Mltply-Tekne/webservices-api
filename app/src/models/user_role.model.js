module.exports = (sequelize, Sequelize) => {
    const UserRole = sequelize.define("user_roles", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      }
    }, {
      freezeTableName: true
    });
  
    UserRole.sync();
  
    return UserRole;
  };
  