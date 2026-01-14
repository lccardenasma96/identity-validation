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
import { photoToBlob } from "../../utils/photoToBlob";

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

  // Inicializar MediaPipe
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

  const navigate = useNavigate();
  const handlePrev = () => {
    currentStep === 1 ? navigate("/") : prevStep();
  }
  const handleNext = () => {
    currentStep < 3 ? nextStep() : navigate("/identity-verification");;
  }

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
        validatePosition(result, video.videoWidth, video.videoHeight);
      }
      rafId = requestAnimationFrame(detectFrame);
    };

    if (detector) detectFrame();
    return () => cancelAnimationFrame(rafId);
  }, [detector]);

  const captureImage = async (): Promise<void> => {
    const isSelfie = currentStep === 3;

    if (
      !webcamRef.current
    )
      return;

    const video = webcamRef.current.video;
    if (!video) return;

    const videoRect = video.getBoundingClientRect();
    const guideRect = guideRef.current.getBoundingClientRect();
    const scaleX = video.videoWidth / videoRect.width;
    const scaleY = video.videoHeight / videoRect.height;
    let sx, sy, sw, sh;

    if (isSelfie) {
      const width = video.videoWidth * 0.55;
      const height = width * 1.3;

      sx = video.videoWidth / 2 - width / 2;
      sy = video.videoHeight / 2 - height / 2;
      sw = width;
      sh = height;
    } else {
      sx = (guideRect.left - videoRect.left) * scaleX;
      sy = (guideRect.top - videoRect.top) * scaleY;
      sw = guideRect.width * scaleX;
      sh = guideRect.height * scaleY;
    }

    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (isSelfie) {
      ctx.beginPath();
      ctx.ellipse(
        sw / 2,
        sh / 2,
        sw / 2,
        sh / 2,
        0,
        0,
        Math.PI * 2
      );
      ctx.closePath();
      ctx.clip();
    }

    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, sw, sh);
    const previewBase64 = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(previewBase64);
    const blob = await photoToBlob(previewBase64);
    if (!blob) {
      return;
    }
    setPhotoByStep(currentStep, blob);
    capturedRef.current = true;
  };

  const validatePosition = (
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

    const docCenter: Point = {
      x: box.originX + box.width / 2,
      y: box.originY + box.height / 2,
    };

    const videoCenter: Point = {
      x: videoWidth / 2,
      y: videoHeight / 2,
    };

    const tolerance = videoWidth * 0.08;
    const centered =
      Math.abs(docCenter.x - videoCenter.x) < tolerance &&
      Math.abs(docCenter.y - videoCenter.y) < tolerance;

    if (centered) {
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
  const previewUrl = currentPhoto instanceof Blob ? URL.createObjectURL(currentPhoto) : null;

  return (
    <div className="capture">
      <header className="capture__header">
        <div className="capture__header-title">
          <button
            className="capture__back-button"
            onClick={handlePrev}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" /></svg>
          </button>
          <h2 className="capture__title">Captura de identidad</h2>
        </div>
        <div className="capture__steps">
          <p className="capture__step-text">Paso {currentStep} de 3</p>
          <progress
            className="capture__progress"
            value={currentStep}
            max={3}
          />
        </div>
      </header>
      <div className="capture__camera">
        {!currentPhoto ? (
          <>
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="capture__webcam"
              videoConstraints={{
                facingMode: { ideal: currentStep !== 3 ? "environment" : "user" },
              }}
            />
            <div
              ref={guideRef}
              className={`capture__frame ${currentStep === 3 ? "capture__frame--selfie" : "capture__frame--document"}`}
              style={{ borderColor: isCentered ? "#4caf50" : "#ff5722" }}
            />
          </>
        ) : (
          <img
            src={previewUrl!}
            alt="captura"
            className={`capture__preview ${currentStep === 3 ? "capture__preview--selfie" : "capture__preview--document"}`}
          />
        )}
      </div>
      <div className="capture__instructions">
        <h3 className="capture__instructions-title">{title}</h3>
        <p className="capture__instructions-text">{subtitle}</p>
      </div>
      <footer className="capture__controls">
        {!currentPhoto ? (
          <button
            type="button"
            className="capture__button capture__button--primary"
            onClick={captureImage}
          >
            Capturar
          </button>
        ) : (
          <>
            <button
              type="button"
              className="capture__button"
              onClick={retakeImage}
            >
              Repetir
            </button>
            <button
              type="button"
              className="capture__button capture__button--primary"
              onClick={handleNext}
            >
              Continuar
            </button>
          </>
        )}
      </footer>
    </div>
  );

};

export default Capture;
