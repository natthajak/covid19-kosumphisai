import { useAuth } from "../contexts/AuthContext";
import { Redirect, Route } from "react-router-dom";

export default function ProtectedRoute({ component: Component, ...rest }) {
    const { isAuth } = useAuth();

    function renderFunc(props) {
        if (isAuth()) {
            return <Component {...props} />
        } else {
            return <Redirect to="/login" />
        }
    }

    return (
        <Route {...rest} render={renderFunc} />
    )
}
