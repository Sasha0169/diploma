const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Cabin', {
    ship_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'ships',
        key: 'ship_id'
      }
    },
    cabin_id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    deck_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'decks',
        key: 'deck_id'
      }
    },
    cabin_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cabin_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    total_count: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cabin_numbers: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true
    },
    single_occupancy: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'cabins',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "cabins_pkey",
        unique: true,
        fields: [
          { name: "cabin_id" },
        ]
      },
    ]
  });
};
