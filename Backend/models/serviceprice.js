import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class serviceprice extends Model {
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
    washingprice: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    cleaningprice: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    servicingprice: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    pickupprice: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'serviceprice',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "serviceprice_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return serviceprice;
  }
}
