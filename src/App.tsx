import { LoginPage } from "./pages/Doctor/LoginPage";
import { RegisterPage } from "./pages/Doctor/RegistrationPage";
import { Header } from "./components/general/Header";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProfilePage } from "./pages/Doctor/ProfilePage";
import { PatientsPage } from "./pages/Patient/PatientsPage";
import { PatientDetailsPage } from "./pages/Patient/PatientDetailsPage";
import { CreateInspectionPage } from "./pages/Inspections/CreateInspectionPage";
import { InspectionDetailsPage } from "./pages/Inspections/InspectionDetailsPage";
import { ConsultationList } from "./pages/Consultations/ConsultationList";
import { ReportPage } from "./pages/Reports/ReportPage";

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
            <Route path="/inspection/:id" element={<InspectionDetailsPage />} />
            <Route path="/consultations" element={<ConsultationList />} />
            <Route path="/reports" element={<ReportPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
