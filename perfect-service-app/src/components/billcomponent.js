import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import ModulesComponent from "../commoncomponents/modulescomponent";
import DataGridComponent from "../commoncomponents/datagridcomponent";
import BillService from "../service/billservice";

const BillComponent = (props) => {
    const [message, setMessage] = useState('');
    const [servicingList, setServicingList] = useState([]);
    const [showPendingBillsData, setPendingBillsData] = useState(true);
    const [pendingbilldata, setPendingBilldata] = useState({
        "customername": "",
        "vehicletype": "",
        "totalbill": "",
        "servicingid": "",
        "billdate": "",
        "ispickup": "",
        "washingprice": 0,
        "cleaningprice": 0,
        "serviceprice": 0,
        "pickupprice": 0,
        "partprice": 0
    });
    const billserv = new BillService();

    const loginpage = () => {
        props.history.push('/login');
    }

    const getServiceRow = (row) => {
        billserv.getPriceData(row.servicingid).then((response) => {
            if(response.status === 200) {
                row.washingprice = response.data.records.washingprice;
                row.cleaningprice = response.data.records.cleaningprice;
                row.serviceprice = response.data.records.serviceprice;
                row.pickupprice = response.data.records.pickupprice;
                setPendingBilldata(row);
            }
        }).catch((error) => {
            setMessage(error);
        });
        setPendingBillsData(!showPendingBillsData);
    }

    const cancelPendingBillForm = () => {
        setPendingBillsData(!showPendingBillsData);
    }

    const handleOnChange = (evt) => {
        if (evt.target.name === "washingpricename") {
            setPendingBilldata({ ...pendingbilldata, washingprice: evt.target.value });
        }
        if (evt.target.name === "cleaningpricename") {
            setPendingBilldata({ ...pendingbilldata, cleaningprice: evt.target.value });
        }
        if (evt.target.name === "servicingpricename") {
            setPendingBilldata({ ...pendingbilldata, serviceprice: evt.target.value });
        }
        if (evt.target.name === "pickuppricename") {
            setPendingBilldata({ ...pendingbilldata, pickupprice: evt.target.value });
        }
    }

    const saveBillData = () => {
        debugger;
        billserv.saveBillData(pendingbilldata).then((response) => {
            if (response.status === 200) {
                setPendingBillsData(!showPendingBillsData);
            }
        }).catch((error) => {
            setMessage(error);
        });
    }

    useEffect(() => {
        billserv.getPendingCustomerBills().then((response) => {
            if (response.status === 200) {
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
                        <div className="container">
                            <input type="button" value="LogOut" className="btn btn-primary btn-sm homelogoutbtn"
                                onClick={loginpage} />
                        </div>
                        <div className="container" hidden={!showPendingBillsData}>
                            <DataGridComponent
                                dataSource={servicingList}
                                getSelectedRow={getServiceRow}
                            ></DataGridComponent>
                        </div>
                        <div className="container" hidden={showPendingBillsData}>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Customer Name</label>
                                        <input className="form-control" type="text" name="customernamename" id="customernameid"
                                            value={pendingbilldata.customername} readOnly={true} />
                                        <br />
                                    </div>
                                    <div className="form-group">
                                        <label>Vehicle Type</label>
                                        <input className="form-control" type="text" name="vehicletypename" id="vehicletypeid"
                                            value={pendingbilldata.vehicletype} readOnly={true} />
                                        <br />
                                    </div>
                                    <div className="form-group">
                                        <label>Total Bill</label>
                                        <input className="form-control" type="text" name="totalbillname" id="totalbillid"
                                            value={pendingbilldata.totalbill} readOnly={true} />
                                        <br />
                                    </div>
                                    <div className="form-group">
                                        <label>Servicing Id</label>
                                        <input className="form-control" type="text" name="servicingidname" id="servicingidid"
                                            value={pendingbilldata.servicingid} readOnly={true} />
                                        <br />
                                    </div>
                                    <div className="form-group">
                                        <label>Is PickUp</label>
                                        <input className="form-control" type="text" name="servicingidname" id="servicingidid"
                                            value={pendingbilldata.ispickup} readOnly={true} />
                                        <br />
                                    </div>
                                    <div className="form-group">
                                        <label>Bill Date</label>
                                        <input className="form-control" type="text" name="billdatename" id="billdateid"
                                            value={pendingbilldata.billdate} readOnly={true} />
                                        <br />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Part Price</label>
                                        <input className="form-control" type="number" name="washingpricename" id="washingpriceid"
                                            value={pendingbilldata.partprice} readOnly={true} />
                                        <br />
                                    </div>
                                    <div className="form-group">
                                        <label>Washing Price</label>
                                        <input className="form-control" type="number" name="washingpricename" id="washingpriceid"
                                            value={pendingbilldata.washingprice}
                                            onChange={handleOnChange} />
                                        <br />
                                    </div>
                                    <div className="form-group">
                                        <label>Cleaning Price</label>
                                        <input className="form-control" type="number" name="cleaningpricename" id="cleaningpriceid"
                                            value={pendingbilldata.cleaningprice}
                                            onChange={handleOnChange} />
                                        <br />
                                    </div>
                                    <div className="form-group">
                                        <label>Servicing Price</label>
                                        <input className="form-control" type="number" name="servicingpricename" id="servicingpriceid"
                                            value={pendingbilldata.serviceprice}
                                            onChange={handleOnChange} />
                                        <br />
                                    </div>
                                    <div className="form-group">
                                        <label>PickUp Price</label>
                                        <input className="form-control" type="number" name="pickuppricename" id="pickuppriceid"
                                            value={pendingbilldata.pickupprice} readOnly={pendingbilldata.ispickup === 'No'} />
                                        <br />
                                    </div>
                                </div>
                            </div>
                            <input className="btn btn-sm btn-success btnCancelBookForm" type="button" value="Save"
                                onClick={saveBillData} />
                            <input className="btn btn-sm btn-success btnCancelBookForm" type="button" value="Cancel"
                                onClick={cancelPendingBillForm} />
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

export default BillComponent;