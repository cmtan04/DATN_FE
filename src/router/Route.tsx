import { Route, Routes } from "react-router-dom";
import { ROUTER_PATH } from "./Routes";
export const WebRouter = () => (
  <Routes>
    <Route path="/" element={<div>Home</div>} />
    <Route path={ROUTER_PATH.SIGNIN} element={<div>Sign In</div>} />
    <Route path={ROUTER_PATH.SIGNUP} element={<div>Sign Up</div>} />
    <Route path={ROUTER_PATH.HOME} element={<div>Home</div>}>
      <Route path={ROUTER_PATH.HOME} element={<div>Home Page</div>} />
      <Route path={ROUTER_PATH.LOCATIONS} element={<div>Locations</div>} />
      <Route
        path={ROUTER_PATH.LOCATION_DETAIL}
        element={<div>Location Detail</div>}
      />
      <Route path={ROUTER_PATH.MAP} element={<div>Map</div>} />
    </Route>
    <Route path={ROUTER_PATH.PROFILE} element={<div>Profile</div>}>
      <Route path={ROUTER_PATH.PROFILE} />
      <Route path={ROUTER_PATH.CHAT} element={<div>Chat</div>} />
      <Route
        path={ROUTER_PATH.MY_LOCATIONS}
        element={<div>My Locations</div>}
      />
      <Route path={ROUTER_PATH.PACKAGE} element={<div>Package</div>} />
    </Route>
  </Routes>
);
