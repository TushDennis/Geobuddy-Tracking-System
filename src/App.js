// import react ,{useState} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Home from "../src/components/Home";
import Footer from "./components/footer";
import LoginPage from "./components/LoginPage";
import Registration from "./components/Registration";
import Travel from "./components/Travel";  
import "./index.css";
import UserTable from "./components/UserTable";
import CreateTable from "./components/CreateTable";
import EditTable from "./components/EditTable";
import { AuthProvider } from "./components/context/authContext"; 
import ProtectedRoute from "./components/services/protectedRoute"; 
import VerifyOtp from "./components/VerifyOtp";


const App = () => {


  return (
    <div className="mx-auto bd-red-200">
      <Router>
        <NavigationBar /> {/* Navigation Bar is always visible */}
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/travel-History" element={<Travel />} />
            <Route path="/track-register" element={<Registration />} />
            <Route path="/UserTable" element={<UserTable />} />
            <Route path="/CreateTable" element={<CreateTable />} />
            <Route path="/EditTable" element={<EditTable />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />

            <Route element={<ProtectedRoute />}>
              {/* <Route path="/dashboard" element={<Home />} /> */}
              {/* Add more protected routes here */}
            </Route>

            {/* Add more routes as needed */}
          </Routes>
          {/* Footer Section */}
          <Footer />
        </AuthProvider>
      </Router>
    </div>
  );
};

export default App;
