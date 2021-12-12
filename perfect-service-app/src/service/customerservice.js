import axios from 'axios';

export default class CustomerService {
    constructor() {
        this.url = "http://localhost:7011";
    }

    getCustomerType() {
        let response = axios.get(`${this.url}/api/getcustomertype`);
        return response;
    }

    saveCustomer(customers) {
        let response = axios.post(`${this.url}/api/create/customer`, customers, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    }
}