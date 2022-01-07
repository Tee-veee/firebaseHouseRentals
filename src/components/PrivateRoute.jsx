// LIB
import { Navigate, Outlet } from "react-router-dom";
// COMP
import Loading from "./Loading";
import useAuthStatus from "../hooks/useAuthStatus";

function PrivateRoute() {
  const { loggedIn, loading } = useAuthStatus();

  if (loading) {
    return <Loading />;
  }

  // NOTES -- OUTLET RENDERS ANY CHILD COMPONENTS LOCATED WITHIN THE ROUTE IN APP.JS
  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
}

export default PrivateRoute;
