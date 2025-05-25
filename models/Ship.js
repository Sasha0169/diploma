const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Ship', {
    ship_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ship_description: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    technical_info: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    ship_id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    services: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true
    },
    decks: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: true
    },
    ship_class: {
      type: DataTypes.ENUM("люкс","премиум","стандарт","эконом","комфорт"),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ships',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "ship_pkey",
        unique: true,
        fields: [
          { name: "ship_id" },
        ]
      },
    ]
  });
};
