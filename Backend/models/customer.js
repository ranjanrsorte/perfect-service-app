import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class customer extends Model {
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
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    primarycontactnumber: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    contactnumber: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    landline: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    customertype: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'customertype',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'employeetype',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'customer',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "customer_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return customer;
  }
}
