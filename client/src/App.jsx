
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import EmployeeDashboard from "./EmployeeDashboard.jsx";
import ProtectedRoute, {
  GuestOnly
} from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestOnly>
            <Login />
          </GuestOnly>
        }
      />

      <Route
        path="/signup"
        element={
          <GuestOnly>
            <Signup />
          </GuestOnly>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<EmployeeDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
