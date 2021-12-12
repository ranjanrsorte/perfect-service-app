import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class partsprice extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true
    },
    part: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    vehicletype: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'vehicletype',
        key: 'id'
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'partsprice',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "partsprice_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return partsprice;
  }
}
