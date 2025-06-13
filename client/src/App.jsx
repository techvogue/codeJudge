import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import CreateProblem from './components/addProblem.jsx';
import Footer from './components/Footer.jsx'
import GetLeaderboard from './components/getLeaderboard.jsx';
import Home from './components/home.jsx';
import IndividualProblem from './components/individualProblem.jsx';
import LandingPage from './components/LandingPage.jsx';
import Login from './components/login.jsx';
import Logout from './components/logout.jsx';
import Navbar from './components/Navbar.jsx';
import ProblemList from './components/problemList.jsx';
import Profile from './components/profile.jsx';
import Signup from './components/signup.jsx';
import UpdateProblem from './components/updateProblem.jsx';
import UpdateProfile from './components/updateProfile.jsx';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Public Route component (only accessible when not logged in)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/home" replace />;
  }
  return children;
};

function App() {
  const token = localStorage.getItem('token');

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <BrowserRouter>
        <Navbar />
        <main className="flex-grow ">
          <Routes>
            <Route path="/" element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/home" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/problemList" element={
              <ProtectedRoute>
                <ProblemList />
              </ProtectedRoute>
            } />
            <Route path="/individualProblem/:id" element={
              <ProtectedRoute>
                <IndividualProblem />
              </ProtectedRoute>
            } />
            <Route path="/addProblem" element={
              <ProtectedRoute>
                <CreateProblem />
              </ProtectedRoute>
            } />
            <Route path="/getLeaderboard" element={
              <ProtectedRoute>
                <GetLeaderboard />
              </ProtectedRoute>
            } />
            <Route path="/updateProfile" element={
              <ProtectedRoute>
                <UpdateProfile />
              </ProtectedRoute>
            } />
            <Route path="/updateProblem/:id" element={
              <ProtectedRoute>
                <UpdateProblem />
              </ProtectedRoute>
            } />
            <Route path="/logout" element={
              <ProtectedRoute>
                <Logout />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        {token && <Footer />}
      </BrowserRouter>
    </div>
  );
}

export default App;
