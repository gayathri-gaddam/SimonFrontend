import React, { useContext } from "react";

import { auth } from "../utils/firebase";
import { UserDataContext } from "../context/UserDataContext";
import { Outlet, Navigate } from "react-router-dom";

export default function RouteGaurd() {
  const { getUserData } = useContext(UserDataContext);
  const userData = getUserData();
  return !userData ? <Navigate to="/login" /> : <Outlet />;
}
