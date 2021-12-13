import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _assignedworkers from  "./assignedworkers.js";

export default function initModels(sequelize) {
  const assignedworkers = _assignedworkers.init(sequelize, DataTypes);

  assignedworkers.belongsTo(employee, { as: "servicelead", foreignKey: "serviceleadid"});
  employee.hasMany(assignedworkers, { as: "assignedworkers", foreignKey: "serviceleadid"});
  assignedworkers.belongsTo(employee, { as: "worker", foreignKey: "workerid"});
  employee.hasMany(assignedworkers, { as: "worker_assignedworkers", foreignKey: "workerid"});
  assignedworkers.belongsTo(servicetype, { as: "servicetype_servicetype", foreignKey: "servicetype"});
  servicetype.hasMany(assignedworkers, { as: "assignedworkers", foreignKey: "servicetype"});
  assignedworkers.belongsTo(servicing, { as: "servicing", foreignKey: "servicingid"});
  servicing.hasMany(assignedworkers, { as: "assignedworkers", foreignKey: "servicingid"});

  return {
    assignedworkers,
  };
}
