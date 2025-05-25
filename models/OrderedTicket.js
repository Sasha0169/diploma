const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('OrderedTicket', {
    ordered_tickets_id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ticket_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tickets',
        key: 'ticket_id'
      }
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'customers',
        key: 'customer_id'
      }
    },
    selected_rate: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    single_occupancy: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'orders',
        key: 'order_id'
      }
    }
  }, {
    sequelize,
    tableName: 'ordered_tickets',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "ordered_tickets_pkey",
        unique: true,
        fields: [
          { name: "ordered_tickets_id" },
        ]
      },
    ]
  });
};
