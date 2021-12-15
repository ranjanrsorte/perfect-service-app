import axios from 'axios';

export default class BillService {
    constructor() {
        this.url = "http://localhost:7011";
    }

    getPendingCustomerBills() {
        let response = axios.get(`${this.url}/api/bills`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
        return response;
    }

    saveBillData(data) {
        let response = axios.put(`${this.url}/api/bills/update/${data.servicingid}`, data, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
        return response;
    }

    getPriceData(servicingid) {
        let response = axios.get(`${this.url}/api/bills/price/${servicingid}`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
        return response;
    }

    getBillDataByDate(servicedate) {
        let response = axios.get(`${this.url}/api/daily/bills/report/${servicedate}`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
        return response;
    }
}