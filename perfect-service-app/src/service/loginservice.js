import axios from 'axios';

export default class LoginService {
    constructor() {
        this.url = "http://localhost:7011";
    }

    loginUser(userDetails) {
        let response = axios.post(`${this.url}/api/auth/employee`, userDetails, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    }
}