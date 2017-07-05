module.exports = (sequelize, DataTypes) => {
  return sequelize.define('todos', {
    description: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        len: [1, 250]
      } 
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
};
