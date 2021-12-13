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
}