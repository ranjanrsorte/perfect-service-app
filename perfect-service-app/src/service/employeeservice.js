import axios from 'axios';

export default class EmployeeService {
    constructor() {
        this.url = "http://localhost:7011";
    }

    getServiceWorkers() {
        let response = axios.get(`${this.url}/api/workers/get`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
        return response;
    }

    getEmployeesList() {
        let response = axios.get(`${this.url}/api/employees/get`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
        return response;
    }

    getEmployeeType() {
        let response = axios.get(`${this.url}/api/employees/type`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
        return response;
    }

    updateEmployeeData(servicing) {
        let response = axios.post(`${this.url}/api/employees/update`, servicing, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
        return response;
    }

    addEmployee(servicing) {
        let response = axios.post(`${this.url}/api/employees/add`, servicing, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
        return response;
    }
}