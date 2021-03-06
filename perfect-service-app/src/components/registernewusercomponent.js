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
    const [disablecreateuserbtn, setDisableCreateUserBtn] = useState(true);
    const [isCustomerNameValid, setCustomerNameValid] = useState(true);
    const [isEmailValid, setCustomerEmailValid] = useState(true);
    const [isValidAddress, setCustomerAddressValid] = useState(true);
    const [isValidCity, setValidCityWarning] = useState(true);
    const [isValidState, setValidStateWarning] = useState(true);
    const [isValidPrimaryContact, setValidPrimaryContactWarning] = useState(true);
    const [isValidContactNumber, setValidContactNumberWarning] = useState(true);
    const [isValidLandline, setValidLandlineWarning] = useState(true);
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
        validateForm(evt.target.name, evt.target.value);
    };

    const validateForm = (name, value) => {
        if (name === 'nameuser') {
            if (value.length <= 0) {
                setCustomerNameValid(false);
                setDisableCreateUserBtn(true);
            } else {
                setCustomerNameValid(true);
                setDisableCreateUserBtn(false);
            }
        }

        if (name === 'useremail') {
            if (value.includes('@') && value.length > 1) {
                setCustomerEmailValid(true);
                setDisableCreateUserBtn(false);
            } else {
                setCustomerEmailValid(false);
                setDisableCreateUserBtn(true);
            }
        }

        if (name === "useraddress") {
            if (value.length <= 0) {
                setCustomerAddressValid(false);
                setDisableCreateUserBtn(true);
            } else {
                setCustomerAddressValid(true);
                setDisableCreateUserBtn(false);
            }
        }

        if (name === "usercity") {
            if(value.length <= 0) {
                setValidCityWarning(false);
                setDisableCreateUserBtn(true);
            } else {
                setValidCityWarning(true);
                setDisableCreateUserBtn(false);
            }
        }
        if (name === "userstate") {
            if(value.length <= 0) {
                setValidStateWarning(false);
                setDisableCreateUserBtn(true);
            } else {
                setValidStateWarning(true);
                setDisableCreateUserBtn(false);
            }
        }
        if (name === "userprimarycontact") {
            if(parseInt(value.length) <= 0) {
                setValidPrimaryContactWarning(false);
                setDisableCreateUserBtn(true);
            } else {
                setValidPrimaryContactWarning(true);
                setDisableCreateUserBtn(false);
            }
        }
        if (name === "usercontactnumber") {
            if(parseInt(value.length) <= 0) {
                setValidContactNumberWarning(false);
                setDisableCreateUserBtn(true);
            } else {
                setValidContactNumberWarning(true);
                setDisableCreateUserBtn(false);
            }
        }
        if (name === "userlandline") {
            if(parseInt(value.length) <= 0) {
                setValidLandlineWarning(false);
                setDisableCreateUserBtn(true);
            } else {
                setValidLandlineWarning(true);
                setDisableCreateUserBtn(false);
            }
        }
    }

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
                        <div className="alert alert-danger" hidden={isCustomerNameValid}>
                            Please Enter valid name
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="createFormLeftMargin">Email</label>
                        <input type="email" className="form-control inputCreateForm createFormLeftMargin"
                            name="useremail"
                            onChange={handleOnChange} />
                        <div className="alert alert-danger" hidden={isEmailValid}>
                            Please Enter valid email
                        </div>
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
                        <div className="alert alert-danger" hidden={isValidAddress}>
                            Please Enter valid address
                        </div>  
                    </div>
                    <div className="form-group">
                        <label className="createFormLeftMargin">City</label>
                        <input type="text" className="form-control inputCreateForm createFormLeftMargin"
                            name="usercity"
                            onChange={handleOnChange} />
                        <div className="alert alert-danger" hidden={isValidCity}>
                            Please Enter valid city
                        </div>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="form-group">
                        <label className="createFormLeftMargin">State</label>
                        <input type="text" className="form-control inputCreateForm createFormLeftMargin"
                            name="userstate"
                            onChange={handleOnChange} />
                        <div className="alert alert-danger" hidden={isValidState}>
                            Please Enter valid state
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="createFormLeftMargin">Primary Contact Number</label>
                        <input type="number" className="form-control inputCreateForm createFormLeftMargin"
                            name="userprimarycontact"
                            onChange={handleOnChange} />
                        <div className="alert alert-danger" hidden={isValidPrimaryContact}>
                            Please Enter valid number
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="createFormLeftMargin">Contact Number</label>
                        <input type="number" className="form-control inputCreateForm createFormLeftMargin"
                            name="usercontactnumber"
                            onChange={handleOnChange} />
                        <div className="alert alert-danger" hidden={isValidContactNumber}>
                            Please Enter valid number
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="createFormLeftMargin">Landline</label>
                        <input type="number" className="form-control inputCreateForm createFormLeftMargin"
                            name="userlandline"
                            onChange={handleOnChange} />
                        <div className="alert alert-danger" hidden={isValidLandline}>
                            Please Enter valid number
                        </div>
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
                value="Create New User" onClick={save} disabled={disablecreateuserbtn} />
            <input type="button" className="btn btn-primary createUserBtn createBtnLeftMargin registerBtn"
                value="Back To Login" onClick={backToLogin} />
        </div>
    );
}

export default RegisterNewUserComponent;