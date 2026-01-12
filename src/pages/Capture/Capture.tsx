import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import {
  ObjectDetector,
  FilesetResolver,
  type ObjectDetectorResult,
} from "@mediapipe/tasks-vision";
import "./Capture.scss";
import { usePhotos } from "../../context/PhotoContext";


interface Point {
  x: number;
  y: number;
}

const Capture = () => {
  const webcamRef = useRef<Webcam | null>(null);
    const captureTimeout = useRef<any>(null);
      const guideRef = useRef<any>(null);
    const capturedRef = useRef(false);
  const [detector, setDetector] = useState<ObjectDetector | null>(null);
    const [isCentered, setIsCentered] = useState(false);
    const [message, setMessage] = useState("Cargando IA...");
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const { photos, currentStep, setPhotoByStep, nextStep, prevStep } = usePhotos();

  const currentPhoto: any = photos[`step${currentStep}` as keyof typeof photos];

    // 1️⃣ Inicializar MediaPipe
  useEffect(() => {
    const initDetector = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      const objectDetector = await ObjectDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite",
          delegate: "GPU",
        },
        scoreThreshold: 0.5,
        runningMode: "VIDEO",
      });

      setDetector(objectDetector);
      setMessage("Alinea tu documento");
    };

    initDetector();
  }, []);

  //Botón atras
  const navigate = useNavigate();
  const handlePrev = () => {
    currentStep === 1 ? navigate("/") : prevStep();
  }

  // 2️⃣ Loop de detección
  useEffect(() => {
    let rafId: number;

    const detectFrame = () => {
      if (
        detector &&
        webcamRef.current &&
        webcamRef.current.video?.readyState === 4 &&
        !capturedRef.current
      ) {
        const video = webcamRef.current.video;
        const result = detector.detectForVideo(video, performance.now());

        validarPosicion(result, video.videoWidth, video.videoHeight);
      }

      rafId = requestAnimationFrame(detectFrame);
    };

    if (detector) detectFrame();
    return () => cancelAnimationFrame(rafId);
  }, [detector]);

    const captureImage = (): void => {
    /*if (!webcamRef.current) return;
    const screenshot = webcamRef.current.getScreenshot();
    if (screenshot) {
      setPhotoByStep(currentStep, screenshot);
      console.log(`Imagen capturada paso ${currentStep}:`, screenshot);
    }*/
   if (
      !webcamRef.current
    )
      return;

    const video = webcamRef.current.video;
    if (!video) return;
    
    const videoRect = video.getBoundingClientRect();
    const guideRect = guideRef.current.getBoundingClientRect();
    console.log("Capturando imagen...", { videoRect, guideRect });
    const scaleX = video.videoWidth / videoRect.width;
    const scaleY = video.videoHeight / videoRect.height;

    const sx = (guideRect.left - videoRect.left) * scaleX;
    const sy = (guideRect.top - videoRect.top) * scaleY;
    const sw = guideRect.width * scaleX;
    const sh = guideRect.height * scaleY;

    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, sw, sh);

    setCapturedImage(canvas.toDataURL("image/jpeg", 0.9));
    console.log(`Imagen capturada paso ${currentStep}:`, canvas.toDataURL("image/jpeg", 0.9));
    setPhotoByStep(currentStep, canvas.toDataURL("image/jpeg", 0.9));
    capturedRef.current = true;
  };
  

  // 3️⃣ Validación de centrado
  const validarPosicion = (
    result: ObjectDetectorResult,
    videoWidth: number,
    videoHeight: number
  ) => {
    if (result.detections.length === 0) {
      setIsCentered(false);
      setMessage("No se detecta documento");
      clearTimeout(captureTimeout.current);
      return;
    }

    const box = result.detections[0].boundingBox;
    if (!box) return;

    const docCentro: Point = {
      x: box.originX + box.width / 2,
      y: box.originY + box.height / 2,
    };

    const videoCentro: Point = {
      x: videoWidth / 2,
      y: videoHeight / 2,
    };

    const tolerancia = videoWidth * 0.08;

    const centrado =
      Math.abs(docCentro.x - videoCentro.x) < tolerancia &&
      Math.abs(docCentro.y - videoCentro.y) < tolerancia;

    if (centrado) {
      setIsCentered(true);
      setMessage("¡Perfecto! Mantén la posición");

      if (!captureTimeout.current) {
        captureTimeout.current = setTimeout(captureImage, 700);
      }
    } else {
      setIsCentered(false);
      setMessage("Mueve el documento al centro");
      clearTimeout(captureTimeout.current);
      captureTimeout.current = null;
    }
  };



    const retakeImage = () => {
    setPhotoByStep(currentStep, null);
    setCapturedImage(null);
    capturedRef.current = false;
    captureTimeout.current = null;
    setMessage("Alinea tu documento");
  };


    // 5️⃣ Reset
  const reset = () => {
    setCapturedImage(null);
    capturedRef.current = false;
    captureTimeout.current = null;
    setMessage("Alinea tu documento");
  };

  const getInstructions = () => {
    if (!currentPhoto) {
      switch (currentStep) {
        case 1:
          return { title: "Ubica el frente de tu cédula", subtitle: "Asegúrate de buena iluminación" };
        case 2:
          return { title: "Ubica el reverso de tu cédula", subtitle: "Asegúrate de buena iluminación" };
        case 3:
          return { title: "Toma tu selfie", subtitle: "Muestra tu rostro claramente" };
      }
    } else {
      return { title: "¿La imagen es legible?", subtitle: "Puedes repetir o continuar" };
    }
  };

  const { title, subtitle } = getInstructions();

  return (
    <div className="capture">
      {/* Header */}
      <header className="capture__header">
        <div className="capture_header_container-title">
          <button className="material-symbols-outlined" onClick={handlePrev}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>
        </button>
        <h2>Captura de identidad</h2>
        </div>        
        <div className="capture_header_container-steps">
          <p className="title_progress" >Paso {currentStep} de 3</p>
          <progress className="progress_tab" value={currentStep} max={3}></progress>
        </div>
      </header>

      {/* Camera */}
      <div className="capture__camera">
        {!currentPhoto ? (
          <>
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="webcam"
              videoConstraints={{ facingMode: { ideal: "environment" } }}
            />
            <div ref={guideRef} style={{ border: isCentered ? "4px solid #4caf50" : "4px solid #ff5722" }} className={`${currentStep === 3 ? "camera-frame--circle" : "camera-frame"}`} />
          </>
        ) : (
          <>     
        
      <img src={currentPhoto} alt="captura" className="current_photo" />
      </>
          
        )}
      </div>

      {/* Instructions */}
      <div className="capture__instructions">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>

      {/* Controls */}
      <footer className="capture__controls">
        {!currentPhoto ? (
          <>
            
            <button type="button" className="primary" onClick={captureImage}>
              Capturar
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={retakeImage}>
              Repetir
            </button>
            <button type="button" className="primary" onClick={nextStep}>
              Continuar
            </button>
          </>
        )}
      </footer>
    </div>
  );
};

export default Capture;
