import './App.css'
import { PhotoProvider } from "./context/PhotoContext";

import AppRoutes from './routes/AppRoutes'

function App() {


  return (
    <PhotoProvider> 
    <AppRoutes />     
    </PhotoProvider>
  )
}

export default App
