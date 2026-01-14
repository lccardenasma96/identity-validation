import { useNavigate, useLocation } from "react-router-dom";
import "./IdentitySuccess.scss";

const IdentitySuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result;
  const score = result.score;
  const risk = result.risk_level;
  const verifiedAt = result.metadata?.validation_timestamp;

  return (
    <div className="identity-success">
      <header className="identity-success__header">
        <h2 className="identity-success__title">Validación de Identidad</h2>
      </header>
      <main className="identity-success__main">
        <section className="identity-success__success">
          <div className="identity-success__success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" height="70px" viewBox="0 -960 960 960" width="70px" fill="#22C55E"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
          </div>
          <h1 className="identity-success__success-title">Identidad validada correctamente</h1>
          <p className="identity-success__success-description">
            El proceso de verificación biométrica ha finalizado con éxito.
          </p>
        </section>
        <section className="identity-success__card">
          <div className="identity-success__card-image" />
          <div className="identity-success__card-content">
            <div className="identity-success__card-header">
              <h3 className="identity-success__card-title">Resultado del análisis</h3>
              <p className="identity-success__status identity-success__status--approved">Aprobado</p>
            </div>
            <div className="identity-success__metrics">
              <div className="identity-success__metric">
                <p className="identity-success__metric-label">Score</p>
                <span className="identity-success__metric-value identity-success__metric-value--primary">
                  {score}
                </span>
              </div>
              <div className="identity-success__metric">
                <p className="identity-success__metric-label">Riesgo</p>
                <span className="identity-success__metric-value identity-success__metric-value--success">
                  {risk}
                </span>
              </div>
            </div>
            <div className="identity-success__verified">
              <span className="identity-success__verified-icon">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#617589"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z" /></svg>
              </span>
              <p>Verificado el {new Date(verifiedAt).toLocaleString()}</p>
            </div>
          </div>
        </section>
        <p className="identity-success__meta">
          Validación procesada por el Sistema Nacional de Identidad
          Digital de Colombia.
        </p>
      </main>
      <footer className="identity-success__footer">
        <button
          className="identity-success__button"
          onClick={() => navigate("/home")}
        >
          <span>Continuar</span>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" /></svg>
        </button>
      </footer>
    </div>
  );
};

export default IdentitySuccess;
