const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Order', {
    order_id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    people_count: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    payment_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    booking_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    payment_status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    additional_services: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'orders',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "orders_pkey",
        unique: true,
        fields: [
          { name: "order_id" },
        ]
      },
    ]
  });
};
