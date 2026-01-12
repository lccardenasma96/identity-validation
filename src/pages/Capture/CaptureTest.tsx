import { useRef, useEffect, useState } from "react";
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

const CaptureAutoCrop = () => {
  const webcamRef = useRef<Webcam | null>(null);
  const captureTimeout = useRef<any>(null);
  const capturedRef = useRef(false);

  const [detector, setDetector] = useState<ObjectDetector | null>(null);
  const [isCentered, setIsCentered] = useState(false);
  const [message, setMessage] = useState("Cargando IA...");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const { photos, currentStep, setPhotoByStep, nextStep } = usePhotos();

  const currentPhoto = photos[`step${currentStep}` as keyof typeof photos];

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

  // 3️⃣ Validación centrado
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

    const docCentro: Point = { x: box.originX + box.width / 2, y: box.originY + box.height / 2 };
    const videoCentro: Point = { x: videoWidth / 2, y: videoHeight / 2 };
    const tolerancia = videoWidth * 0.1;

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

  // 4️⃣ Recortar imagen al bounding box
  const cropToBoundingBox = (imageSrc: string, box: any) => {
    return new Promise<string>((resolve) => {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = box.width;
        canvas.height = box.height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(
            img,
            box.originX,
            box.originY,
            box.width,
            box.height,
            0,
            0,
            box.width,
            box.height
          );
          resolve(canvas.toDataURL("image/jpeg"));
        }
      };
    });
  };

  // 5️⃣ Capturar imagen
  const captureImage = async () => {
    if (!webcamRef.current || !detector) return;

    const video = webcamRef.current.video;
    if (!video) return;

    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) return;

    const result = detector.detectForVideo(video, performance.now());
    if (!result.detections[0]?.boundingBox) return;

    const box = result.detections[0].boundingBox;
    const cropped = await cropToBoundingBox(screenshot, box);

    setPhotoByStep(currentStep, cropped);
    setCapturedImage(cropped);
    capturedRef.current = true;
    console.log(`Imagen recortada paso ${currentStep}:`, cropped);
  };

  const retakeImage = () => {
    setPhotoByStep(currentStep, null);
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
    }
    return { title: "¿La imagen es legible?", subtitle: "Puedes repetir o continuar" };
  };

  const { title, subtitle } = getInstructions();

  return (
    <div className="capture">
      {/* Header */}
      <header className="capture__header">
        <span className="material-symbols-outlined">arrow_back_ios</span>
        <h2>Captura de identidad</h2>
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
            <div
              style={{ border: isCentered ? "4px solid #4caf50" : "4px solid #ff5722" }}
              className={currentStep === 3 ? "camera-frame--circle" : "camera-frame"}
            />
          </>
        ) : (
          capturedImage && (
            <img src={capturedImage} alt="captura" className="webcam" />
          )
        )}
      </div>

      {/* Instructions */}
      <div className="capture__instructions">
        <h3>{title}</h3>
        <p>{subtitle}</p>
        <div style={{ textAlign: "center", padding: 10, background: "#222", color: "#fff", marginTop: 10 }}>
          {message}
        </div>
      </div>

      {/* Controls */}
      <footer className="capture__controls">
        {!currentPhoto ? (
          <>
            <button type="button">Galería</button>
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

export default CaptureAutoCrop;
