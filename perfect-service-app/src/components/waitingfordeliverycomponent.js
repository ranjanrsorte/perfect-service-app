import { Redirect } from "react-router-dom";
import { useEffect, useState } from "react";
import ModulesComponent from "../commoncomponents/modulescomponent";
import DataGridComponent from "../commoncomponents/datagridcomponent";
import ServicingService from "../service/servicingservice";
import LoggedInUserDetailComponent from "../commoncomponents/loggedinuserdetailcomponent";

const WaitingForDeliveryComponent = (props) => {

    const [servicingList, setServicingList] = useState([]);
    const [message, setMessage] = useState("");
    const [serviceData, setServiceData] = useState({
        'vehiclenumber': "",
        'vehicletype': "",
        'customername': "",
        'registrationtype': "",
        'servicestatus': ""
    });
    const [showWaitingDataTable, setWaitingDataTable] = useState(false);
    const [showWaitingDataForm, setWaitingDataForm] = useState(true);
    const servicingserv = new ServicingService();

    const loginpage = () => {
        props.history.push('/login');
    }

    const getServiceRow = (row) => {
        setWaitingDataTable(!showWaitingDataTable);
        setWaitingDataForm(!showWaitingDataForm);
        setServiceData(row);
    }

    const cancelWaitingDataForm = () => {
        setWaitingDataTable(!showWaitingDataTable);
        setWaitingDataForm(!showWaitingDataForm);
    }

    const updateStatus = () => {
        servicingserv.updateDeliveredStatus(serviceData).then((response) => {
            if (response.status === 200) {
                console.log(`${JSON.stringify(response)}`);
            }
            setWaitingDataTable(!showWaitingDataTable);
            setWaitingDataForm(!showWaitingDataForm);
        }).catch((error) => {
            setMessage(error);
        });
    }

    useEffect(() => {
        servicingserv.getWaitingForDeliveryData().then((response) => {
            if (response.status == 200) {
                setServicingList(response.data.records);
            }
        }).catch((error) => {
            setMessage(error)
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
                                            <input type="button" value="LogOut" className="btn btn-primary btn-sm homelogoutbtn"
                                                onClick={loginpage} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <br />
                        <div className="container" hidden={showWaitingDataTable}>
                            <DataGridComponent
                                dataSource={servicingList}
                                getSelectedRow={getServiceRow}
                            ></DataGridComponent>
                        </div>
                        <div className="container" hidden={showWaitingDataForm}>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Vehicle Number</label>
                                        <input className="form-control" type="text" name="vehiclenumbername" id="vehiclenumberid"
                                            value={serviceData.vehiclenumber}
                                            readOnly={true} />
                                        <br />
                                    </div>
                                    <div className="form-group">
                                        <label>Vehicle Type</label>
                                        <input className="form-control" type="text" name="vehicletypename" id="vehicletypeid"
                                            value={serviceData.vehicletype}
                                            readOnly={true} />
                                        <br />
                                    </div>
                                    <div className="form-group">
                                        <label>Customer Name</label>
                                        <input className="form-control" type="text" name="customernamename" id="customernameid"
                                            value={serviceData.customername}
                                            readOnly={true} />
                                        <br />
                                    </div>
                                    <input type="button"
                                        className="btn btn-primary btn-sm"
                                        value="Delivered" onClick={updateStatus} />
                                    <input type="button"
                                        className="btn btn-primary btn-sm btnCancelBookForm"
                                        value="Cancel" onClick={cancelWaitingDataForm} />
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Registration Type</label>
                                        <input className="form-control" type="text" name="registerationtypename" id="registerationtypeid"
                                            value={serviceData.registrationtype}
                                            readOnly={true} />
                                        <br />
                                    </div>
                                    <div className="form-group">
                                        <label>Service Status</label>
                                        <input className="form-control" type="text" name="servicestatusname" id="servicestatusid"
                                            value={serviceData.servicestatus}
                                            readOnly={true} />
                                        <br />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        <div>
            <Redirect to="/login"></Redirect>
        </div>
    }
}

export default WaitingForDeliveryComponent;