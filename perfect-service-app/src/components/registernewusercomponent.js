import { useEffect, useState } from 'react';

import CustomerService from "../service/customerservice";

const RegisterNewUserComponent = (props) => {
    const [message, setMessage] = useState('');
    const [customertype, setCustomerType] = useState([]);
    const [customer, setCustomer] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        city: "",
        state: "",
        primarycontactnumber: 0,
        contactnumber: 0,
        landline: 0,
        customertype: ""
    });
    const [customers, addCustomer] = useState([]);
    const custserv = new CustomerService();

    const backToLogin = () => {
        props.history.push('/login');
    }

    useEffect(() => {
        custserv.getCustomerType().then((response) => {
            setCustomerType(response.data.type);
        }).catch((error) => {
            setMessage(error);
        });
    }, [])

    const handleOnChange = (evt) => {
        if (evt.target.name === "nameuser") {
            setCustomer({ ...customer, name: evt.target.value });
        }
        if (evt.target.name === "useremail") {
            setCustomer({ ...customer, email: evt.target.value });
        }
        if (evt.target.name === "userpassword") {
            setCustomer({ ...customer, password: evt.target.value });
        }
        if (evt.target.name === "useraddress") {
            setCustomer({ ...customer, address: evt.target.value });
        }
        if (evt.target.name === "usercity") {
            setCustomer({ ...customer, city: evt.target.value });
        }
        if (evt.target.name === "userstate") {
            setCustomer({ ...customer, state: evt.target.value });
        }
        if (evt.target.name === "userprimarycontact") {
            setCustomer({ ...customer, primarycontactnumber: parseInt(evt.target.value) });
        }
        if (evt.target.name === "usercontactnumber") {
            setCustomer({ ...customer, contactnumber: parseInt(evt.target.value) });
        }
        if (evt.target.name === "userlandline") {
            setCustomer({ ...customer, landline: parseInt(evt.target.value) });
        }
        if (evt.target.name === "customertypename") {
            setCustomer({ ...customer, customertype: evt.target.value });
        }
    };

    const save = () => {
        addCustomer([...customers, customer]);

        custserv.saveCustomer(customer).then((response) => {
            console.log(`${JSON.stringify(response)}`);
            props.history.push("/login");
        }).catch((error) => {
            setMessage(error);
        });
    };

    return (
        <div className="container">
            <h4 className="createUserHeading">Register as a new user</h4>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <label className="createFormLeftMargin">Name</label>
                        <input type="text"
                            className="form-control inputCreateForm createFormLeftMargin"
                            name="nameuser"
                            onChange={handleOnChange} />
                    </div>
                    <div className="form-group">
                        <label className="createFormLeftMargin">Email</label>
                        <input type="email" className="form-control inputCreateForm createFormLeftMargin"
                            name="useremail"
                            onChange={handleOnChange} />
                    </div>
                    <div className="form-group">
                        <label className="createFormLeftMargin">Password</label>
                        <input type="password" className="form-control inputCreateForm createFormLeftMargin"
                            name="userpassword"
                            onChange={handleOnChange} />
                    </div>
                    <div className="form-group">
                        <label className="createFormLeftMargin">Address</label>
                        <input type="text" className="form-control inputCreateForm createFormLeftMargin"
                            name="useraddress"
                            onChange={handleOnChange} />
                    </div>
                    <div className="form-group">
                        <label className="createFormLeftMargin">City</label>
                        <input type="text" className="form-control inputCreateForm createFormLeftMargin"
                            name="usercity"
                            onChange={handleOnChange} />
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="form-group">
                        <label className="createFormLeftMargin">State</label>
                        <input type="text" className="form-control inputCreateForm createFormLeftMargin"
                            name="userstate"
                            onChange={handleOnChange} />
                    </div>
                    <div className="form-group">
                        <label className="createFormLeftMargin">Primary Contact Number</label>
                        <input type="number" className="form-control inputCreateForm createFormLeftMargin"
                            name="userprimarycontact"
                            onChange={handleOnChange} />
                    </div>
                    <div className="form-group">
                        <label className="createFormLeftMargin">Contact Number</label>
                        <input type="number" className="form-control inputCreateForm createFormLeftMargin"
                            name="usercontactnumber"
                            onChange={handleOnChange} />
                    </div>
                    <div className="form-group">
                        <label className="createFormLeftMargin">Landline</label>
                        <input type="number" className="form-control inputCreateForm createFormLeftMargin"
                            name="userlandline"
                            onChange={handleOnChange} />
                    </div>
                    <div className="form-group">
                        <label className="createFormLeftMargin">Type</label>
                        <select className="form-control inputCreateForm createFormLeftMargin"
                            value={props.valueProperty}
                            name="customertypename"
                            onChange={handleOnChange}
                        >
                            {customertype.map((ds, idx) => (
                                <option key={idx} value={ds.name}>
                                    {ds.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>


            <br />
            <input type="button" className="btn btn-primary createUserBtn createBtnLeftMargin"
                value="Create New User" onClick={save} />
            <input type="button" className="btn btn-primary createUserBtn createBtnLeftMargin registerBtn"
                value="Back To Login" onClick={backToLogin} />
        </div>
    );
}

export default RegisterNewUserComponent;