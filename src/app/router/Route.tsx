import { Navigate, Route, Routes } from "react-router-dom";
import { WebLayout } from "@app/layouts";
import { SignIn, SignUp } from "@modules/auth";
import { HomePage } from "@modules/home";
import { LocationList, LocationMap } from "@modules/location";
import { ProtectedRoute } from "./ProtectedRoute";
import { ROUTER_NAME, ROUTER_PATH } from "./routes";

export const WebRouter = () => (
  <Routes>
    <Route path="/" element={<Navigate to={ROUTER_PATH.HOME} replace />} />
    <Route path={ROUTER_NAME.SIGNIN} element={<SignIn />} />
    <Route path={ROUTER_NAME.SIGNUP} element={<SignUp />} />

    <Route element={<WebLayout />}>
      <Route path={ROUTER_NAME.HOME} element={<HomePage />} />
      <Route path={ROUTER_NAME.LOCATIONS} element={<LocationList />} />
      <Route
        path={ROUTER_NAME.LOCATION_DETAIL}
        element={<div>Location Detail</div>}
      />
      <Route path={ROUTER_NAME.MAP} element={<LocationMap />} />

      <Route element={<ProtectedRoute />}>
        <Route path={ROUTER_NAME.PROFILE} element={<div>Profile</div>} />
        <Route path={ROUTER_NAME.CHAT} element={<div>Chat</div>} />
        <Route
          path={ROUTER_NAME.MY_LOCATIONS}
          element={<div>My Locations</div>}
        />
        <Route path={ROUTER_NAME.PACKAGE} element={<div>Package</div>} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to={ROUTER_PATH.SIGNIN} replace />} />
  </Routes>
);
