import { Redirect } from "react-router-dom";
import { useState, useEffect } from "react";
import ModulesComponent from "../commoncomponents/modulescomponent";
import LoggedInUserDetailComponent from "../commoncomponents/loggedinuserdetailcomponent";
import DataGridComponent from "../commoncomponents/datagridcomponent";
import EmployeeService from "../service/employeeservice";

const EmployeesListComponent = (props) => {

    const [servicingList, setServicingList] = useState([]);
    const [employeetype, setEmployeeType] = useState([]);
    const [servicing, setServicing] = useState({
        "loginname": "",
        "contactnumber": 0,
        "name": "",
        "employeetype": ""
    });
    const [message, setMessage] = useState("");
    const [editEmployeeForm, setEditEmployeeForm] = useState(true);
    const [addEmployeeForm, setAddEmployeeForm] = useState(true);
    const [employeelisttable, setEmployeeListTable] = useState(false);
    const empservice = new EmployeeService();

    const loginpage = () => {
        props.history.push('/login');
    }

    const getServiceRow = (row) => {
        setServicing(row);
        setEmployeeListTable(!employeelisttable);
        setEditEmployeeForm(!editEmployeeForm);
    }

    const handleOnChange = (evt) => {
        if (evt.target.name === "nameuser") {
            setServicing({ ...servicing, name: evt.target.value });
        }

        if (evt.target.name === "contactnumbername") {
            setServicing({ ...servicing, contactnumber: evt.target.value });
        }

        if (evt.target.name === "employeetypename") {
            setServicing({ ...servicing, employeetype: evt.target.value });
        }

        if (evt.target.name === "addloginnamename") {
            setServicing({ ...servicing, loginname: evt.target.value });
        }

        if (evt.target.name === "addnameuser") {
            setServicing({ ...servicing, name: evt.target.value });
        }

        if (evt.target.name === "addcontactnumbername") {
            setServicing({ ...servicing, contactnumber: evt.target.value });
        }

        if (evt.target.name === "addemployeetypename") {
            setServicing({ ...servicing, employeetype: evt.target.value });
        }
    }

    const canceleditform = () => {
        setEmployeeListTable(!employeelisttable);
        setEditEmployeeForm(!editEmployeeForm);
    }

    const updateEmployee = () => {
        // setEditEmployeeForm(!editEmployeeForm);
        console.log(`${JSON.stringify(servicing)}`);
        empservice.updateEmployeeData(servicing).then((response) => {
            if (response.status === 200) {
                setEmployeeListTable(!employeelisttable);
                setEditEmployeeForm(!editEmployeeForm);
            }
        }).catch((error) => { });
    }

    const addEmployee = () => {
        empservice.addEmployee(servicing).then((response) => {
            if (response.status === 200) {
                setEmployeeListTable(!employeelisttable);
                setEditEmployeeForm(!editEmployeeForm);
            }
        }).catch((error) => {
            setMessage(error);
        });
    }

    const toggleAddEmployeeForm = () => {
        setEmployeeListTable(!employeelisttable);
        setAddEmployeeForm(!addEmployeeForm);
    }

    useEffect(() => {
        empservice.getEmployeesList().then((response) => {
            if (response.status === 200) {
                setServicingList(response.data.records);
            }
        }).catch((error) => {
            setMessage(error);
        });

        empservice.getEmployeeType().then((response) => {
            if (response.status === 200) {
                setEmployeeType(response.data.records);
            }
        }).catch((error) => {
            setMessage(error);
        });
    }, []);

    if (sessionStorage.getItem('token') != null) {
        return (
            <div>
                <div className="row">
                    <div className="col-sm-2 moduleRoutes">
                        <ModulesComponent></ModulesComponent>
                    </div>
                    <div className="col-sm-10">
                        <div>
                            <table>
                                <tbody>
                                    <tr>
                                        <td className="loggedinusername">
                                            <LoggedInUserDetailComponent></LoggedInUserDetailComponent>
                                        </td>
                                        <td className="logoutandbooktd">
                                        <input type="button" value="Add Employee" className="btn btn-primary btn-sm"
                                                onClick={toggleAddEmployeeForm} />
                                            <input type="button" value="LogOut" className="btn btn-primary btn-sm homelogoutbtn"
                                                onClick={loginpage} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="container" hidden={employeelisttable}>
                            <DataGridComponent
                                dataSource={servicingList}
                                getSelectedRow={getServiceRow}
                            ></DataGridComponent>
                        </div>
                        <div hidden={editEmployeeForm}>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="container">
                                        <div className="form-group">
                                            <label className="createFormLeftMargin">Login Name</label>
                                            <input type="text"
                                                className="form-control inputCreateForm createFormLeftMargin"
                                                value={servicing.loginname} name="loginnamename" readOnly={true} />
                                        </div>
                                        <div className="form-group">
                                            <label className="createFormLeftMargin">Name</label>
                                            <input type="text"
                                                className="form-control inputCreateForm createFormLeftMargin"
                                                name="nameuser" value={servicing.name}
                                                onChange={handleOnChange}
                                            />

                                        </div>
                                        <input type="button" value="Cancel" className="btn btn-primary btn-sm cancelBtnEmpForm"
                                            onClick={canceleditform} />
                                        <input type="button" value="Save" className="btn btn-primary btn-sm"
                                            onClick={updateEmployee} />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="container">
                                        <div className="form-group">
                                            <label className="createFormLeftMargin">Contact Number</label>
                                            <input type="text"
                                                className="form-control inputCreateForm createFormLeftMargin"
                                                name="contactnumbername" value={servicing.contactnumber}
                                                onChange={handleOnChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="createFormLeftMargin">Employee Type</label>
                                            <select className="form-control inputCreateForm createFormLeftMargin"
                                                value={servicing.employeetype}
                                                name="employeetypename"
                                                onChange={handleOnChange}
                                            >
                                                {employeetype.map((ds, idx) => (
                                                    <option key={idx} value={ds.name}>
                                                        {ds.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div hidden={addEmployeeForm}>

                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="container">
                                        <div className="form-group">
                                            <label className="createFormLeftMargin">Login Name</label>
                                            <input type="text"
                                                className="form-control inputCreateForm createFormLeftMargin"
                                                value={servicing.loginname} name="addloginnamename"
                                                onChange={handleOnChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="createFormLeftMargin">Name</label>
                                            <input type="text"
                                                className="form-control inputCreateForm createFormLeftMargin"
                                                name="addnameuser" value={servicing.name}
                                                onChange={handleOnChange}
                                            />

                                        </div>
                                        <input type="button" value="Cancel" className="btn btn-primary btn-sm cancelBtnEmpForm"
                                            onClick={canceleditform} />
                                        <input type="button" value="Add" className="btn btn-primary btn-sm"
                                            onClick={addEmployee} />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="container">
                                        <div className="form-group">
                                            <label className="createFormLeftMargin">Contact Number</label>
                                            <input type="text"
                                                className="form-control inputCreateForm createFormLeftMargin"
                                                name="addcontactnumbername" value={servicing.contactnumber}
                                                onChange={handleOnChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="createFormLeftMargin">Employee Type</label>
                                            <select className="form-control inputCreateForm createFormLeftMargin"
                                                value={servicing.employeetype}
                                                name="addemployeetypename"
                                                onChange={handleOnChange}
                                            >
                                                {employeetype.map((ds, idx) => (
                                                    <option key={idx} value={ds.name}>
                                                        {ds.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <Redirect to="/login"></Redirect>
            </div>
        );
    }
}

export default EmployeesListComponent;