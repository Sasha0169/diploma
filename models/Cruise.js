const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Cruise', {
    cruise_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cruise_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    route_points: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    departure_location: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    arrival_location: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    ship_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'ships',
        key: 'ship_id'
      }
    },
    cruise_type: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    cruise_id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    day_by_day_info: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: true
    },
    route_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'routes',
        key: 'route_id'
      }
    },
    departure_city_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cities',
        key: 'city_id'
      }
    },
    minimum_price: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    minimum_discounted_price: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    photo_addresses: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'cruises',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "cruises_pkey",
        unique: true,
        fields: [
          { name: "cruise_id" },
        ]
      },
    ]
  });
};
