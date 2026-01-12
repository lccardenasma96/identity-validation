export type CaptureStep = "front" | "back" | "selfie";

export const CAPTURE_STEPS = [
  {
    key: "front",
    title: "Frente de la cédula",
    instruction: "Ubica el frente de tu cédula dentro del recuadro",
    progress: 33,
    icon: "badge",
  },
  {
    key: "back",
    title: "Reverso de la cédula",
    instruction: "Ubica el reverso de tu cédula dentro del recuadro",
    progress: 66,
    icon: "badge",
  },
  {
    key: "selfie",
    title: "Selfie",
    instruction: "Ubica tu rostro dentro del recuadro",
    progress: 100,
    icon: "face",
  },
];
