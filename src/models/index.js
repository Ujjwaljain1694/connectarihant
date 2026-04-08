const sequelize = require('../config/database');
const Manager = require('./Manager');
const Client = require('./Client');
const Holding = require('./Holding');
const Position = require('./Position');
const OTP = require('./OTP');
const TrialBalance = require('./TrialBalance');
const Brokerage = require('./Brokerage');
const ThirdParty = require('./ThirdParty');
const Research = require('./Research');

// Associations
Manager.hasMany(Client, { foreignKey: 'manager_id', as: 'clients' });
Client.belongsTo(Manager, { foreignKey: 'manager_id', as: 'manager' });

Client.hasMany(Holding, { foreignKey: 'client_code', sourceKey: 'client_code', as: 'holdings' });
Holding.belongsTo(Client, { foreignKey: 'client_code', targetKey: 'client_code', as: 'client' });

Client.hasMany(Position, { foreignKey: 'client_code', sourceKey: 'client_code', as: 'positions' });
Position.belongsTo(Client, { foreignKey: 'client_code', targetKey: 'client_code', as: 'client' });

Manager.hasMany(Brokerage, { foreignKey: 'manager_id', as: 'brokerages' });
Brokerage.belongsTo(Manager, { foreignKey: 'manager_id', as: 'manager' });

Manager.hasMany(ThirdParty, { foreignKey: 'manager_id', as: 'thirdParties' });
ThirdParty.belongsTo(Manager, { foreignKey: 'manager_id', as: 'manager' });

Manager.hasMany(Research, { foreignKey: 'manager_id', as: 'research' });
Research.belongsTo(Manager, { foreignKey: 'manager_id', as: 'manager' });

module.exports = { sequelize, Manager, Client, Holding, Position, OTP, TrialBalance, Brokerage, ThirdParty, Research };
