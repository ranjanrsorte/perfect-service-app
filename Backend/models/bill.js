import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class bill extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true
    },
    customerid: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'customer',
        key: 'id'
      }
    },
    vehicletype: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'vehicletype',
        key: 'id'
      }
    },
    totalbill: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    servicingid: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'servicing',
        key: 'id'
      }
    },
    billdate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'bill',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "bill_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return bill;
  }
}
