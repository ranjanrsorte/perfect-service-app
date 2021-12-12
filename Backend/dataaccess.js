import { Sequelize } from "sequelize";
import pkg from "sequelize";
import jsonwebtoken from "jsonwebtoken";

const { DataTypes } = pkg;

import employeetype from './models/employeetype.js';
import employee from './models/employee.js';
import customertype from './models/customertype.js';
import customer from './models/customer.js';
import vehicletype from './models/vehicletype.js';
import servicing from './models/servicing.js';

const sequelize = new Sequelize("perfectservice", "postgres", "mysql", {
    host: "localhost",
    port: 5432,
    dialect: "postgres"
});

const jwtSettings = {
    jwtSecret: "msit007700itms",
};

sequelize.authenticate().then(
    (authenticate) => {
        console.log(`Database connected successfully`);
    },
    (error) => {
        console.log(`Error occurred while connecting to database`);
    }
);

class DataAccess {
    constructor() {
        employee.init(sequelize, DataTypes);
        employeetype.init(sequelize, DataTypes);
        customertype.init(sequelize, DataTypes);
        customer.init(sequelize, DataTypes);
        vehicletype.init(sequelize, DataTypes);
        servicing.init(sequelize, DataTypes);
    }

    async authenticateEmployee(req, res) {
        const user = req.body;
        await sequelize.sync({ force: false });

        let findUser = await employee.findOne({
            where: { loginname: user.username },
        });
        if (findUser === null) {
            findUser = await customer.findOne({
                where: { email: user.username },
            });
            if (findUser === null) {
                return res
                    .status(404)
                    .send({ message: `User ${user.username} is not found` });
            }

        }

        if (findUser.password.trim() !== user.password.trim()) {
            return res
                .status(401)
                .send({ message: `User's password does not match` });
        }

        const findRole = await employeetype.findOne({
            where: { id: findUser.type }
        })

        let tokenDataJson = { "username": user.username, "rolename": findRole.name };

        const token = jsonwebtoken.sign({ tokenDataJson }, jwtSettings.jwtSecret, {
            expiresIn: 3600, // 1 hr
            algorithm: "HS384",
        });

        return res.status(200).send({
            message: `User ${user.username} is authenticated successfully`,
            token: token,
            role: findRole.name,
            email: user.username
        });
    }

    async getCustomerType(req, res) {
        await sequelize.sync({ force: false });
        const custtype = await customertype.findAll();
        return res
            .status(200)
            .send({ message: `Data Read Successfully`, type: custtype });
    }

    async saveCustomer(req, res) {
        await sequelize.sync({ force: false });

        let maxCustId = await customer.max('id', { where: req.body.id });
        if (maxCustId === null) {
            req.body.id = 1;
        } else {
            req.body.id = maxCustId + 1;
        }

        const custtype = await customertype.findOne({
            where: { name: req.body.customertype }
        });
        console.log(`custtype ${JSON.stringify(custtype)}`);

        if (custtype != null) {
            req.body.customertype = parseInt(custtype.id);
        } else {
            return res.status(500).send({ message: "Invalid Customer Type" });
        }
        req.body.type = 7;
        console.log(`req.body ${JSON.stringify(req.body)}`);

        let cust = await customer.create(req.body);
        if (cust) {
            return res
                .status(200)
                .send({ message: "Data is added successfully", data: cust });
        }
        return res
            .status(500)
            .send({ message: "Some error Occurred while adding record" });
    }

    async getVehicleType(req, res) {
        await sequelize.sync({ force: false });
        const vehtype = await vehicletype.findAll();
        return res
            .status(200)
            .send({ message: `Data Read Successfully`, type: vehtype });
    }

    async bookServicing(req, res) {
        if (req.headers.authorization !== undefined) {
            const receivedToken = req.headers.authorization.split(" ")[1];
            console.log(`${req.headers.authorization}`);
            await jsonwebtoken.verify(
                receivedToken,
                jwtSettings.jwtSecret,
                async (error, decode) => {
                    if (error) {
                        return res.status(401).send({
                            message: `User Authentication Failed because token verification failed`,
                        });
                    }

                    req.decode = decode;

                    await sequelize.sync({ force: false });
                    let data = {
                        vehiclenumber: req.body.vehiclenumber,
                        vehicletype: req.body.vehicletype,
                        ispickup: req.body.ispickup
                    }

                    const cust = await customer.findOne({ where: { email: req.body.email } });
                    data.customerid = cust.id;

                    const vehtype = await vehicletype.findOne({ where: { name: req.body.vehicletype } });
                    data.vehicletype = parseInt(vehtype.id);

                    let maxServicingId = await servicing.max('id', { where: req.body.id });
                    if (maxServicingId === null) {
                        data.id = 1;
                    } else {
                        data.id = maxServicingId + 1;
                    }

                    let numOfService = await servicing.count('vehiclenumber', { where: req.body.vehiclenumber });
                    data.numberofservice = numOfService + 1;

                    let date = new Date();
                    data.registrationdate = date.getDate() + '-' + parseInt(date.getMonth() + 1) + '-' + date.getFullYear();
                    data.actualservicestartdate = date.getDate() + '-' + parseInt(date.getMonth() + 1) + '-' + date.getFullYear();
                    data.expectedserviceenddate = date.getDate() + '-' + parseInt(date.getMonth() + 1) + '-' + date.getFullYear();

                    data.registrationtype = req.decode.tokenDataJson.rolename === 'Customer' ? 1 : 3;
                    data.bookedby = req.decode.tokenDataJson.rolename === 'Customer' ? 7 : 4;

                    console.log(`data :: :: :: :: ${JSON.stringify(data)}`);
                    const serv = await servicing.create(data);
                    if (serv) {
                        return res
                            .status(200)
                            .send({ message: `Data Read Successfully`, records: serv });
                    }
                    return res
                        .status(500)
                        .send({ message: "Some error Occurred while adding record" });
                }
            );
        }

    }

    async getServicingDataByCustomer(req, res) {
        if (req.headers.authorization !== undefined) {
            const receivedToken = req.headers.authorization.split(" ")[1];
            await jsonwebtoken.verify(
                receivedToken,
                jwtSettings.jwtSecret,
                async (error, decode) => {
                    if (error) {
                        return res.status(401).send({
                            message: `User Authentication Failed because token verification failed`,
                        });
                    }
                    req.decode = decode;
                    const username = req.decode.tokenDataJson.username;
                    const role = req.decode.tokenDataJson.rolename;
                    const cust = await customer.findOne({ where: { email: username } });
                    const customerid = cust.id;
                    let servicingData;
                    if (role === 'Customer') {
                        servicingData = await servicing.findAll({
                            attributes: [
                                'vehiclenumber',
                                'vehicletype',
                                'numberofservice',
                                'actualservicestartdate',
                                'expectedserviceenddate',
                                'actualserviceenddate',
                                'ispickup'
                            ],
                            where: { customerid: customerid }
                        });
                    } else {
                        console.log(`Inside Else`);
                    }

                    if (servicingData) {
                        for (let i = 0; i < servicingData.length; i++) {
                            let vehicletypedata = await vehicletype.findOne({ where: { id: servicingData[i].vehicletype } });
                            servicingData[i].vehicletype = vehicletypedata.name;
                        }
                        console.log(`servicingData :: :: :: :: ${JSON.stringify(servicingData)}`);
                        return res
                            .status(200)
                            .send({ message: `Data Read Successfully`, records: servicingData });
                    }
                    return res
                        .status(500)
                        .send({ message: "Some error Occurred while adding record" });
                }
            );
        }
    }

    async deleteServiceRecord(req, res) {
        if (req.headers.authorization !== undefined) {
            console.log(`Inside`);
            const receivedToken = req.headers.authorization.split(" ")[1];
            await jsonwebtoken.verify(
                receivedToken,
                jwtSettings.jwtSecret,
                async (error, decode) => {
                    if (error) {
                        return res.status(401).send({
                            message: `User Authentication Failed because token verification failed`,
                        });
                    }
                    req.decode = decode;
                    let vehiclenumber = req.params.vehiclenumber;
                    const serv = await servicing.destroy({ where: { vehiclenumber: vehiclenumber } });
                    if(serv) {
                        console.log(`serv :: :: :: :: ${JSON.stringify(serv)}`);
                    }
                }
            );
        }
    }
}

export default DataAccess;