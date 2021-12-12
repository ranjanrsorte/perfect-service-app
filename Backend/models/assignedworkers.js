import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class assignedworkers extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true
    },
    servicingid: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'servicing',
        key: 'id'
      }
    },
    serviceleadid: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'employee',
        key: 'id'
      }
    },
    workerid: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'employee',
        key: 'id'
      }
    },
    servicetype: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'servicetype',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'assignedworkers',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "assignedworkers_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return assignedworkers;
  }
}
