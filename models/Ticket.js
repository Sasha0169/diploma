const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Ticket', {
    ticket_id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cruise_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cruises',
        key: 'cruise_id'
      }
    },
    cabin_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cabins',
        key: 'cabin_id'
      }
    },
    place: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    prices: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tickets',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "tickets_pkey",
        unique: true,
        fields: [
          { name: "ticket_id" },
        ]
      },
    ]
  });
};
