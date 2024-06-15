import { Route, Routes, BrowserRouter } from "react-router-dom";

import { UserDataProvider } from "./context/UserDataContext";
import { Home, Game, Login, Signup, UserDetails, Rules } from "./pages/index";
import RouteGaurd from "./components/RouteGaurd";

function App() {
  const getToken = () => {
    return localStorage.getItem("token");
  };
  const setToken = (jwt) => {
    localStorage.setItem("token", jwt);
  };
  const getUserData = () => {
    return JSON.parse(localStorage.getItem("userData"));
  };
  const setUserData = (user) => {
    return localStorage.setItem("userData", JSON.stringify(user));
  };

  return (
    <UserDataProvider value={{ getUserData, setUserData, getToken, setToken }}>
      <BrowserRouter>
        <Routes>
          <Route element={<RouteGaurd />}>
            <Route path="/userDetails" element={<UserDetails />} />
            <Route path="/game" element={<Game />} />
          </Route>
          <Route path="/rules" element={<Rules />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </UserDataProvider>
  );
}

export default App;
