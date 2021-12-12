import express from "express";
import cors from "cors";
import DataAccess from "./dataaccess.js";

const instance = express();
instance.use(express.json());
instance.use(express.urlencoded({ extended: false }));
instance.use(cors({
    origin:'*',
    methods:'*',
    allowedHeaders:'*'
}));

const port = process.env.PORT || 7011;
const dataAccess = new DataAccess();

instance.post("/api/auth/employee", dataAccess.authenticateEmployee);
instance.get("/api/getcustomertype", dataAccess.getCustomerType);
instance.post("/api/create/customer", dataAccess.saveCustomer);
instance.get("/api/getvehicletype", dataAccess.getVehicleType);
instance.post("/api/service/book", dataAccess.bookServicing);
instance.get("/api/service/get", dataAccess.getServicingDataByCustomer);
instance.delete("/api/service/delete/:vehiclenumber", dataAccess.deleteServiceRecord);

instance.listen(port, () => {
    console.log(`Server started on port ${port}`);
});