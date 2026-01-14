import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import "./Home.scss";

const HomePostValidation = () => {

  const { identityResult } = useAuth();
  const navigate = useNavigate();

  if (!identityResult) return null;

  const { score, risk_level, details } = identityResult;
  const { ocr } = details || {};
  const name = ocr?.nombres || "Usuario";
  const lastName = ocr?.apellidos || "";
  const IdNum = ocr?.numero_documento || "";
  const dateBirth = ocr?.fecha_nacimiento || "";
  const dateExp = ocr?.fecha_expedicion || "";
  const logout = () => {
    navigate("/");
  }
  const [showPerfil, setShowPerfil] = useState(false);
  const togglePerfil = () => {
    setShowPerfil(prev => !prev);
  };

  return (
    <div className="home">
      <header className="home-header">
        <div className="home-header-icon">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#137FEC"><path d="m438-338 226-226-57-57-169 169-84-84-57 57 141 141Zm42 258q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132Zm0-316Z" /></svg>
        </div>
        <h2 className="home-header-title">Inicio</h2>
        <button
          className="home-header-action"
          onClick={logout}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" /></svg>
        </button>
      </header>
      <div className={!showPerfil ? "home-content" : "home-content_hidden"}>
        <section className="home-content-welcome">
          <h3 className="home-content-welcome_subtitle" >Bienvenido {name + " " + lastName}, tu identidad fue validada correctamente</h3>
          <p className="home-content-welcome_paragraph" >Tu proceso con la Registraduría Nacional ha finalizado.</p>
        </section>
        <section className="home-validation-card">
          <div className="home-validation-card-image">
            <div className="home-validation-card-overlay">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
              </div>
              <p>Identidad Protegida</p>
            </div>
          </div>
          <div className="home-validation-card-content">
            <p className="home-validation-tag">Resultado Exitoso</p>
            <h4 className="home-validation-score" >Puntaje de Validación: {score}/100</h4>
            <div className="home-validation-risk">
              <span className="home-validation-dot" />
              <p>
                Nivel de Riesgo:{" "}
                <strong className="home-validation-low">
                  {risk_level}
                </strong>
              </p>
            </div>
            <p className="home-validation-verify-description">
              Tu identidad ha sido verificada exitosamente
              con los estándares de seguridad vigentes en
              Colombia (Circular 002-2024).
            </p>
          </div>
        </section>
        <section className="home-quick-actions">
          <h3 className="home-quick-actions_title" >Acciones rápidas</h3>
          <div className="home-quick-actions-grid">
            <button
              className="home-quick-action-card"
              disabled={true}
            >
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#137FAC"><path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" /></svg>
              </div>
              <p>Mis Documentos</p>
            </button>
            <button
              className="action-card"
              disabled={true}
            >
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#137FAC"><path d="M280-40q-33 0-56.5-23.5T200-120v-720q0-33 23.5-56.5T280-920h400q33 0 56.5 23.5T760-840v124q18 7 29 22t11 34v80q0 19-11 34t-29 22v404q0 33-23.5 56.5T680-40H280Zm0-80h400v-720H280v720Zm0 0v-720 720Zm162-240 198-198-56-56-142 142-56-56-56 56 112 112Z" /></svg>
              </div>
              <p>Token Digital</p>
            </button>
          </div>
        </section>
      </div>
      <section  className={!showPerfil ? "home-perfil_hidden" : "home-perfil"}>
        <h3 className="home-perfil_title" >Mi Perfil</h3>
        <div className="home-perfil_container_information">
          <p className="home-perfil-information_subtitle" >Nombre</p>
          <input className="home-perfil-information" type="text" value={name} disabled />
          <p className="home-perfil-information_subtitle">Apellido</p>
          <input className="home-perfil-information" type="text" value={lastName} disabled />
          <p className="home-perfil-information_subtitle">Fecha de Nacimiento</p>
          <input className="home-perfil-information" type="text" value={dateBirth} disabled />
          <p className="home-perfil-information_subtitle">Número de Identificación</p>
          <input className="home-perfil-information" type="text" value={IdNum} disabled />
          <p className="home-perfil-information_subtitle">Fecha de Expedición</p>
          <input className="home-perfil-information" type="text" value={dateExp} disabled />
        </div>
      </section>
      <nav className="home-menu_container">
        <ul className="home-menu">
          <li className="home-menu_item">
            <button className="home-menu_item-link" onClick={togglePerfil} ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#9ca3af"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" /></svg>
              <p>Inicio</p></button>
          </li>
          <li className="home-menu_item">
            <a className="home-menu_item-link"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#9ca3af"><path d="M480-120q-138 0-240.5-91.5T122-440h82q14 104 92.5 172T480-200q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h110v80H120v-240h80v94q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z" /></svg>
              <p>Actividad</p></a>
          </li>
          <li className="home-menu_item">
            <a className="home-menu_item-link"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#9ca3af"><path d="M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132Zm0-316Z" /></svg>
              <p>Seguridad</p></a>
          </li>
          <li className="home-menu_item">
            <button className="home-menu_item-link" onClick={togglePerfil}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#9ca3af"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" /></svg>
              <p>Perfil</p></button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HomePostValidation;
