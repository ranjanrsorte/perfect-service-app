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
instance.get("/api/get/bill/:vehiclenumber", dataAccess.getBillData);
instance.get("/api/get/loggedinuser/:useremail", dataAccess.getLoggedInUserDetails);

// Assigned Work
instance.get("/api/assign/work/manager/get", dataAccess.getPendingServiceDataByManager);
instance.get("/api/get/service/lead", dataAccess.getServiceLeads);
instance.get("/api/get/service/assignees/:vehiclenumber", dataAccess.getServiceAssignees);
instance.put("/api/service/assign/lead/:vehiclenumber", dataAccess.assignServiceLead);
instance.get("/api/workers/get", dataAccess.getServiceWorkers);
instance.get("/api/get/servicestatus/list", dataAccess.getServiceStatusList);
instance.get("/api/get/vehicleparts/list/:vehicletype", dataAccess.getVehicleParts);

// Bills
instance.get("/api/bills", dataAccess.getPendingBills);
instance.put("/api/bills/update/:servicingid", dataAccess.updateBillData);
instance.get("/api/bills/price/:servicingid", dataAccess.getBillPrices);

// Waiting For Delivery
instance.get("/api/get/waiting/delivery", dataAccess.getWaitingForDeliveryData);
instance.post("/api/update/status/delivered", dataAccess.updateStatusDelivered);

// Daily Bill Collection
instance.get("/api/daily/bills/report/:servicedate", dataAccess.getDailyBillReport);

// Delivered
instance.get("/api/get/delivered/services", dataAccess.getDeliveredServices);

// Employees List
instance.get("/api/employees/get", dataAccess.getAllEmployeesList);
instance.get("/api/employees/type", dataAccess.getEmployeeType);
instance.post("/api/employees/update", dataAccess.updateEmployeeData);
instance.post("/api/employees/add", dataAccess.addEmployee);


instance.listen(port, () => {
    console.log(`Server started on port ${port}`);
});