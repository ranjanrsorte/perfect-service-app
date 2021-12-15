import { Redirect } from "react-router-dom";
import { useState, useEffect } from "react";
import ModulesComponent from "../commoncomponents/modulescomponent";
import DataGridComponent from "../commoncomponents/datagridcomponent";
import ServicingService from "../service/servicingservice";

const GeneratedBillComponent = (props) => {
    const sericingserv = new ServicingService();
    const [servicingList, setServicingList] = useState([]);
    const [message, setMessage] = useState("");

    const backToServiceList = () => {
        props.history.push('/bookings');
    }

    const getServiceRow = (row) => { }

    useEffect(() => {
        sericingserv.getBillData().then((response) => {
            if(response.status === 200) {
                let records = {
                    "content" : [],
                    "price": [],
                    /*"customername": response.data.records.customerid,
                    "vehicletype": response.data.records.vehicletypeid,
                    "totalbill": response.data.records.totalbill,
                    "billdate": response.data.records.billdate,
                    "partprice": response.data.records.partprice,
                    "serviceprice": response.data.records.serviceprice,
                    "washingprice": response.data.records.washingprice,
                    "cleaningprice": response.data.records.cleaningprice,
                    "pickupprice" :response.data.records.pickupprice*/
                };
                
                setServicingList(records);
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
                        <br />
                        <input type="button" className="btn btn-warning btn-sm"
                            value="Back to Service List" onClick={backToServiceList} />
                    </div>
                    <div className="container">
                        <div className="col-sm-10">
                            <DataGridComponent
                                dataSource={servicingList}
                                getSelectedRow={getServiceRow}
                            ></DataGridComponent>
                        </div>
                        <br />
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

export default GeneratedBillComponent;