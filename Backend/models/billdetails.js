import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class billdetails extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true
    },
    billid: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'bill',
        key: 'id'
      }
    },
    partpriceid: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'partsprice',
        key: 'id'
      }
    },
    servicepriceid: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'serviceprice',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'billdetails',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "billdetails_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return billdetails;
  }
}
