import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _servicing from  "./servicing.js";

export default function initModels(sequelize) {
  const servicing = _servicing.init(sequelize, DataTypes);

  servicing.belongsTo(bookingtype, { as: "registrationtype_bookingtype", foreignKey: "registrationtype"});
  bookingtype.hasMany(servicing, { as: "servicings", foreignKey: "registrationtype"});
  servicing.belongsTo(customer, { as: "customer", foreignKey: "customerid"});
  customer.hasMany(servicing, { as: "servicings", foreignKey: "customerid"});
  servicing.belongsTo(employee, { as: "servicelead", foreignKey: "serviceleadid"});
  employee.hasMany(servicing, { as: "servicings", foreignKey: "serviceleadid"});
  servicing.belongsTo(employee, { as: "servicemanager", foreignKey: "servicemanagerid"});
  employee.hasMany(servicing, { as: "servicemanager_servicings", foreignKey: "servicemanagerid"});
  servicing.belongsTo(employee, { as: "worker", foreignKey: "workerid"});
  employee.hasMany(servicing, { as: "worker_servicings", foreignKey: "workerid"});
  servicing.belongsTo(employeetype, { as: "bookedby_employeetype", foreignKey: "bookedby"});
  employeetype.hasMany(servicing, { as: "servicings", foreignKey: "bookedby"});
  servicing.belongsTo(servicestatus, { as: "servicestatus_servicestatus", foreignKey: "servicestatus"});
  servicestatus.hasMany(servicing, { as: "servicings", foreignKey: "servicestatus"});
  servicing.belongsTo(vehicletype, { as: "vehicletype_vehicletype", foreignKey: "vehicletype"});
  vehicletype.hasMany(servicing, { as: "servicings", foreignKey: "vehicletype"});

  return {
    servicing,
  };
}
