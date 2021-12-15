import axios from 'axios';

export default class ServicingService {
    constructor() {
        this.url = "http://localhost:7011";
    }

    addBookedService(servicedata) {
        let response = axios.post(`${this.url}/api/service/book`, servicedata, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
        return response;
    }

    getServicingDataByCustomer(token) {
        let response = axios.get(`${this.url}/api/service/get`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
        return response;
    }

    deleterecord(data) {
        let response = axios.delete(`${this.url}/api/service/delete/${data.vehiclenumber}`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
        return response;
    }

    getBookingType() {
        let response = axios.get(`${this.url}/api/getbookingtype`);
        return response;
    }

    getPendingServiceDataByManager() {
        let response = axios.get(`${this.url}/api/assign/work/manager/get`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
        return response;
    }

    getServiceLeads() {
        let response = axios.get(`${this.url}/api/get/service/lead`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
        return response;
    }

    assignLeadToService(data) {
        let response = axios.put(`${this.url}/api/service/assign/lead/${data.vehiclenumber}`, data, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
        return response;
    }

    getEmployeesData(data) {
        let response = axios.get(`${this.url}/api/get/service/assignees/${data.vehiclenumber}`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
        return response;
    }

    getAllServiceStatus() {
        let response = axios.get(`${this.url}/api/get/servicestatus/list`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
        return response;
    }

    getVehiclePartsByVehicleType(data) {
        let response = axios.get(`${this.url}/api/get/vehicleparts/list/${data.vehicletype}`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
        return response;
    }

    getWaitingForDeliveryData() {
        let response = axios.get(`${this.url}/api/get/waiting/delivery`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
        return response;
    }

    updateDeliveredStatus (data) {
        let response = axios.post(`${this.url}/api/update/status/delivered`, data, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
        return response;
    }

    getBillDetails(data) {
        let response = axios.get(`${this.url}/api/get/bill/${data.vehiclenumber}`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
        return response;
    }
}