import { Redirect } from 'react-router-dom';
import { useState } from 'react';
import ModulesComponent from '../commoncomponents/modulescomponent';
import DataGridComponent from '../commoncomponents/datagridcomponent';
import BillService from '../service/billservice';

const DailyBillCollectionComponent = (props) => {
    const [message, setMessage] = useState("");
    const billserv = new BillService();
    const [servicingList, setServicingList] = useState([]);
    const [billcollection, setBillCollection] = useState("");
    const [selecteddate, setSelectedDate] = useState("");
    const [showDateHeading, setDateHeading] = useState(true);
    const getServiceRow = (row) => {}

    const handleChange = (evt) => {
        console.log(`${evt.target.value}`);
        setSelectedDate(evt.target.value);
        setDateHeading(!showDateHeading);
        billserv.getBillDataByDate(evt.target.value).then((response) => {
            if (response.status === 200) {
                let records = response.data.records;
                setServicingList(records);
                let dailybillcollection = 0;
                for(let x=0; x < records.length; x++) {
                    dailybillcollection = parseInt(dailybillcollection) + parseInt(records[x].totalbill);
                }
                console.log(dailybillcollection);
                setBillCollection(dailybillcollection);
            }
        }).catch((error) => {
            setMessage(error);
        });
    }
    if (sessionStorage.getItem('token') != null) {

        return (
            <div>
                <div className="row">
                    <div className="col-sm-2 moduleRoutes">
                        <ModulesComponent></ModulesComponent>
                    </div>
                    <div className="col-sm-10">
                        <div className='row'>
                            <div className='col-sm-2'>
                                <br />
                                <label>Select Date</label>
                                <input className="form-control" type="date" name="datepicker" id="datepickerid"
                                    onChange={handleChange} />
                            </div>
                        </div>
                        <br />
                        <div className='row'>
                            <div className='col-sm-8' hidden= {showDateHeading}>
                                <h3>Bill Collection For Date '{selecteddate}' is {billcollection}</h3>
                            </div>
                        </div>
                        <br />
                        <div>
                            <DataGridComponent
                                dataSource={servicingList}
                                getSelectedRow={getServiceRow}
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

export default DailyBillCollectionComponent;