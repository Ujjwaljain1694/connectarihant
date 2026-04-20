module.exports = (sequelize, DataTypes) => {
  const PayoutCancel = sequelize.define("payout_cancel", {
    request_date: {
      type: DataTypes.DATEONLY
    },
    client_code: {
      type: DataTypes.STRING
    },
    client_name: {
      type: DataTypes.STRING
    },
    request_amount: {
      type: DataTypes.DECIMAL(12,2)
    },
    status: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'payout_cancel',
    timestamps: false
  });

  return PayoutCancel;
};
