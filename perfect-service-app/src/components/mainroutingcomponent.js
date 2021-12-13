import { Route, Switch } from "react-router-dom";
import HomeComponent from "./homecomponent";
import UserLoginComponent from "./userlogincomponent";
import RegisterNewUserComponent from "./registernewusercomponent";
import UserProfileComponent from './userprofilecomponent';
import AllBookingsComponent from './allbookingscomponent';
import CustomerListComponent from './customerlistcomponent';
import EmployeesListComponent from './employeeslistcomponent';
import AssignedServicingComponent from './assignedservicingcomponent';
import PartsAndPriceComponent from './partsandpricecomponent';
import BillComponent from './billcomponent';
import AssignedWorkComponent from "./assignedworkcomponent";


const MainRoutingComponent = () => {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <a className="nav-link appName" href="#">Perfect Service</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">About Us</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <div>
                <Switch>
                    <Route exact path="/" component={HomeComponent}></Route>
                    <Route exact path="/login" component={UserLoginComponent}></Route>
                    <Route exact path="/create" component={RegisterNewUserComponent}></Route>
                    <Route exact path="/userprofile" component={UserProfileComponent}></Route>
                    <Route exact path="/bookings" component={AllBookingsComponent}></Route>
                    <Route exact path="/customers" component={CustomerListComponent}></Route>
                    <Route exact path="/employees" component={EmployeesListComponent}></Route>
                    <Route exact path="/servicing" component={AssignedServicingComponent}></Route>
                    <Route exact path="/parts" component={PartsAndPriceComponent}></Route>
                    <Route exact path="/bill" component={BillComponent}></Route>
                    <Route exact path="/assignedwork" component={AssignedWorkComponent}></Route>
                </Switch>
            </div>
        </div>
    );
}

export default MainRoutingComponent;