import { useState } from "react";
import LoginService from "../service/loginservice";

const UserLoginComponent = (props) => {
    const [auth, setAuthUser] = useState({ username: "", password: "" });
    const [message, setMessage] = useState('');
    const serv = new LoginService();

    const authenticateUser = () => {
        serv.loginUser(auth).then((response) => {
            setMessage(response.data.message);
            // store token in sessionStorage
            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('role', response.data.role);
            sessionStorage.setItem('email', response.data.email);
            props.history.push("/bookings");
        }).catch((error) => {
            setMessage(error);
        });
    }

    const registerNewUser = () => {
        props.history.push('/create');
    }
    if (sessionStorage.getItem('token') != null) {
        sessionStorage.removeItem('token');
    }

    if (sessionStorage.getItem('role') != null) {
        sessionStorage.removeItem('role');
    }

    return (
        <div className="container col-sm-4 loginForm">
            <h5 className="inputText userLoginHeading">USER LOGIN</h5>
            <div className="form-group">
                <label className="lblname">UserName</label>
                <input type="text" className="form-control inputText"
                    value={auth.username}
                    onChange={(evt) =>
                        setAuthUser({ ...auth, username: evt.target.value })
                    } />
            </div>
            <div className="form-group">
                <label className="inputText">Password</label>
                <input type="password" className="form-control inputText"
                    value={auth.password}
                    onChange={(evt) =>
                        setAuthUser({ ...auth, password: evt.target.value })
                    } />
            </div>
            <br />
            <input type="button" className="btn btn-primary inputText" value="Login"
                onClick={authenticateUser} />
            <input type="button" className="btn btn-primary inputText registerBtn"
                value="Register New User"
                onClick={registerNewUser} />
        </div>
    );
}

export default UserLoginComponent;