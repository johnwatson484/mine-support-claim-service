module.exports = (sequelize, DataTypes) => {
  return sequelize.define('users', {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    }
  }, {
    freezeTableName: true,
    tableName: 'users'
  })
}
