import Navbar from "./components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  const isAuth = false;

  return (
    <div className="bg-gray-100 min-h-screen grid place-items-center">
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={isAuth ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!isAuth ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!isAuth ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={isAuth ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
}
