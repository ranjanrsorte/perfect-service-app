import { Redirect } from "react-router-dom";
import ModulesComponent from "../commoncomponents/modulescomponent";

const PartsAndPriceComponent = () =>{
    if (sessionStorage.getItem('token') != null) {
        return (
            <div>
                <div className="row">
                    <div className="col-sm-2 moduleRoutes">
                        <ModulesComponent></ModulesComponent>
                    </div>
                    <div className="col-sm-10">
                        parts and price component
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

export default PartsAndPriceComponent;