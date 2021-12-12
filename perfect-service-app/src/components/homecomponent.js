const HomeComponent = (props) => {

    const loginpage = () => {
        props.history.push('/login');
    }
    return (
        <div>
            <div>
                <input type="button" value="Login" className="btn btn-primary btn-sm homeloginbtn"
                    onClick={loginpage} />
            </div>
            <hr />
            <div>
                <h1 className="appTagline">We Care For Your Vehicle</h1>
            </div>
            <hr />
            <div className="container">
                <div className="row">
                    <div className="col-sm-3">
                        <ul className="list-group">
                            <li className="list-group-item list-group-item-dark">
                                <h5>Services we provide</h5>
                            </li>
                            <li className="list-group-item list-group-item-info">
                                2-Wheeler Service
                            </li>
                            <li className="list-group-item list-group-item-info">
                                3-Wheeler Service
                            </li>
                            <li className="list-group-item list-group-item-info">
                                4-Wheeler Service
                            </li>
                            <li className="list-group-item list-group-item-info">
                                Truck Service
                            </li>
                            <li className="list-group-item list-group-item-info">
                                Bus Service
                            </li>
                        </ul>
                    </div>
                    <div className="col-sm-8">
                        <h5>Services Types</h5>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="card serviceInfo">
                                    <div className="card-header">
                                        General Service
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">With General Service has regular oil check ups in the vehicle along with washing.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="card serviceInfo">
                                    <div className="card-header">
                                        Oil Change
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">Oil change type can only have the all parts of vehicle oil checking and changing.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="card serviceInfo">
                                    <div className="card-header">
                                        Part Change
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">With Part Change type all the vehicle parts are analyzed by experts and faulty parts has been replaced.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="card serviceInfo">
                                    <div className="card-header">
                                        Washing Only
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">With Washing Only type you can wash your vehicle at our service station without any servicing.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeComponent;