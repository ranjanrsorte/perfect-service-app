import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class bill extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
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
    vehicletypeid: {
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
      type: DataTypes.STRING(100),
      allowNull: false
    },
    partprice: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    serviceprice: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    washingprice: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    cleaningprice: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    pickupprice: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
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
