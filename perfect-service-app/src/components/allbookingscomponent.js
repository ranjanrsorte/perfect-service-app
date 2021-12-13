import { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import ModulesComponent from "../commoncomponents/modulescomponent";
import VehicleService from "../service/vehicleservice";
import ServicingService from '../service/servicingservice';
import DataGridComponent from "../commoncomponents/datagridcomponent";

const AllBookingsComponent = (props) => {
    const showBookServiceBtn = sessionStorage.getItem('role') === 'Customer' || sessionStorage.getItem('role') === 'Servicing Representative' ? false : true;
    const [showServiceBookingForm, setServiceBookingForm] = useState(true);
    const [showServiceBookingList, setServiceBookingList] = useState(false);
    const [showReadOnlyServiceBookingForm, setReadOnlyServiceBookingForm] = useState(true);
    const [showBillDetails, setBillDetails] = useState(true);
    const showCustomerNameField = sessionStorage.getItem('role') === 'Servicing Representative' ? false : true;
    const showCustomerEmailField = sessionStorage.getItem('role') === 'Servicing Representative' ? false : true;
    const [servicing, setServicing] = useState({
        vehiclenumber: '',
        vehicletype: '',
        numberofservice: 0,
        actualservicestartdate: '',
        expectedserviceenddate: '',
        actualserviceenddate: '',
        ispickup: ''
    });
    const [message, setMessage] = useState('');
    const [vehicletype, setVehicleType] = useState([]);
    const [bookingtype, setBookingType] = useState([]);
    const [servicedata, setServiceData] = useState({});
    const [servicingList, setServicingList] = useState([]);
    const vehserv = new VehicleService();
    const servingserv = new ServicingService();

    const loginpage = () => {
        props.history.push('/login');
    }
    const toggleServiceBookingForm = () => {
        setServiceBookingForm(!showServiceBookingForm);
        setServiceBookingList(!showServiceBookingList);
        setReadOnlyServiceBookingForm(true);
    }

    useEffect(() => {
        vehserv.getVehicleType().then((response) => {
            setVehicleType(response.data.type);
        }).catch((error) => {
            setMessage(error);
        });

        servingserv.getServicingDataByCustomer().then((response) => {
            if (response.status === 200) {
                let records = response.data.records;
                for (let i = 0; i < records.length; i++) {
                    records[i].ispickup = records[i].ispickup === 0 ? 'No' : 'Yes';
                }
                setServicingList(records);
            }
        }).catch((error) => {
            setMessage(error);
        });

        servingserv.getBookingType().then((response) => {
            if(response.status === 200) {
                setBookingType(response.data.type);
            }
        }).catch((error) => {
            setMessage(error);
        });
    }, []);

    const bookService = () => {
        servicedata.email = sessionStorage.getItem('email');
        servingserv.addBookedService(servicedata).then((response) => {
            if (response.status === 200) {
                setServiceData({ ...servicedata, vehiclenumber: "" });
                setServiceBookingForm(!showServiceBookingForm);
                setServiceBookingList(!showServiceBookingList);
                servingserv.getServicingDataByCustomer().then((response) => {
                    if (response.status === 200) {
                        let records = response.data.records;
                        for (let i = 0; i < records.length; i++) {
                            records[i].ispickup = records[i].ispickup === 0 ? 'No' : 'Yes';
                        }
                        setServicingList(records);
                    }
                    console.log(`${JSON.stringify(response)}`);
                }).catch((error) => {
                    setMessage(error);
                });
            }
            console.log(`${JSON.stringify(response)}`);
        }).catch((error) => {
            setMessage(error);
        });
    }

    const handleOnChange = (evt) => {
        if (evt.target.name === "vehiclenumbername") {
            setServiceData({ ...servicedata, vehiclenumber: evt.target.value });
        }

        if (evt.target.name === "vehicletypename") {
            setServiceData({ ...servicedata, vehicletype: evt.target.value });
        }

        if (evt.target.name === "ispickupname") {
            setServiceData({ ...servicedata, ispickup: evt.target.value });
        }
        if (evt.target.name === "customeremailname") {
            setServiceData({ ...servicedata, customeremail: evt.target.value });
        }
        if (evt.target.name === "bookingtypename") {
            setServiceData({ ...servicedata, bookingtype: evt.target.value });
        }
    }

    const getServiceRow = (row) => {
        setServicing(row);
        setServiceBookingList(!showServiceBookingList);
        setReadOnlyServiceBookingForm(!showReadOnlyServiceBookingForm);
    }

    const toggleReadOnlyServiceForm = () => {
        setServiceBookingList(false);
        setReadOnlyServiceBookingForm(true);
    }

    const toggleBillTable = () => {
        setReadOnlyServiceBookingForm(!showReadOnlyServiceBookingForm);
        setBillDetails(false);
    }

    const deleteServicing = (data) => {
        if(data.vehiclenumber !== "") {
            servingserv.deleterecord(servicing).then((response) => {
                if(response.status === 200) {
                    servingserv.getServicingDataByCustomer().then((response) => {
                        if (response.status === 200) {
                            let records = response.data.records;
                            for (let i = 0; i < records.length; i++) {
                                records[i].ispickup = records[i].ispickup === 0 ? 'No' : 'Yes';
                            }
                            setServicingList(records);
                        }
                        setServiceBookingList(!showServiceBookingList);
                        setReadOnlyServiceBookingForm(!showReadOnlyServiceBookingForm);
                    }).catch((error) => {
                        setMessage(error);
                    });
                }
            }).catch((error) => {
                setMessage(error);
            });
        }
    }

    if (sessionStorage.getItem('token') != null) {
        return (
            <div>
                <div className="row">
                    <div className="col-sm-2 moduleRoutes">
                        <ModulesComponent></ModulesComponent>
                    </div>
                    <div className="col-sm-10">
                        <div>
                            <input type="button" value="Book Service" className="btn btn-primary btn-sm addServicingBtn"
                                onClick={toggleServiceBookingForm} hidden={showBookServiceBtn} />
                            <input type="button" value="LogOut" className="btn btn-primary btn-sm homelogoutbtn"
                                onClick={loginpage} />
                        </div>

                        <div className="container" hidden={showServiceBookingList}>
                            <DataGridComponent
                                dataSource={servicingList}
                                getSelectedRow={getServiceRow}></DataGridComponent>

                        </div> 
                        <div className="container" hidden={showBillDetails}>
                            <DataGridComponent
                                dataSource={[servicing]}
                                getSelectedRow={getServiceRow}></DataGridComponent>

                        </div>
                        <div className="container" hidden={showServiceBookingForm}>
                            <div className="form-group">
                                <label>Vehicle Number</label>
                                <input className="form-control" type="text" name="vehiclenumbername" id="vehiclenumberid"
                                    value={servicedata.vehiclenumber} onChange={handleOnChange} />
                                <br />
                            </div>
                            <div>
                                <label>Vehicle Type</label>
                                <select className="form-control" name="vehicletypename" id="vehicletypeid"
                                    onChange={handleOnChange}
                                >
                                    {vehicletype.map((ds, idx) => (
                                        <option key={idx} value={ds.name}>
                                            {ds.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Pickup</label>
                                <select className="form-control" name="ispickupname" id="ispickupid"
                                    onChange={handleOnChange}>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                                <br />
                            </div>
                            <div className="form-group" hidden={showCustomerEmailField}>
                                <label>Customer Email</label>
                                <input className="form-control" type="email" name="customeremailname" id="customeremailid"
                                    value={servicedata.customeremail} onChange={handleOnChange} />
                                <br />
                            </div>
                            <div hidden={showCustomerEmailField}>
                                <label>Booking Type</label>
                                <select className="form-control" name="bookingtypename" id="bookingtypeid"
                                    onChange={handleOnChange}
                                >
                                    {bookingtype.map((ds, idx) => (
                                        <option key={idx} value={ds.name}>
                                            {ds.name}
                                        </option>
                                    ))}
                                </select>
                                <br />
                            </div>
                            <div>
                                <input className="btn btn-primary" type="button" value="Book" onClick={bookService} />
                                <input className="btn btn-primary btnCancelBookForm" type="button" value="Cancel" onClick={toggleServiceBookingForm} />
                            </div>
                        </div>
                        <div className="container" hidden={showReadOnlyServiceBookingForm}>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Vehicle Number</label>
                                        <input className="form-control" type="text" name="vehiclenumbernamereadonly" id="vehiclenumberidreadonly"
                                            value={servicing.vehiclenumber} readOnly={true} />
                                        <br />
                                    </div>
                                    <div>
                                        <label>Vehicle Type</label>
                                        <input className="form-control" type="text" name="vehicletypenamereadonly" id="vehicletypeidreadonly"
                                            value={servicing.vehicletype} readOnly={true} />
                                        <br />
                                    </div>
                                    <div>
                                        <label>Pickup</label>
                                        <input className="form-control" type="text" name="ispickupnamereadonly" id="ispickupidreadonly"
                                            value={servicing.ispickup} readOnly={true} />
                                        <br />
                                    </div>
                                    <div>
                                        <label>Number Of Service</label>
                                        <input className="form-control" type="text" name="numofservicenamereadonly" id="numofservicenameidreadonly"
                                            value={servicing.numberofservice} readOnly={true} />
                                        <br />
                                    </div>
                                    <div>
                                        <label>Service Status</label>
                                        <input className="form-control" type="text" name="servicestatusnamereadonly" id="servicestatusidreadonly"
                                            value={servicing.servicestatusid} readOnly={true} />
                                        <br />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div>
                                        <label>Actual Service Start Date</label>
                                        <input className="form-control" type="text" name="actualservicestartnamereadonly" id="actualservicestartidreadonly"
                                            value={servicing.actualservicestartdate} readOnly={true} />
                                        <br />
                                    </div>
                                    <div>
                                        <label>Expected Service End Date</label>
                                        <input className="form-control" type="text" name="expectedserviceendnamereadonly" id="expectedserviceendidreadonly"
                                            value={servicing.expectedserviceenddate} readOnly={true} />
                                        <br />
                                    </div>
                                    <div>
                                        <label>Actual Service End Date</label>
                                        <input className="form-control" type="text" name="actualserviceendnamereadonly" id="actualserviceendidreadonly"
                                            value={servicing.actualserviceenddate} readOnly={true} />
                                        <br />
                                    </div>
                                    
                                    <div hidden={showCustomerNameField}>
                                        <label>Customer Name</label>
                                        <input className="form-control" type="text" name="customernamenamereadonly" id="customernameidreadonly"
                                            value={servicing.customerid} readOnly={true} />
                                        <br />
                                    </div>
                                    <div hidden={showCustomerNameField}>
                                        <label>Booking Type</label>
                                        <input className="form-control" type="text" name="bookingtypenamereadonly" id="bookingtypeidreadonly"
                                            value={servicing.registrationtype} readOnly={true} />
                                        <br />
                                    </div>
                                </div>
                                <div>
                                    <input className="btn btn-primary btnCancelBookForm" type="button" value="Cancel" onClick={toggleReadOnlyServiceForm} />
                                    <input className="btn btn-primary btnCancelBookForm" type="button" value="Delete" onClick={deleteServicing} />
                                    <input className="btn btn-primary btnCancelBookForm" type="button" value="Generate Bill" onClick={toggleBillTable} />
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

export default AllBookingsComponent;