import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class customertype extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'customertype',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "customertype_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return customertype;
  }
}
