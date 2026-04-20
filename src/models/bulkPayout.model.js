module.exports = (sequelize, DataTypes) => {
  return sequelize.define("bulk_payout", {
    file_name: DataTypes.STRING,
    file_path: DataTypes.STRING
  }, {
    tableName: 'bulk_payout',
    timestamps: false
  });
};
