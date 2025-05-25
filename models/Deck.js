const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Deck', {
    deck_id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ship_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'ships',
        key: 'ship_id'
      }
    },
    deck_scheme: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    deck_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'decks',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "decks_pkey",
        unique: true,
        fields: [
          { name: "deck_id" },
        ]
      },
    ]
  });
};
