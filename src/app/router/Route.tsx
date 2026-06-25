import { Navigate, Route, Routes } from "react-router-dom";
import { WebLayout } from "@app/layouts";
import { ForgotPassword, SignIn, SignUp } from "@modules/auth";
import { HomePage } from "@modules/home";
import {
  LocationBooking,
  LocationDetail,
  LocationList,
  LocationMap,
} from "@modules/location";
import { PaymentCheckoutResult } from "@modules/payment";
import { ProfilePage, UserBookingsPage } from "@modules/user";
import { ProtectedRoute } from "./ProtectedRoute";
import { ROUTER_NAME, ROUTER_PATH } from "./routes";

const UserFavoritesPlaceholder = () => <div>Danh sach phong yeu thich</div>;

export const WebRouter = () => (
  <Routes>
    <Route element={<WebLayout />}>
      <Route path="/" element={<Navigate to={ROUTER_PATH.HOME} replace />} />
      <Route path={ROUTER_NAME.SIGNIN} element={<SignIn />} />
      <Route path={ROUTER_NAME.SIGNUP} element={<SignUp />} />
      <Route path={ROUTER_NAME.FORGOT_PASSWORD} element={<ForgotPassword />} />
      <Route path={ROUTER_NAME.HOME} element={<HomePage />} />
      <Route path={ROUTER_NAME.LOCATIONS} element={<LocationList />} />
      <Route path={ROUTER_NAME.LOCATION_DETAIL} element={<LocationDetail />} />
      <Route path={ROUTER_NAME.MAP} element={<LocationMap />} />

      <Route element={<ProtectedRoute />}>
        <Route
          path={ROUTER_NAME.LOCATION_BOOKING}
          element={<LocationBooking />}
        />
        <Route
          path={ROUTER_NAME.PAYMENT_CHECKOUT}
          element={<PaymentCheckoutResult />}
        />
        <Route path={ROUTER_NAME.PROFILE} element={<ProfilePage />} />
        <Route path={ROUTER_NAME.USER_PROFILE} element={<ProfilePage />} />
        <Route
          path={ROUTER_NAME.USER_BOOKINGS}
          element={<UserBookingsPage />}
        />
        <Route
          path={ROUTER_NAME.USER_FAVORITES}
          element={<UserFavoritesPlaceholder />}
        />
        <Route path={ROUTER_NAME.CHAT} element={<div>Chat</div>} />
        <Route
          path={ROUTER_NAME.MY_LOCATIONS}
          element={<div>My Locations</div>}
        />
        <Route path={ROUTER_NAME.PACKAGE} element={<div>Package</div>} />
      </Route>
    </Route>
  </Routes>
);
