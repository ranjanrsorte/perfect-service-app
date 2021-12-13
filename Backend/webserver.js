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

// Login User
instance.post("/api/auth/employee", dataAccess.authenticateEmployee);

// Create User
instance.get("/api/getcustomertype", dataAccess.getCustomerType);
instance.post("/api/create/customer", dataAccess.saveCustomer);

// All Bookings
instance.get("/api/getvehicletype", dataAccess.getVehicleType);
instance.get("/api/getbookingtype", dataAccess.getBookingType);
instance.post("/api/service/book", dataAccess.bookServicing);
instance.get("/api/service/get", dataAccess.getServicingDataByCustomer);
instance.delete("/api/service/delete/:vehiclenumber", dataAccess.deleteServiceRecord);

// Assigned Work
instance.get("/api/assign/work/manager/get", dataAccess.getPendingServiceDataByManager);
instance.get("/api/get/service/lead", dataAccess.getServiceLeads);
instance.get("/api/get/service/assignees/:vehiclenumber", dataAccess.getServiceAssignees);
instance.put("/api/service/assign/lead/:vehiclenumber", dataAccess.assignServiceLead);
instance.get("/api/workers/get", dataAccess.getServiceWorkers);

instance.listen(port, () => {
    console.log(`Server started on port ${port}`);
});