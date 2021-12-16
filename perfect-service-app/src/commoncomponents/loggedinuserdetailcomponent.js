import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import CustomerService from '../service/customerservice';

const LoggedInUserDetailComponent = (props) => {

    const [loggedinuserdetail, setLoggedInUserDetail] = useState({});
    const [message, setMessage] = useState("");
    const customerserv = new CustomerService();

    useEffect(()=>{
        customerserv.getLoggedInCustomerDetails().then((response) => {
            if (response.status === 200) {
                setLoggedInUserDetail(response.data.records);
            }
        }).catch((error) => {
            setMessage(error);
        });
    }, []);
    
    if (sessionStorage.getItem('token') != null) {
        return (
            <div>
                <h4>{loggedinuserdetail.name}</h4>
                <h6>{loggedinuserdetail.rolename}</h6>
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


export default LoggedInUserDetailComponent;