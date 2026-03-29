import { LoginPage } from "./pages/Doctor/LoginPage";
import { RegisterPage } from "./pages/Doctor/RegistrationPage";
import { Header } from "./components/Header";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProfilePage } from "./pages/Doctor/ProfilePage";
import { PatientsPage } from "./pages/Patient/PatientsPage";
import { PatientDetailsPage } from "./pages/Patient/PatientDetailsPage";
import { CreateInspectionPage } from "./pages/Patient/CreateInspectionPage";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registration" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/patient/:id" element={<PatientDetailsPage />} />
            <Route
              path="/inspection/create"
              element={<CreateInspectionPage />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
