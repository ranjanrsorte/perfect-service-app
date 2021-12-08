import { Link, Route, Switch, Redirect } from "react-router-dom";
import HomeComponent from "./homecomponent";

const MainRoutingComponent = () => {
    const showRoutes = true;
    const showUserProfile = true;
    const showAllBookings = true;
    const showCustomerList = true;
    const showEmployeesList = true;
    const showAssignedServicing = true;
    const showPartsAndPrice = true;
    const showBill = true;
    const showHome = true;
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <a className="nav-link appName" href="#">Perfect Service</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">About Us</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Login</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <div className="row">
                <div className="col-sm-2 moduleRoutes">
                    <ul className="nav flex-column">
                        <li className="nav-item" hidden={showUserProfile}>
                            <a className="nav-link" href="#">User Profile</a>
                        </li>
                        <li className="nav-item" hidden={showAllBookings}>
                            <a className="nav-link" href="#">All Bookings</a>
                        </li>
                        <li className="nav-item" hidden={showCustomerList}>
                            <a className="nav-link" href="#">Customers List</a>
                        </li>
                        <li className="nav-item" hidden={showEmployeesList}>
                            <a className="nav-link" href="#">Employees List</a>
                        </li>
                        <li className="nav-item" hidden={showAssignedServicing}>
                            <a className="nav-link" href="#">Assigned Servicing</a>
                        </li>
                        <li className="nav-item" hidden={showPartsAndPrice}>
                            <a className="nav-link" href="#">Parts and Price</a>
                        </li>
                        <li className="nav-item" hidden={showBill}>
                            <a className="nav-link" href="#">Bill</a>
                        </li>
                    </ul>
                </div>
                <div className="col-sm-10" hidden={showRoutes}>
                    {/* <Switch>
                        <Route exact path="/" component={HomeComponent}></Route>
                    </Switch> */}
                </div>
            </div>
            <div>
                <Switch>
                    <Route exact path="/" component={() => (<HomeComponent showHome={showHome} />)}></Route>
                </Switch>
            </div>
        </div>
    );
}

export default MainRoutingComponent;