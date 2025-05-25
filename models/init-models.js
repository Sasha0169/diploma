let DataTypes = require("sequelize").DataTypes;
let CabinModelModel = require("./Cabin");
let CityModelModel = require("./City");
let CruiseModel = require("./Cruise");
let CustomerModel = require("./Customer");
let DeckModel = require("./Deck");
let OrderedTicketModel = require("./OrderedTicket");
let OrderModel = require("./Order");
let RouteModel = require("./Route");
let ShipModel = require("./Ship");
let TicketModel = require("./Ticket");
let UserModel = require("./User");

function initModels(sequelize) {
  let Cabin = CabinModelModel(sequelize, DataTypes);
  let City = CityModelModel(sequelize, DataTypes);
  let Cruise = CruiseModel(sequelize, DataTypes);
  let Customer = CustomerModel(sequelize, DataTypes);
  let Deck = DeckModel(sequelize, DataTypes);
  let OrderedTicket = OrderedTicketModel(sequelize, DataTypes);
  let Order = OrderModel(sequelize, DataTypes);
  let Route = RouteModel(sequelize, DataTypes);
  let Ship = ShipModel(sequelize, DataTypes);
  let Ticket = TicketModel(sequelize, DataTypes);
  let User = UserModel(sequelize, DataTypes);

  Ticket.belongsTo(Cabin, { as: "cabin", foreignKey: "cabin_id"});
  Cabin.hasMany(Ticket, { as: "tickets", foreignKey: "cabin_id"});
  Cruise.belongsTo(City, { as: "departure_city", foreignKey: "departure_city_id"});
  City.hasMany(Cruise, { as: "cruises", foreignKey: "departure_city_id"});
  Ticket.belongsTo(Cruise, { as: "cruise", foreignKey: "cruise_id"});
  Cruise.hasMany(Ticket, { as: "tickets", foreignKey: "cruise_id"});
  OrderedTicket.belongsTo(Customer, { as: "customer", foreignKey: "customer_id"});
  Customer.hasMany(OrderedTicket, { as: "ordered_tickets", foreignKey: "customer_id"});
  User.belongsTo(Customer, { as: "customer", foreignKey: "customer_id"});
  Customer.hasMany(User, { as: "users", foreignKey: "customer_id"});
  Cabin.belongsTo(Deck, { as: "deck", foreignKey: "deck_id"});
  Deck.hasMany(Cabin, { as: "cabins", foreignKey: "deck_id"});
  OrderedTicket.belongsTo(Order, { as: "order", foreignKey: "order_id"});
  Order.hasMany(OrderedTicket, { as: "ordered_tickets", foreignKey: "order_id"});
  Cruise.belongsTo(Route, { as: "route", foreignKey: "route_id"});
  Route.hasMany(Cruise, { as: "cruises", foreignKey: "route_id"});
  Cabin.belongsTo(Ship, { as: "ship", foreignKey: "ship_id"});
  Ship.hasMany(Cabin, { as: "cabins", foreignKey: "ship_id"});
  Cruise.belongsTo(Ship, { as: "ship", foreignKey: "ship_id"});
  Ship.hasMany(Cruise, { as: "cruises", foreignKey: "ship_id"});
  Deck.belongsTo(Ship, { as: "ship", foreignKey: "ship_id"});
  Ship.hasMany(Deck, { as: "ship_decks", foreignKey: "ship_id"});
  OrderedTicket.belongsTo(Ticket, { as: "ticket", foreignKey: "ticket_id"});
  Ticket.hasMany(OrderedTicket, { as: "ordered_tickets", foreignKey: "ticket_id"});
  Order.belongsTo(User, { as: "user", foreignKey: "user_id"});
  User.hasMany(Order, { as: "orders", foreignKey: "user_id"});

  return {
    Cabin,
    City,
    Cruise,
    Customer,
    Deck,
    OrderedTicket,
    Order,
    Route,
    Ship,
    Ticket,
    User,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
