import { Sequelize } from "sequelize";
import pkg from "sequelize";
import jsonwebtoken from "jsonwebtoken";

const { DataTypes, Op } = pkg;

import employeetype from './models/employeetype.js';
import employee from './models/employee.js';
import customertype from './models/customertype.js';
import customer from './models/customer.js';
import vehicletype from './models/vehicletype.js';
import servicing from './models/servicing.js';
import bookingtype from './models/bookingtype.js';
import servicestatus from './models/servicestatus.js';
import assignedworkers from './models/assignedworkers.js';
import partsprice from './models/partsprice.js';
import bill from './models/bill.js';
import e from "express";

const sequelize = new Sequelize("perfectservice", "postgres", "mysql", {
    host: "localhost",
    port: 5432,
    dialect: "postgres"
});

const jwtSettings = {
    jwtSecret: "",
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
        bookingtype.init(sequelize, DataTypes);
        servicestatus.init(sequelize, DataTypes);
        assignedworkers.init(sequelize, DataTypes);
        partsprice.init(sequelize, DataTypes);
        bill.init(sequelize, DataTypes);
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

        console.log(`......................................`);
        console.log(`${JSON.stringify(req.body)}`);
        console.log(`......................................`);

        if (req.body.name !== "" && req.body.email !== "" && req.body.password !== "" && req.body.address !== "" && req.body.city !== ""
            && req.body.state !== "" && req.body.primarycontactnumber !== "" && req.body.contactnumber !== "" && req.body.landline !== "" && req.body.customertype !== "") {
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
    }

    async getVehicleType(req, res) {
        await sequelize.sync({ force: false });
        const vehtype = await vehicletype.findAll();
        return res
            .status(200)
            .send({ message: `Data Read Successfully`, type: vehtype });
    }

    async getBookingType(req, res) {
        await sequelize.sync({ force: false });
        const booktype = await bookingtype.findAll();
        return res
            .status(200)
            .send({ message: `Data Read Successfully`, type: booktype });
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

                    if (req.decode.tokenDataJson.rolename === 'Customer') {
                        const cust = await customer.findOne({ where: { email: req.body.email } });
                        data.customerid = cust.id;
                    } else if (req.decode.tokenDataJson.rolename === 'Servicing Representative') {
                        const cust = await customer.findOne({ where: { email: req.body.customeremail } });
                        data.customerid = cust.id;
                    }

                    const vehtype = await vehicletype.findOne({ where: { name: req.body.vehicletype } });
                    data.vehicletype = parseInt(vehtype.id);

                    let maxServicingId = await servicing.max('id', { where: req.body.id });
                    if (maxServicingId === null) {
                        data.id = 1;
                    } else {
                        data.id = maxServicingId + 1;
                    }

                    let numOfService = await servicing.findAll({ where: { vehiclenumber: req.body.vehiclenumber } });
                    data.numberofservice = numOfService.length + 1;

                    let date = new Date();
                    data.registrationdate = date.getDate() + '-' + parseInt(date.getMonth() + 1) + '-' + date.getFullYear();
                    data.actualservicestartdate = date.getDate() + '-' + parseInt(date.getMonth() + 1) + '-' + date.getFullYear();
                    data.expectedserviceenddate = date.getDate() + '-' + parseInt(date.getMonth() + 1) + '-' + date.getFullYear();

                    if (req.decode.tokenDataJson.rolename === 'Customer') {
                        data.registrationtype = 1;
                    } else if (req.decode.tokenDataJson.rolename === 'Servicing Representative') {
                        let booktype = await bookingtype.findOne({ where: { name: req.body.bookingtype } });
                        data.registrationtype = booktype.id;
                    }
                    data.bookedby = req.decode.tokenDataJson.rolename === 'Customer' ? 7 : 4;
                    data.servicestatusid = 1;

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
                    let servicingData;
                    if (role === 'Customer') {
                        const cust = await customer.findOne({ where: { email: username } });
                        const customerid = cust.id;
                        servicingData = await servicing.findAll({
                            attributes: [
                                'vehiclenumber',
                                'vehicletype',
                                'numberofservice',
                                'actualservicestartdate',
                                'expectedserviceenddate',
                                'actualserviceenddate',
                                'ispickup',
                                'servicestatusid'
                            ],
                            where: { customerid: customerid }
                        });
                    } else if (role === 'Servicing Representative' || role === 'Administrator') {
                        servicingData = await servicing.findAll({
                            attributes: [
                                'vehiclenumber',
                                'vehicletype',
                                'numberofservice',
                                'actualservicestartdate',
                                'expectedserviceenddate',
                                'actualserviceenddate',
                                'ispickup',
                                'customerid',
                                'registrationtype',
                                'servicestatusid'
                            ]
                        });
                        if (servicingData) {
                            for (let i = 0; i < servicingData.length; i++) {
                                let cust = await customer.findOne({ where: { id: servicingData[i].customerid } });
                                servicingData[i].customerid = cust.name;
                                let booktype = await bookingtype.findOne({ where: { id: servicingData[i].registrationtype } });
                                servicingData[i].registrationtype = booktype.name;
                            }
                        }
                    }

                    if (servicingData) {
                        for (let i = 0; i < servicingData.length; i++) {
                            let vehicletypedata = await vehicletype.findOne({ where: { id: servicingData[i].vehicletype } });
                            servicingData[i].vehicletype = vehicletypedata.name;

                            let servicestat = await servicestatus.findOne({ where: { id: servicingData[i].servicestatusid } });
                            servicingData[i].servicestatusid = servicestat.name;
                        }
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
                    if (serv) {
                        return res
                            .status(200)
                            .send({ message: `Data Deleted Successfully`, records: serv });
                    }
                    return res
                        .status(500)
                        .send({ message: "Some error Occurred while deleting record" });
                }
            );
        }
    }

    async getPendingServiceDataByManager(req, res) {
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
                    let serv;
                    if (req.decode.tokenDataJson.rolename === 'Servicing Manager') {
                        serv = await servicing.findAll({ where: { servicestatusid: { [Op.ne]: 5 } } });
                    } else if (req.decode.tokenDataJson.rolename === 'Servicing Leads') {
                        let emp = await employee.findOne({ where: { loginname: req.decode.tokenDataJson.username } });
                        serv = await servicing.findAll({ where: { serviceleadid: emp.id } });
                    } else if (req.decode.tokenDataJson.rolename === 'Servicing Worker') {
                        let emp = await employee.findOne({ where: { loginname: req.decode.tokenDataJson.username } });
                        let assignwork = await assignedworkers.findAll({ where: { workerid: emp.id } });
                        let servid = [];
                        for (let p = 0; p < assignwork.length; p++) {
                            servid.push(parseInt(assignwork[p].servicingid));
                        }
                        serv = await servicing.findAll({ where: { id: { [Op.in]: servid }, servicestatusid: { [Op.ne]: 5 } } });
                    }

                    if (serv) {
                        let servicingData = [];
                        let serviceData = {};
                        for (let i = 0; i < serv.length; i++) {

                            let cust = await customer.findOne({ where: { id: serv[i].customerid } });
                            let booktype = await bookingtype.findOne({ where: { id: serv[i].registrationtype } });
                            let vehicletypedata = await vehicletype.findOne({ where: { id: serv[i].vehicletype } });
                            let servicestat = await servicestatus.findOne({ where: { id: serv[i].servicestatusid } });

                            serviceData = {
                                'vehiclenumber': serv[i].vehiclenumber,
                                'registrationdate': serv[i].registrationdate,
                                'numberofservice': serv[i].numberofservice,
                                'customername': cust.name,
                                'registrationtype': booktype.name,
                                'vehicletype': vehicletypedata.name,
                                'servicestatus': servicestat.name,
                                'ispickup': serv[i].ispickup === 0 ? 'No' : 'Yes'
                            }

                            servicingData.push(serviceData);
                        }

                        return res
                            .status(200)
                            .send({ message: `Data Read Successfully`, records: servicingData });
                    }
                    return res
                        .status(500)
                        .send({ message: "Some error Occurred while getting record" });
                }
            );
        }
    }

    async getServiceLeads(req, res) {
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
                    const serviceleads = await employee.findAll({ where: { type: 3 } });
                    if (serviceleads) {
                        return res
                            .status(200)
                            .send({ message: `Data Read Successfully`, records: serviceleads });
                    }
                    return res
                        .status(500)
                        .send({ message: "Some error Occurred while getting record" });
                }
            );
        }
    }

    async assignServiceLead(req, res) {
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
                    await sequelize.sync({ force: false });
                    let serv;
                    if (req.decode.tokenDataJson.rolename === 'Servicing Manager') {
                        let managerid = await employee.findOne({ where: { loginname: req.decode.tokenDataJson.username } });
                        let leadid = await employee.findOne({ where: { name: req.body.servicelead } });
                        serv = await servicing.update({
                            servicemanagerid: parseInt(managerid.id),
                            serviceleadid: parseInt(leadid.id)
                        }, {
                            where: {
                                vehiclenumber: req.params.vehiclenumber
                            }
                        });
                    } else if (req.decode.tokenDataJson.rolename === 'Servicing Leads') {
                        serv = await servicing.findOne({ where: { vehiclenumber: req.params.vehiclenumber } });
                        let washingworker = await employee.findOne({ where: { name: req.body.washingworker } });
                        let cleaningworker = await employee.findOne({ where: { name: req.body.cleaningworker } });
                        let servicingworker = await employee.findOne({ where: { name: req.body.serviceworker } });
                        let assignedwashingworks = {
                            servicingid: serv.id,
                            serviceleadid: serv.serviceleadid,
                            workerid: washingworker.id,
                            servicetype: 1
                        }

                        let assignedcleaningworks = {
                            servicingid: serv.id,
                            serviceleadid: serv.serviceleadid,
                            workerid: cleaningworker.id,
                            servicetype: 2
                        }

                        let assignedservicingworks = {
                            servicingid: serv.id,
                            serviceleadid: serv.serviceleadid,
                            workerid: servicingworker.id,
                            servicetype: 3
                        }

                        await assignedworkers.create(assignedwashingworks);
                        await assignedworkers.create(assignedcleaningworks);
                        await assignedworkers.create(assignedservicingworks);

                    } else if (req.decode.tokenDataJson.rolename === 'Servicing Worker') {
                        let servicestatusdata = await servicestatus.findOne({ where: { name: req.body.servicestatus } });
                        serv = await servicing.update({
                            servicestatusid: parseInt(servicestatusdata.id)
                        }, {
                            where: {
                                vehiclenumber: req.body.vehiclenumber
                            }
                        });
                        const servicedata = await servicing.findOne({ where: { vehiclenumber: req.body.vehiclenumber } });
                        const vehiclepart = await partsprice.findOne({
                            where: {
                                part: req.body.parts,
                                vehicletypeid: servicedata.vehicletype
                            }
                        });
                        let customerbill = await bill.findOne({ where: { servicingid: servicedata.id } });

                        if (customerbill != null) {
                            customerbill = await bill.update({
                                totalbill: vehiclepart.price
                            }, { where: { servicingid: servicedata.id } });
                        } else {
                            let date = new Date();
                            const billeddate = date.getDate() + '-' + parseInt(date.getMonth() + 1) + '-' + date.getFullYear();
                            customerbill = await bill.create({
                                customerid: servicedata.customerid,
                                vehicletypeid: servicedata.vehicletype,
                                totalbill: vehiclepart.price,
                                servicingid: servicedata.id,
                                billdate: billeddate,
                                partprice: vehiclepart.price,
                                serviceprice: 0,
                                washingprice: 0,
                                cleaningprice: 0
                            });
                        }
                    }

                    if (serv) {
                        return res
                            .status(200)
                            .send({ message: `Data updated Successfully`, records: serv });
                    }
                    return res
                        .status(500)
                        .send({ message: "Some error Occurred while updating record" });

                }
            );
        }
    }

    async getServiceAssignees(req, res) {
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
                    let servicedata = await servicing.findOne({ where: { vehiclenumber: req.params.vehiclenumber } });
                    let servicemanager = await employee.findOne({ where: { id: servicedata.servicemanagerid } });
                    let servicelead = await employee.findOne({ where: { id: servicedata.serviceleadid } });
                    let serviceassignees = {
                        'vehiclenumber': servicedata.vehiclenumber,
                        'servicemanager': servicemanager === null ? "" : servicemanager.name,
                        'servicelead': servicelead === null ? "" : servicelead.name
                    };
                    if (servicemanager && servicelead) {
                        return res
                            .status(200)
                            .send({ message: `Data updated Successfully`, records: serviceassignees });
                    }
                    return res
                        .status(500)
                        .send({ message: "Some error Occurred while updating record" });
                }
            );
        }
    }

    async getServiceWorkers(req, res) {
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
                    let workers = await employee.findAll({ where: { type: 5 } });
                    if (workers) {
                        return res
                            .status(200)
                            .send({ message: `Data updated Successfully`, records: workers });
                    }
                    return res
                        .status(500)
                        .send({ message: "Some error Occurred while updating record" });
                }
            );
        }
    }

    async getServiceStatusList(req, res) {
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
                    const servicestatuslist = await servicestatus.findAll();
                    if (servicestatuslist) {
                        return res
                            .status(200)
                            .send({ message: `Data updated Successfully`, records: servicestatuslist });
                    }
                    return res
                        .status(500)
                        .send({ message: "Some error Occurred while updating record" });
                }
            );
        }
    }

    async getVehicleParts(req, res) {
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
                    const vehicletypedata = await vehicletype.findOne({ where: { name: req.params.vehicletype } });
                    const vehiclepart = await partsprice.findAll(
                        { where: { vehicletypeid: vehicletypedata.id } }
                    );
                    if (vehiclepart) {
                        return res
                            .status(200)
                            .send({ message: `Data read Successfully`, records: vehiclepart });
                    }
                    return res
                        .status(500)
                        .send({ message: "Some error Occurred while reading record" });
                }
            );
        }
    }

    async getPendingBills(req, res) {
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
                    const serv = await servicing.findAll({ where: { servicestatusid: 3 } });
                    let servid = [];
                    let billdata = [];
                    for (let p = 0; p < serv.length; p++) {
                        servid.push(serv[p].id);
                    }
                    const pendingbills = await bill.findAll({ where: { servicingid: { [Op.in]: servid } } });
                    if (pendingbills) {
                        for (let i = 0; i < serv.length; i++) {
                            const cust = await customer.findOne({ where: { id: serv[i].customerid } });
                            const vehtype = await vehicletype.findOne({ where: { id: serv[i].vehicletype } });
                            let pendingbillsdata = {
                                "customername": cust.name,
                                "vehicletype": vehtype.name,
                                "totalbill": pendingbills[i].totalbill,
                                "servicingid": pendingbills[i].servicingid,
                                "billdate": pendingbills[i].billdate,
                                "ispickup": serv[i].ispickup === 0 ? 'No' : 'Yes',
                                "partprice": pendingbills[i].partprice
                            };
                            billdata.push(pendingbillsdata);
                        }
                        console.log(`........................................................`);
                        console.log(`billdata ${JSON.stringify(billdata)}`);
                        console.log(`........................................................`);
                        return res
                            .status(200)
                            .send({ message: `Data read Successfully`, records: billdata });
                    }
                    return res
                        .status(500)
                        .send({ message: "Some error Occurred while reading record" });
                }
            );
        }
    }

    async updateBillData(req, res) {
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

                    let totalprice = parseInt(req.body.washingprice)
                        + parseInt(req.body.cleaningprice)
                        + parseInt(req.body.serviceprice)
                        + parseInt(req.body.partprice);

                    if (req.body.ispickup === 'Yes') {
                        totalprice = parseInt(totalprice) + parseInt(req.body.pickupprice);
                    }

                    let updatedbill = {
                        "washingprice": req.body.washingprice,
                        "cleaningprice": req.body.cleaningprice,
                        "serviceprice": req.body.serviceprice,
                        "pickupprice": req.body.pickupprice,
                        "totalbill": parseInt(totalprice)
                    }
                    let billdata = await bill.update(updatedbill, { where: { servicingid: req.params.servicingid } });
                    if (billdata) {
                        const serv = await servicing.update({
                            servicestatusid: 4
                        }, { where: { id: req.params.servicingid } })
                        return res
                            .status(200)
                            .send({ message: `Data updated Successfully`, records: billdata });
                    }
                    return res
                        .status(500)
                        .send({ message: "Some error Occurred while updating record" });
                }
            );
        }
    }
    async getBillPrices(req, res) {
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
                    let prices = await bill.findOne({
                        attributes: [
                            'washingprice', 'serviceprice', 'cleaningprice', 'pickupprice'
                        ], where: { servicingid: req.params.servicingid }
                    });
                    if (prices) {
                        return res
                            .status(200)
                            .send({ message: `Data read Successfully`, records: prices });
                    }
                    return res
                        .status(500)
                        .send({ message: "Some error Occurred while reading record" });
                }
            )
        }
    }

    async getWaitingForDeliveryData(req, res) {
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
                    const serv = await servicing.findAll({
                        attributes: [
                            'vehiclenumber',
                            'vehicletype',
                            'customerid',
                            'registrationtype',
                            'servicestatusid'
                        ], where: { servicestatusid: 4 }
                    });
                    if (serv) {
                        let data = [];
                        for (let x = 0; x < serv.length; x++) {
                            let cust = await customer.findOne({ where: { id: serv[x].customerid } });
                            let vehtype = await vehicletype.findOne({ where: { id: serv[x].vehicletype } });
                            let status = await servicestatus.findOne({ where: { id: serv[x].servicestatusid } });
                            let regnum = await bookingtype.findOne({ where: { id: serv[x].registrationtype } });

                            let waitingdata = {
                                'vehiclenumber': serv[x].vehiclenumber,
                                'vehicletype': vehtype.name,
                                'customername': cust.name,
                                'registrationtype': regnum.name,
                                'servicestatus': status.name
                            }
                            data.push(waitingdata);
                        }
                        return res
                            .status(200)
                            .send({ message: `Data read Successfully`, records: data });
                    }
                    return res
                        .status(500)
                        .send({ message: "Some error Occurred while reading record" });
                }
            )
        }
    }

    async updateStatusDelivered(req, res) {
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
                    let date = new Date();
                    let serviceenddate = date.getDate() + '-' + parseInt(date.getMonth() + 1) + '-' + date.getFullYear();
                    const serv = await servicing.update({
                        actualserviceenddate: serviceenddate,
                        servicestatusid: 5
                    }, { where: { vehiclenumber: req.body.vehiclenumber } });
                    if (serv) {
                        return res
                            .status(200)
                            .send({ message: `Data read Successfully`, records: serv });
                    }
                    return res
                        .status(500)
                        .send({ message: "Some error Occurred while reading record" });
                }
            )
        }
    }

    async getBillData(req, res) {
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
                    const serv = await servicing.findOne({ where: { vehiclenumber: req.params.vehiclenumber } });
                    const billdetails = await bill.findOne({
                        attributes: [
                            "billdate", "partprice", "serviceprice", "washingprice", "cleaningprice", "pickupprice", "totalbill"
                        ],
                        where: { servicingid: serv.id }
                    });
                    if (billdetails) {
                        return res
                            .status(200)
                            .send({ message: `Data read Successfully`, records: billdetails });
                    }
                    return res
                        .status(500)
                        .send({ message: "Some error Occurred while reading record" });
                }
            )
        }
    }

    async getDailyBillReport(req, res) {
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
                    const servicedate = req.params.servicedate;
                    const splitteddate = servicedate.split('-');
                    const dateday = splitteddate[2];
                    const datemonth = splitteddate[1];
                    const dateyear = splitteddate[0];
                    const generatedbilldate = dateday + "-" + datemonth + "-" + dateyear;

                    const billdata = await bill.findAll({ where: { billdate: generatedbilldate } });
                    let billdetails = [];
                    if (billdata) {
                        for (let i = 0; i < billdata.length; i++) {
                            const cust = await customer.findOne({ where: { id: billdata[i].customerid } });
                            let billdetail = {
                                "customername": cust.name,
                                "washingprice": billdata[i].washingprice,
                                "cleaningprice": billdata[i].cleaningprice,
                                "serviceprice": billdata[i].serviceprice,
                                "pickupprice": billdata[i].pickupprice,
                                "partprice": billdata[i].partprice,
                                "totalbill": billdata[i].totalbill
                            }
                            billdetails.push(billdetail);
                        }
                        return res
                            .status(200)
                            .send({ message: `Data read Successfully`, records: billdetails });
                    }
                    return res
                        .status(500)
                        .send({ message: "Some error Occurred while reading record" });
                }
            )
        }
    }

    async getLoggedInUserDetails(req, res) {
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
                    let role = "";
                    let cust = await customer.findOne({ where: { email: req.params.useremail } });

                    if (cust === null) {
                        cust = await employee.findOne({ where: { loginname: req.params.useremail } });
                    }
                    const emprole = await employeetype.findOne({ where: { id: cust.type } });
                    role = emprole.name;

                    let loggedinuserdata = {
                        "name": cust.name === null ? cust.name : cust.name,
                        "rolename": role
                    }
                    return res
                        .status(200)
                        .send({ message: `Data read Successfully`, records: loggedinuserdata });
                }
            )
        }
    }

    async getDeliveredServices(req, res) {
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
                    const serv = await servicing.findAll({ where: { servicestatusid: 5 } });
                    if (serv) {
                        let servdata = [];
                        for (let p = 0; p < serv.length; p++) {
                            const cust = await customer.findOne({ where: { id: serv[p].customerid } });
                            const vehtype = await vehicletype.findOne({ where: { id: serv[p].vehicletype } });
                            const regtype = await bookingtype.findOne({ where: { id: serv[p].registrationtype } });
                            const servstatus = await servicestatus.findOne({ where: { id: serv[p].servicestatusid } });
                            let data = {
                                "vehiclenumber": serv[p].vehiclenumber,
                                "registrationdate": serv[p].registrationdate,
                                "numberofservice": serv[p].numberofservice,
                                "customername": cust.name,
                                "registrationtype": regtype.name,
                                "vehicletype": vehtype.name,
                                "servicestatus": servstatus.name,
                                "ispickup": serv[p].ispickup === 0 ? 'No' : 'Yes'
                            }
                            servdata.push(data);
                        }
                        return res
                            .status(200)
                            .send({ message: `Data read Successfully`, records: servdata });
                    }
                    return res
                        .status(500)
                        .send({ message: "Some error Occurred while reading record" });
                }
            )
        }
    }

    async getAllEmployeesList(req, res) {
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
                    const emp = await employee.findAll();
                    if (emp) {
                        let employeesData = [];
                        for (let i = 0; i < emp.length; i++) {
                            const emptype = await employeetype.findOne({ where: { id: emp[i].type } });
                            let empdata = {
                                "loginname": emp[i].loginname,
                                "name": emp[i].name,
                                "contactnumber": emp[i].contactnumber,
                                "employeetype": emptype.name
                            }
                            employeesData.push(empdata);
                        }
                        return res
                            .status(200)
                            .send({ message: `Data read Successfully`, records: employeesData });
                    }
                    return res
                        .status(500)
                        .send({ message: "Some error Occurred while reading record" });
                }
            )
        }
    }

    async getEmployeeType(req, res) {
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
                    const emptype = await employeetype.findAll();
                    if (emptype) {
                        return res
                            .status(200)
                            .send({ message: `Data read Successfully`, records: emptype });
                    }
                    return res
                        .status(500)
                        .send({ message: "Some error Occurred while reading record" });
                }
            )
        }
    }

    async updateEmployeeData(req, res) {
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
                    const emptype = await employeetype.findOne({ where: { name: req.body.employeetype } });
                    const emp = await employee.update({
                        "name": req.body.name,
                        "contactnumber": req.body.contactnumber,
                        "type": emptype.id
                    }, { where: { loginname: req.body.loginname } });
                    if (emp) {
                        return res
                            .status(200)
                            .send({ message: `Data read Successfully`, records: emp });
                    }
                    return res
                        .status(500)
                        .send({ message: "Some error Occurred while reading record" });
                }
            )
        }
    }

    async addEmployee(req, res) {
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
                    await sequelize.sync({ force: false });
                    let maxCustId = await employee.max('id', { where: req.body.id });
                    if (maxCustId === null) {
                        req.body.id = 1;
                    } else {
                        req.body.id = maxCustId + 1;
                    }
                    const emptype = await employeetype.findOne({ where: { name: req.body.employeetype } });
                    const emp = await employee.create({
                        "id": req.body.id,
                        "loginname": req.body.name,
                        "password": null,
                        "name": req.body.name,
                        "conatactnumber": req.body.contactnumber,
                        "type": emptype.id
                    });
                    if (emp) {
                        return res
                            .status(200)
                            .send({ message: `Data read Successfully`, records: emp });
                    }
                    return res
                        .status(500)
                        .send({ message: "Some error Occurred while reading record" });

                    /*
                    await sequelize.sync({ force: false });
                    
                            let maxCustId = await customer.max('id', { where: req.body.id });
                            if (maxCustId === null) {
                                req.body.id = 1;
                            } else {
                                req.body.id = maxCustId + 1;
                            }
                    
                            console.log(`......................................`);
                            console.log(`${JSON.stringify(req.body)}`);
                            console.log(`......................................`);
                    
                            if (req.body.name !== "" && req.body.email !== "" && req.body.password !== "" && req.body.address !== "" && req.body.city !== ""
                                && req.body.state !== "" && req.body.primarycontactnumber !== "" && req.body.contactnumber !== "" && req.body.landline !== "" && req.body.customertype !== "") {
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
                    
                    */
                }
            )
        }
    }
}

export default DataAccess;