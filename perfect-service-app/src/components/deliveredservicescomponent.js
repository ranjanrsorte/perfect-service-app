import { Redirect } from "react-router-dom";
import ModulesComponent from "../commoncomponents/modulescomponent";
import LoggedInUserDetailComponent from "../commoncomponents/loggedinuserdetailcomponent";
import DataGridComponent from "../commoncomponents/datagridcomponent";
import { useEffect, useState } from "react";
import ServicingService from "../service/servicingservice";

const DeliveredServicesComponent = (props) => {
    const [servicingList, setServicingList] = useState([]);
    const [message, setMessage] = useState("");
    const servicingserv = new ServicingService();

    const loginpage = () => {
        props.history.push('/login');
    }

    useEffect(()=>{
        servicingserv.getDeliveredServicingList().then((response) => {
            if(response.status === 200) {
                setServicingList(response.data.records);
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
                                            <input type="button" value="LogOut" className="btn btn-primary btn-sm homelogoutbtn"
                                                onClick={loginpage} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="container"
                            // hidden={showServiceBookingList}
                        >
                            <DataGridComponent
                                dataSource={servicingList}
                                // getSelectedRow={getServiceRow}
                            ></DataGridComponent>

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

export default DeliveredServicesComponent;