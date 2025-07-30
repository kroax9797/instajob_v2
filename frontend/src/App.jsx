import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from './pages/Home';
import RecruiterDashboard from "./pages/Dashboard/RecruiterDashboard";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import JobApplicationsView from './pages/Dashboard/components/JobApplicationsView'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/applicant/dashboard" element={<UserDashboard />} />
        <Route path="/recruiter/dashboard/:jobId" element={<JobApplicationsView />} />
        <Route path='/*' element = {<NotFound/>}/>
      </Routes>
    </Router>
  );
}

export default App;
