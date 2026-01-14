import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartValidation from "../pages/StartValidation/StartValidation";
import Capture from "../pages/Capture/Capture";
import IdentityVerification from "../pages/IdentityVerification/IdentityVerification";
import IdentitySuccess from "../pages/IdentitySucess/IdentitySuccess";
import IdentityError from "../pages/IdentityError/IdentityError";
import HomePostValidation from "../pages/Home/Home";
import { ProtectedRoute } from "../auth/ProtectedRoute";



const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>  
    
          <Route path="/" element={<StartValidation/>} />
            <Route path= "/capture"  element= {<Capture/>} />
             <Route path= "/identity-verification"  element= {<IdentityVerification/>} />
             <Route path= "/identity-sucess" element= {<ProtectedRoute><IdentitySuccess/></ProtectedRoute>  } />
            <Route path="/identity-error" element={<IdentityError />} />
            <Route path= "/home" element= {<ProtectedRoute><HomePostValidation/></ProtectedRoute> } /> 
            
               
            
        </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;