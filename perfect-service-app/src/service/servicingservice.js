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
}