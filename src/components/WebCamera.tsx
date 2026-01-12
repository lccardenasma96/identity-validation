import { useRef, useState } from "react";
import Webcam from "react-webcam";
import "./Capture.scss";

type CaptureStep = "front" | "back" | "selfie" | "done";

const Capture = (step: CaptureStep) => {
const webcamRef = useRef<Webcam | null>(null);
const [front, setFront] = useState<string | null>(null);
const [back, setBack] = useState<string | null>(null);
const [continue, setContinue] = useState<boolean>(false);

const captureImage = (): void => {
  if (!webcamRef.current) return;
  const screenshot = webcamRef.current.getScreenshot();
  if (screenshot) {
    setFront(screenshot);
    console.log("Imagen capturada:", screenshot);
  }
};

const retakeImage = (): void => {
  setFront(null);
};


  return (
    <div className="capture">

      {/* Header */}
      <header className="capture__header">
        <span className="material-symbols-outlined">arrow_back_ios</span>
        <h2>Captura de identidad</h2>
      </header>

      {/* Camera */}
      <div className="capture__camera">

        {!continue ? (
          <>
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="webcam"
              videoConstraints={{
                facingMode: { ideal: "environment" },
              }}
            />
            <div className="camera-frame" />
          </>
        ) : (
          <img src={image} alt="captura" className="webcam" />
        )}
      </div>

      {/* Instructions */}
      <div className="capture__instructions">
        {!image ? (
          <>
            <h3>Ubica el frente de tu cédula</h3>
            <p>Asegúrate de buena iluminación</p>
          </>
        ) : (
          <>
            <h3>¿La imagen es legible?</h3>
            <p>Puedes repetir o continuar</p>
          </>
        )}
        </div>

      {/* Controls */}
      <footer className="capture__controls">
        {!image ? (
          <>
            <button type="button">Galería</button>
            <button
              type="button"
              className="primary"
              onClick={captureImage}
            >
              Capturar
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={retakeImage}>
              Repetir
            </button>
            <button type="button" className="primary">
              Continuar
            </button>
          </>
        )}
      </footer>

    </div>
  );
};

export default Capture;
