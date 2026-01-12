import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePhotos } from "../../context/PhotoContext";
import "./StartValidation.scss";


const StartValidation = () => {
  const [documentNumber, setDocumentNumber] = useState<any>({idDocument:""});
  const navigate = useNavigate(); 
  const {setUserId} = usePhotos();
  const handleStart = () => {
    const idNumber = parseInt(documentNumber.idDocument, 10);
    setUserId(idNumber);
    navigate("/capture");
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDocumentNumber((prevDatos:any) => ({
      ...prevDatos,
      [name]: value
    }));
  }

  return (
    <div className="start-validation">
      {/* Top App Bar */}
      <header className="top-bar">
       
        <h2>Identidad Digital</h2>
      </header>

      {/* Content */}
      <main className="content">
        <section className="headline">
          <h1>Inicio de Validación</h1>
        </section>

        <section className="description">
          <p>
            Por favor, ingrese su número de documento para comenzar el proceso de
            verificación de identidad.
          </p>
        </section>

        {/* Input */}
        <section className="input-section">
          <label>
            <span>Número de identificación</span>
            <div className="input-wrapper">
              <input
              name="idDocument"
                type="number"
                placeholder="Ej: 1234567890"
                value={documentNumber.idDocument}
                onChange={handleChange}
              />
              <span className="material-symbols-outlined icon">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#999999"><path d="M560-440h200v-80H560v80Zm0-120h200v-80H560v80ZM200-320h320v-22q0-45-44-71.5T360-440q-72 0-116 26.5T200-342v22Zm160-160q33 0 56.5-23.5T440-560q0-33-23.5-56.5T360-640q-33 0-56.5 23.5T280-560q0 33 23.5 56.5T360-480ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z"/></svg>
              </span>
            </div>
          </label>
        </section>

        {/* Privacy Card */}
        <section className="privacy-card">
          <div className="privacy-header">
            <div className="privacy-icon">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#137fec"><path d="M480-320q17 0 28.5-11.5T520-360q0-17-11.5-28.5T480-400q-17 0-28.5 11.5T440-360q0 17 11.5 28.5T480-320Zm-40-160h80v-200h-80v200Zm40 400q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132Zm0-316Z"/></svg>
            </div>
            <h3>Privacidad y Consentimiento</h3>
          </div>

          <p className="privacy-text">
            Los datos y las imágenes utilizadas en esta prueba técnica son
            únicamente para fines de evaluación. Ninguna información es
            almacenada ni compartida.
          </p>
        </section>
      </main>

      {/* Action Button */}
      <footer className="footer">
        <button
          className="primary-button"
          onClick={handleStart}
          disabled={!documentNumber || documentNumber.length < 6}
        >
          <span>Iniciar validación</span>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/></svg>
        </button>
      </footer>
    </div>
  );
};

export default StartValidation;
