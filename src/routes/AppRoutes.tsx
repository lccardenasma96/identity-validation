import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartValidation from "../pages/StartValidation/StartValidation";
import Capture from "../pages/Capture/Capture";
import CaptureAutoCrop from "../pages/Capture/CaptureTest";


const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>    
            <Route path="/" element={<StartValidation/>} />
            < Route path= "/capture"  element= {<Capture/>} />
            <Route path= "/capture-test"  element= {<CaptureAutoCrop/>} />
        </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;