import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class vehicleamc extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true
    },
    vehicletype: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'vehicletype',
        key: 'id'
      }
    },
    customerid: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'customer',
        key: 'id'
      }
    },
    contractenddate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'vehicleamc',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "vehicleamc_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return vehicleamc;
  }
}
