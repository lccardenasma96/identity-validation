import './App.css'
import { AuthProvider } from './auth/AuthContext';
import { PhotoProvider } from "./context/PhotoContext";

import AppRoutes from './routes/AppRoutes'

function App() {


  return (
    <PhotoProvider> 
      <AuthProvider>
    <AppRoutes />  
      </AuthProvider>   
    </PhotoProvider>
  )
}

export default App
