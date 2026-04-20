const { DataTypes } = require('sequelize');
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
const BranchPerformance = require('./BranchPerformance');
const ReactivationReport = require('./ReactivationReport');
const SamparkReport = require('./SamparkReport');
const KRAStatus = require('./KRAStatus');
const HoldKRA = require('./HoldKRA');
const Modification = require('./Modification');
const PhysicalAccount = require('./PhysicalAccount');
const NomineePending = require('./NomineePending');
const ComplianceCircular = require('./ComplianceCircular');
const MarketingMaterial = require('./MarketingMaterial');
const DownloadFile = require('./DownloadFile');
const Certificate = require('./Certificate');
const UploadCertificate = require('./UploadCertificate');
const MtfBalance = require('./MtfBalance');
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

Manager.hasMany(BranchPerformance, { foreignKey: 'manager_id', as: 'branchPerformance' });
BranchPerformance.belongsTo(Manager, { foreignKey: 'manager_id', as: 'manager' });

Manager.hasMany(ReactivationReport, { foreignKey: 'manager_id', as: 'reactivationReports' });
ReactivationReport.belongsTo(Manager, { foreignKey: 'manager_id', as: 'manager' });

Manager.hasMany(SamparkReport, { foreignKey: 'manager_id', as: 'samparkReports' });
SamparkReport.belongsTo(Manager, { foreignKey: 'manager_id', as: 'manager' });


const MTFRequestReport = require('./MTFRequestReport');
const IPOReport = require('./IPOReport');
const DPSlip = require('./DPSlip');
const ResearchCall = require('./ResearchCall');
const AlgoBrokerage = require('./AlgoBrokerage');
const MutualFund = require('./MutualFund');
const MutualFundRejection = require('./MutualFundRejection');
const MfMandateReport = require('./MfMandateReport');
const BondOffer = require('./BondOffer');
const ContestData = require('./contestData');
const InactiveClient = require('./InactiveClient');
const FollowUpCall = require('./FollowUpCall');
const Payout = require('./Payout');
const PayoutCancel = require('./payoutCancel.model')(sequelize, DataTypes);
const PayoutReport = require('./payoutReport.model')(sequelize, DataTypes);
const BulkPayout = require('./bulkPayout.model')(sequelize, DataTypes);
const MfStructure = require('./mfStructure.model')(sequelize, DataTypes);

module.exports = { sequelize, Manager, Client, Holding, Position, OTP, TrialBalance, Brokerage, ThirdParty, Research,  BranchPerformance ,ReactivationReport, SamparkReport, KRAStatus, HoldKRA, Modification, PhysicalAccount,  NomineePending, ComplianceCircular, MarketingMaterial, DownloadFile, Certificate, UploadCertificate, MtfBalance, MTFRequestReport, IPOReport, DPSlip, ResearchCall, AlgoBrokerage, MutualFund, MutualFundRejection, MfMandateReport, BondOffer, ContestData, InactiveClient, FollowUpCall, Payout, payout_cancel: PayoutCancel, payout_report: PayoutReport, bulk_payout: BulkPayout, mf_structure: MfStructure };
