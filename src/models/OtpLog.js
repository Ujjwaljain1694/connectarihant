module.exports = (sequelize, DataTypes) => {
  return sequelize.define("OtpLog", {
    branch_code: DataTypes.STRING,
    otp: DataTypes.STRING,
    expiry_time: DataTypes.DATE,
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
};
