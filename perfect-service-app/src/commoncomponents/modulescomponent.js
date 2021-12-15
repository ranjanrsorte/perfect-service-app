import { Redirect } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ModulesComponent = () => {
    // const showUserProfile = sessionStorage.getItem('role') === 'Customer' ? false : true;
    const showAllBookings = sessionStorage.getItem('role') === 'Customer' || sessionStorage.getItem('role') === 'Administrator' || sessionStorage.getItem('role') === 'Servicing Representative' ? false : true;
    // const showCustomerList = sessionStorage.getItem('role') === 'Administrator' || sessionStorage.getItem('role') === 'Servicing Manager' ? false : true;
    // const showEmployeesList = sessionStorage.getItem('role') === 'Administrator' || sessionStorage.getItem('role') === 'Servicing Manager' || sessionStorage.getItem('role') === 'Servicing Leads' ? false : true;
    // const showAssignedServicing = sessionStorage.getItem('role') === 'Administrator' || sessionStorage.getItem('role') === 'Servicing Worker' || sessionStorage.getItem('role') === 'Servicing Leads' ? false : true;
    // const showPartsAndPrice = sessionStorage.getItem('role') === 'Administrator' ? false : true;
    const showBill = sessionStorage.getItem('role') === 'Accountant' ? false : true;
    const showAssignedWork = sessionStorage.getItem('role') === 'Administrator' || sessionStorage.getItem('role') === 'Servicing Manager' || sessionStorage.getItem('role') === 'Servicing Leads' || sessionStorage.getItem('role') === 'Servicing Worker' ? false : true;
    const showWaitingForDelivery = sessionStorage.getItem('role') === 'Administrator' || sessionStorage.getItem('role') === 'Servicing Manager' || sessionStorage.getItem('role') === 'Servicing Representative' ? false : true;
    const showDailyCollection = sessionStorage.getItem('role') === 'Administrator' ? false : true;

    return (

        <div className='modulesDiv'>
            <ul className="nav flex-column">
                {/* <li className="nav-item" hidden={showUserProfile}>
                    <a className="nav-link" href="/userprofile">User Profile</a>
                </li> */}
                <li className="nav-item" hidden={showAllBookings}>
                    <a className="nav-link" href="/bookings">All Bookings</a>
                </li>
                <li className="nav-item" hidden={showAssignedWork}>
                    <a className="nav-link" href="/assignedwork">Assigned Work</a>
                </li>
                {/* <li className="nav-item" hidden={showCustomerList}>
                    <a className="nav-link" href="/customers">Customers List</a>
                </li>
                <li className="nav-item" hidden={showEmployeesList}>
                    <a className="nav-link" href="/employees">Employees List</a>
                </li> */}
                {/* <li className="nav-item" hidden={showAssignedServicing}>
                    <a className="nav-link" href="/servicing">Assigned Servicing</a>
                </li> */}
                {/* <li className="nav-item" hidden={showPartsAndPrice}>
                    <a className="nav-link" href="/parts">Parts and Price</a>
                </li> */}
                <li className="nav-item" hidden={showBill}>
                    <a className="nav-link" href="/bill">Bill</a>
                </li>
                <li className="nav-item" hidden={showWaitingForDelivery}>
                    <a className="nav-link" href="/waiting">Waiting for Delivery</a>
                </li>
                <li className="nav-item" hidden={showDailyCollection}>
                    <a className="nav-link" href="/dailycollection">Daily Bill Collection</a>
                </li>
            </ul>
        </div>
    );
}

export default ModulesComponent;