const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Route', {
    route_id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'routes',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "directions_pkey",
        unique: true,
        fields: [
          { name: "route_id" },
        ]
      },
    ]
  });
};
