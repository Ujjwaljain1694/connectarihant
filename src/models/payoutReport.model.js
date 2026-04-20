module.exports = (sequelize, DataTypes) => {
  return sequelize.define("payout_report", {
    request_date: DataTypes.DATEONLY,
    client_code: DataTypes.STRING,
    client_name: DataTypes.STRING,
    bank_account: DataTypes.STRING,
    request_amount: DataTypes.DECIMAL(12,2),
    status: DataTypes.STRING
  }, {
    tableName: 'payout_report',
    timestamps: false
  });
};
