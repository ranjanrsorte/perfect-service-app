import { Redirect } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ModulesComponent from '../commoncomponents/modulescomponent';
import DataGridComponent from '../commoncomponents/datagridcomponent';
import ServicingService from '../service/servicingservice';
import EmployeeService from '../service/employeeservice';
import LoggedInUserDetailComponent from '../commoncomponents/loggedinuserdetailcomponent';


const AssignedWorkComponent = (props) => {
    const [servicingList, setServicingList] = useState([]);
    const [message, setMessage] = useState('');
    const [showAssignedWorkForm, setAssignedWorkForm] = useState(true);
    const [showPendingBookingsList, setPendingBookingList] = useState(false);
    const showServiceManagerName = sessionStorage.getItem('role') === 'Servicing Leads' ? false : true;
    const showReadOnlyServiceStatus = sessionStorage.getItem('role') === 'Servicing Worker' || sessionStorage.getItem('role') === 'Servicing Lead' || sessionStorage.getItem('role') === 'Servicing Manager' ? true : false;
    const [leademployee, setLeadEmployee] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [servicing, setServicing] = useState({
        vehiclenumber: '',
        vehicletype: '',
        numberofservice: 0,
        registrationdate: '',
        ispickup: '',
        servicelead: '',
        servicemanager: '',
        servicestatus: '',
        registrationtype: '',
        customername: '',
        parts: ''
    });
    const [servicestatuslist, setServiceStatusList] = useState([]);
    const [servicepartslist, setServicePart] = useState([]);
    const servicingserv = new ServicingService();
    const empservice = new EmployeeService();

    const getServiceRow = (row) => {
        setAssignedWorkForm(!showAssignedWorkForm);
        setPendingBookingList(!showPendingBookingsList);
        servicingserv.getEmployeesData(row).then((response) => {
            if (response.status === 200) {
                setServicing(response.data.records);
            }
        }).catch((error) => {
            setMessage(error);
        });
        servicingserv.getVehiclePartsByVehicleType(row).then((response) => {
            if (response.status === 200) {
                setServicePart(response.data.records);
            }
        }).catch((error) => {
            setMessage(error);
        });
        setServicing(row);
    }

    const loginpage = () => {
        props.history.push('/login');
    }

    useEffect(() => {
        servicingserv.getPendingServiceDataByManager().then((response) => {
            if (response.status === 200) {
                setServicingList(response.data.records);
            }
        }).catch((error) => {
            setMessage(error);
        });

        servicingserv.getServiceLeads().then((response) => {
            if (response.status === 200) {
                setLeadEmployee(response.data.records);
            }
        }).catch((error) => {
            setMessage(error);
        });

        empservice.getServiceWorkers().then((response) => {
            if (response.status === 200) {
                setWorkers(response.data.records);
            }
        }).catch((error) => {
            setMessage(error);
        });

        servicingserv.getAllServiceStatus().then((response) => {
            if (response.status === 200) {
                setServiceStatusList(response.data.records);
            }
        }).catch((error) => {
            setMessage(error);
        });

    }, []);

    const handleOnChange = (evt) => {
        if (evt.target.name === "serviceleadname") {
            setServicing({ ...servicing, servicelead: evt.target.value });
        }
        if (evt.target.name === "washingworkername") {
            setServicing({ ...servicing, washingworker: evt.target.value });
        }
        if (evt.target.name === "cleaningworkername") {
            setServicing({ ...servicing, cleaningworker: evt.target.value });
        }
        if (evt.target.name === "servicingworkername") {
            setServicing({ ...servicing, serviceworker: evt.target.value });
        }
        if (evt.target.name === "servicestatusname") {
            setServicing({ ...servicing, servicestatus: evt.target.value });
        }
        if (evt.target.name === "servicepartsname") {
            setServicing({ ...servicing, parts: evt.target.value });
        }
    }

    const assignLeadForService = () => {
        servicingserv.assignLeadToService(servicing).then((response) => {
            if (response.status === 200) {
                setAssignedWorkForm(!showAssignedWorkForm);
                setPendingBookingList(!showPendingBookingsList);
            }
        }).catch((error) => {
            setMessage(error);
        });
    }

    const cancelAssignLeadForm = () => {
        setAssignedWorkForm(!showAssignedWorkForm);
        setPendingBookingList(!showPendingBookingsList);
    }

    if (sessionStorage.getItem('token') != null) {
        return (
            <div>
                <div className='row'>
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
                                            <input type="button" value="LogOut" className="btn btn-primary btn-sm homelogoutbtn"
                                                onClick={loginpage} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="container">
                            <div hidden={showPendingBookingsList}>
                                <DataGridComponent
                                    dataSource={servicingList}
                                    getSelectedRow={getServiceRow}
                                ></DataGridComponent>
                            </div>
                            <div hidden={showAssignedWorkForm}>
                                <div className='container'>
                                    <div className='row'>
                                        <div className='col-sm-6'>
                                            <div className="form-group">
                                                <label>Vehicle Number</label>
                                                <input className="form-control" type="text" name="vehiclenumbername" id="vehiclenumberid"
                                                    value={servicing.vehiclenumber} readOnly={true} />
                                                <br />
                                            </div>
                                            <div className="form-group">
                                                <label>Registration Date</label>
                                                <input className="form-control" type="text" name="registerationdatename" id="registerationdateid"
                                                    value={servicing.registrationdate} readOnly={true} />
                                                <br />
                                            </div>
                                            <div className="form-group">
                                                <label>Service Number</label>
                                                <input className="form-control" type="text" name="servicenumbername" id="servicenumberid"
                                                    value={servicing.numberofservice} readOnly={true} />
                                                <br />
                                            </div>
                                            <div className="form-group">
                                                <label>Customer Name</label>
                                                <input className="form-control" type="text" name="customernamename" id="customernameid"
                                                    value={servicing.customername} readOnly={true} />
                                                <br />
                                            </div>
                                            <div className="form-group" hidden={!showServiceManagerName}>
                                                <label>Servicing Leads</label>
                                                <select className="form-control"
                                                    value={servicing.servicelead}
                                                    name="serviceleadname"
                                                    onChange={handleOnChange}
                                                >
                                                    {leademployee.map((ds, idx) => (
                                                        <option key={idx} value={ds.name}>
                                                            {ds.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <br />
                                            </div>
                                            <div className="form-group">
                                                <label>Parts</label>
                                                <select className="form-control"
                                                    value={servicing.parts}
                                                    name="servicepartsname"
                                                    onChange={handleOnChange}
                                                >
                                                    {servicepartslist.map((ds, idx) => (
                                                        <option key={idx} value={ds.part}>
                                                            {ds.part}
                                                        </option>
                                                    ))}
                                                </select>
                                                <br />
                                            </div>
                                            <div className="form-group" hidden={showServiceManagerName}>
                                                <label>Servicing Manager</label>
                                                <input className="form-control" type="text" name="ispickupname" id="ispickupid"
                                                    value={servicing.servicemanager} readOnly={true} />
                                                <br />
                                            </div>
                                            <div>
                                                <input className="btn btn-sm btn-success btnCancelBookForm" type="button" value="Assign"
                                                    onClick={assignLeadForService} />
                                                <input className="btn btn-sm btn-success btnCancelBookForm" type="button" value="Cancel"
                                                    onClick={cancelAssignLeadForm} />
                                            </div>
                                        </div>
                                        <div className='col-sm-6'>
                                            <div className="form-group">
                                                <label>Registration Type</label>
                                                <input className="form-control" type="text" name="registrationtypename" id="registrationtypeid"
                                                    value={servicing.registrationtype} readOnly={true} />
                                                <br />
                                            </div>
                                            <div className="form-group">
                                                <label>Vehicle Type</label>
                                                <input className="form-control" type="text" name="vehicletypename" id="vehicletypeid"
                                                    value={servicing.vehicletype} readOnly={true} />
                                                <br />
                                            </div>
                                            <div className="form-group" hidden={showReadOnlyServiceStatus}>
                                                <label>Service Status</label>
                                                <input className="form-control" type="text" name="servicestatusroname" id="servicestatusroid"
                                                    value={servicing.servicestatus} readOnly={true} />
                                                <br />
                                            </div>
                                            <div className="form-group" hidden={!showReadOnlyServiceStatus}>
                                                <label>Service Status</label>
                                                <select className="form-control"
                                                    value={servicing.servicestatus}
                                                    name="servicestatusname"
                                                    onChange={handleOnChange}
                                                >
                                                    {servicestatuslist.map((ds, idx) => (
                                                        <option key={idx} value={ds.name}>
                                                            {ds.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <br />
                                            </div>
                                            <div className="form-group">
                                                <label>Is Pick Up</label>
                                                <input className="form-control" type="text" name="ispickupname" id="ispickupid"
                                                    value={servicing.ispickup} readOnly={true} />
                                                <br />
                                            </div>
                                            <div className="form-group" hidden={showServiceManagerName}>
                                                <label>Washing Workers</label>
                                                <select className="form-control"
                                                    value={servicing.washingworker}
                                                    name="washingworkername"
                                                    onChange={handleOnChange}
                                                >
                                                    {workers.map((ds, idx) => (
                                                        <option key={idx} value={ds.name}>
                                                            {ds.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <br />
                                            </div>
                                            <div className="form-group" hidden={showServiceManagerName}>
                                                <label>Cleaning Workers</label>
                                                <select className="form-control"
                                                    value={servicing.cleaningworker}
                                                    name="cleaningworkername"
                                                    onChange={handleOnChange}
                                                >
                                                    {workers.map((ds, idx) => (
                                                        <option key={idx} value={ds.name}>
                                                            {ds.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <br />
                                            </div>
                                            <div className="form-group" hidden={showServiceManagerName}>
                                                <label>Servicing Worker</label>
                                                <select className="form-control"
                                                    value={servicing.servicingworker}
                                                    name="servicingworkername"
                                                    onChange={handleOnChange}
                                                >
                                                    {workers.map((ds, idx) => (
                                                        <option key={idx} value={ds.name}>
                                                            {ds.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <br />
                                            </div>
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

export default AssignedWorkComponent;