import axios from 'axios';

export default class VehicleService {
    constructor() {
        this.url = "http://localhost:7011";
    }

    getVehicleType() {
        let response = axios.get(`${this.url}/api/getvehicletype`);
        return response;
    }
}