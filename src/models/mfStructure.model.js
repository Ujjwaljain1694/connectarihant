module.exports = (sequelize, DataTypes) => {
  return sequelize.define("mf_structure", {
    financial_year: DataTypes.STRING,
    file_name: DataTypes.STRING
  }, {
    tableName: 'mf_structure',
  });
};
