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
        console.log(`${data}`); debugger;
        let response = axios.delete(`${this.url}/api/service/delete/${data.vehiclenumber}`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
        return response;
    }
}