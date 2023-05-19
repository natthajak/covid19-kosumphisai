import "./App.scss";
import { Login } from "./components/Login";
import { Report } from "./components/Report";
import { MainMenu } from "./components/MainMenu";
import { NotFound } from "./components/NotFound";
import { Dashboard } from "./components/Dashboard";
import { MainNavbar } from "./components/MainNavbar";
import { AddPatient } from "./components/AddPatient";
import { AuthProvider } from "./contexts/AuthContext";
import { PatientInfo } from "./components/PatientInfo";
import { LandingPage } from "./components/LandingPage";
import { FindPatient } from "./components/FindPatient";
import { EditPatient } from "./components/EditPatient";
import { AddTimeline } from "./components/AddTimeline";
import { TimelineInfo } from "./components/TimelineInfo";
import { EditTimeline } from "./components/EditTimeline";
import ProtectedRoute from "./components/ProtectedRoute";
import { AddTreatment } from "./components/AddTreatment";
import { ManagePatient } from "./components/ManagePatient";
import { TreatmentInfo } from "./components/TreatmentInfo";
import { EditTreatment } from "./components/EditTreatment";
import { PrintTimeline } from "./components/PrintTimeline";
import { PatientProvider } from "./contexts/PatientContext";
import { PatientAdmission } from "./components/PatientAdmission";
import { PatientDischarge } from "./components/PatientDischarge";
import { PublicPatientProvider } from "./contexts/PublicPatientContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <PublicPatientProvider>
            <PatientProvider>
              <MainNavbar />
              <Switch>
                {/* Public Routes */}
                <Route exact path="/" component={LandingPage} />
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/login" component={Login} />

                {/* Protected Routes */}
                <ProtectedRoute exact path="/mainmenu" component={MainMenu} />
                <ProtectedRoute exact path="/report" component={Report} />
                {/* Patients */}
                <ProtectedRoute exact path="/patients/add" component={AddPatient} />
                <ProtectedRoute exact path="/patients/find" component={FindPatient} />
                <ProtectedRoute exact path="/patients/manage" component={ManagePatient} />
                <ProtectedRoute exact path="/patients/info/:_id" component={PatientInfo} />
                <ProtectedRoute exact path="/patients/edit/:_id" component={EditPatient} />
                {/* Timelines */}
                <ProtectedRoute exact path="/patients/timelines/add/:_id" component={AddTimeline} />
                <ProtectedRoute exact path="/patients/timelines/info/:_id" component={TimelineInfo} />
                <ProtectedRoute exact path="/patients/timelines/print/:_id" component={PrintTimeline} />
                <ProtectedRoute exact path="/patients/timelines/edit/:_id/:_timeline_id" component={EditTimeline} />
                {/* Treatments */}
                <ProtectedRoute exact path="/patients/admission/:_id" component={PatientAdmission} />
                <ProtectedRoute exact path="/patients/discharge/:_id" component={PatientDischarge} />
                <ProtectedRoute exact path="/patients/treatments/add/:_id" component={AddTreatment} />
                <ProtectedRoute exact path="/patients/treatments/info/:_id" component={TreatmentInfo} />
                <ProtectedRoute exact path="/patients/treatments/edit/:_id/:_treatmentId" component={EditTreatment} />

                {/* 404 Not Found */}
                <Route path="/" component={NotFound} />
              </Switch>
            </PatientProvider>
          </PublicPatientProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;