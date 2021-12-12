import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class bookingtype extends Model {
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
    tableName: 'bookingtype',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "bookingtype_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return bookingtype;
  }
}
