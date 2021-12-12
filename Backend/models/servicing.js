import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class servicing extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true
    },
    vehiclenumber: {
      type: DataTypes.STRING(100),
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
    customerid: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'customer',
        key: 'id'
      }
    },
    numberofservice: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    registrationdate: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    registrationtype: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'bookingtype',
        key: 'id'
      }
    },
    actualservicestartdate: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    expectedserviceenddate: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    actualserviceenddate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    servicemanagerid: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      references: {
        model: 'employee',
        key: 'id'
      }
    },
    serviceleadid: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      references: {
        model: 'employee',
        key: 'id'
      }
    },
    workerid: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      references: {
        model: 'employee',
        key: 'id'
      }
    },
    servicestatus: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      references: {
        model: 'servicestatus',
        key: 'id'
      }
    },
    ispickup: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    bookedby: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'employeetype',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'servicing',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "servicing_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return servicing;
  }
}
